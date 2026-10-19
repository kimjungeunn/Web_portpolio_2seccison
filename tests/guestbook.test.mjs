import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, validateMessage, verifyPassword } from '../lib/guestbook.mjs';

test('방명록 입력 길이와 타입 검증', () => {
  assert.deepEqual(validateMessage({ name: ' 정은 ', text: ' 안녕하세요 ', password: 'secret123' }), { name: '정은', text: '안녕하세요', password: 'secret123' });
  for (const value of [null, {}, { name: ' ', text: 'hi', password: '123456' }, { name: '가'.repeat(31), text: 'hi', password: '123456' }, { name: '가', text: 'a'.repeat(1001), password: '123456' }, { name: '가', text: 'hi', password: '123' }, { name: {}, text: 'hi', password: '123456' }]) assert.equal(validateMessage(value), null);
});
test('삭제 비밀번호를 salt와 함께 해시하고 올바른 비밀번호만 허용', () => {
  const hash = hashPassword('secret123');
  assert.notEqual(hash, hashPassword('secret123'));
  assert.equal(hash.includes('secret123'), false);
  assert.equal(verifyPassword('secret123', hash), true);
  assert.equal(verifyPassword('wrong123', hash), false);
  assert.equal(verifyPassword(null, hash), false);
  assert.equal(verifyPassword('secret123', 'invalid'), false);
});
