'use client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { likeProjectAction } from '@/lib/project-actions';
export function LikeButton({ id, initialLikes }: { id: string; initialLikes: number | null }) {
  const [likes, setLikes] = useState(initialLikes);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  return <div><Button variant="outline" disabled={pending} onClick={() => startTransition(async () => {
    setError('');
    try { const result = await likeProjectAction(id); if ('error' in result) setError(result.error); else setLikes(result.likes); }
    catch { setError('응원을 저장하지 못했습니다. 연결 상태를 확인해주세요.'); }
  })}>{pending ? '저장 중…' : `♡ 응원하기${likes === null ? '' : ` · ${likes}`}`}</Button>{error && <p className="error" role="alert">{error}</p>}</div>;
}
