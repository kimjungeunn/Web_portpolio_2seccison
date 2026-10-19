'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
export default function NoticesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <div className="wrap page"><p className="eyebrow">PLEASE TRY AGAIN</p><h1 className="page-title">기록을 불러오지 못했어요.</h1><p>일시적인 저장소 연결 문제일 수 있습니다. 잠시 후 다시 시도해주세요.</p><Button disabled={pending} onClick={() => startTransition(() => { router.refresh(); reset(); })}>{pending ? '다시 연결 중…' : '다시 시도'}</Button></div>;
}
