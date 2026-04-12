import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EndorsementCategory } from "./supabase";

/**
 * Analyze a submitted endorsement with Gemini.
 * Returns structured JSON: category, zinger, share caption, safety flag.
 */
export interface AnalyzedEndorsement {
  category: EndorsementCategory;
  zinger: string;
  share_caption: string;
  safe_to_publish: boolean;
}

const SYSTEM_PROMPT = `You are helping Keri H. Carroll's campaign for Chancery Court Judge.

Analyze the endorsement submitted below and return a JSON object with four fields:

1. "category" — one of these exact strings, pick the best fit:
   - "former_client"         — the writer is someone Keri helped as their attorney
   - "professional_reference" — the writer has worked with Keri in a professional capacity (judge, opposing counsel, co-counsel, court staff)
   - "community_leader"       — the writer is a church, civic, or community leader endorsing her
   - "fellow_attorney"        — the writer is another attorney endorsing her as qualified for the bench
   - "friend_family"          — the writer is a personal friend or family member
   - "other"                  — none of the above clearly fits

2. "zinger" — one punchy sentence under 20 words that captures the heart of the endorsement. Should read well as a social graphic caption. First-person is fine. No quotation marks, no trailing period if it feels better without.

3. "share_caption" — a 2–3 sentence social-share-ready caption the endorser could post along with a graphic. Warm, specific, and genuine. Written from the endorser's perspective. Under 280 characters.

4. "safe_to_publish" — boolean. false ONLY if the text is hostile, defamatory, spam, profane, or clearly not a real endorsement. Give normal endorsements the benefit of the doubt.

Return ONLY valid JSON, no markdown fences, no prose. Example:
{"category":"former_client","zinger":"She fought for my kids when no one else would","share_caption":"When our family needed a fierce advocate, Keri Carroll showed up. She has my full support for Chancery Court Judge.","safe_to_publish":true}`;

export async function analyzeEndorsement(
  name: string,
  endorsementText: string
): Promise<AnalyzedEndorsement> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const userPrompt = `Endorser name: ${name}\n\nEndorsement text:\n"""${endorsementText}"""`;

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 200)}`);
  }

  const obj = parsed as Partial<AnalyzedEndorsement>;
  const validCategories: EndorsementCategory[] = [
    "former_client",
    "professional_reference",
    "community_leader",
    "fellow_attorney",
    "friend_family",
    "other",
  ];

  const category = validCategories.includes(obj.category as EndorsementCategory)
    ? (obj.category as EndorsementCategory)
    : "other";

  return {
    category,
    zinger: (obj.zinger || "I'm with Keri.").toString().slice(0, 200),
    share_caption: (obj.share_caption || "I'm with Keri H. Carroll for Chancery Court Judge.").toString().slice(0, 400),
    safe_to_publish: obj.safe_to_publish !== false,
  };
}

/**
 * Human-readable headline for each category — used on the graphic template.
 */
export function headlineForCategory(category: EndorsementCategory): string {
  switch (category) {
    case "former_client":          return "Keri Helped Me";
    case "professional_reference": return "I've Worked With Keri";
    case "community_leader":       return "Keri Has My Support";
    case "fellow_attorney":        return "Keri Belongs on the Bench";
    case "friend_family":          return "I'm With Keri";
    default:                       return "I'm With Keri";
  }
}
