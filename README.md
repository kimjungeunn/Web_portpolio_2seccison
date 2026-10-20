# 김정은 포트폴리오

Next.js App Router와 MongoDB/Mongoose를 사용하는 개인 포트폴리오입니다. 로그인·회원가입 없이 소개와 프로젝트를 둘러보고, 게시판과 방명록에 글을 남길 수 있습니다.

## 실행

Node.js 24 LTS를 권장합니다. Windows PowerShell에서는 npm.cmd를 사용하세요.

```powershell
npm.cmd install
npm.cmd run setup:env
npm.cmd run dev
```

.env.local의 MONGODB_URI를 자신의 MongoDB 연결 문자열로 설정하고 서버를 다시 시작하세요. http://localhost:3000 에서 확인합니다.

```dotenv
MONGODB_URI=mongodb+srv://USER:PASSWORD@YOUR_CLUSTER.mongodb.net/portfolio?retryWrites=true&w=majority
MONGODB_DB=portfolio
```

로그인 기능을 제거했으므로 AUTH_SECRET은 더 이상 사용하지 않습니다. 기존 .env.local의 값이나 DB에 보관된 회원 데이터는 자동 삭제하지 않습니다. 환경 파일은 Git에서 제외됩니다.

Atlas의 Database User와 Network Access를 설정해야 합니다. URI 비밀번호의 특수문자는 URL 인코딩하세요. 로컬 MongoDB 서버를 실행 중이면 mongodb://127.0.0.1:27017을 사용할 수 있습니다.

## 구성

- /: 소개와 대표 프로젝트
- /about: 자기소개와 익명 방명록
- /projects: Team / Personal 분류 선택
- /projects/group/[group]: 분류별 프로젝트 목록
- /projects/[id]: 상세, 사이트·GitHub 링크, DB에 저장되는 응원
- /notices: 학습 기록 게시판
- /notices/new: 이름·본문·글 비밀번호로 작성
- /notices/[id]: 글 상세와 비밀번호 확인 후 삭제
- /notices/[id]/edit: 비밀번호 확인 후 수정

상단의 팀원 소개 메뉴와 로그인·회원가입 메뉴는 없습니다. 로그인 페이지와 인증 API도 제거했습니다.

## 게시판 비밀번호

계정 대신 글마다 비밀번호를 설정합니다. 새 글 작성 시 이름·제목·내용·분류와 비밀번호가 필요합니다. 비밀번호는 8자 이상, UTF-8 기준 72바이트 이하이며 bcrypt 10 rounds 해시만 저장합니다. 수정·삭제 시 서버가 비밀번호를 검증합니다. 해시는 화면이나 클라이언트에 보내지 않습니다.

기존 로그인 방식으로 작성된 글은 비밀번호가 없으므로 읽기 전용으로 보존됩니다. 그 글에 임의의 비밀번호를 부여하거나 다른 방문자가 수정·삭제하도록 허용하지 않습니다. 실제 DB 문서는 마이그레이션하거나 삭제하지 않았습니다.

방명록은 기존 scrypt 비밀번호 방식을 유지합니다. 좋아요는 여러 번 남길 수 있는 누적 응원입니다.

게시판 목록과 상세에 조회수를 표시합니다. 상세 화면이 실제로 열린 뒤 Server Action으로 MongoDB의 views를 1 증가시킵니다. 목록 조회·Next.js의 사전 로딩·수정 화면 열기만으로는 증가하지 않습니다. 새로고침이나 다시 방문하면 추가 집계하며 고유 방문자 수는 아닙니다. 기존 글은 0부터 표시하고 첫 조회 때 필드를 생성합니다. 조회수 갱신은 글 수정 날짜를 변경하지 않습니다.

## 구현 위치

- lib/content.js: 프로젝트 내용과 링크
- components/Navigation.js: 공통 메뉴
- components/NoticeForm.tsx: 글 작성·수정 입력 폼
- lib/actions.ts: 게시판 Server Action, revalidatePath·redirect
- lib/notices.ts: Mongoose 조회·저장과 비밀번호 검증
- models/Notice.ts: 게시글 스키마
- lib/db.ts: 연결 Promise 캐싱과 재시도
- app/notices/loading.tsx, error.tsx: 로딩·오류 화면
- components/LikeButton.tsx: useTransition으로 응원 서버 액션 호출
- components/ui/button.tsx: shadcn/ui 기반 버튼
- app/api/guestbook/route.js: 방명록 JSON Route Handler

## 검증과 배포

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run typecheck
npm.cmd start
```

Vercel에는 MONGODB_URI와 MONGODB_DB를 설정하고 재배포하세요. 실제 환경에서 게시글 작성·새로고침·수정·삭제, 잘못된 비밀번호 거절, 방명록과 응원 저장을 확인합니다.

수업 반영 내역은 docs/COURSE-MAPPING.md에 정리했습니다. 추가 기능은 TypeScript, 기존 소개 컴포넌트는 JavaScript를 사용합니다. Tailwind v4와 기존 CSS를 함께 사용합니다.
