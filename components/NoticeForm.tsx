import type { Notice } from '@/lib/notices';
import { categories } from '@/lib/validation.mjs';
import { SubmitButton } from '@/components/SubmitButton';
export function NoticeForm({ action, notice, error }: { action: (formData: FormData) => Promise<void>; notice?: Notice; error?: string }) {
  return <form action={action} className="guestbook-form notice-form">{error && <p role="alert" className="error">{error === 'validation' ? '제목 1~120자, 내용 1~10,000자와 분류를 확인해주세요.' : '글을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.'}</p>}<label>분류<select name="category" defaultValue={notice?.category || categories[0]}>{categories.map((category: string) => <option key={category}>{category}</option>)}</select></label><label>제목<input name="title" required maxLength={120} defaultValue={notice?.title} placeholder="이야기의 제목을 입력해주세요" /></label><label>내용<textarea name="content" required maxLength={10000} rows={12} defaultValue={notice?.content} placeholder="배운 내용이나 프로젝트 소식을 나눠주세요." /></label><p className="text-xs">작성자는 로그인한 계정의 이름으로 표시됩니다.</p><SubmitButton label={notice ? '수정 내용 저장' : '글 등록하기'} /></form>;
}
