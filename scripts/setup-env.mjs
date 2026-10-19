import { existsSync, copyFileSync } from 'node:fs';
if (!existsSync('.env.local')) {
  copyFileSync('.env.example', '.env.local');
  console.log('.env.local을 생성했습니다. MONGODB_URI를 설정하고 서버를 다시 시작해주세요.');
} else console.log('기존 .env.local을 유지했습니다. 로그인 시크릿은 더 이상 필요하지 않습니다.');
