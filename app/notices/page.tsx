import Link from 'next/link';
import { getNotices } from '@/lib/notices';
import { NoticeListItem } from '@/components/NoticeListItem';
import { Button } from '@/components/ui/button';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Board | 김정은' };
export default async function NoticesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const notices = await getNotices();
  return <div className="wrap page"><div className="section-heading"><div><p className="eyebrow">LEARNING TOGETHER</p><h1 className="page-title">배움과 이야기를 기록해요<span>.</span></h1><p className="page-description mb-0">학습 기록, 프로젝트 소식, 함께 나누고 싶은 이야기.</p></div><Button asChild><Link href="/notices/new">새 글 작성 ↗</Link></Button></div>{error && <p role="alert" className="error">글이 없거나 수정·삭제할 권한이 없습니다.</p>}{notices.length ? <ul className="notice-list">{notices.map(notice => <NoticeListItem key={notice.id} notice={notice} />)}</ul> : <div className="empty board-empty"><h2>아직 기록이 없어요.</h2><p>첫 번째 배움의 이야기를 남겨보세요.</p><Link className="text-link" href="/notices/new">첫 글 작성하기 ↗</Link></div>}<p className="board-hint">최근 100개의 글을 표시합니다. 이름과 글 비밀번호로 자유롭게 작성할 수 있어요.</p></div>;
}
