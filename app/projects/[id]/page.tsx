import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/content';
import { connectDB } from '@/lib/db';
import { ProjectStat } from '@/models/ProjectStat';
import { LikeButton } from '@/components/LikeButton';
export const dynamic = 'force-dynamic';
export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find(item => item.id === id);
  if (!project) notFound();
  let likes: number | null = null;
  try { await connectDB(); const stat = await ProjectStat.findOne({ projectId: id }).lean(); likes = stat?.likes ?? 0; } catch { /* 소개는 DB 장애 중에도 열람 가능합니다. */ }
  return <div className="wrap page">
    <Link className="text-link" href={`/projects/group/${project.group}`}>← {project.group === 'team' ? 'Team' : 'Personal'} 프로젝트 목록</Link>
    <div className={`project-detail-art project-art ${project.color}`} aria-hidden="true"><span className="art-number">PROJECT / {project.number}</span><span className="art-symbol">{project.symbol}</span></div>
    <div className="tags large">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    <h1 className="page-title">{project.title}</h1><p className="detail-description">{project.description}</p>
    <div className="actions flex-wrap">
      {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="button">프로젝트 방문하기 ↗</a>}
      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="button project-github-link" aria-label={`${project.title} GitHub 저장소 (새 탭)`}>GitHub ↗</a>}
      <LikeButton id={id} initialLikes={likes} />
    </div>
    {likes === null && <p className="board-hint">지금은 응원 수를 불러올 수 없습니다. 프로젝트 소개는 계속 확인하실 수 있어요.</p>}
    <p className="board-hint">응원은 여러 번 남길 수 있습니다.</p>
  </div>;
}
