import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
const noticeSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  author: { type: String, required: true, trim: true, maxlength: 30 },
  // 기존 로그인 게시글은 비밀번호 없이 읽기 전용으로 보존합니다.
  passwordHash: { type: String, select: false },
  content: { type: String, required: true, trim: true, maxlength: 10000 },
  category: { type: String, enum: ['학습 기록', '프로젝트 소식', '자유 이야기'] as string[], default: '학습 기록', required: true },
}, { timestamps: true });
export type NoticeRecord = InferSchemaType<typeof noticeSchema>;
export const NoticeModel = (models.Notice as Model<NoticeRecord>) || model<NoticeRecord>('Notice', noticeSchema);
