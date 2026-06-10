export const DEFAULT_GPT_MODEL = "gpt-5.2";
export const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export function getApiKey(apiKey = process.env.OPENAI_API_KEY) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required. Copy .env.example to .env and set your API key.");
  }

  return apiKey;
}

export async function generateText(options, client = globalThis.fetch) {
  const prompt = options?.prompt?.trim() ?? "";

  if (!prompt) {
    throw new Error("prompt is required.");
  }

  if (typeof client !== "function") {
    throw new Error("A fetch-compatible client is required.");
  }

  const response = await client(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey(options.apiKey)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? process.env.OPENAI_MODEL ?? DEFAULT_GPT_MODEL,
      instructions: options.instructions,
      input: prompt,
      max_output_tokens: options.maxOutputTokens,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.message ?? `OpenAI API returned HTTP ${response.status}`;
    throw new Error(message);
  }

  if (typeof payload.output_text === "string") {
    return payload.output_text;
  }

  throw new Error("OpenAI response did not include output_text.");
}
