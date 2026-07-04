import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('bufferCommands', false); // Fail fast instead of hanging

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not defined. Using in-memory fallback.");
    return null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).catch((err) => {
      console.error("MongoDB connection failed:", err.message);
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;