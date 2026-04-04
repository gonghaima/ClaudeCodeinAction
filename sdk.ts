import { query } from "@anthropic-ai/claude-agent-sdk";

const prompt = "Look for duplicate queries in the ./src/queries dir";

(async () => {
  for await (const message of query({
    prompt,
  })) {
    console.log(JSON.stringify(message, null, 2));
  }
})();
