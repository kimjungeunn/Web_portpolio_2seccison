import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectGroups } from '@/lib/content';
import ProjectCards from '@/components/ProjectCards';

type Props = { params: Promise<{ group: string }> };
export async function generateMetadata({ params }: Props) {
  const { group } = await params;
  const selected = projectGroups.find(item => item.id === group);
  return { title: `${selected?.title || 'Project'} | 김정은` };
}
export default async function ProjectGroupPage({ params }: Props) {
  const { group } = await params;
  const selected = projectGroups.find(item => item.id === group);
  if (!selected) notFound();
  return <div className="wrap page"><Link href="/projects" className="text-link">← 프로젝트 분류 선택</Link><p className="eyebrow mt-8">{selected.title.toUpperCase()} PROJECTS</p><h1 className="page-title">{selected.title}<span>.</span></h1><p className="page-description">{selected.description}</p><nav className="project-group-tabs" aria-label="프로젝트 분류">{projectGroups.map(item => <Link key={item.id} href={`/projects/group/${item.id}`} aria-current={item.id === group ? 'page' : undefined}>{item.title}</Link>)}</nav><ProjectCards group={group} /></div>;
}
