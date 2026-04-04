'use client'
type Props = { fileId: string; storage: string }

export default function DrivePlayer({ fileId, storage }: Props) {
  const src = storage === 'drive'
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : fileId

  return (
    <div style={{width:'100%',aspectRatio:'16/9',background:'#000',borderRadius:16,overflow:'hidden',border:'1px solid var(--player-border)',boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
      <iframe src={src} style={{width:'100%',height:'100%',border:'none',display:'block'}} allow="autoplay" allowFullScreen />
    </div>
  )
}