import { cn } from '../../lib/utils';

export default function DecorativeRule({ className, dark = false }) {
  return (
    <svg
      viewBox="0 0 240 16"
      fill="none"
      aria-hidden="true"
      className={cn('h-4 w-40', className)}
      preserveAspectRatio="none"
    >
      <path d="M0 8h86" stroke={dark ? '#E9DCC4' : '#B45C36'} strokeWidth="1" />
      <path d="M154 8h86" stroke={dark ? '#E9DCC4' : '#B45C36'} strokeWidth="1" />
      <path d="M120 2l12 6-12 6-12-6 12-6Z" fill={dark ? '#D6A32C' : '#C13A24'} />
      <circle cx="98" cy="8" r="2" fill={dark ? '#D6A32C' : '#25466C'} />
      <circle cx="142" cy="8" r="2" fill={dark ? '#D6A32C' : '#25466C'} />
    </svg>
  );
}
