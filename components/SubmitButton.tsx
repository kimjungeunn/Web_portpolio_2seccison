'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
export function SubmitButton({ label, variant = 'default' }: { label: string; variant?: 'default' | 'outline' | 'destructive' }) {
  const { pending } = useFormStatus();
  return <Button type="submit" variant={variant} disabled={pending}>{pending ? '처리 중…' : label}</Button>;
}
