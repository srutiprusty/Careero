/* import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB; */
// utils/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
}

// attach cache to global to reuse across lambda invocations / hot reloads
let cached =
  global._mongooseCache ||
  (global._mongooseCache = { conn: null, promise: null });

// * Options tuned for serverless functions and faster failure when DB unreachable.
//* Adjust serverSelectionTimeoutMS to control how long to wait attempting to find a server.

const mongooseOptions = {
  // new URL parser and unified topology recommended
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Fail fast if the server selection takes too long (in ms)
  serverSelectionTimeoutMS: 5000,
  // socketTimeoutMS: 45000, // optional
  // family: 4, // force IPv4 (helpful in some environments)
};

// Enable mongoose buffering of model operations when disconnected for serverless.
mongoose.set("bufferCommands", true);

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new mongoose connection promise");
    cached.promise = mongoose
      .connect(MONGO_URI, mongooseOptions)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        // clear cached.promise so next invocation can retry
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connected");
  return cached.conn;
}

export default connectDB;
