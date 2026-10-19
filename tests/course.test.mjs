import test from 'node:test';
import assert from 'node:assert/strict';
import { hash, compare } from 'bcryptjs';
import { validateBoardInput, validateNotice, validPassword } from '../lib/validation.mjs';

test('게시글 이름·비밀번호 검증과 bcrypt 72바이트 한도', () => {
  const input = { title: ' 제목 ', content: ' 본문 ', category: '학습 기록', author: ' 정은 ', password: 'secure123' };
  assert.deepEqual(validateBoardInput(input), { title: '제목', content: '본문', category: '학습 기록', author: '정은', password: 'secure123' });
  for (const author of ['', ' ', 'a'.repeat(31), { $ne: null }]) assert.equal(validateBoardInput({ ...input, author }), null);
  for (const password of ['', 'short', '가'.repeat(25), { $ne: null }]) assert.equal(validateBoardInput({ ...input, password }), null);
  assert.equal(validPassword('a'.repeat(72)), true);
  assert.equal(validPassword('a'.repeat(73)), false);
  assert.equal(validPassword('가'.repeat(25)), false);
  assert.equal(validPassword('short'), false);
});
test('게시판 제목과 분류, 본문 검증', () => {
  assert.deepEqual(validateNotice({ title: ' 제목 ', content: ' 기록 ', category: '학습 기록' }), { title: '제목', content: '기록', category: '학습 기록' });
  for (const data of [null, {}, { title: 'a', content: 'b', category: 'wrong' }, { title: 'a'.repeat(121), content: 'b', category: '학습 기록' }, { title: 'a', content: ' ', category: '학습 기록' }, { title: { $ne: null }, content: 'b', category: '학습 기록' }]) assert.equal(validateNotice(data), null);
});
test('bcrypt는 평문을 저장하지 않고 올바른 비밀번호만 비교 성공', async () => {
  const passwordHash = await hash('secure123', 10);
  assert.notEqual(passwordHash, 'secure123');
  assert.notEqual(passwordHash, await hash('secure123', 10));
  assert.equal(await compare('secure123', passwordHash), true);
  assert.equal(await compare('wrong123', passwordHash), false);
});
