import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

test('개발 서버의 기존 모델에도 새 조회수 필드를 반영한다', async () => {
  const existing = mongoose.model('Notice', new mongoose.Schema({ title: String }));
  assert.equal(existing.schema.path('views'), undefined);
  const { NoticeModel } = await import('../models/Notice.ts');
  assert.equal(NoticeModel, existing);
  assert.ok(NoticeModel.schema.path('views'));
  const notice = new NoticeModel({ title: '예전 모델에서 작성' });
  assert.equal(notice.views, 0);
});
