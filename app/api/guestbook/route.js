import { Types } from 'mongoose';
import { getDatabase } from '../../../lib/mongodb';
import { hashPassword, validateMessage, verifyPassword } from '../../../lib/guestbook.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const unavailable = () => reply({ error: '방명록 저장소에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' }, 503);

export async function GET() {
  try {
    const db = await getDatabase();
    const messages = await db.collection('guestbook').find({}, { projection: { name: 1, text: 1, createdAt: 1 } }).sort({ _id: -1 }).limit(100).toArray();
    return reply({ messages: messages.map(({ _id, ...message }) => ({ ...message, id: _id.toString() })) });
  } catch { return unavailable(); }
}

async function readBody(request) {
  // JSON 입력을 제한하고 잘못된 요청에 DB 작업을 수행하지 않습니다.
  const body = await request.text();
  if (Buffer.byteLength(body, 'utf8') > 8192) throw new Error('INVALID_BODY');
  return JSON.parse(body);
}

export async function POST(request) {
  let message;
  try { message = validateMessage(await readBody(request)); } catch { /* 아래에서 400 응답 */ }
  if (!message) return reply({ error: '이름 1~30자, 내용 1~1,000자, 삭제 비밀번호 6~100자를 입력해주세요.' }, 400);
  try {
    const db = await getDatabase();
    const document = { name: message.name, text: message.text, passwordHash: hashPassword(message.password), createdAt: new Date() };
    const { insertedId } = await db.collection('guestbook').insertOne(document);
    return reply({ message: { id: insertedId.toString(), name: document.name, text: document.text, createdAt: document.createdAt } }, 201);
  } catch { return unavailable(); }
}

export async function DELETE(request) {
  let data;
  try { data = await readBody(request); } catch { return reply({ error: '잘못된 요청입니다.' }, 400); }
  if (!data || typeof data.id !== 'string' || !/^[a-f0-9]{24}$/i.test(data.id) || typeof data.password !== 'string' || data.password.length < 6 || data.password.length > 100) return reply({ error: '글과 삭제 비밀번호를 확인해주세요.' }, 400);
  try {
    const db = await getDatabase();
    const collection = db.collection('guestbook');
    const _id = new Types.ObjectId(data.id);
    const message = await collection.findOne({ _id });
    if (!message) return reply({ error: '이미 삭제되었거나 없는 글입니다.' }, 404);
    if (!verifyPassword(data.password, message.passwordHash)) return reply({ error: '비밀번호가 일치하지 않습니다.' }, 403);
    await collection.deleteOne({ _id });
    return reply({ success: true });
  } catch { return unavailable(); }
}
