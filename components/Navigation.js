'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '../lib/auth-actions';
import { SubmitButton } from './SubmitButton';

/** @param {{ userName?: string | null }} props */
export default function Navigation({ userName = null }) {
  const pathname = usePathname();
  return <header className="header"><nav className="nav wrap" aria-label="주 메뉴"><Link className="logo" href="/">jungeun<span>.</span></Link><div className="nav-links">{[['/', 'Home'], ['/about', 'About Me'], ['/projects', 'Project'], ['/notices', 'Board']].map(([href, title]) => <Link key={href} href={href} aria-current={(href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined}>{title}</Link>)}</div><div className="auth-nav">{userName ? <><span>{userName}님</span><form action={logoutAction}><SubmitButton label="로그아웃" variant="outline" /></form></> : <Link className="nav-login" href="/login">로그인 ↗</Link>}</div></nav></header>;
}
