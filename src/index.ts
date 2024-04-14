import { BskyAgent } from "@atproto/api";

const agent = new BskyAgent({
  service: "https://bsky.social",
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});

const tl = await agent.getTimeline();
console.log(
  tl.data.feed.map(
    (item) =>
      // @ts-ignore
      item.post.record.text,
  ),
);
