import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export function validateMessage(data) {
  if (!data || typeof data !== 'object') return null;
  const { name, text, password } = data;
  if (typeof name !== 'string' || typeof text !== 'string' || typeof password !== 'string') return null;
  if (!name.trim() || name.trim().length > 30 || !text.trim() || text.trim().length > 1000 || password.length < 6 || password.length > 100) return null;
  return { name: name.trim(), text: text.trim(), password };
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPassword(password, stored) {
  if (typeof password !== 'string' || password.length < 6 || password.length > 100 || typeof stored !== 'string') return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash || !/^[a-f0-9]{128}$/.test(hash)) return false;
  return timingSafeEqual(Buffer.from(hash, 'hex'), scryptSync(password, salt, 64));
}
