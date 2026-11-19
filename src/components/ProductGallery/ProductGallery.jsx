import { useRef, useState } from 'react';
import { FaExpand } from 'react-icons/fa6';
import { cn } from '../../lib/utils';
import ArtImage from '../Common/ArtImage';
import Modal from '../Common/Modal';

export default function ProductGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const frameRef = useRef(null);
  const [origin, setOrigin] = useState('50% 50%');

  if (!images.length) return null;

  const onMove = (event) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div>
      <div
        ref={frameRef}
        className="group relative overflow-hidden border border-ink/10 bg-paper"
        onMouseMove={onMove}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <ArtImage
          src={images[active].src}
          alt={images[active].alt}
          className="aspect-[4/5] w-full"
          eager
          imgClassName={cn(
            'transition-transform duration-500 ease-out',
            zoom && 'scale-[1.85] cursor-zoom-in',
          )}
          style={{ transformOrigin: origin }}
        />
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-ivory/95 text-ink transition-colors hover:bg-indigoDeep hover:text-ivory"
          aria-label="Open full-size image"
        >
          <FaExpand aria-hidden="true" />
        </button>
        <span className="absolute left-4 top-4 bg-ivory/90 px-3 py-1.5 font-sans text-[9px] uppercase tracking-wide2 text-charcoal/70">
          {images[active].label} · hover to zoom
        </span>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label={`${name} image views`}>
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-label={`Show ${image.label}`}
            onClick={() => setActive(index)}
            className={cn(
              'shrink-0 border-2 p-0.5 transition-colors',
              active === index ? 'border-vermilion' : 'border-transparent hover:border-ink/20',
            )}
          >
            <ArtImage src={image.src} alt="" className="h-20 w-16 sm:h-24 sm:w-20" />
          </button>
        ))}
      </div>

      <Modal open={lightbox} onClose={() => setLightbox(false)} title={`${name} — full view`} size="lg">
        <div className="p-3">
          <ArtImage src={images[active].src} alt={images[active].alt} className="aspect-[4/5] w-full" eager />
        </div>
      </Modal>
    </div>
  );
}
