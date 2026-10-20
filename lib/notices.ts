import { isValidObjectId } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { NoticeModel } from '@/models/Notice';
import { validPassword } from '@/lib/validation.mjs';

export type Notice = { id: string; title: string; author: string; content: string; category: string; createdAt: string; updatedAt: string; hasPassword: boolean; views: number };
type NoticeDoc = { _id: unknown; title: string; author: string; content: string; category: string; createdAt: Date; updatedAt: Date; passwordHash?: string | null; views?: number };
function toNotice(doc: NoticeDoc): Notice {
  // 비밀번호 해시는 서버 밖으로 보내지 않습니다.
  return { id: String(doc._id), title: doc.title, author: doc.author, content: doc.content, category: doc.category, createdAt: doc.createdAt.toISOString(), updatedAt: doc.updatedAt.toISOString(), hasPassword: Boolean(doc.passwordHash), views: doc.views ?? 0 };
}
export async function getNotices(): Promise<Notice[]> {
  await connectDB();
  const docs = await NoticeModel.find().sort({ createdAt: -1, _id: -1 }).limit(100).lean();
  return docs.map(toNotice);
}
export async function getNotice(id: string): Promise<Notice | null> {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const doc = await NoticeModel.findById(id).select('+passwordHash').lean();
  return doc ? toNotice(doc) : null;
}
export async function incrementNoticeViews(id: string): Promise<number | null> {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  // $inc로 동시 접속 때도 누적하며 조회만으로 글 수정 시각을 바꾸지 않습니다.
  // 기존 문서에 views가 없으면 MongoDB가 1부터 생성합니다.
  const doc = await NoticeModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true, timestamps: false }).select('views').lean();
  return doc ? doc.views : null;
}
export async function createNotice(input: { title: string; content: string; category: string; author: string; password: string }): Promise<Notice> {
  if (!validPassword(input.password)) throw new Error('INVALID_PASSWORD');
  await connectDB();
  const { password, ...fields } = input;
  const passwordHash = await hash(password, 10);
  return toNotice(await NoticeModel.create({ ...fields, passwordHash }));
}
export async function updateNotice(id: string, password: string, input: { title: string; content: string; category: string; author: string }) {
  if (!isValidObjectId(id) || !validPassword(password)) return null;
  await connectDB();
  const original = await NoticeModel.findById(id).select('+passwordHash').lean();
  if (!original?.passwordHash || !await compare(password, original.passwordHash)) return null;
  const doc = await NoticeModel.findOneAndUpdate({ _id: id, passwordHash: original.passwordHash }, { $set: input }, { new: true, runValidators: true }).select('+passwordHash').lean();
  return doc ? toNotice(doc) : null;
}
export async function deleteNotice(id: string, password: string) {
  if (!isValidObjectId(id) || !validPassword(password)) return false;
  await connectDB();
  const original = await NoticeModel.findById(id).select('+passwordHash').lean();
  if (!original?.passwordHash || !await compare(password, original.passwordHash)) return false;
  const result = await NoticeModel.deleteOne({ _id: id, passwordHash: original.passwordHash });
  return result.deletedCount === 1;
}
