export default function NoticesLoading() {
  return <div className="wrap page" role="status" aria-label="게시판 불러오는 중"><div className="h-10 w-2/3 rounded-lg bg-[#e3eade] animate-pulse mb-10" />{[1, 2, 3].map(i => <div key={i} className="h-32 w-full rounded-xl bg-[#edf1e8] animate-pulse mb-5" />)}<span className="sr-only">게시판을 불러오고 있습니다.</span></div>;
}
