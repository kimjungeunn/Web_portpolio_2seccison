import Link from 'next/link';
import { registerAction } from '@/lib/auth-actions';
import { SubmitButton } from '@/components/SubmitButton';
export const metadata = { title: '회원가입 | 김정은' };
export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const errors: Record<string, string> = { validation: '이름·이메일을 확인해주세요. 비밀번호는 8자 이상, UTF-8 기준 72바이트 이하여야 합니다.', duplicate: '이미 가입된 이메일입니다. 로그인해주세요.', unavailable: '가입하지 못했습니다. 잠시 후 다시 시도해주세요.', setup: '회원가입 연결 설정이 준비되지 않았습니다. 잠시 후 다시 방문해주세요.' };
  return <section className="wrap page"><div className="auth-panel"><p className="eyebrow">LET’S LEARN TOGETHER</p><h1 className="page-title">함께 이야기해요<span>.</span></h1><p>게시판에서 배움과 프로젝트 이야기를 나눠보세요.</p>{error && <p className="error" role="alert">{errors[error] || errors.unavailable}</p>}<form action={registerAction}><label>이름<input name="name" required maxLength={30} autoComplete="name" /></label><label>이메일<input name="email" type="email" required maxLength={254} autoComplete="email" /></label><label>비밀번호<input name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" aria-describedby="password-help" /></label><p id="password-help" className="muted text-xs">8자 이상 입력해주세요. 한글 등 다중 바이트 문자는 최대 길이가 짧아질 수 있습니다.</p><SubmitButton label="가입하고 로그인" /></form><p className="auth-foot">이미 계정이 있나요? <Link href="/login">로그인 →</Link></p></div></section>;
}
