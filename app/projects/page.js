import Link from 'next/link';
import { projects, projectGroups } from '../../lib/content';
export const metadata = { title: 'Project | 김정은' };
export default function Projects() {
  return <div className="wrap page"><p className="eyebrow">MY PROJECTS</p><h1 className="page-title">직접 만들며 배운 것들<span>.</span></h1><p className="page-description">함께 만든 경험과 스스로 완성한 경험을 나누어 소개합니다.</p><div className="project-grid">{projectGroups.map(group => <Link className="project-group-card" key={group.id} href={`/projects/group/${group.id}`}><div className={`project-art ${group.color}`} aria-hidden="true"><span className="art-number">{group.title.toUpperCase()} PROJECTS</span><span className="art-symbol">{group.symbol}</span></div><div className="project-copy"><span className="group-count">{projects.filter(project => project.group === group.id).length} PROJECTS</span><h2>{group.title}</h2><h3>{group.subtitle}</h3><p>{group.description}</p><span className="text-link">{group.title} 프로젝트 보기 ↗</span></div></Link>)}</div></div>;
}
