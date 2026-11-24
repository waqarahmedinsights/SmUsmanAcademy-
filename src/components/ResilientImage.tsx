import { useState } from 'react';
import { Landmark } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'SMU Consultants Campus',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-6 text-center ${className}`}
      >
        <Landmark className="w-10 h-10 text-amber-400 mb-3" strokeWidth={1.5} />
        <p className="font-display text-sm font-semibold tracking-tight text-slate-100">
          {fallbackTitle}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
