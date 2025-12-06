// Mock AI service for testing without backend
// Use this while backend proxy is being set up

export async function mockAnalyzePhoto(): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    items_detected: [
      {
        object: "wall",
        issue: "small crack",
        location: "Top left corner near ceiling",
        severity: "minor",
        classification: "pre_existing_damage",
        confidence: 0.85,
        reasoning: "The crack shows signs of age and weathering. The edges are worn and there's dust accumulation in the crevice, indicating this existed before tenant occupancy.",
        legal_basis: "Malaysian common law: Tenant not liable for pre-existing damage. Burden of proof on landlord to show damage is new.",
        dimensions: "Approximately 3cm length, hairline width",
        tenant_liability: "NONE"
      },
      {
        object: "floor",
        issue: "minor scuff marks",
        location: "Near doorway entrance",
        severity: "minor",
        classification: "wear_and_tear",
        confidence: 0.92,
        reasoning: "Light scuff marks in high-traffic area consistent with normal daily use. This is expected wear and tear from regular walking.",
        legal_basis: "Malaysian common law: Normal wear and tear is landlord's responsibility. Tenant not liable for reasonable use.",
        dimensions: "Multiple small marks, largest 2cm",
        tenant_liability: "NONE"
      }
    ],
    overall_assessment: "Room is in generally good condition. Detected issues are either pre-existing or normal wear and tear. No tenant liability identified.",
    recommendation: "Document this condition with photos and this report. Tenant should not be charged for these items during move-out."
  };
}

export async function mockChatResponse(message: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('deposit') || lowerMessage.includes('rm')) {
    return `I understand you're concerned about your security deposit. Under Malaysian tenancy law, landlords can only deduct from your deposit for:

1. **Actual damage** (not normal wear and tear)
2. **Unpaid rent or utilities**
3. **Breach of tenancy agreement**

Normal wear and tear includes:
- Minor scuff marks
- Small nail holes
- Faded paint
- Worn carpet in walkways

**Next Steps:**
1. Review your move-in photos - do they show pre-existing damage?
2. Document current condition with photos
3. Request an itemized list of deductions from landlord
4. If disputed, I can help you generate a formal dispute report

Would you like me to help you prepare a dispute report?`;
  }

  if (lowerMessage.includes('form 198') || lowerMessage.includes('tribunal')) {
    return `Form 198 (Borang 198) is the official filing document for the Tribunal Tuntutan Pengguna Malaysia.

**When to file:**
- After attempts at negotiation have failed
- After sending a demand letter (7-14 days notice)
- For claims up to RM 50,000

**Requirements:**
- Must be in Bahasa Malaysia (mandatory)
- Include all evidence (photos, receipts, contracts)
- List specific amounts claimed
- Cite legal basis for claim

**Process:**
1. File Form 198 at tribunal office
2. Tribunal schedules hearing (usually 3-6 months)
3. Both parties present evidence
4. Tribunal makes binding decision

I can generate a draft Form 198 for you. Would you like me to do that?`;
  }

  return `Thank you for your question about Malaysian tenancy law. I'm here to help you with:

- Deposit disputes
- Damage classification (pre-existing vs tenant damage)
- Legal document generation (dispute reports, Form 198, demand letters)
- Understanding your rights under Malaysian law

Could you provide more details about your specific situation? For example:
- What is the dispute about?
- Do you have move-in photos?
- What amount is involved?

This will help me give you more specific guidance.`;
}

export async function mockGenerateDocument(type: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const date = new Date().toLocaleDateString('en-MY', { day: '2-digit', month: '2-digit', year: 'numeric' });

  if (type === 'dispute') {
    return `DISPUTE RESOLUTION REPORT
Generated: ${date}

==================================================================
SEWASECURE TENANCY DISPUTE ANALYSIS
==================================================================

PROPERTY DETAILS:
-----------------
Property Address: [Property Address]
Tenant Name: [Tenant Name]
Landlord Name: [Landlord Name]
Tenancy Period: [Start Date] to [End Date]

DISPUTED MATTER:
----------------
Security Deposit Withholding: RM 1,500.00

TENANT'S POSITION:
------------------
The damage was pre-existing and documented in move-in photos taken on [date]. The tenant properly maintained the property and any wear is normal and reasonable for the duration of tenancy.

LANDLORD'S POSITION:
--------------------
The landlord claims the damage is new and was caused by tenant negligence during the tenancy period.

LEGAL ANALYSIS:
---------------
Under Malaysian common law and the Akta Kontrak 1950, the following principles apply:

1. BURDEN OF PROOF (Evidence Act 1950, Section 101)
   The party claiming damage (landlord) bears the burden of proving that:
   a) The damage did not exist at move-in
   b) The damage was caused by tenant negligence
   c) The damage exceeds normal wear and tear

2. NORMAL WEAR AND TEAR DOCTRINE
   Malaysian courts have consistently held that tenants are NOT liable for:
   - Minor scuff marks and scratches
   - Faded paint from sunlight
   - Worn carpet in high-traffic areas
   - Small nail holes (<3mm) for hanging pictures
   - General aging of fixtures

3. PRE-EXISTING DAMAGE PROTECTION
   Photos taken at move-in with timestamps and GPS data are admissible under the Evidence Act 1950, Section 90A as electronic evidence.

EVIDENCE REVIEW:
----------------
Move-In Evidence:
- Photos dated [date] showing existing wall crack
- Timestamp metadata confirms date
- GPS data confirms location

Move-Out Evidence:
- Photos show same condition as move-in
- No new damage identified
- Normal wear consistent with [X] months of occupancy

AI ANALYSIS SUMMARY:
--------------------
Automated image analysis detected:
- Wall crack (3cm) - Classification: PRE-EXISTING
- Floor scuffs - Classification: NORMAL WEAR & TEAR
- No items classified as TENANT DAMAGE

RECOMMENDATION:
---------------
Based on the evidence and legal analysis, the tenant has a STRONG CASE for full deposit return.

SUGGESTED NEXT STEPS:

Option 1 - Negotiation (Recommended First Step):
1. Send this report to landlord
2. Request itemized deduction list
3. Negotiate settlement based on evidence

Option 2 - Formal Demand Letter:
1. Send demand letter giving 14 days to return deposit
2. Include this report as supporting evidence
3. State intention to escalate if unresolved

Option 3 - Legal Action (If Above Fail):
1. File Form 198 with Tribunal Tuntutan Pengguna
2. Attach this report and all evidence
3. Tribunal will schedule hearing within 3-6 months

LEGAL DISCLAIMER:
-----------------
This report is for informational purposes only and does not constitute legal advice. For disputes involving large amounts (>RM 10,000) or complex legal issues, consult a qualified lawyer.

==================================================================
Generated by SewaSecure AI - Malaysian Tenancy Evidence Platform
Report ID: MOCK-${Date.now()}
==================================================================`;
  }

  return `[Mock ${type} document would be generated here]`;
}

