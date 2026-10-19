import Link from 'next/link';
import { createNoticeAction } from '@/lib/actions';
import { NoticeForm } from '@/components/NoticeForm';
export default async function NewNoticePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <div className="wrap page"><Link href="/notices" className="text-link">← 게시판으로</Link><p className="eyebrow mt-8">NEW STORY</p><h1 className="page-title">새로운 이야기<span>.</span></h1><NoticeForm action={createNoticeAction} error={error} /></div>;
}
