'use client';
import { useEffect, useRef, useState } from 'react';
import { recordNoticeViewAction } from '@/lib/notice-view-actions';

export function NoticeViews({ id, initialViews }: { id: string; initialViews: number }) {
  const [views, setViews] = useState(initialViews);
  const [failed, setFailed] = useState(false);
  const recordedId = useRef<string | null>(null);
  useEffect(() => {
    // 미리 불러온 서버 화면이 아닌 실제 상세 화면 마운트 시 기록합니다.
    // 개발 모드의 StrictMode Effect 재실행에서도 중복 요청하지 않습니다.
    if (recordedId.current === id) return;
    recordedId.current = id;
    setViews(initialViews);
    setFailed(false);
    recordNoticeViewAction(id).then(result => {
      if (recordedId.current !== id) return;
      if ('views' in result && Number.isFinite(result.views)) setViews(result.views);
      else setFailed(true);
    }).catch(() => { if (recordedId.current === id) setFailed(true); });
  }, [id, initialViews]);
  return <span aria-live="polite">{failed ? '조회수 집계 실패 · 새로고침해주세요' : `조회 ${views.toLocaleString('ko-KR')}`}</span>;
}
