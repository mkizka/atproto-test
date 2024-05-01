import { AtpAgent } from "@atproto/api";

const agent = new AtpAgent({
  service: "https://bsky.social",
});

const string = (value: unknown) => {
  if (typeof value !== "string") {
    throw new Error("Expected a string");
  }
  return value;
};

await agent.login({
  identifier: string(import.meta.env.VITE_BSKY_USERNAME),
  password: string(import.meta.env.VITE_BSKY_PASSWORD),
});

export { agent };
