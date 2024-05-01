import { AtpAgent, BskyAgent } from "@atproto/api";

const agent = new BskyAgent({
  service: "https://bsky.social",
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});

const posts = await agent.getAuthorFeed({
  actor: "mkizka.dev"
})

console.log(posts)
