import { BskyAgent } from "@atproto/api";

const agent = new BskyAgent({
  service: "https://bsky.social",
});

const string = (value: unknown) => {
  if (typeof value !== "string") {
    throw new Error("Expected a string");
  }
  return value;
};

await agent.login({
  identifier: string(import.meta.env.BSKY_USERNAME),
  password: string(import.meta.env.BSKY_PASSWORD),
});

const posts = await agent.getAuthorFeed({
  actor: "mkizka.dev",
});

console.log(posts);
