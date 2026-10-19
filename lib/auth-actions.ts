'use server';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { createUser } from '@/lib/users';
import { signIn, signOut } from '@/auth';
import { validateRegistration, validPassword } from '@/lib/validation.mjs';

export async function registerAction(formData: FormData) {
  if (!process.env.AUTH_SECRET || !process.env.MONGODB_URI) redirect('/register?error=setup');
  const valid = validateRegistration(Object.fromEntries(formData));
  if (!valid) redirect('/register?error=validation');
  try { await createUser(valid); }
  catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 11000) redirect('/register?error=duplicate');
    redirect('/register?error=unavailable');
  }
  try { await signIn('credentials', { email: valid.email, password: valid.password, redirectTo: '/' }); }
  catch (error) {
    if (error instanceof AuthError) redirect('/login?registered=1');
    throw error; // 로그인 성공 시 Next.js가 던지는 리다이렉트 신호는 삼키지 않습니다.
  }
}
export async function loginAction(formData: FormData) {
  if (!process.env.AUTH_SECRET || !process.env.MONGODB_URI) redirect('/login?error=setup');
  const email = formData.get('email');
  const password = formData.get('password');
  if (typeof email !== 'string' || email.length > 254 || !validPassword(password)) redirect('/login?error=1');
  try { await signIn('credentials', { email: email.trim().toLowerCase(), password, redirectTo: '/' }); }
  catch (error) {
    if (error instanceof AuthError) redirect(error.type === 'CredentialsSignin' ? '/login?error=1' : '/login?error=unavailable');
    throw error;
  }
}
export async function logoutAction() { await signOut({ redirectTo: '/' }); }
