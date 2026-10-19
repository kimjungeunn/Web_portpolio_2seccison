// localhost의 쿠키는 포트별로 분리되지 않으므로 개발용 세션 이름을 프로젝트별로 지정합니다.
// options를 덮어쓰지 않아 Auth.js의 HttpOnly / SameSite / HTTPS 설정을 유지합니다.
export function authCookies(environment) {
  if (environment !== 'development') return undefined;
  return { sessionToken: { name: 'jungeun-portfolio.dev.session-token' } };
}
