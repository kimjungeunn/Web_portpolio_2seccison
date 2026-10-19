'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createNotice, updateNotice, deleteNotice } from '@/lib/notices';
import { validateBoardInput, validPassword } from '@/lib/validation.mjs';

export async function createNoticeAction(formData: FormData) {
  const input = validateBoardInput(Object.fromEntries(formData));
  if (!input) redirect('/notices/new?error=validation');
  let id: string;
  try { const notice = await createNotice(input); id = notice.id; }
  catch { redirect('/notices/new?error=unavailable'); }
  revalidatePath('/notices');
  redirect(`/notices/${id}`);
}
export async function updateNoticeAction(id: string, formData: FormData) {
  const input = validateBoardInput(Object.fromEntries(formData));
  if (!input) redirect(`/notices/${id}/edit?error=validation`);
  const { password, ...fields } = input;
  let updated;
  try { updated = await updateNotice(id, password, fields); }
  catch { redirect(`/notices/${id}/edit?error=unavailable`); }
  if (!updated) redirect(`/notices/${id}/edit?error=password`);
  revalidatePath('/notices'); revalidatePath(`/notices/${id}`);
  redirect(`/notices/${id}`);
}
export async function deleteNoticeAction(formData: FormData) {
  const id = formData.get('id');
  const password = formData.get('password');
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/i.test(id)) redirect('/notices');
  if (!validPassword(password)) redirect(`/notices/${id}?error=password`);
  let deleted;
  try { deleted = await deleteNotice(id, password as string); }
  catch { redirect(`/notices/${id}?error=delete`); }
  if (!deleted) redirect(`/notices/${id}?error=password`);
  revalidatePath('/notices'); revalidatePath(`/notices/${id}`);
  redirect('/notices');
}
