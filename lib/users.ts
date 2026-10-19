import { hash } from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { validateRegistration } from '@/lib/validation.mjs';

export async function createUser(input: { name: string; email: string; password: string }) {
  const valid = validateRegistration(input);
  if (!valid) throw new Error('INVALID_REGISTRATION');
  await connectDB();
  // unique 인덱스는 동시 가입 요청도 DB 수준에서 막습니다.
  await User.init();
  const passwordHash = await hash(valid.password, 10);
  const user = await User.create({ name: valid.name, email: valid.email, passwordHash });
  return { id: String(user._id), name: user.name, email: user.email };
}
