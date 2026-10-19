import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import { NoticeModel } from '@/models/Notice';

export type Notice = { id: string; title: string; author: string; authorId: string; content: string; category: string; createdAt: string; updatedAt: string };
type NoticeDoc = { _id: unknown; title: string; author: string; authorId: string; content: string; category: string; createdAt: Date; updatedAt: Date };
function toNotice(doc: NoticeDoc): Notice {
  return { id: String(doc._id), title: doc.title, author: doc.author, authorId: doc.authorId, content: doc.content, category: doc.category, createdAt: doc.createdAt.toISOString(), updatedAt: doc.updatedAt.toISOString() };
}
export async function getNotices(): Promise<Notice[]> {
  await connectDB();
  const docs = await NoticeModel.find().sort({ createdAt: -1, _id: -1 }).limit(100).lean();
  return docs.map(toNotice);
}
export async function getNotice(id: string): Promise<Notice | null> {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const doc = await NoticeModel.findById(id).lean();
  return doc ? toNotice(doc) : null;
}
export async function createNotice(input: { title: string; content: string; category: string; author: string; authorId: string }): Promise<Notice> {
  await connectDB();
  return toNotice(await NoticeModel.create(input));
}
export async function updateNotice(id: string, authorId: string, input: { title: string; content: string; category: string }) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  // 브라우저에서 전달한 작성자 정보는 신뢰하지 않습니다. 서버 세션의 ID로 소유권을 확인합니다.
  const doc = await NoticeModel.findOneAndUpdate({ _id: id, authorId }, { $set: input }, { new: true, runValidators: true }).lean();
  return doc ? toNotice(doc) : null;
}
export async function deleteNotice(id: string, authorId: string) {
  if (!isValidObjectId(id)) return false;
  await connectDB();
  const result = await NoticeModel.deleteOne({ _id: id, authorId });
  return result.deletedCount === 1;
}
