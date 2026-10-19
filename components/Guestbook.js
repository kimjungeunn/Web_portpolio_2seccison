'use client';
import { useCallback, useEffect, useState } from 'react';

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [password, setPassword] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/guestbook', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessages(data.messages);
    } catch (e) { setError(e.message || '방명록을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/guestbook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessages(previous => [data.message, ...previous].slice(0, 100));
      form.reset(); setNotice('반가운 인사가 등록되었습니다. 감사합니다!');
    } catch (e) { setError(e.message || '등록하지 못했습니다. 다시 시도해주세요.'); }
    finally { setBusy(false); }
  }
  async function remove(event, id) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/guestbook', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessages(previous => previous.filter(message => message.id !== id));
      setDeleting(null); setPassword(''); setNotice('글이 삭제되었습니다.');
    } catch (e) { setError(e.message || '삭제하지 못했습니다.'); }
    finally { setBusy(false); }
  }
  return <div className="guestbook"><form className="guestbook-form" onSubmit={submit}><div className="form-row"><label>이름<input name="name" placeholder="어떻게 불러드릴까요?" required maxLength={30} autoComplete="nickname" /></label><label>삭제 비밀번호<input name="password" type="password" placeholder="6자 이상 입력해주세요" required minLength={6} maxLength={100} autoComplete="new-password" /></label></div><label>메시지<textarea name="text" placeholder="따뜻한 한마디를 남겨주세요." required maxLength={1000} rows={4} /></label><div className="form-bottom"><small>비밀번호는 글을 삭제할 때 사용합니다.</small><button className="button" disabled={busy || loading}>{busy ? '처리 중…' : '인사 남기기 ↗'}</button></div></form><div role="status" aria-live="polite">{notice && <p className="notice">{notice}</p>}</div>{error && <div role="alert" className="error"><p>{error}</p><button onClick={load} disabled={busy || loading}>다시 불러오기</button></div>}<div className="message-list" aria-busy={loading}>{loading ? <p className="empty">인사를 불러오고 있어요…</p> : !error && messages.length === 0 ? <p className="empty">아직 남겨진 인사가 없어요. 첫 인사를 남겨주세요!</p> : messages.map(message => <article className="message" key={message.id}><div className="message-top"><strong>{message.name}</strong><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</time><button disabled={busy} onClick={() => { setDeleting(message.id); setPassword(''); }}>삭제</button></div><p>{message.text}</p>{deleting === message.id && <form className="delete-form" onSubmit={event => remove(event, message.id)}><label className="sr-only" htmlFor={`pw-${message.id}`}>삭제 비밀번호</label><input id={`pw-${message.id}`} type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="삭제 비밀번호" required minLength={6} maxLength={100} autoFocus /><button disabled={busy} type="submit">삭제 확인</button><button disabled={busy} type="button" onClick={() => { setDeleting(null); setPassword(''); }}>취소</button></form>}</article>)}</div></div>;
}
