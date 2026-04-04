import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayerr';
import EpisodeCard from '@/components/EpisodeCard';
import Link from 'next/link';

type Episode = {
  id: number;
  season: number;
  episode: number;
  name: string;
  duration: string | null;
  thumbnail_url: string | null;
  file_id: string;
  storage: 'drive' | 'r2';
  title_id: number;
  titles: { id: number; name: string } | null;
};

export default async function EpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: episode } = await supabase
    .from('episodes')
    .select('*, titles(*)')
    .eq('id', id)
    .single<Episode>();

  if (!episode) notFound();

  const { data: nextEpisode } = await supabase
    .from('episodes')
    .select('id, season, episode, name, file_id, storage')
    .eq('title_id', episode.title_id)
    .eq('season', episode.season)
    .eq('episode', episode.episode + 1)
    .maybeSingle();

  let finalNextEpisode = nextEpisode;
  if (!nextEpisode) {
    const { data: firstNextSeason } = await supabase
      .from('episodes')
      .select('id, season, episode, name, file_id, storage')
      .eq('title_id', episode.title_id)
      .gt('season', episode.season)
      .order('season', { ascending: true })
      .order('episode', { ascending: true })
      .limit(1)
      .maybeSingle();
    finalNextEpisode = firstNextSeason;
  }

  const { data: nextEpisodesList } = await supabase
    .from('episodes')
    .select('id, season, episode, name, duration, thumbnail_url')
    .eq('title_id', episode.title_id)
    .gt('episode', episode.episode)
    .eq('season', episode.season)
    .order('episode')
    .limit(8);

  return (
    <main className="episode-page">
      {/* Ambient glow de fundo */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="glow glow-1" />
        <div className="glow glow-2" />
      </div>

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href={`/titulo/${episode.title_id}`} className="back-link">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{episode.titles?.name ?? 'Voltar'}</span>
        </Link>
        <span className="separator" aria-hidden="true">/</span>
        <span className="ep-label">T{episode.season} · E{episode.episode}</span>
      </nav>

      {/* Player */}
      <div className="player-wrapper">
        <VideoPlayer episode={episode} nextEpisode={finalNextEpisode} />
      </div>

      {/* Info do episódio */}
      <section className="episode-info">
        <div className="info-left">
          <div className="badge-group">
            <span className="badge badge-season">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <circle cx="5" cy="5" r="5" />
              </svg>
              Temporada {episode.season}
            </span>
            <span className="badge badge-ep">Episódio {episode.episode}</span>
          </div>
          <h1 className="episode-title">{episode.name}</h1>
          {episode.duration && (
            <div className="duration">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {episode.duration}
            </div>
          )}
        </div>

        {finalNextEpisode && (
          <Link href={`/episodio/${finalNextEpisode.id}`} className="next-cta">
            <span className="next-label">A seguir</span>
            <span className="next-name">
              {finalNextEpisode.name}
            </span>
            <div className="next-arrow">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        )}
      </section>

      {/* Lista "A seguir" */}
      {nextEpisodesList && nextEpisodesList.length > 0 && (
        <section className="queue-section">
          <div className="queue-header">
            <div className="queue-line" aria-hidden="true" />
            <h2 className="queue-title">A seguir</h2>
            <div className="queue-count">{nextEpisodesList.length} episódios</div>
          </div>
          <div className="queue-scroll">
            {nextEpisodesList.map((ep, i) => (
              <div
                key={ep.id}
                className="queue-card-wrapper"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <EpisodeCard episode={ep} />
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        /* ─── Reset & Base ─────────────────────────────── */
        .episode-page {
          position: relative;
          min-height: 100vh;
          background: #08080f;
          color: #e8e8f0;
          padding-bottom: 80px;
          overflow-x: hidden;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ─── Ambient Background ───────────────────────── */
        .ambient-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.06;
        }
        .glow-1 {
          width: 700px;
          height: 700px;
          background: #7c3aed;
          top: -200px;
          left: -150px;
          animation: drift1 20s ease-in-out infinite alternate;
        }
        .glow-2 {
          width: 500px;
          height: 500px;
          background: #4f46e5;
          bottom: 0;
          right: -100px;
          animation: drift2 18s ease-in-out infinite alternate;
        }
        @keyframes drift1 {
          to { transform: translate(60px, 40px); }
        }
        @keyframes drift2 {
          to { transform: translate(-40px, -60px); }
        }

        /* ─── Content z-index ──────────────────────────── */
        .breadcrumb,
        .player-wrapper,
        .episode-info,
        .queue-section {
          position: relative;
          z-index: 1;
        }

        /* ─── Breadcrumb ───────────────────────────────── */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 84px 44px 20px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 500;
          color: #6b6b85;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: color 0.18s;
        }
        .back-link:hover {
          color: #a78bfa;
        }
        .back-link svg {
          transition: transform 0.18s;
        }
        .back-link:hover svg {
          transform: translateX(-2px);
        }
        .separator {
          color: #2e2e42;
          font-size: 13px;
        }
        .ep-label {
          font-size: 12.5px;
          color: #3d3d55;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.04em;
        }

        /* ─── Player ───────────────────────────────────── */
        .player-wrapper {
          padding: 0 44px 28px;
        }
        .player-wrapper > * {
          border-radius: 16px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05),
            0 32px 80px rgba(0,0,0,0.7),
            0 0 120px rgba(99,102,241,0.08);
        }

        /* ─── Episode Info ─────────────────────────────── */
        .episode-info {
          margin: 0 44px 36px;
          padding: 24px 28px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          backdrop-filter: blur(20px);
        }
        .info-left {
          flex: 1;
          min-width: 0;
        }
        .badge-group {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 6px;
        }
        .badge-season {
          color: #a78bfa;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.2);
        }
        .badge-season svg {
          opacity: 0.7;
        }
        .badge-ep {
          color: #6b6b85;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .episode-title {
          font-size: 20px;
          font-weight: 700;
          color: #f0f0f8;
          margin: 0 0 10px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .duration {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          color: #4a4a65;
          font-variant-numeric: tabular-nums;
        }

        /* ─── Next Episode CTA ─────────────────────────── */
        .next-cta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          padding: 14px 18px;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.18);
          border-radius: 12px;
          text-decoration: none;
          flex-shrink: 0;
          max-width: 220px;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, border-color 0.2s, transform 0.18s;
        }
        .next-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(124,58,237,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .next-cta:hover {
          background: rgba(124,58,237,0.14);
          border-color: rgba(124,58,237,0.35);
          transform: translateY(-1px);
        }
        .next-cta:hover::before {
          opacity: 1;
        }
        .next-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7c3aed;
        }
        .next-name {
          font-size: 13px;
          font-weight: 500;
          color: #c4c4d8;
          text-align: right;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .next-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(124,58,237,0.2);
          color: #a78bfa;
          margin-top: 6px;
          align-self: flex-end;
          transition: background 0.18s;
        }
        .next-cta:hover .next-arrow {
          background: rgba(124,58,237,0.35);
        }

        /* ─── Queue Section ────────────────────────────── */
        .queue-section {
          padding: 0 44px;
        }
        .queue-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .queue-line {
          width: 3px;
          height: 20px;
          border-radius: 3px;
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
          flex-shrink: 0;
        }
        .queue-title {
          font-size: 15px;
          font-weight: 700;
          color: #e8e8f0;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .queue-count {
          font-size: 11.5px;
          color: #3d3d55;
          font-weight: 500;
          margin-left: auto;
          letter-spacing: 0.02em;
        }
        .queue-scroll {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-bottom: 16px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-snap-type: x mandatory;
        }
        .queue-scroll::-webkit-scrollbar {
          display: none;
        }
        .queue-card-wrapper {
          flex-shrink: 0;
          scroll-snap-align: start;
          opacity: 0;
          transform: translateY(8px);
          animation: cardIn 0.4s ease forwards;
        }
        @keyframes cardIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ─── Responsive ───────────────────────────────── */
        @media (max-width: 768px) {
          .breadcrumb {
            padding: 72px 20px 16px;
          }
          .player-wrapper {
            padding: 0 20px 20px;
          }
          .episode-info {
            margin: 0 20px 28px;
            padding: 20px;
            flex-direction: column;
          }
          .next-cta {
            max-width: 100%;
            width: 100%;
            flex-direction: row;
            align-items: center;
          }
          .next-name {
            text-align: left;
            flex: 1;
          }
          .queue-section {
            padding: 0 20px;
          }
        }
      `}</style>
    </main>
  );
}