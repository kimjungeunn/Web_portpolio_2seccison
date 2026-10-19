import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getNotice } from '@/lib/notices';
import { updateNoticeAction } from '@/lib/actions';
import { NoticeForm } from '@/components/NoticeForm';
export default async function EditNotice({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const session = process.env.AUTH_SECRET ? await auth() : null;
  if (!session?.user?.id) redirect('/login');
  const { id } = await params;
  const notice = await getNotice(id);
  if (!notice) notFound();
  if (notice.authorId !== session.user.id) redirect('/notices?error=permission');
  const { error } = await searchParams;
  return <div className="wrap page"><Link href={`/notices/${id}`} className="text-link">← 글로 돌아가기</Link><p className="eyebrow mt-8">EDIT STORY</p><h1 className="page-title">이야기 다듬기<span>.</span></h1><NoticeForm action={updateNoticeAction.bind(null, id)} notice={notice} error={error} /></div>;
}
