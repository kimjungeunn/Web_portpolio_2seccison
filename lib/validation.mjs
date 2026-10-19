export const categories = ['학습 기록', '프로젝트 소식', '자유 이야기'];
const text = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
export function validateRegistration(data) {
  if (!data || !text(data.name, 1, 30) || !text(data.email, 3, 254) || typeof data.password !== 'string') return null;
  const email = data.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data.password.length < 8 || Buffer.byteLength(data.password, 'utf8') > 72) return null;
  return { name: data.name.trim(), email, password: data.password };
}
export function validateNotice(data) {
  if (!data || !text(data.title, 1, 120) || !text(data.content, 1, 10000) || !categories.includes(data.category)) return null;
  return { title: data.title.trim(), content: data.content.trim(), category: data.category };
}
export function validPassword(value) {
  return typeof value === 'string' && value.length >= 8 && Buffer.byteLength(value, 'utf8') <= 72;
}
