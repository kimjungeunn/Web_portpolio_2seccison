import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
const file = '.env.local';
if (!existsSync(file)) {
  writeFileSync(file, '# 자신의 MongoDB 연결 문자열을 아래에 입력하세요.\nMONGODB_URI=\nMONGODB_DB=portfolio\n', { mode: 0o600 });
}
const contents = readFileSync(file, 'utf8');
if (!/^AUTH_SECRET=.+$/m.test(contents)) {
  const secret = randomBytes(32).toString('base64url');
  if (/^AUTH_SECRET=.*$/m.test(contents)) writeFileSync(file, contents.replace(/^AUTH_SECRET=.*$/m, `AUTH_SECRET=${secret}`));
  else appendFileSync(file, `\nAUTH_SECRET=${secret}\n`);
  console.log('AUTH_SECRET을 .env.local에 생성했습니다. 값은 화면에 표시하지 않습니다.');
} else console.log('기존 AUTH_SECRET을 유지했습니다.');
console.log('.env.local의 MONGODB_URI를 설정하고 서버를 다시 시작해주세요.');
