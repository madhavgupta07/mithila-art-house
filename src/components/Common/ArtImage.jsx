import { useState } from 'react';
import { cn } from '../../lib/utils';

/** Image wrapper with explicit dimensions, lazy loading by default and a safe fallback. */
export default function ArtImage({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
  width = 800,
  height = 1000,
  sizes,
  ...props
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-paper', className)} {...props}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center p-6 text-center font-display text-xl text-indigo/50">
          Artwork image unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : undefined}
          onError={() => setFailed(true)}
          className={cn('h-full w-full object-cover', imgClassName)}
        />
      )}
    </div>
  );
}
