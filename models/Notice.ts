import mongoose, { type Model, type InferSchemaType } from 'mongoose';
const { Schema, model, models } = mongoose;
const noticeSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  author: { type: String, required: true, trim: true, maxlength: 30 },
  // 기존 로그인 게시글은 비밀번호 없이 읽기 전용으로 보존합니다.
  passwordHash: { type: String, select: false },
  content: { type: String, required: true, trim: true, maxlength: 10000 },
  views: { type: Number, default: 0, min: 0, required: true },
  category: { type: String, enum: ['학습 기록', '프로젝트 소식', '자유 이야기'] as string[], default: '학습 기록', required: true },
}, { timestamps: true });
export type NoticeRecord = InferSchemaType<typeof noticeSchema>;
// Hot reload는 기존 모델을 유지하므로 새 조회수 필드를 캐시된 스키마에도 반영합니다.
// 모델을 삭제·재등록하거나 DB 문서를 변경하지 않습니다.
if (models.Notice && !models.Notice.schema.path('views')) {
  models.Notice.schema.add({ views: { type: Number, default: 0, min: 0, required: true } });
  models.Notice.recompileSchema();
}
export const NoticeModel = (models.Notice as Model<NoticeRecord>) || model<NoticeRecord>('Notice', noticeSchema);
