// ==============================================================================
// SEWASECURE CLAUDE AI SERVICE - API Integration
// ==============================================================================

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true';
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001/api/claude';
const CLAUDE_API_URL = USE_PROXY ? PROXY_URL : 'https://api.anthropic.com/v1/messages';
// Using Claude 3 Haiku - fast, cost-effective, and proven to work
const CLAUDE_MODEL = 'claude-3-haiku-20240307';

// Import mock service for fallback
import { mockAnalyzePhoto, mockChatResponse, mockGenerateDocument } from './mockAI';

console.log(`🔧 AI Service Config:
  - Use Proxy: ${USE_PROXY ? 'YES ✓' : 'NO (Direct API - will fail due to CORS)'}
  - Endpoint: ${CLAUDE_API_URL}
  - API Key: ${CLAUDE_API_KEY ? 'Set ✓' : 'Not Set ✗'}
`);

// Helper function to build headers
function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Only add API key and version for direct API calls (not proxy)
  if (!USE_PROXY) {
    headers['x-api-key'] = CLAUDE_API_KEY;
    headers['anthropic-version'] = '2023-06-01';
  }
  
  return headers;
}

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
      "legal_basis": "Malaysian law principle (e.g., tenant not liable for reasonable use)",
      "dimensions": "Size of damage",
      "tenant_liability": "NONE|PARTIAL|FULL"
    }
  ],
  "overall_assessment": "Summary of room condition",
  "recommendation": "What should happen next"
}

ANALYSIS RULES:
- ALWAYS show confidence score (0-100%)
- ALWAYS explain reasoning in plain English/BM
- Consider tenancy duration (longer = more acceptable wear)
- Consider room type (kitchen vs bedroom wear differs)
- If comparing before/after: Focus on what CHANGED
- Flag if metadata missing (GPS, timestamp) - affects admissibility

CONFIDENCE SCORING:
- 90-100%: Obvious classification
- 70-89%: Likely correct, context-dependent
- 50-69%: Uncertain, recommend human review
- <50%: Cannot determine, need more evidence

Malaysian Legal Context:
- Evidence Act 1950, Section 90A: Digital evidence must have metadata
- Common law: Tenant not liable for reasonable wear from normal use
- Burden of proof: Party claiming damage must prove it`;

// ------------------------------------------------------------------------------
// PROMPT 2: LEGAL DOCUMENT GENERATION
// ------------------------------------------------------------------------------

const LEGAL_DOCUMENT_PROMPT = `You are the legal document generator for SewaSecure, a Malaysian tenancy evidence platform.

ROLE: Generate legally admissible documents for tenancy disputes under Malaysian law.

DOCUMENT TYPES YOU GENERATE:

1. MOVE-IN CONDITION REPORT (Simple)
   - When: No damage to document
   - Content: Simple acknowledgment both parties agree property is in good condition
   - No photos needed

2. MOVE-IN CONDITION REPORT (With Pre-Existing Damage)
   - When: Tenant documents damage to protect deposit
   - Content: Detailed report with photos, AI analysis, signatures
   - Purpose: Prove damage existed BEFORE tenancy

3. MOVE-OUT DISPUTE REPORT
   - When: Parties DISAGREE on liability
   - Content: Before/after comparison, AI analysis, settlement recommendation
   - NOT generated if both parties agree

4. FORM 198 (Borang 198) - Small Claims Tribunal
   - When: Dispute escalates to legal action
   - Language: MUST be in Bahasa Malaysia (mandatory by law)
   - Format: Official tribunal format with proper sections

5. DEMAND LETTER
   - When: Before filing Form 198, attempt settlement
   - Language: English or Bahasa Malaysia
   - Tone: Professional, firm, factual

FORM 198 STRUCTURE (Bahasa Malaysia):
BORANG 198
TRIBUNAL TUNTUTAN PENGGUNA MALAYSIA

ANTARA
[Plaintif Details]                    ... PLAINTIF
DAN
[Defendan Details]                    ... DEFENDAN

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
- Common law: Tenant not liable for normal wear and tear

CRITICAL RULES:
- Form 198 ALWAYS in Bahasa Malaysia (legal requirement)
- Include SHA-256 hashes for all evidence
- Cite specific sections of Malaysian law
- Include disclaimer: "This is not legal advice, consult lawyer for complex cases"
- Use DD/MM/YYYY date format
- Currency in RM (Malaysian Ringgit)
- Professional tone, no emotional language

WHEN NOT TO GENERATE:
- If both parties already agreed on outcome → close ticket, no document needed
- If dispute is unclear → request more information first`;

// ------------------------------------------------------------------------------
// PROMPT 3: CONVERSATIONAL INTAKE & CHAT
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
   Extract: Who, what, when, how much

2. GATHER KEY DETAILS
   - Deposit amount
   - Move-in/move-out dates
   - What damage is claimed
   - What evidence exists
   - What both parties are saying

3. CHECK FOR AGREEMENT
   Critical: "Have you and the [landlord/tenant] discussed this? Do you both agree or disagree?"
   
   If AGREE → "Great! Since you both agree, I'll close the ticket and process the settlement. No formal report needed."
   
   If DISAGREE → "I'll help you resolve this. Let me analyze the evidence and generate a dispute report."

4. OFFER SOLUTIONS
   Option A: "Generate dispute report" (for negotiation)
   Option B: "Generate demand letter" (formal request)
   Option C: "Prepare Form 198" (legal action)

INFORMATION EXTRACTION:
As you chat, extract structured data:
{
  "dispute_type": "deposit_withhold|damage_claim|utility_dispute",
  "amount_disputed": "RM amount",
  "tenant_name": "name",
  "landlord_name": "name",
  "property_address": "address",
  "move_in_date": "DD/MM/YYYY",
  "move_out_date": "DD/MM/YYYY",
  "tenant_position": "summary",
  "landlord_position": "summary",
  "evidence_available": ["move_in_photos", "move_out_photos", "receipts"],
  "agreement_status": "agree|disagree|partial"
}

KEY PHRASES TO DETECT:

Agreement indicators:
- "We both agree..."
- "They accepted..."
- "I'm okay with paying..."
- "We settled on..."
→ CLOSE TICKET, no report needed

Disagreement indicators:
- "They refuse..."
- "I don't agree..."
- "This is unfair..."
- "They're wrong..."
→ GENERATE DISPUTE REPORT

TONE GUIDELINES:
- Acknowledge emotions but stay professional
- Never guarantee outcomes ("This is a strong case" not "You will definitely win")
- Explain legal concepts in simple terms
- Offer multiple paths forward
- Remind: Both parties benefit from fair resolution

Malaysian Context:
- Tribunal Tuntutan Pengguna Malaysia (TTPM) handles claims up to RM 50,000
- No lawyers required for tribunal
- Forms must be in Bahasa Malaysia
- Process takes 3-6 months typically
- Always recommend lawyers for complex cases (>RM 10,000 or criminal matters)

CRITICAL RULE:
If both parties AGREE on outcome → DO NOT generate unnecessary reports. Close ticket efficiently.`;

// ------------------------------------------------------------------------------
// API HELPER FUNCTIONS
// ------------------------------------------------------------------------------

export type ClaudeMessage = {
  role: 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; source?: any }>;
};

export type AIAction = 
  | 'analyze_move_in_photo'
  | 'analyze_move_out_photo'
  | 'compare_before_after'
  | 'generate_move_in_report'
  | 'generate_dispute_report'
  | 'generate_form_198'
  | 'generate_demand_letter'
  | 'chat_with_user'
  | 'gather_dispute_info'
  | 'explain_legal_process';

function getSystemPrompt(action: AIAction): string {
  const prompts: Record<AIAction, string> = {
    analyze_move_in_photo: IMAGE_ANALYSIS_PROMPT,
    analyze_move_out_photo: IMAGE_ANALYSIS_PROMPT,
    compare_before_after: IMAGE_ANALYSIS_PROMPT,
    generate_move_in_report: LEGAL_DOCUMENT_PROMPT,
    generate_dispute_report: LEGAL_DOCUMENT_PROMPT,
    generate_form_198: LEGAL_DOCUMENT_PROMPT,
    generate_demand_letter: LEGAL_DOCUMENT_PROMPT,
    chat_with_user: CONVERSATIONAL_PROMPT,
    gather_dispute_info: CONVERSATIONAL_PROMPT,
    explain_legal_process: CONVERSATIONAL_PROMPT,
  };
  
  return prompts[action];
}

// ------------------------------------------------------------------------------
// MAIN API FUNCTIONS
// ------------------------------------------------------------------------------

/**
 * Analyze a property photo using Claude AI
 */
export async function analyzePropertyPhoto(
  imageBase64: string,
  context: {
    propertyAddress: string;
    roomType: string;
    moveInDate: string;
    purpose: string;
  }
): Promise<any> {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key not configured. Please set VITE_CLAUDE_API_KEY in your environment.');
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        model: CLAUDE_MODEL,
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
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: `Analyze this property photo taken at move-in.

Context:
- Property: ${context.propertyAddress}
- Room: ${context.roomType}
- Date: ${context.moveInDate}
- Purpose: ${context.purpose}

Provide analysis in JSON format.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${error}`);
    }

    const data = await response.json();
    const textContent = data.content[0].text;
    
    // Try to parse JSON from response
    try {
      return JSON.parse(textContent);
    } catch {
      // If not valid JSON, return as-is
      return { raw_response: textContent };
    }
  } catch (error: any) {
    // If CORS error or API unavailable, use mock data
    if (error.message?.includes('fetch') || error.message?.includes('CORS') || error.name === 'TypeError') {
      console.warn('⚠️ API call failed (likely CORS). Using mock data. Set up a backend proxy for production.');
      return mockAnalyzePhoto();
    }
    throw error;
  }
}

/**
 * Generate a legal document (dispute report, Form 198, demand letter)
 */
export async function generateLegalDocument(
  action: 'generate_dispute_report' | 'generate_form_198' | 'generate_demand_letter',
  disputeData: {
    tenantName: string;
    landlordName: string;
    propertyAddress: string;
    moveInDate: string;
    moveOutDate?: string;
    amount: number;
    tenantClaim: string;
    landlordClaim: string;
    moveInEvidence?: string;
    moveOutEvidence?: string;
  }
): Promise<string> {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key not configured. Please set VITE_CLAUDE_API_KEY in your environment.');
  }

  const documentType = 
    action === 'generate_dispute_report' ? 'dispute report' :
    action === 'generate_form_198' ? 'Form 198 (Borang 198)' :
    'demand letter';

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 3000,
        system: getSystemPrompt(action),
        messages: [
          {
            role: 'user',
            content: `Generate a ${documentType}.

Dispute Details:
- Tenant: ${disputeData.tenantName}
- Landlord: ${disputeData.landlordName}
- Property: ${disputeData.propertyAddress}
- Move-in Date: ${disputeData.moveInDate}
${disputeData.moveOutDate ? `- Move-out Date: ${disputeData.moveOutDate}` : ''}
- Disputed Amount: RM ${disputeData.amount}

Tenant's Position: ${disputeData.tenantClaim}
Landlord's Position: ${disputeData.landlordClaim}

${disputeData.moveInEvidence ? `Move-in Evidence: ${disputeData.moveInEvidence}` : ''}
${disputeData.moveOutEvidence ? `Move-out Evidence: ${disputeData.moveOutEvidence}` : ''}

Generate a detailed ${documentType}.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error: any) {
    // If CORS error or API unavailable, use mock data
    if (error.message?.includes('fetch') || error.message?.includes('CORS') || error.name === 'TypeError') {
      console.warn('⚠️ API call failed (likely CORS). Using mock data. Set up a backend proxy for production.');
      return mockGenerateDocument('dispute');
    }
    throw error;
  }
}

/**
 * Chat with the AI assistant
 */
export async function chatWithAI(
  conversationHistory: ClaudeMessage[],
  userMessage: string
): Promise<string> {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key not configured. Please set VITE_CLAUDE_API_KEY in your environment.');
  }

  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: userMessage },
  ];

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        system: getSystemPrompt('chat_with_user'),
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error: any) {
    // If CORS error or API unavailable, use mock data
    if (error.message?.includes('fetch') || error.message?.includes('CORS') || error.name === 'TypeError') {
      console.warn('⚠️ API call failed (likely CORS). Using mock data. Set up a backend proxy for production.');
      return mockChatResponse(userMessage);
    }
    throw error;
  }
}

/**
 * Check if Claude API is configured
 */
export function isClaudeConfigured(): boolean {
  return !!CLAUDE_API_KEY && CLAUDE_API_KEY !== '';
}

