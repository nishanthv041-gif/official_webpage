import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-200 p-6 text-center ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'SRT School Campus Illustration'}
      >
        <GraduationCap className="w-10 h-10 text-amber-400 mb-2 shrink-0" />
        <span className="text-xs font-medium tracking-wide text-slate-300 max-w-xs">
          {fallbackTitle || alt || 'SRT School Campus'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'SRT School'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
