import { Link } from 'react-router-dom';

export default function Logo({ compact = false, light = false, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mustard"
      aria-label="Mithila Art House — home"
    >
      <svg viewBox="0 0 56 56" className="h-10 w-10 shrink-0" aria-hidden="true">
        <rect x="1" y="1" width="54" height="54" fill="none" stroke={light ? '#FBF7EF' : '#162A45'} strokeWidth="1.5" />
        <path d="M28 7c4 6 4 10 0 15-4-5-4-9 0-15Z" fill="#D6A32C" stroke={light ? '#FBF7EF' : '#2B1E18'} strokeWidth="1" />
        <path d="M28 49c-5-8-5-12 0-18 5 6 5 10 0 18Z" fill="#C13A24" stroke={light ? '#FBF7EF' : '#2B1E18'} strokeWidth="1" />
        <path d="M9 28c8-4 13-4 19 0-6 4-11 4-19 0Zm38 0c-8-4-13-4-19 0 6 4 11 4 19 0Z" fill="#2E5B47" stroke={light ? '#FBF7EF' : '#2B1E18'} strokeWidth="1" />
        <circle cx="28" cy="28" r="4.4" fill="#FBF7EF" stroke={light ? '#162A45' : '#162A45'} strokeWidth="1.5" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display text-[24px] font-semibold tracking-[0.12em] ${light ? 'text-ivory' : 'text-ink'}`}>
            MITHILA
          </span>
          <span className={`mt-1 block font-sans text-[8px] uppercase tracking-luxe ${light ? 'text-mustard' : 'text-vermilion'}`}>
            Art House
          </span>
        </span>
      )}
    </Link>
  );
}
