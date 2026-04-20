import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EndorsementCategory, EndorsementPillar } from "./supabase";

/**
 * Analyze a submitted endorsement with Gemini.
 * Returns structured JSON: category (who's speaking), pillar (what they're
 * testifying to), zinger, share caption, and a safety flag.
 */
export interface AnalyzedEndorsement {
  category: EndorsementCategory;
  pillar: EndorsementPillar;
  zinger: string;
  share_caption: string;
  safe_to_publish: boolean;
}

const SYSTEM_PROMPT = `You are helping Keri H. Carroll's campaign for Chancery Court Judge.

Analyze the endorsement submitted below and return a JSON object with five fields:

1. "category" — WHO is speaking. One of these exact strings, pick the best fit:
   - "former_client"         — the writer is someone Keri helped as their attorney
   - "professional_reference" — the writer has worked with Keri in a professional capacity (judge, opposing counsel, co-counsel, court staff)
   - "community_leader"       — the writer is a church, civic, or community leader endorsing her
   - "fellow_attorney"        — the writer is another attorney endorsing her as qualified for the bench
   - "friend_family"          — the writer is a personal friend or family member
   - "other"                  — none of the above clearly fits

2. "pillar" — WHAT the endorsement is testifying to. Pick the single best fit among the three campaign pillars. These are Keri's core message framework; every endorsement maps to one:
   - "experience" — they're vouching for her legal/professional competence, subject-matter mastery, qualifications, years of practice, preparation, or readiness for the bench. Keywords: knowledgeable, skilled, prepared, experienced, qualified, sharp, understands the law, handled my case expertly.
   - "fairness"   — they're vouching for her character, judicial temperament, integrity, impartiality, how she treats people, listening, patience, respect regardless of circumstance. Keywords: fair, honest, listens, treats everyone equally, patient, balanced, respectful, professional demeanor, steady.
   - "family"     — they're vouching for her personal commitment to families, kids, clients in their hardest moments, her compassion for family matters, or her community/family-centered values. Keywords: cared about my kids, protected my family, community, dedicated, compassionate, personal, showed up, stood by us.
   - "other"      — use ONLY if the endorsement genuinely doesn't fit any of the three.

   Tie-breaker when an endorsement touches multiple pillars: pick the pillar the ZINGER emphasizes. If the zinger leads with competence → "experience". If it leads with character/fairness → "fairness". If it leads with caring for a family/client through a hard moment → "family".

3. "zinger" — one punchy sentence under 20 words that captures the heart of the endorsement. Should read well as a social graphic caption. First-person is fine. No quotation marks, no trailing period if it feels better without.

4. "share_caption" — a 2–3 sentence social-share-ready caption the endorser could post along with a graphic. Warm, specific, and genuine. Written from the endorser's perspective. Under 280 characters.

5. "safe_to_publish" — boolean. false ONLY if the text is hostile, defamatory, spam, profane, or clearly not a real endorsement. Give normal endorsements the benefit of the doubt.

Return ONLY valid JSON, no markdown fences, no prose. Example:
{"category":"former_client","pillar":"family","zinger":"She fought for my kids when no one else would","share_caption":"When our family needed a fierce advocate, Keri Carroll showed up. She has my full support for Chancery Court Judge.","safe_to_publish":true}`;

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
  const validPillars: EndorsementPillar[] = [
    "experience",
    "fairness",
    "family",
    "other",
  ];

  const category = validCategories.includes(obj.category as EndorsementCategory)
    ? (obj.category as EndorsementCategory)
    : "other";
  const pillar = validPillars.includes(obj.pillar as EndorsementPillar)
    ? (obj.pillar as EndorsementPillar)
    : "other";

  return {
    category,
    pillar,
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

/**
 * Display label for each pillar — Title Case brand word for badges and filters.
 */
export function labelForPillar(pillar: EndorsementPillar | null | undefined): string {
  switch (pillar) {
    case "experience": return "Experience";
    case "fairness":   return "Fairness";
    case "family":     return "Family";
    case "other":      return "Other";
    default:           return "Unclassified";
  }
}
