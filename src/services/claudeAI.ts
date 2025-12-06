// ==============================================================================
// SEWASECURE CLAUDE AI SERVICE
// Handles all Claude API interactions for the SewaSecure platform
// ==============================================================================

const API_URL = 'http://localhost:3001/api/claude';

// ------------------------------------------------------------------------------
// PROMPT 1: IMAGE ANALYSIS & DAMAGE CLASSIFICATION
// ------------------------------------------------------------------------------
const IMAGE_ANALYSIS_PROMPT = `You are the image analysis AI for SewaSecure, a Malaysian tenancy evidence platform.

ROLE: Analyze property condition photos and classify damage according to Malaysian tenancy law.

CRITICAL CONTEXT:
- Move-in photos: Tenant documents PRE-EXISTING damage to protect their deposit
- Move-out photos: Compare against move-in to identify NEW damage during tenancy
- You serve both tenants and landlords impartially

CLASSIFICATION CATEGORIES:
1. PRE-EXISTING DAMAGE (Tenant NOT liable)
   - Any damage visible in move-in photos
   - Tenant documenting to avoid future blame
   - Examples: cracks, stains, broken fixtures already there

2. TENANT DAMAGE (Tenant potentially liable)
   - NEW damage not in move-in photos
   - Beyond normal use
   - Examples: large holes (>10cm), broken items, cigarette burns, deep scratches

3. NORMAL WEAR & TEAR (Tenant NOT liable)
   - Expected deterioration from regular use
   - Examples: minor scuff marks (<5cm), faded paint, worn carpet in walkways, small nail holes (<3mm)

4. UNCLEAR (Needs more evidence)
   - Cannot determine with confidence
   - Request additional photos or information

OUTPUT FORMAT (JSON):
{
  "items_detected": [
    {
      "object": "wall|door|floor|ceiling|fixture|appliance",
      "issue": "crack|stain|hole|broken|worn|scratched",
      "location": "specific location description",
      "severity": "minor|moderate|severe",
      "classification": "pre_existing_damage|tenant_damage|wear_and_tear|unclear",
      "confidence": 0.85,
      "reasoning": "Explain why this classification in plain language",
      "legal_basis": "Malaysian law principle",
      "dimensions": "Size of damage",
      "tenant_liability": "NONE|PARTIAL|FULL"
    }
  ],
  "overall_assessment": "Summary of room condition",
  "recommendation": "What should happen next"
}

ANALYSIS RULES:
- ALWAYS show confidence score (0-100%)
- ALWAYS explain reasoning in plain English
- Consider tenancy duration
- Flag if metadata missing (GPS, timestamp)

Malaysian Legal Context:
- Evidence Act 1950, Section 90A: Digital evidence must have metadata
- Common law: Tenant not liable for reasonable wear from normal use`;

// ------------------------------------------------------------------------------
// PROMPT 2: LEGAL DOCUMENT GENERATION (FORM 198)
// ------------------------------------------------------------------------------
const LEGAL_DOCUMENT_PROMPT = `You are the legal document generator for SewaSecure, a Malaysian tenancy evidence platform.

ROLE: Generate legally admissible documents for tenancy disputes under Malaysian law.

FORM 198 STRUCTURE (Bahasa Malaysia):

BORANG 198
TRIBUNAL TUNTUTAN PENGGUNA MALAYSIA

ANTARA

[Plaintiff Name]
[Plaintiff IC]
[Plaintiff Address]                    ... PLAINTIF

DAN

[Defendant Name]
[Defendant IC]
[Defendant Address]                    ... DEFENDAN

TUNTUTAN: RM [Amount] ([Reason])

FAKTA-FAKTA KES:
[Numbered paragraphs chronologically]

ASAS UNDANG-UNDANG:
- Akta Kontrak 1950, Seksyen 74 (breach of contract damages)
- Akta Keterangan 1950, Seksyen 90A (digital evidence admissibility)

RELIEF YANG DITUNTUT:
[What plaintiff requests tribunal to order]

EKSHIBIT:
[List evidence with hash values]

Malaysian Law References:
- Akta Kontrak 1950, Seksyen 74: Compensation for breach
- Akta Keterangan 1950, Seksyen 90A: Computer output admissibility
- Akta Keterangan 1950, Seksyen 101: Burden of proof

CRITICAL RULES:
- Form 198 ALWAYS in Bahasa Malaysia (legal requirement)
- Include SHA-256 hashes for all evidence
- Cite specific sections of Malaysian law
- Include disclaimer: "This is not legal advice, consult lawyer for complex cases"
- Use DD/MM/YYYY date format
- Currency in RM (Malaysian Ringgit)`;

// ------------------------------------------------------------------------------
// PROMPT 3: CONVERSATIONAL AI
// ------------------------------------------------------------------------------
const CONVERSATIONAL_PROMPT = `You are the conversational AI assistant for SewaSecure, a Malaysian tenancy evidence platform.

ROLE: Help users understand disputes, gather information, and guide them through resolution.

YOUR PERSONALITY:
- Professional but friendly
- Empathetic to dispute stress
- Impartial (serve both tenants and landlords equally)
- Educational (explain legal concepts simply)
- Bilingual (respond in user's language: English or Bahasa Malaysia)

CONVERSATION FLOW:
1. UNDERSTAND THE SITUATION
   Ask: "What's the dispute about?"
   
2. GATHER KEY DETAILS
   - Deposit amount
   - Move-in/move-out dates
   - What damage is claimed
   - What evidence exists

3. CHECK FOR AGREEMENT
   If AGREE → "Great! Since you both agree, no formal report needed."
   If DISAGREE → "I'll help you resolve this. Let me analyze the evidence."

4. OFFER SOLUTIONS
   Option A: "Generate dispute report" (for negotiation)
   Option B: "Generate demand letter" (formal request)
   Option C: "Prepare Form 198" (legal action)

Malaysian Context:
- Tribunal Tuntutan Pengguna Malaysia (TTPM) handles claims up to RM 50,000
- No lawyers required for tribunal
- Forms must be in Bahasa Malaysia
- Process takes 3-6 months typically`;

// ------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------------------

function getSystemPrompt(action: string): string {
  const prompts: Record<string, string> = {
    'analyze_move_in_photo': IMAGE_ANALYSIS_PROMPT,
    'generate_form_198': LEGAL_DOCUMENT_PROMPT,
    'chat_with_user': CONVERSATIONAL_PROMPT,
  };
  return prompts[action] || CONVERSATIONAL_PROMPT;
}

// ------------------------------------------------------------------------------
// API CALL FUNCTIONS
// ------------------------------------------------------------------------------

/**
 * Analyze property photo with AI
 */
export async function analyzePropertyPhoto(
  imageBase64: string,
  context: {
    propertyAddress: string;
    roomType: string;
    moveInDate: string;
  }
): Promise<any> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        system: getSystemPrompt('analyze_move_in_photo'),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64
                }
              },
              {
                type: 'text',
                text: `Analyze this property photo taken at move-in.

Context:
- Property: ${context.propertyAddress}
- Room: ${context.roomType}
- Date: ${context.moveInDate}
- Purpose: Tenant documenting pre-existing damage to protect deposit

Provide analysis in JSON format.`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const textContent = data.content.find((c: any) => c.type === 'text');
    
    if (!textContent) {
      throw new Error('No text response from AI');
    }

    // Extract JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
}

/**
 * Generate Form 198 (Borang 198) for tribunal
 */
export async function generateForm198(disputeData: {
  plaintiffName: string;
  plaintiffIC: string;
  plaintiffAddress: string;
  defendantName: string;
  defendantIC: string;
  defendantAddress: string;
  amount: number;
  reason: string;
  facts: string[];
  evidence: string[];
}): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 3000,
        system: getSystemPrompt('generate_form_198'),
        messages: [
          {
            role: 'user',
            content: `Generate Form 198 (Borang 198) for Tribunal Tuntutan Pengguna Malaysia.

Dispute Details:
- Plaintiff: ${disputeData.plaintiffName} (IC: ${disputeData.plaintiffIC})
- Plaintiff Address: ${disputeData.plaintiffAddress}
- Defendant: ${disputeData.defendantName} (IC: ${disputeData.defendantIC})
- Defendant Address: ${disputeData.defendantAddress}
- Amount Claimed: RM ${disputeData.amount}
- Reason: ${disputeData.reason}

Facts of Case:
${disputeData.facts.map((fact, i) => `${i + 1}. ${fact}`).join('\n')}

Evidence Available:
${disputeData.evidence.map((ev, i) => `${i + 1}. ${ev}`).join('\n')}

Generate complete Form 198 in Bahasa Malaysia format.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const textContent = data.content.find((c: any) => c.type === 'text');
    
    return textContent?.text || 'Error generating Form 198';
  } catch (error) {
    console.error('Form 198 Generation Error:', error);
    throw error;
  }
}

/**
 * Chat with AI assistant
 */
export async function chatWithUser(
  conversationHistory: Array<{ role: string; content: string }>,
  userMessage: string
): Promise<string> {
  try {
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: getSystemPrompt('chat_with_user'),
        messages: messages
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const textContent = data.content.find((c: any) => c.type === 'text');
    
    return textContent?.text || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Chat Error:', error);
    throw error;
  }
}

