'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { createNotice, updateNotice, deleteNotice } from '@/lib/notices';
import { validateNotice } from '@/lib/validation.mjs';

async function currentUser() {
  const session = process.env.AUTH_SECRET ? await auth() : null;
  if (!session?.user?.id) redirect('/login');
  return session.user;
}
export async function createNoticeAction(formData: FormData) {
  const user = await currentUser();
  const input = validateNotice(Object.fromEntries(formData));
  if (!input) redirect('/notices/new?error=validation');
  let id: string;
  try { const notice = await createNotice({ ...input, author: user.name || '회원', authorId: user.id! }); id = notice.id; }
  catch { redirect('/notices/new?error=unavailable'); }
  revalidatePath('/notices');
  redirect(`/notices/${id}`);
}
export async function updateNoticeAction(id: string, formData: FormData) {
  const user = await currentUser();
  const input = validateNotice(Object.fromEntries(formData));
  if (!input) redirect(`/notices/${id}/edit?error=validation`);
  let updated;
  try { updated = await updateNotice(id, user.id!, input); }
  catch { redirect(`/notices/${id}/edit?error=unavailable`); }
  if (!updated) redirect('/notices?error=permission');
  revalidatePath('/notices'); revalidatePath(`/notices/${id}`);
  redirect(`/notices/${id}`);
}
export async function deleteNoticeAction(formData: FormData) {
  const user = await currentUser();
  const id = formData.get('id');
  if (typeof id !== 'string') redirect('/notices?error=permission');
  let deleted;
  try { deleted = await deleteNotice(id, user.id!); }
  catch { redirect(`/notices/${id}?error=delete`); }
  if (!deleted) redirect('/notices?error=permission');
  revalidatePath('/notices'); revalidatePath(`/notices/${id}`);
  redirect('/notices');
}
