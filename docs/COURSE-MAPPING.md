# 01~07 강의 내용 적용표

제공된 PDF의 개념과 코드 패턴을 포트폴리오에 적용한 기록입니다. 각 주차 과제 전체를 독립 프로젝트로 복제하거나 자동채점 통과를 보장하는 문서는 아닙니다. 제출 지시와 예제 명령은 참고 자료로 읽었으며 실제 제출을 실행하지 않았습니다.

| 강의 | 확인한 내용 | 포트폴리오 적용 |
| --- | --- | --- |
| 01 강의개요 | React 19·Next.js 16, 보안·환경변수, 포트폴리오, AI 활용 기록 | 앱 구조, 시크릿 분리, 이 문서 |
| 02 개발환경구축 | Node 24, TypeScript, Tailwind v4, MongoDB/Mongoose, Auth.js, Vercel | package.json, tsconfig.json, postcss.config.mjs, .env.example, README |
| 03 Nextjs | App Router, layout, Server/Client Component, useState, Link | app/layout.js, 서버 SiteHeader.tsx·ProjectCards.js, 클라이언트 Guestbook.js |
| 04 Nextjs주요기능 | 동적 라우팅, await params, loading/Suspense, shadcn Button, Server Action 좋아요, useTransition, Route Handler | app/projects/[id]/page.tsx, loading.tsx, components/ui/button.tsx, LikeButton.tsx, lib/project-actions.ts, 방명록 API |
| 05 공지사항게시판 | Notice 타입, 계층 분리, 목록/상세/글쓰기, form action, useFormStatus, 필드 추가 | lib/notices.ts, app/notices/, NoticeListItem.tsx, NoticeForm.tsx, SubmitButton.tsx, category 필드 |
| 06 MongoDB연동 | Promise 캐싱, 실패 시 초기화, Mongoose 스키마·timestamps, 모델 재사용, 직렬화, error/reset | lib/db.ts, models/, 문자열 ID·ISO 날짜, app/notices/error.tsx, MongoDB 영속 저장 |
| 07 인증 | bcrypt hash/compare, User, Auth.js v5 Credentials, JWT, AUTH_SECRET, 가입 후 로그인, AuthError, 서버 헤더 | models/User.ts, lib/users.ts, auth.ts, lib/auth-actions.ts, /api/auth/[...nextauth], /register, /login, SiteHeader.tsx |

## 포트폴리오에 맞춘 적용

- 상품 예제의 상세와 좋아요는 기존 프로젝트 상세와 응원에 적용했습니다. 별도의 쇼핑몰은 만들지 않았습니다.
- Counter 실습의 useState는 방명록·좋아요의 화면 상태에서 사용합니다. 프로젝트는 Team / Personal 분류 페이지에서 탐색합니다.
- 게시판의 새 필드 category를 모델·검증·폼·목록·상세에 반영했습니다.
- 07 강의는 인증까지 다루고 인가는 이후 주차로 구분합니다. 이 프로젝트에는 실제 사용을 고려해 로그인 후 작성, 본인 글만 수정·삭제 규칙을 추가했습니다. 이를 07 강의의 필수 요구라고 주장하지 않습니다.
- 메모리 배열 단계 대신 MongoDB 최종 구현을 사용합니다. DB 실패를 가짜 데이터나 성공 메시지로 대체하지 않습니다.
- 자동 예시 시드는 생략했습니다. 실제 사용자가 쓴 글과 혼동하지 않도록 빈 게시판으로 시작합니다.
- shadcn/ui 기본 Button의 로컬 소스를 참고해 필요한 variant만 남기고 민트 테마로 조정했습니다.
- 기존 익명 방명록은 scrypt 방식을 유지하고 새 회원 인증에는 bcrypt를 사용합니다.
- 기존 JavaScript 소개 페이지는 유지하고 추가 기능은 TypeScript로 작성했습니다.

## AI 활용 기록

요청: 기존 포트폴리오를 Next.js·MongoDB로 만들고 제공된 01~07 강의 내용을 반영.

수행: PDF 7개 내용 확인 → 빠진 패턴 확인 → 게시판·Mongoose·인증·동적 상세·서버 액션 구현 → 테스트와 빌드로 수정·검증.

설명할 때 따라가 볼 코드 흐름:

1. NoticeForm의 name → FormData → createNoticeAction → 서버 세션과 입력 검사.
2. createNotice → connectDB → NoticeModel.create → 문자열 ID 변환.
3. revalidatePath → redirect → [id]/page.tsx의 await params와 getNotice.
4. 가입 폼 → bcrypt 해시 → User 저장 → Credentials 비교 → JWT 쿠키 → 서버 헤더 auth().
5. 로그인 실패의 AuthError와 성공 리다이렉트 신호를 구별하는 이유.

## 검증 결과

- `npm.cmd run build`: 성공.
- `npm.cmd run typecheck`: 성공.
- `npm.cmd test`: 입력 검증·scrypt·bcrypt 단위 테스트 5개 통과.
- 별도 임시 MongoDB와 프로덕션 서버로 HTTP 통합 검사 9개 통과: 페이지 응답, 가입 후 자동 로그인, 해시 저장·세션 정보, 이메일 중복 거절, 서버 작성자 지정, 글 수정·목록 반영, 타 계정 수정·삭제 거절, 본인 삭제, 방명록 저장·비밀번호 삭제, 로그아웃·로그인 실패·재로그인 흐름을 확인했습니다. 관련 항목은 검사 9개에 묶어 실행했습니다.
- 통합 검사 중 기존 MongoDB 드라이버와 Mongoose의 BSON 버전 차이로 방명록 삭제가 실패하는 문제를 발견하고 `Types.ObjectId`로 통일해 수정했습니다.
- 테스트 DB와 서버는 검사 종료 시 정리했습니다. 실제 Atlas 계정 연결·Vercel 배포는 진행하지 않았습니다.
- 브라우저 시각 검사와 좋아요 버튼 클릭 후 영속 저장 확인은 남아 있습니다. 좋아요 코드는 빌드·타입 검사까지 완료했습니다.

## 공식 문서 참고

- [Auth.js 설치](https://authjs.dev/getting-started/installation)
- [Credentials 인증](https://authjs.dev/getting-started/authentication/credentials)
- [Tailwind CSS와 Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [shadcn/ui 기본 Button 소스](https://github.com/shadcn-ui/ui/blob/main/apps/v4/public/r/styles/default/button.json)

실제 제출에는 저장소 커밋·배포 링크와 사용자가 이해하고 수정·검증한 기록을 별도로 정리해야 합니다.
