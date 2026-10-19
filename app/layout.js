import './globals.css';
import './course.css';
import { SiteHeader } from '../components/SiteHeader';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '김정은 | Portfolio',
  description: '보안을 배우고, 만들며 성장하는 김정은의 포트폴리오',
};

export default function RootLayout({ children }) {
  return <html lang="ko"><body><a className="skip" href="#main">본문으로 이동</a><SiteHeader /><main id="main">{children}</main><footer><a href="/">jungeun<span>.</span></a><p>배우고 기록하며, 더 나은 내일을 만듭니다.</p><small>© {new Date().getFullYear()} 김정은</small></footer></body></html>;
}
