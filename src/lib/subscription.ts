import { ids, lexicons } from "@atproto/bsky/dist/lexicon/lexicons.js";
import type { OutputSchema as RepoEvent } from "@atproto/bsky/dist/lexicon/types/com/atproto/sync/subscribeRepos.js";
import { isCommit } from "@atproto/bsky/dist/lexicon/types/com/atproto/sync/subscribeRepos.js";
import { cborToLexRecord, readCar } from "@atproto/repo";
import { Subscription } from "@atproto/xrpc-server";

type Operation = {
  action: string;
  uri: string;
  cid: string;
  repo: string;
  collection: string;
  record: Record<string, unknown>;
};

export abstract class FirehoseSubscriptionBase {
  public sub: Subscription<RepoEvent>;

  constructor(public service: string = "wss://bsky.network") {
    this.sub = new Subscription({
      service: service,
      method: ids.ComAtprotoSyncSubscribeRepos,
      getParams: () => undefined, // TODO: fix
      validate: (value: unknown) => {
        try {
          return lexicons.assertValidXrpcMessage<RepoEvent>(
            ids.ComAtprotoSyncSubscribeRepos,
            value,
          );
        } catch (err) {
          console.error("repo subscription skipped invalid message", err);
        }
      },
    });
  }

  async handleEvent(event: RepoEvent) {
    if (!isCommit(event)) return;
    const car = await readCar(event.blocks);
    const operations: Operation[] = [];
    for (const op of event.ops) {
      if (!op.cid) continue;
      const recordBytes = car.blocks.get(op.cid);
      if (!recordBytes) continue;
      operations.push({
        action: op.action,
        cid: `${op.cid}`,
        uri: `at://${event.repo}/${op.path}`,
        collection: op.path.split("/")[0],
        repo: event.repo,
        record: cborToLexRecord(recordBytes),
      });
    }
    return this.handle(operations, event);
  }

  abstract handle(
    operations: Operation[],
    event: RepoEvent,
  ): Promise<void> | void;

  async run() {
    for await (const evt of this.sub) {
      try {
        await this.handleEvent(evt);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

class FirehoseSubscription extends FirehoseSubscriptionBase {
  handle(operations: Operation[], _event: RepoEvent): void | Promise<void> {
    if (operations[0] && !operations[0].collection.startsWith("app.bsky")) {
      console.log(JSON.stringify(operations, null, 2));
    }
  }
}

new FirehoseSubscription().run().catch(console.error);
