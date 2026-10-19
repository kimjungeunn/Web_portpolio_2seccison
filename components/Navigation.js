'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  return <header className="header"><nav className="nav wrap" aria-label="주 메뉴"><Link className="logo" href="/">jungeun<span>.</span></Link><div className="nav-links">{[['/', 'Home'], ['/about', 'About Me'], ['/projects', 'Project'], ['/notices', 'Board']].map(([href, title]) => <Link key={href} href={href} aria-current={(href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined}>{title}</Link>)}</div></nav></header>;
}
