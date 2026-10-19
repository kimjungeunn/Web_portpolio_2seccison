import mongoose from 'mongoose';

type Cache = { promise: Promise<typeof mongoose> | null };
declare global { var portfolioMongoose: Cache | undefined; }
const cached = globalThis.portfolioMongoose ?? { promise: null };
globalThis.portfolioMongoose = cached;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('DATABASE_UNAVAILABLE');
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'portfolio', serverSelectionTimeoutMS: 5000,
    }).catch(error => { cached.promise = null; throw error; });
  }
  return cached.promise;
}
