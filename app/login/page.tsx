import Link from 'next/link';
import { loginAction } from '@/lib/auth-actions';
import { SubmitButton } from '@/components/SubmitButton';
export const metadata = { title: '로그인 | 김정은' };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; registered?: string }> }) {
  const { error, registered } = await searchParams;
  const errors: Record<string, string> = { '1': '이메일 또는 비밀번호가 올바르지 않습니다.', setup: '로그인 연결 설정이 준비되지 않았습니다. 잠시 후 다시 방문해주세요.', unavailable: '지금은 로그인할 수 없습니다. 잠시 후 다시 시도해주세요.' };
  return <section className="wrap page"><div className="auth-panel"><p className="eyebrow">WELCOME BACK</p><h1 className="page-title">다시 만나 반가워요<span>.</span></h1><p>로그인하고 학습 이야기를 나눠보세요.</p>{error && <p className="error" role="alert">{errors[error] || errors['1']}</p>}{registered && <p className="notice">가입이 완료되었습니다. 이메일과 비밀번호로 로그인해주세요.</p>}<form action={loginAction}><label>이메일<input type="email" name="email" required maxLength={254} autoComplete="email" /></label><label>비밀번호<input type="password" name="password" required minLength={8} maxLength={72} autoComplete="current-password" /></label><SubmitButton label="로그인" /></form><p className="auth-foot">처음 방문하셨나요? <Link href="/register">회원가입 →</Link></p></div></section>;
}
