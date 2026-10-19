import { connectDB } from './db';

// 개발 중 hot reload에도 연결 풀을 재사용합니다. URI는 서버에서만 읽습니다.
export async function getDatabase() {
  const mongoose = await connectDB();
  return mongoose.connection.db;
}
