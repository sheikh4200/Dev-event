import mongoose, { Connection, Mongoose } from 'mongoose';

/**
 * Shape of the cached connection object stored on the global scope.
 * This prevents creating multiple connections in development when
 * Next.js hot-reloads or re-imports modules.
 */
interface MongooseGlobalCache {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Augment the global type so TypeScript knows about `mongoose` on `globalThis`.
 * We use `var` here instead of `let/const` because in Node.js `var`-declared
 * globals can be re-declared across module reloads without throwing.
 */
// eslint-disable-next-line no-var
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseGlobalCache | undefined;
}



/**
 * Use a global variable in development to preserve the connection across
 * hot-reloads. In production, this will be `undefined` and a fresh cache
 * object will be created per server instance.
 */
const cached: MongooseGlobalCache = globalThis.mongoose ?? { conn: null, promise: null };

if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

/**
 * Establishes (or reuses) a singleton Mongoose connection.
 *
 * Usage (in API routes or server components):
 *   await connectToDatabase();
 */
export async function connectToDatabase(): Promise<Connection> {
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Fail fast if the environment variable is missing; this is a misconfiguration
  // that should never reach runtime in production.
  throw new Error('Please define the MONGODB_URI environment variable in your .env file');
}

  // If we already have an active connection, reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already in progress, wait for it and then reuse it.
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    } as const;

    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;

  return cached.conn;
}
