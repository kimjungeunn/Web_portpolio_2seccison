'use server';
import { revalidatePath } from 'next/cache';
import { projects } from '@/lib/content';
import { connectDB } from '@/lib/db';
import { ProjectStat } from '@/models/ProjectStat';
export async function likeProjectAction(id: string): Promise<{ likes: number } | { error: string }> {
  if (typeof id !== 'string' || !projects.some(project => project.id === id)) return { error: '프로젝트를 찾을 수 없습니다.' };
  try {
    await connectDB();
    await ProjectStat.init();
    const result = await ProjectStat.findOneAndUpdate({ projectId: id }, { $inc: { likes: 1 } }, { upsert: true, new: true, runValidators: true }).lean();
    revalidatePath(`/projects/${id}`);
    return { likes: result.likes };
  } catch { return { error: '응원을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.' }; }
}
