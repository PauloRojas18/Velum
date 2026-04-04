'use client';

import { useRouter } from 'next/navigation';

type Episode = {
  id: number;
  name: string;
  season: number;
  episode: number;
  file_id: string;
  storage: 'drive' | 'r2';
};

type Props = {
  episode: Episode;
  nextEpisode?: Episode | null;
};

export default function VideoPlayer({ episode, nextEpisode }: Props) {
  const isR2 = episode.storage === 'r2';
  const videoUrl = isR2 ? episode.file_id : '';

  // Google Drive (iframe)
  if (!isR2) {
    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 16, overflow: 'hidden' }}>
        <iframe
          src={`https://drive.google.com/file/d/${episode.file_id}/preview`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="autoplay"
          allowFullScreen
          title={episode.name}
        />
      </div>
    );
  }

  // R2 (vídeo nativo)
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 16, overflow: 'hidden' }}>
      <video
        src={videoUrl}
        controls
        autoPlay
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
