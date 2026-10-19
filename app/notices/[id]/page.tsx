import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getNotice } from '@/lib/notices';
import { deleteNoticeAction } from '@/lib/actions';
import { SubmitButton } from '@/components/SubmitButton';
export default async function NoticeDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const notice = await getNotice(id);
  if (!notice) notFound();
  const session = process.env.AUTH_SECRET ? await auth() : null;
  const { error } = await searchParams;
  const owner = session?.user?.id === notice.authorId;
  return <article className="wrap page"><Link className="text-link" href="/notices">← 게시판으로</Link><div className="article-heading"><span className="notice-category">{notice.category}</span><h1 className="page-title">{notice.title}</h1><div className="notice-meta"><span>{notice.author}</span><time dateTime={notice.createdAt}>{new Date(notice.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</time></div></div>{error && <p role="alert" className="error">글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.</p>}<div className="article-content">{notice.content}</div>{owner && <div className="owner-actions"><Link href={`/notices/${id}/edit`} className="text-link">글 수정 →</Link><details><summary>글 삭제</summary><p className="text-sm">삭제한 글은 복구할 수 없습니다. 삭제할까요?</p><form action={deleteNoticeAction}><input type="hidden" name="id" value={id} /><SubmitButton label="삭제 확인" variant="destructive" /></form></details></div>}</article>;
}
