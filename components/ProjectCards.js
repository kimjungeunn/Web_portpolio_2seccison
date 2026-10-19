import { projects, projectGroups } from '../lib/content';
import Link from 'next/link';

export default function ProjectCards({ preview = false, group = '' }) {
  const visible = preview ? projects.slice(0, 2) : projects.filter(p => !group || p.group === group);
  return <>
    <div className="project-grid">{visible.map(project => <article className="project-card" key={project.id}>
      <div className={`project-art ${project.color}`} aria-hidden="true"><span className="art-number">PROJECT / {project.number}</span><span className="art-symbol">{project.symbol}</span><span className="art-caption">{projectGroups.find(item => item.id === project.group)?.title} · LEARN & BUILD</span></div>
      <div className="project-copy"><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><h3><Link href={`/projects/${project.id}`}>{project.title}</Link></h3><p>{project.description}</p><div className="project-card-links"><Link className="text-link" href={`/projects/${project.id}`}>상세 내용과 응원 보기 ↗</Link>{project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">사이트 방문 ↗</a>}{project.githubUrl && <a className="text-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} GitHub 저장소 (새 탭)`}>GitHub ↗</a>}</div></div>
    </article>)}</div>
    {visible.length === 0 && <p className="empty">아직 등록된 프로젝트가 없어요.</p>}
  </>;
}
