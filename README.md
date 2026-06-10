# GPT Integration Starter

这个仓库提供了一个最小可运行的 GPT 接入示例，使用 OpenAI Responses API。项目只依赖 Node.js 20+ 的内置 `fetch`，不需要额外 npm 包。

## 功能

- 从 `OPENAI_API_KEY` 读取 OpenAI API Key。
- 默认使用 `gpt-5.2`，也可以通过 `OPENAI_MODEL` 覆盖。
- 提供可复用的 `generateText` 方法。
- 提供命令行入口，方便本地验证。
- 单元测试使用 mock fetch，不会真实调用 OpenAI API。

## 快速开始

```bash
cp .env.example .env
# 编辑 .env，填入 OPENAI_API_KEY
npm start -- "用一句话介绍这个项目"
```

## 在代码里调用

```js
import { generateText } from "./src/gpt.js";

const answer = await generateText({
  prompt: "帮我写一段产品介绍",
  instructions: "你是一个中文营销文案助手。",
});

console.log(answer);
```

## 环境变量

| 变量 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | 是 | - | OpenAI API Key。不要提交到代码仓库。 |
| `OPENAI_MODEL` | 否 | `gpt-5.2` | 覆盖默认 GPT 模型。 |

## 常用命令

```bash
npm test
npm start -- "你好，GPT"
```
