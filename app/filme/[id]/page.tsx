import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { getIsAdmin } from '@/lib/auth';
import VideoPlayer from '@/components/VideoPlayerr';
import TitleCard from '@/components/TitleCard';
import Link from 'next/link';

type Movie = {
  id: number;
  title_id: number;
  duration: string | null;
  storage: 'drive' | 'r2';
  file_id: string;
};

type Title = {
  id: number;
  name: string;
  description: string | null;
  cover_url: string | null;
  type: string;
  year: number | null;
  genres: string[] | null;
  admin_only: boolean | null;
};

type SimilarTitle = {
  id: number;
  name: string;
  type: string;
  cover_url: string | null;
  year: number | null;
  total_seasons: number | null;
  total_episodes: number | null;
};

export default async function FilmePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isAdmin = await getIsAdmin();

  const { data: movie } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single<Movie>();

  if (!movie) notFound();

  const { data: title } = await supabase
    .from('titles')
    .select('*')
    .eq('id', movie.title_id)
    .single<Title>();

    console.log('>>> title:', title, '| isAdmin:', isAdmin);

  if (!title) notFound();
  if (title.admin_only && !isAdmin) notFound();

  const { data: similar } = await supabase
    .from('titles')
    .select('*')
    .eq('type', 'movie')
    .neq('id', title.id)
    .limit(8);

  const typedSimilar = ((similar ?? []) as SimilarTitle[]).filter(
    (t: any) => isAdmin || !t.admin_only
  );

  const movieAsEpisode = {
    id: movie.id,
    name: title.name,
    season: 1,
    episode: 1,
    file_id: movie.file_id,
    storage: movie.storage,
  };

  return (
    <main className="filme-page">
      <div className="ambient-bg" aria-hidden="true">
        <div className="glow glow-1" />
        <div className="glow glow-2" />
      </div>

      <nav className="breadcrumb">
        <Link href={`/titulo/${title.id}`} className="back-link">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{title.name}</span>
        </Link>
        <span className="separator" aria-hidden="true">/</span>
        <span className="ep-label">{title.year ?? 'Filme'}</span>
      </nav>

      <div className="player-wrapper">
        <VideoPlayer episode={movieAsEpisode} nextEpisode={null} />
      </div>

      <section className="filme-info">
        <div className="info-left">
          <div className="badge-group">
            <span className="badge badge-type">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5" /></svg>
              Filme
            </span>
            {title.year && (
              <span className="badge badge-year">{title.year}</span>
            )}
          </div>
          <h1 className="filme-title">{title.name}</h1>
          {movie.duration && (
            <div className="duration">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {movie.duration}
            </div>
          )}
          {title.genres && title.genres.length > 0 && (
            <div className="genres">
              {title.genres.map(g => (
                <span key={g} className="genre-tag">{g}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {typedSimilar.length > 0 && (
        <section className="similar-section">
          <div className="similar-header">
            <div className="similar-line" aria-hidden="true" />
            <h2 className="similar-title">Filmes semelhantes</h2>
            <div className="similar-count">{typedSimilar.length} títulos</div>
          </div>
          <div className="similar-scroll">
            {typedSimilar.map((t, i) => (
              <div key={t.id} className="similar-card-wrapper" style={{ animationDelay: `${i * 60}ms` }}>
                <TitleCard title={t} />
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .filme-page { position:relative; min-height:100vh; background:#08080f; color:#e8e8f0; padding-bottom:80px; overflow-x:hidden; font-family:'DM Sans',system-ui,sans-serif; }
        .ambient-bg { position:fixed; inset:0; pointer-events:none; z-index:0; }
        .glow { position:absolute; border-radius:50%; filter:blur(120px); opacity:0.06; }
        .glow-1 { width:700px; height:700px; background:#7c3aed; top:-200px; left:-150px; animation:drift1 20s ease-in-out infinite alternate; }
        .glow-2 { width:500px; height:500px; background:#4f46e5; bottom:0; right:-100px; animation:drift2 18s ease-in-out infinite alternate; }
        @keyframes drift1 { to { transform:translate(60px,40px); } }
        @keyframes drift2 { to { transform:translate(-40px,-60px); } }
        .breadcrumb,.player-wrapper,.filme-info,.similar-section { position:relative; z-index:1; }
        .breadcrumb { display:flex; align-items:center; gap:10px; padding:84px 44px 20px; }
        .back-link { display:inline-flex; align-items:center; gap:6px; font-size:12.5px; font-weight:500; color:#6b6b85; text-decoration:none; letter-spacing:0.01em; transition:color 0.18s; }
        .back-link:hover { color:#a78bfa; }
        .back-link svg { transition:transform 0.18s; }
        .back-link:hover svg { transform:translateX(-2px); }
        .separator { color:#2e2e42; font-size:13px; }
        .ep-label { font-size:12.5px; color:#3d3d55; font-variant-numeric:tabular-nums; letter-spacing:0.04em; }
        .player-wrapper { padding:0 44px 28px; }
        .player-wrapper > * { border-radius:16px; overflow:hidden; box-shadow:0 0 0 1px rgba(255,255,255,0.05),0 32px 80px rgba(0,0,0,0.7),0 0 120px rgba(99,102,241,0.08); }
        .filme-info { margin:0 44px 36px; padding:24px 28px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:16px; backdrop-filter:blur(20px); }
        .info-left { flex:1; min-width:0; }
        .badge-group { display:flex; align-items:center; gap:8px; margin-bottom:14px; }
        .badge { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; padding:5px 12px; border-radius:6px; }
        .badge-type { color:#a78bfa; background:rgba(124,58,237,0.12); border:1px solid rgba(124,58,237,0.2); }
        .badge-type svg { opacity:0.7; }
        .badge-year { color:#6b6b85; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); }
        .filme-title { font-size:20px; font-weight:700; color:#f0f0f8; margin:0 0 10px; line-height:1.3; letter-spacing:-0.01em; }
        .duration { display:inline-flex; align-items:center; gap:5px; font-size:12.5px; color:#4a4a65; font-variant-numeric:tabular-nums; margin-bottom:12px; }
        .genres { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
        .genre-tag { font-size:11.5px; font-weight:500; color:#d1d1e0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); padding:4px 10px; border-radius:6px; }
        .similar-section { padding:0 44px; }
        .similar-header { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .similar-line { width:3px; height:20px; border-radius:3px; background:linear-gradient(to bottom,#7c3aed,#4f46e5); flex-shrink:0; }
        .similar-title { font-size:15px; font-weight:700; color:#e8e8f0; letter-spacing:-0.01em; margin:0; }
        .similar-count { font-size:11.5px; color:#3d3d55; font-weight:500; margin-left:auto; letter-spacing:0.02em; }
        .similar-scroll { display:flex; gap:14px; overflow-x:auto; padding-bottom:16px; scrollbar-width:none; -ms-overflow-style:none; scroll-snap-type:x mandatory; }
        .similar-scroll::-webkit-scrollbar { display:none; }
        .similar-card-wrapper { flex-shrink:0; width:160px; scroll-snap-align:start; opacity:0; transform:translateY(8px); animation:cardIn 0.4s ease forwards; }
        @keyframes cardIn { to { opacity:1; transform:translateY(0); } }
        @media (max-width:768px) {
          .breadcrumb { padding:72px 20px 16px; }
          .player-wrapper { padding:0 20px 20px; }
          .filme-info { margin:0 20px 28px; padding:20px; }
          .similar-section { padding:0 20px; }
        }
      `}</style>
    </main>
  );
}