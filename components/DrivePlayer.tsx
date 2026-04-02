'use client'

type Props = {
  fileId: string
  storage: string
}

export default function DrivePlayer({ fileId, storage }: Props) {
  const src =
    storage === 'drive'
      ? `https://drive.google.com/file/d/${fileId}/preview`
      : fileId

  return (
    <div className="w-full aspect-video bg-black">
      <iframe
        src={src}
        className="w-full h-full"
        allow="autoplay"
        allowFullScreen
      />
    </div>
  )
}