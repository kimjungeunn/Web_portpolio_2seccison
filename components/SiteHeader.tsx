import { auth } from '@/auth';
import Navigation from '@/components/Navigation';
export async function SiteHeader() {
  // 시크릿 미설정 상태에서도 포트폴리오 소개는 열람할 수 있습니다.
  const session = process.env.AUTH_SECRET ? await auth() : null;
  return <Navigation userName={session?.user?.name || null} />;
}
