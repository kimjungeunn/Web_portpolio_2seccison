export const metadata = { title: 'Team | 김정은' };
const team = [
  { name: '김정은', initials: 'JE', github: 'https://github.com/kimjungeunn', blog: 'https://kje0408blog.tistory.com/', color: 'mint' },
  { name: '박민지', initials: 'MJ', github: 'https://github.com/pmj2744', blog: 'https://blog.naver.com/pmj2744', color: 'peach' },
  { name: '박시현', initials: 'SH', github: 'https://github.com/parksshh14', blog: 'https://velog.io/@parksshh14/posts', color: 'lavender' },
];
export default function Team() {
  return <div className="wrap page"><p className="eyebrow">OUR TEAM</p><h1 className="page-title">함께 배우고, 함께 성장합니다<span>.</span></h1><p className="page-description">기존 웹 프로젝트를 함께한 팀원들을 소개합니다.</p><div className="team-grid">{team.map(person => <article className="team-card" key={person.name}><div className={`team-avatar ${person.color}`}>{person.initials}</div><span className="eyebrow">TEAM MEMBER</span><h2>{person.name}</h2><p>정보보호학과</p><div className="profile-links"><a href={person.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={person.blog} target="_blank" rel="noopener noreferrer">Blog ↗</a></div></article>)}</div></div>;
}
