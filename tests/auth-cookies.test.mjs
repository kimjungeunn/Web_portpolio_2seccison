import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { Auth } from '@auth/core';
import { encode } from '@auth/core/jwt';
import { authCookies } from '../lib/auth-cookies.mjs';

test('다른 localhost 프로젝트의 기존 JWT 쿠키는 읽지 않는다', async () => {
  const errors = [];
  const response = await Auth(new Request('http://localhost:3000/api/auth/session', {
    headers: { Cookie: 'authjs.session-token=old-unreadable-session; authjs.session-token.0=old-chunk' },
  }), {
    secret: randomBytes(32).toString('hex'), trustHost: true, providers: [], basePath: '/api/auth',
    cookies: authCookies('development'), session: { strategy: 'jwt' },
    logger: { error(error) { errors.push(error); } },
  });
  assert.equal(response.status, 200);
  assert.equal(await response.json(), null);
  assert.equal(errors.length, 0);
});

test('프로젝트 전용 세션은 정상 해독하고 기본 쿠키 보안 옵션을 유지한다', async () => {
  const secret = randomBytes(32).toString('hex');
  const cookies = authCookies('development');
  const name = cookies.sessionToken.name;
  const jwt = await encode({ secret, salt: name, token: { sub: 'test-id', name: '세션 검사' } });
  const response = await Auth(new Request('http://localhost:3000/api/auth/session', {
    headers: { Cookie: `${name}=${jwt}` },
  }), { secret, trustHost: true, providers: [], cookies, basePath: '/api/auth', session: { strategy: 'jwt' } });
  assert.equal((await response.json()).user.name, '세션 검사');
  const header = response.headers.getSetCookie().find(value => value.startsWith(`${name}=`));
  assert.match(header, /HttpOnly/i);
  assert.match(header, /SameSite=Lax/i);
  assert.equal(authCookies('production'), undefined);
});
