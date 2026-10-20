'use server';
import { revalidatePath } from 'next/cache';
import { incrementNoticeViews } from '@/lib/notices';

export async function recordNoticeViewAction(id: string): Promise<{ views: number } | { error: string }> {
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/i.test(id)) return { error: '글을 찾을 수 없습니다.' };
  try {
    const views = await incrementNoticeViews(id);
    if (views === null) return { error: '글을 찾을 수 없습니다.' };
    if (!Number.isFinite(views)) return { error: '조회수를 기록하지 못했습니다.' };
    revalidatePath('/notices');
    return { views };
  } catch { return { error: '조회수를 기록하지 못했습니다.' }; }
}
