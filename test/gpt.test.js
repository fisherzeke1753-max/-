import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_GPT_MODEL, OPENAI_RESPONSES_URL, generateText, getApiKey } from "../src/gpt.js";

test("generateText sends a prompt through the Responses API", async () => {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return Response.json({ output_text: "你好！" });
  };

  const text = await generateText(
    { apiKey: "test-key", prompt: "  打个招呼  ", instructions: "中文回答" },
    fetchMock,
  );

  assert.equal(text, "你好！");
  assert.equal(calls[0].url, OPENAI_RESPONSES_URL);
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers.Authorization, "Bearer test-key");
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    model: DEFAULT_GPT_MODEL,
    instructions: "中文回答",
    input: "打个招呼",
  });
});

test("generateText rejects empty prompts", async () => {
  await assert.rejects(
    () => generateText({ apiKey: "test-key", prompt: "   " }, async () => Response.json({})),
    /prompt is required/,
  );
});

test("getApiKey requires OPENAI_API_KEY", () => {
  const originalKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    assert.throws(() => getApiKey(), /OPENAI_API_KEY is required/);
  } finally {
    if (originalKey !== undefined) {
      process.env.OPENAI_API_KEY = originalKey;
    }
  }
});
