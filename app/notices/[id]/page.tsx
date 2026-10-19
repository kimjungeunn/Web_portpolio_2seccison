import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNotice } from '@/lib/notices';
import { deleteNoticeAction } from '@/lib/actions';
import { SubmitButton } from '@/components/SubmitButton';
export default async function NoticeDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const notice = await getNotice(id);
  if (!notice) notFound();
  const { error } = await searchParams;
  return <article className="wrap page">
    <Link className="text-link" href="/notices">← 게시판으로</Link>
    <div className="article-heading"><span className="notice-category">{notice.category}</span><h1 className="page-title">{notice.title}</h1><div className="notice-meta"><span>{notice.author}</span><time dateTime={notice.createdAt}>{new Date(notice.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</time></div></div>
    {error && <p role="alert" className="error">{error === 'password' ? '비밀번호가 일치하지 않거나 삭제할 수 없는 글입니다.' : '글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.'}</p>}
    <div className="article-content">{notice.content}</div>
    {notice.hasPassword ? <div className="owner-actions"><Link href={`/notices/${id}/edit`} className="text-link">글 수정 →</Link><details><summary>글 삭제</summary><p className="text-sm">작성할 때 설정한 비밀번호를 입력해주세요. 삭제한 글은 복구할 수 없습니다.</p><form action={deleteNoticeAction}><input type="hidden" name="id" value={id} /><label>글 비밀번호<input name="password" type="password" required minLength={8} maxLength={72} autoComplete="off" /></label><SubmitButton label="삭제 확인" variant="destructive" /></form></details></div> : <p className="board-hint">이전에 작성된 글입니다. 읽기 전용으로 보관됩니다.</p>}
  </article>;
}
