import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import TitleCard from "@/components/TitleCard";
import SeasonSelect from "@/components/SeasonSelect";
import Link from "next/link";

type Title = {
  id: number;
  name: string;
  description: string | null;
  cover_url: string | null;
  type: string;
  total_seasons: number | null;
  total_episodes: number | null;
  year: number | null;
  genres: string[] | null;
};
type Episode = {
  id: number;
  season: number;
  episode: number;
  name: string;
  duration: string | null;
  thumbnail_url: string | null;
  file_id: string;
  storage: string;
  title_id: number;
};
type Movie = {
  id: number;
  title_id: number;
  duration: string | null;
  storage: string;
  file_id: string;
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

export default async function TitlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: title } = await supabase
    .from("titles")
    .select("*")
    .eq("id", id)
    .single<Title>();
  if (!title) notFound();

  const { data: episodes } = await supabase
    .from("episodes")
    .select("*")
    .eq("title_id", title.id)
    .order("season")
    .order("episode");

  const { data: movie } = await supabase
    .from("movies")
    .select("*")
    .eq("title_id", title.id)
    .maybeSingle<Movie>();

  const { data: similar } = await supabase
    .from("titles")
    .select("*")
    .eq("type", title.type)
    .neq("id", title.id)
    .limit(8);

  const typedEpisodes = (episodes ?? []) as Episode[];
  const typedSimilar = (similar ?? []) as SimilarTitle[];
  const seasons = [...new Set(typedEpisodes.map((e) => e.season))].sort(
    (a, b) => a - b,
  );
  const firstEpisode = typedEpisodes[0];

  const watchHref =
    title.type === "movie" && movie
      ? `/filme/${movie.id}`
      : firstEpisode
        ? `/episodio/${firstEpisode.id}`
        : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* Hero */}
      <div
        className="titulo-hero"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {title.cover_url && (
          <img
            src={title.cover_url}
            alt={title.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.38,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--hero-grad-side)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--hero-grad-bottom)",
          }}
        />

        <div
          className="titulo-hero-content"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.22)",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#6366f1",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#818cf8" }}>
              {title.type === "series"
                ? `Série - ${title.total_seasons} temporadas - ${title.total_episodes} episódios`
                : `Filme - ${title.year}`}
            </span>
          </div>

          <h1
            className="titulo-hero-title"
            style={{
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              marginBottom: 16,
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            {title.name}
          </h1>

          {title.description && (
            <p
              className="titulo-hero-desc"
              style={{
                fontSize: 15,
                color: "#ccc",
                lineHeight: 1.65,
                marginBottom: 20,
                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
              }}
            >
              {title.description}
            </p>
          )}

          {title.genres && title.genres.length > 0 && (
            <div
              className="titulo-genres"
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              {title.genres.map((g) => (
                <span
                  key={g}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#d1d1e0",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    padding: "5px 12px",
                    borderRadius: 8,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {watchHref && (
            <Link
              href={watchHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                padding: "12px 24px",
                borderRadius: 12,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
              }}
            >
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Assistir agora
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="titulo-content" style={{ paddingBottom: 64 }}>
        {title.type === "series" && typedEpisodes.length > 0 && (
          <SeasonSelect seasons={seasons} episodes={typedEpisodes} />
        )}

        {title.type === "movie" && typedSimilar.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 24,
                  borderRadius: 4,
                  background: "linear-gradient(to bottom,#6366f1,#8b5cf6)",
                  flexShrink: 0,
                }}
              />
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Títulos semelhantes
              </h2>
            </div>
            <div
              className="similar-scroll"
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                paddingBottom: 16,
              }}
            >
              {typedSimilar.map((t) => (
                <div
                  key={t.id}
                  className="similar-card"
                  style={{ flexShrink: 0 }}
                >
                  <TitleCard title={t} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .titulo-hero {
          height: 520px;
          padding: 80px 40px 48px;
        }
        .titulo-hero-content {
          max-width: 700px;
        }
        .titulo-hero-title {
          font-size: 42px;
        }
        .titulo-hero-desc {
          max-width: 600px;
        }
        .titulo-content {
          padding: 24px 40px;
        }
        .similar-card {
          width: 160px;
        }

        @media (max-width: 768px) {
          .titulo-hero {
            height: auto;
            min-height: 400px;
            padding: 80px 20px 32px;
          }
          .titulo-hero-content {
            max-width: none;
          }
          .titulo-hero-title {
            font-size: 28px !important;
          }
          .titulo-hero-desc {
            font-size: 14px !important;
            max-width: none;
          }
          .titulo-genres {
            gap: 6px !important;
          }
          .titulo-genres span {
            font-size: 11px !important;
            padding: 4px 10px !important;
          }
          .titulo-content {
            padding: 24px 16px;
          }
          .similar-card {
            width: 130px !important;
          }
        }

        @media (max-width: 480px) {
          .titulo-hero {
            min-height: 350px;
            padding: 70px 16px 24px;
          }
          .titulo-hero-title {
            font-size: 24px !important;
          }
          .similar-card {
            width: 110px !important;
          }
        }
      `}</style>
    </main>
  );
}