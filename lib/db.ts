import { MongoClient, type Collection } from "mongodb";

export type Subscriber = {
  email: string;
  unsubToken: string;
  ipHash: string;
  createdAt: Date;
  unsubscribedAt: Date | null;
  notifiedAt: Date | null;
};

// Reused across hot reloads in dev and across requests on a warm serverless instance.
const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

function getClient(): Promise<MongoClient> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  // Only the scheme is echoed back, never the credentials.
  if (!/^mongodb(\+srv)?:\/\//.test(url)) {
    const scheme = url.match(/^([a-z][a-z0-9+.-]*):/i)?.[1] ?? "(none)";
    throw new Error(
      `DATABASE_URL must be a MongoDB connection string starting with mongodb:// or mongodb+srv://, ` +
        `but it starts with "${scheme}://".`,
    );
  }

  globalForMongo._mongoClient ??= new MongoClient(url, { serverSelectionTimeoutMS: 8000 })
    .connect()
    .catch((err) => {
      globalForMongo._mongoClient = undefined;
      throw err;
    });
  return globalForMongo._mongoClient;
}

// Creates the indexes on first use, once per server instance. No migration step needed.
let indexesReady: Promise<void> | null = null;

/** The subscribers collection, with its indexes in place. */
export async function getSubscribers(): Promise<Collection<Subscriber>> {
  const client = await getClient();
  const col = client
    .db(process.env.DATABASE_NAME || "ism_coming_soon")
    .collection<Subscriber>("subscribers");

  indexesReady ??= (async () => {
    await col.createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { unsubToken: 1 }, unique: true },
      { key: { ipHash: 1, createdAt: 1 } },
    ]);
  })().catch((err) => {
    indexesReady = null;
    throw err;
  });
  await indexesReady;
  return col;
}
