import type { Notice } from '@/lib/notices';
import { categories } from '@/lib/validation.mjs';
import { SubmitButton } from '@/components/SubmitButton';
export function NoticeForm({ action, notice, error }: { action: (formData: FormData) => Promise<void>; notice?: Notice; error?: string }) {
  const errors: Record<string,string> = {
    validation: '이름 1~30자, 제목 1~120자, 내용 1~10,000자와 비밀번호(8자 이상, UTF-8 72바이트 이하)를 확인해주세요.',
    password: '비밀번호가 일치하지 않거나 수정할 수 없는 글입니다.',
    unavailable: '글을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.',
  };
  return <form action={action} className="guestbook-form notice-form">
    {error && <p role="alert" className="error">{errors[error] || errors.unavailable}</p>}
    <label>이름<input name="author" required maxLength={30} defaultValue={notice?.author} placeholder="작성자 이름" autoComplete="nickname" /></label>
    <label>분류<select name="category" defaultValue={notice?.category || categories[0]}>{categories.map((category: string) => <option key={category}>{category}</option>)}</select></label>
    <label>제목<input name="title" required maxLength={120} defaultValue={notice?.title} placeholder="이야기의 제목을 입력해주세요" /></label>
    <label>내용<textarea name="content" required maxLength={10000} rows={12} defaultValue={notice?.content} placeholder="배운 내용이나 프로젝트 소식을 나눠주세요." /></label>
    <label>{notice ? '작성할 때 설정한 비밀번호' : '글 수정·삭제 비밀번호'}<input name="password" type="password" required minLength={8} maxLength={72} autoComplete={notice ? 'off' : 'new-password'} aria-describedby="notice-password-help" /></label>
    <p id="notice-password-help" className="text-xs">{notice ? '글을 작성할 때 설정한 비밀번호를 입력해주세요.' : '로그인 없이 작성할 수 있어요. 비밀번호는 8자 이상 입력하고 수정·삭제할 때 사용해주세요.'}</p>
    <SubmitButton label={notice ? '수정 내용 저장' : '글 등록하기'} />
  </form>;
}
