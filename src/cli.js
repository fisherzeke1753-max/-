import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateText } from "./gpt.js";

loadDotEnv();

const prompt = process.argv.slice(2).join(" ").trim();

if (!prompt) {
  console.error("Usage: npm start -- \"你的问题或任务\"");
  process.exitCode = 1;
} else {
  try {
    const answer = await generateText({
      prompt,
      instructions: "You are a concise, helpful assistant. Answer in the user's language.",
    });

    console.log(answer);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`GPT request failed: ${message}`);
    process.exitCode = 1;
  }
}

function loadDotEnv(filePath = resolve(".env")) {
  if (!existsSync(filePath)) {
    return;
  }

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}
