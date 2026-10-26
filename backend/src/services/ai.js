import OpenAI from "openai";

const KNOWLEDGE_BASE = `
BookLeaf support knowledge base:
- Royalty statements are calculated from confirmed sales and payout status appears in the author dashboard.
- Authors should include their book title, ISBN, sales period, and statement details for royalty questions.
- ISBN and metadata changes require the book title, current value, and requested correction.
- Printing and quality issues should include photos or a detailed description when available.
- Distribution availability can vary by platform, territory, and current stock.
- Production status updates depend on the current stage shown in the author dashboard.
- Never promise a payout, correction, replacement, or timeline unless an admin confirms it.
`;

const CATEGORY_VALUES = [
  "ROYALTY_PAYMENTS",
  "ISBN_METADATA",
  "PRINTING_QUALITY",
  "DISTRIBUTION_AVAILABILITY",
  "BOOK_STATUS_PRODUCTION",
  "GENERAL_INQUIRY",
];
const PRIORITY_VALUES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export async function analyzeTicket({ subject, description }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
You are BookLeaf's internal support triage assistant.

Analyze the support ticket and return JSON with:
- category: one of ${CATEGORY_VALUES.join(", ")}
- priority: one of ${PRIORITY_VALUES.join(", ")}
- draftResponse: a concise, empathetic draft a human support representative can edit

Use the knowledge base below. Do not claim that an action has already been completed.
If information is missing, ask for the minimum useful detail. Treat six months
without royalty as CRITICAL or HIGH, and general profile questions as LOW.
${KNOWLEDGE_BASE}
`,
      },
      {
        role: "user",
        content: `Subject: ${subject}\nDescription: ${description}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned an empty response");
  }

  const result = JSON.parse(content);
  if (!CATEGORY_VALUES.includes(result.category) || !PRIORITY_VALUES.includes(result.priority)) {
    throw new Error("AI returned invalid ticket classification");
  }
  return result;
}

export { KNOWLEDGE_BASE, CATEGORY_VALUES, PRIORITY_VALUES };