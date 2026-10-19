import Link from 'next/link';
export default function NotFound() {
  return <div className="wrap page"><p className="eyebrow">404 · NOT FOUND</p><h1 className="page-title">찾으시는 페이지가 없어요.</h1><p>주소가 올바른지 확인하거나 다른 이야기를 둘러보세요.</p><Link className="button" href="/">홈으로 돌아가기 →</Link></div>;
}
