// lib/db.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable inside .env.local");
}

// Extend global type to cache connection
interface MongooseGlobal extends Global {
  _mongoose?: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

declare const global: MongooseGlobal;

// Always initialize cached
const cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export default async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
