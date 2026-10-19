export const projectGroups = [
  { id: 'team', title: 'Team', subtitle: '함께 만들고 함께 배운 프로젝트', description: '아이디어를 나누고 협업하며 완성한 웹 프로젝트를 소개합니다.', color: 'mint', symbol: '↗' },
  { id: 'personal', title: 'Personal', subtitle: '직접 고민하고 만들어본 프로젝트', description: '배운 내용을 스스로 적용하며 완성한 개인 프로젝트를 소개합니다.', color: 'peach', symbol: '✦' },
];

// group: 'team'은 팀 프로젝트, 'personal'은 개인 프로젝트입니다.
// githubUrl에 각 프로젝트의 실제 GitHub 저장소 주소를 넣으면 카드와 상세 화면에 표시됩니다.
export const projects = [
  { id: 'security-final', number: '01', group: 'team', category: 'Web', title: '웹프로그래밍 팀플 · 1학기', description: '1학기에 제작한 웹 보안 프로젝트입니다. 중간과제에 카테고리 버튼과 방명록 등 JavaScript 기능을 더한 웹프로그래밍 기말과제입니다.', tags: ['1학기', 'HTML', 'CSS', 'JavaScript'], symbol: '{ }', color: 'blue', url: 'https://web-team-project-woad.vercel.app/', githubUrl: 'https://github.com/kimjungeunn/hcjfinalexamweb' },
  { id: 'web-midterm-demo', number: '02', group: 'team', category: 'Web', title: '웹프로그래밍 팀플 · 2학기', description: '2학기에 팀원들과 함께 진행한 웹프로그래밍 프로젝트입니다. 실제 사이트와 GitHub 저장소에서 결과물과 소스 코드를 확인할 수 있습니다.', tags: ['2학기', 'Web', 'Team Project'], symbol: '⌘', color: 'mint', url: 'https://web-programming-midterm-demo.vercel.app/', githubUrl: 'https://github.com/kimjungeunn/Web_Programming_Midterm_Demo' },
  { id: 'vending', number: '03', group: 'team', category: 'Java', title: '객체지향 자판기 시스템', description: '캡슐화와 접근 제어자를 활용해 재고를 관리하고 관리자 기능을 구현한 자판기 시스템입니다.', tags: ['Java', 'OOP'], symbol: '▦', color: 'lavender', githubUrl: '' },
  { id: 'portfolio', number: '04', group: 'personal', category: 'Web', title: '개인 포트폴리오', description: '', tags: [], symbol: '✦', color: 'peach', url: 'https://web-portpolio-2seccison.vercel.app/', githubUrl: 'https://github.com/kimjungeunn/Web_portpolio_2seccison' },
  { id: 'ilchwiwoljang', number: '05', group: 'personal', category: 'Personal', title: '일취월장 · 방학 개인 프로젝트', description: '방학 동안 진행한 개인 프로젝트입니다. GitHub 저장소에서 소스 코드를 확인할 수 있습니다.', tags: ['방학', 'Personal Project'], symbol: '↗', color: 'mint', githubUrl: 'https://github.com/kimjungeunn/Ilchwiwoljang_project_jungeun' },
];
