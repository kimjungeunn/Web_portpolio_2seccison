# 김정은 포트폴리오

기존 포트폴리오를 밝은 크림색·민트색으로 다시 구성하고 01~07 강의의 Next.js·게시판·MongoDB·인증 패턴을 적용했습니다. [수업 내용 적용표](docs/COURSE-MAPPING.md)에서 강의별 구현 위치를 확인하세요.

## 실행 준비

강의와 동일하게 Node.js 24 LTS 사용을 권장합니다. PowerShell에서는 npm.cmd를 사용하세요.

```powershell
npm.cmd install
npm.cmd run setup:env
npm.cmd run dev
```

setup:env는 .env.local을 만들고 랜덤 AUTH_SECRET을 생성합니다. 기존 시크릿은 유지하고 화면에 출력하지 않습니다. **.env.local의 MONGODB_URI를 자신의 MongoDB 접속 문자열로 채운 뒤 서버를 다시 시작하세요.** 주소는 http://localhost:3000 입니다.

MongoDB Atlas에서 클러스터와 Database User를 만들고 Network Access에 개발 PC 및 배포 서버의 접속을 허용합니다. Connect → Drivers의 연결 문자열에 실제 DB 사용자명과 비밀번호를 채우세요. 특수문자는 URL 인코딩합니다. Atlas 로그인 계정과 DB 사용자는 별개입니다.

```dotenv
MONGODB_URI=mongodb+srv://USER:PASSWORD@YOUR_CLUSTER.mongodb.net/portfolio?retryWrites=true&w=majority
MONGODB_DB=portfolio
AUTH_SECRET=생성된_값_유지
```

로컬 MongoDB 서버 실행 중이면 mongodb://127.0.0.1:27017 도 가능합니다. .env.local은 Git에서 제외됩니다. DB 미연결 상태에서는 소개 페이지를 확인할 수 있지만 로그인·게시판·방명록 저장은 동작하지 않습니다.

## 기능과 경로

| 경로 | 기능 |
| --- | --- |
| / | 소개와 대표 프로젝트 |
| /about | 자기소개와 익명 방명록 |
| /team | 기존 팀원 소개와 링크 |
| /projects | Team / Personal 분류 선택 |
| /projects/group/[group] | 선택한 분류의 프로젝트 목록 |
| /projects/[id] | 동적 상세와 MongoDB 좋아요 |
| /notices | 학습 기록 게시판, 최근 100개 |
| /notices/new | 로그인한 계정으로 작성 |
| /notices/[id] | 글 상세와 본인 글 삭제 확인 |
| /notices/[id]/edit | 본인 글 수정 |
| /register, /login | 가입 후 자동 로그인, 재로그인 |

## 구조

- auth.ts: Auth.js v5 Credentials, JWT 세션, bcrypt 비교.
- lib/auth-actions.ts: 가입·로그인·로그아웃 Server Action. AuthError와 리다이렉트 신호 구분.
- components/SiteHeader.tsx: 서버의 auth() 결과를 공통 헤더에 전달.
- lib/db.ts: Mongoose 연결 Promise 캐싱, 실패 시 초기화.
- models/: User, Notice, ProjectStat 스키마와 timestamps, unique 인덱스.
- lib/notices.ts: 화면에서 분리한 DB 접근 계층.
- lib/actions.ts: 게시판 액션, 세션 기반 소유권 확인, revalidatePath와 redirect.
- components/SubmitButton.tsx: useFormStatus로 제출 중 중복 클릭 방지.
- components/LikeButton.tsx: useTransition으로 서버 액션 호출. DB의 $inc로 응원 누적.
- components/ui/button.tsx: shadcn/ui 기본 Button 소스를 민트 테마에 맞춘 로컬 컴포넌트.
- app/notices/loading.tsx, error.tsx: 자동 로딩 화면, 일반 오류 안내와 재시도.
- app/api/guestbook/route.js: JSON Route Handler. Mongoose 연결의 DB 재사용.

새 기능은 TypeScript로 작성했고 기존 JavaScript는 allowJs로 함께 사용합니다. Tailwind v4와 기존 CSS를 함께 적용하며 기존 디자인 유지를 위해 preflight 초기화는 생략했습니다.

회원 비밀번호는 bcrypt 10 rounds로 해싱하며 UTF-8 기준 72바이트 한도를 서버에서 검증합니다. 익명 방명록은 기존 scrypt 비밀번호와 문서 형식을 유지합니다. 비밀번호 해시는 조회 응답에 포함하지 않습니다. 글은 React 텍스트로 렌더링합니다.

## 검증

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run typecheck
npm.cmd start
```

Atlas 연결 후 확인할 흐름:

1. 가입 → 헤더에 이름 → 로그아웃 → 재로그인. 틀린 비밀번호는 일반적인 실패 문구 표시.
2. 글 작성 → 상세 이동 → 새로고침 후 유지 → 수정 → 삭제 확인.
3. 다른 계정에서 남의 글 수정 거절. 로그아웃 후 글쓰기 시 로그인으로 이동.
4. 프로젝트 응원 → 새로고침 후 수 유지. 여러 번 응원 가능하며 사용자별 투표 기능은 아닙니다.
5. 방명록 등록 → 다른 브라우저에서 조회 → 잘못된 비밀번호 삭제 거절 → 올바른 비밀번호 삭제.
6. DB 미연결 시 게시판 오류 화면, 방명록·좋아요 실패 안내 확인.

## 개발 중 로그인 세션 오류

`JWTSessionError: no matching decryption secret`은 이전 쿠키를 현재 AUTH_SECRET으로 해독할 수 없을 때 발생합니다. 개발 모드에서는 전용 쿠키 `jungeun-portfolio.dev.session-token`을 사용해 다른 localhost 프로젝트와의 충돌을 피합니다. 변경 후 처음에는 다시 로그인해야 합니다.

AUTH_SECRET은 서버를 실행할 때마다 바꾸지 마세요. 직접 바꿨다면 서버를 재시작하고 브라우저 개발자 도구 → Application → Cookies에서 이 프로젝트의 세션 쿠키(분할된 .0, .1 포함)를 삭제한 후 로그인하세요. MongoDB 데이터나 회원 계정을 삭제할 필요는 없습니다. 배포 환경에서는 Auth.js 기본 보안 쿠키 설정을 사용합니다.

## 배포 안내

Vercel의 Next.js 프로젝트로 배포할 수 있습니다. Environment Variables에 MONGODB_URI, MONGODB_DB, AUTH_SECRET을 등록하고 재배포하세요. 실제 GitHub Organization 저장소, 학번, 제출 PR은 본인의 정보를 사용해야 합니다. 원격 저장소 생성·push·제출·배포는 실행하지 않았습니다.

팀원·과제 링크는 기존 참고 사이트에서 가져왔고 새 경력이나 실적은 추가하지 않았습니다. PDF는 저장소에 복사하지 않았습니다. 공개 서비스로 확대하려면 요청 제한·스팸 방지·이메일 검증·비밀번호 재설정·페이지네이션을 별도로 설계할 수 있습니다.
