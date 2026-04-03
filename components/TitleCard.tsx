"use client";
import { useState } from "react";
import Link from "next/link";
import type { Title } from "@/types/title";

export default function TitleCard({ title }: { title: Title }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/titulo/${title.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 150, // 🔥 controla o tamanho aqui
          flexShrink: 0,
        }}
      >
        <div
          style={{
            aspectRatio: "2/3",
            background: "#1a1a24",
            borderRadius: 12,
            overflow: "hidden",
            position: "relative",
            border: "1px solid #2a2a3a",
            transition: "all 0.25s ease",
            transform: hovered ? "translateY(-6px)" : "none",
            boxShadow: hovered ? "0 12px 40px rgba(99,102,241,0.18)" : "none",
          }}
        >
          {/* IMAGEM */}
          {title.cover_url && !imgError ? (
            <img
              src={title.cover_url}
              alt={title.name}
              onError={() => setImgError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: hovered ? 1 : 0.92,
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "all 0.4s ease",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                background:
                  "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))",
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(99,102,241,0.5)",
                textAlign: "center",
              }}
            >
              {title.name}
            </div>
          )}

          {/* OVERLAY */}
          {hovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top,#08080c,transparent)",
              }}
            />
          )}

          {/* BOTÃO PLAY */}
          {hovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* TAG */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: "3px 8px",
              borderRadius: 6,
              background: "rgba(8,8,12,0.8)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 10,
              color: "#a1a1b5",
            }}
          >
            {title.type === "series" ? "Série" : "Filme"}
          </div>
        </div>

        {/* TEXTO */}
        <div style={{ marginTop: 10 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "white",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title.name}
          </p>

          <p style={{ fontSize: 11, color: "#6b6b80", marginTop: 2 }}>
            {title.type === "series"
              ? `${title.total_seasons ?? 0} temporadas`
              : `${title.year ?? ""}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
