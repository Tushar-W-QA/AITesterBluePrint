import Groq from "groq-sdk";
import { upsertRow, getAllRows, getTodayRow } from "./excelManager";
import type { ContentRow } from "./types";
import { KEYWORD_POOL } from "./types";
import { PERSONA } from "./persona";

function getClient(): Groq {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY not set");
  return new Groq({ apiKey: key });
}

async function chat(groq: Groq, prompt: string, systemPrompt: string): Promise<string> {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });
  return res.choices[0]?.message?.content ?? "";
}

export async function runAgent1(): Promise<string> {
  const groq = getClient();
  const rows = await getAllRows();
  const existingTopics = rows.map((r) => r.topic.toLowerCase());
  const pool = KEYWORD_POOL.filter((k) => !existingTopics.some((t) => t.includes(k.toLowerCase())));
  const keywordsToUse = pool.length > 0 ? pool : [...KEYWORD_POOL];

  const topic = await chat(
    groq,
    `Generate ONE specific, engaging article/post topic title (max 12 words) using one of these keywords: ${keywordsToUse.join(", ")}.
The topic must be relevant to software automation testing, AI in testing, or QA engineering.
Return ONLY the title, nothing else.`,
    `${PERSONA}\n\nYou are a technical content strategist. Generate specific, actionable topic titles for software testers and SDETs.`
  );

  const today = new Date().toISOString().split("T")[0];
  const cleanTopic = topic.trim().replace(/^["']|["']$/g, "");
  await upsertRow({ date: today, topic: cleanTopic, status: "Pending" });
  console.log(`[Agent1] Topic generated: ${cleanTopic}`);
  return cleanTopic;
}

export async function runAgent2(topic: string): Promise<void> {
  const groq = getClient();
  const today = new Date().toISOString().split("T")[0];
  await upsertRow({ date: today, topic, status: "Writing" });

  const systemPrompt = `${PERSONA}

Additional rules:
- Write in first person as Tushar Warad.
- Draw on seminar-speaker experience: clear structure, real examples, confident tone.
- Reference real tools: Playwright, Selenium, LangChain, n8n, Groq, DeepEval, etc.
- Include code snippets where they add value (markdown fences).
- No corporate speak, no padding.`;

  const [linkedinPost, mediumArticle, igScript, ytScript, devtoArticle] = await Promise.all([
    chat(
      groq,
      `Write a LinkedIn post as Tushar Warad about: "${topic}".

Requirements:
- Hook in the first line (no "I" as the first word). Bold, direct, pattern-interrupting.
- 150-200 words total.
- 3-5 bullet points with practical takeaways a QA engineer or SDET can use today.
- End with one question that invites fellow testers to share their experience in the comments.
- Add 4-5 relevant hashtags at the very end (not in the body).
- Voice: confident seminar speaker who also codes — no fluff, no self-promotion paragraph.`,
      systemPrompt
    ),

    chat(
      groq,
      `Write a 3000-word Medium article as Tushar Warad about: "${topic}".

Structure:
# [Title]
[Intro — 200 words: why this matters for testers right now]

## [Section 1 — Foundation / Context]
## [Section 2 — Core Concept]
## [Section 3 — Practical Implementation]
## [Section 4 — Real-World Example]
## [Section 5 — Common Pitfalls]
## [Section 6 — What's Next]
## Conclusion
[200 words wrap-up with one practical CTA]

Rules:
- Markdown formatting throughout.
- Real code examples in fenced blocks with language tags.
- Reference specific tools (Playwright, Groq, LangChain, etc.) with real usage context.
- Seminar-speaker clarity: each section builds on the last.
- No filler, no padding.`,
      systemPrompt
    ),

    chat(
      groq,
      `Write an Instagram Reel/Carousel script as Tushar Warad about: "${topic}".

CAROUSEL SLIDES:
Slide 1: [Hook — max 8 words, bold claim or question that stops the scroll]
Slide 2: [Key point 1 — max 15 words + emoji]
Slide 3: [Key point 2 — max 15 words + emoji]
Slide 4: [Key point 3 — max 15 words + emoji]
Slide 5: [Key point 4 — max 15 words + emoji]
Slide 6: [Key point 5 — max 15 words + emoji]
Slide 7: [Actionable tip — max 20 words]
Slide 8: [CTA — "Follow for more AI + Testing content."]

REEL VOICEOVER (60 seconds):
[Full spoken script — conversational, seminar-demo energy, as Tushar Warad]

CAPTION:
[Instagram caption, 8-10 hashtags at the end]`,
      systemPrompt
    ),

    chat(
      groq,
      `Write a YouTube video script as Tushar Warad about: "${topic}".

Structure:
[00:00] HOOK (20 sec — bold statement or demo-worthy question)
[00:20] INTRO (40 sec — who I am, what you'll learn today, why it matters right now)
[01:00] CONTEXT (2 min — what most testers get wrong or miss about this topic)
[03:00] MAIN CONTENT
  [03:00] Part 1: [subtitle]
  [06:00] Part 2: [subtitle]
  [09:00] Part 3: [subtitle]
[12:00] LIVE DEMO / CODE WALKTHROUGH (3 min — real code, real terminal output)
[15:00] COMMON MISTAKES TO AVOID (1 min — 3 quick points)
[16:00] OUTRO (1 min — summary, ask for likes/subscribe, one CTA)

Rules:
- Full spoken sentences, not bullet notes.
- Include [B-roll suggestions] in square brackets.
- Seminar-speaker energy: structured, confident, builds momentum.
- Conversational — like explaining to a room of testers, not reading a script.`,
      systemPrompt
    ),

    chat(
      groq,
      `Write a 2000-word Dev.to article as Tushar Warad about: "${topic}".

---
title: "[Article Title]"
published: false
tags: [pick 4 from: testing, playwright, selenium, ai, llm, qa, automation, sdet, langchain, n8n]
---

[Intro — 150 words]

## [Section 1]
[Content with code examples]

## [Section 2]
## [Section 3]
## [Section 4]

## Key Takeaways
- [3-5 actionable bullet points]

## Let's Discuss
[One question for the Dev.to testing community]

Rules:
- Technical peer-to-peer tone. Real code in fenced blocks with language tags.
- No corporate speak. No padding.
- Sign off with: "— Tushar Warad | Software Automation Testing | AI in QA"`,
      systemPrompt
    ),
  ]);

  const existing = await getTodayRow();
  await upsertRow({
    date: today,
    topic,
    linkedinPost: linkedinPost.trim(),
    mediumArticle: mediumArticle.trim(),
    igScript: igScript.trim(),
    ytScript: ytScript.trim(),
    devtoArticle: devtoArticle.trim(),
    status: "Prompting",
    linkedinImagePrompt: existing?.linkedinImagePrompt ?? "",
    mediumImagePrompt: existing?.mediumImagePrompt ?? "",
    igImagePrompt: existing?.igImagePrompt ?? "",
  });
  console.log(`[Agent2] Content written for: ${topic}`);
}

export async function runAgent3(topic: string): Promise<void> {
  const groq = getClient();
  const today = new Date().toISOString().split("T")[0];

  const imageSystem = `You are an expert at writing detailed image-generation prompts for technical content about software automation testing and AI in QA.

STRICT RULES — follow without exception:
- Do NOT include any brand names, academy names, company names, logos, watermarks, or text overlays in the prompt.
- Do NOT mention "Testing Academy", "Tushar Warad", or any person or organisation name.
- The image must be purely visual — no text, no logos, no branding of any kind.
- Style: dark background (#0d1117), electric blue / cyan accents, clean code-editor or circuit-board motif, professional and modern.
- Focus entirely on visualising the TOPIC concept through abstract or technical imagery.`;

  try {
    const [mediumPrompt, linkedinPrompt, igPrompt] = await Promise.all([
      chat(
        groq,
        `Create a detailed image-generation prompt for a Medium cover image about: "${topic}".
Specs: 16:9 aspect ratio. Dark background, electric blue/cyan accent, clean tech aesthetic.
Visualise the core concept through abstract or technical imagery ONLY — no text, no logos, no brand names, no watermarks.
Include: subject description, style (digital illustration or 3D render), composition, color palette, mood (focused, authoritative), lighting (subtle glow).
Return ONLY the final prompt text, ready to paste into Midjourney or DALL-E 3.`,
        imageSystem
      ),

      chat(
        groq,
        `Create a detailed image-generation prompt for a LinkedIn banner about: "${topic}".
Specs: 1200×627 pixels (landscape). Dark background, electric blue accent, professional tech look.
Visualise the core concept through abstract or technical imagery ONLY — no text, no logos, no brand names, no watermarks.
Include: subject description, style, composition, color palette, mood, lighting.
Return ONLY the final prompt text, ready to paste into Midjourney or DALL-E 3.`,
        imageSystem
      ),

      chat(
        groq,
        `Create a detailed image-generation prompt for an Instagram square post about: "${topic}".
Specs: 1080×1080 pixels. Bold, eye-catching for mobile scroll. Dark bg, neon blue/cyan accents, dynamic tech/code visual elements.
Visualise the core concept through abstract or technical imagery ONLY — no text, no logos, no brand names, no watermarks.
Include: style (3D render or digital illustration), composition, color palette, mood, lighting.
Return ONLY the final prompt text, ready to paste into Midjourney or DALL-E 3.`,
        imageSystem
      ),
    ]);

    const existing = await getTodayRow();
    await upsertRow({
      date: today,
      topic,
      linkedinPost: existing?.linkedinPost ?? "",
      mediumArticle: existing?.mediumArticle ?? "",
      igScript: existing?.igScript ?? "",
      ytScript: existing?.ytScript ?? "",
      devtoArticle: existing?.devtoArticle ?? "",
      status: "Done",
      linkedinImagePrompt: linkedinPrompt.trim(),
      mediumImagePrompt: mediumPrompt.trim(),
      igImagePrompt: igPrompt.trim(),
    });
    console.log(`[Agent3] Image prompts generated for: ${topic}`);
  } catch (err) {
    const existing = await getTodayRow();
    await upsertRow({
      date: today,
      topic,
      linkedinPost: existing?.linkedinPost ?? "",
      mediumArticle: existing?.mediumArticle ?? "",
      igScript: existing?.igScript ?? "",
      ytScript: existing?.ytScript ?? "",
      devtoArticle: existing?.devtoArticle ?? "",
      status: "Error",
      linkedinImagePrompt: existing?.linkedinImagePrompt ?? "",
      mediumImagePrompt: existing?.mediumImagePrompt ?? "",
      igImagePrompt: existing?.igImagePrompt ?? "",
      errorMessage: err instanceof Error ? err.message : String(err),
    });
    console.error(`[Agent3] Error:`, err);
    throw err;
  }
}

// Cached — hits Groq API once every 2 minutes maximum
let _groqCache: { valid: boolean; ts: number } | null = null;

export async function validateGroqKey(): Promise<boolean> {
  if (_groqCache && Date.now() - _groqCache.ts < 120_000) return _groqCache.valid;
  try {
    const groq = getClient();
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 1,
    });
    _groqCache = { valid: true, ts: Date.now() };
    return true;
  } catch {
    _groqCache = { valid: false, ts: Date.now() };
    return false;
  }
}
