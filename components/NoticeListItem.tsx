import Link from 'next/link';
import type { Notice } from '@/lib/notices';
export function NoticeListItem({ notice }: { notice: Notice }) {
  return <li className="notice-row"><Link href={`/notices/${notice.id}`}><span className="notice-category">{notice.category}</span><h2>{notice.title}</h2><p>{notice.content.slice(0, 110)}{notice.content.length > 110 ? '…' : ''}</p><div className="notice-meta"><span>{notice.author}</span><time dateTime={notice.createdAt}>{new Date(notice.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</time><span>조회 {notice.views.toLocaleString('ko-KR')}</span><span className="row-arrow" aria-hidden="true">↗</span></div></Link></li>;
}
