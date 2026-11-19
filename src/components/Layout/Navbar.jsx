import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaHeart, FaMagnifyingGlass, FaBagShopping, FaBars, FaChevronDown, FaXmark } from 'react-icons/fa6';
import { categories } from '../../data/collections';
import { selectCartCount, useCartStore, useUiStore, useWishlistStore } from '../../context/store';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../lib/utils';
import Container from '../Common/Container';
import Logo from './Logo';

const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop', mega: true },
  { label: 'Artists', to: '/artists' },
  { label: 'Custom Art', to: '/custom' },
  { label: 'Our Story', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const cartCount = useCartStore(selectCartCount);
  const wishlistCount = useWishlistStore((state) => state.ids.length);
  const { openCart, mobileNavOpen, toggleMobileNav, closeMobileNav } = useUiStore();

  useLockBodyScroll(mobileNavOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-ivory/95 backdrop-blur-md transition-shadow duration-300',
        scrolled ? 'border-ink/10 shadow-[0_10px_30px_-24px_rgba(32,27,23,0.5)]' : 'border-transparent',
      )}
    >
      <Container>
        <div className="flex h-[74px] items-center justify-between gap-6 lg:h-[86px]">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {primaryLinks.map((link) => (
              <div key={link.label} className="group relative h-full">
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex h-[86px] items-center gap-1 font-sans text-[11px] font-medium uppercase tracking-wide2 transition-colors hover:text-vermilion',
                      isActive ? 'text-vermilion' : 'text-ink/80',
                    )
                  }
                >
                  {link.label}
                  {link.mega && <FaChevronDown aria-hidden="true" className="text-[8px]" />}
                </NavLink>
                {link.mega && (
                  <div className="invisible absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 border border-ink/10 bg-ivory p-7 opacity-0 shadow-soft transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          to={category.slug === 'custom' ? '/custom' : `/shop?category=${category.slug}`}
                          className="group/item flex flex-col gap-1 py-1"
                        >
                          <span className="font-display text-[19px] text-ink transition-colors group-hover/item:text-vermilion">
                            {category.name}
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/50">
                            {category.short}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
                      <p className="font-display text-lg italic text-charcoal/70">
                        Every line carries a story.
                      </p>
                      <Link
                        to="/shop"
                        className="font-sans text-[10px] uppercase tracking-wide2 text-vermilion underline underline-offset-4"
                      >
                        View all artwork
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4 sm:gap-5">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="text-ink transition-colors hover:text-vermilion"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <FaXmark size={17} /> : <FaMagnifyingGlass size={17} />}
            </button>
            <Link
              to="/wishlist"
              className="relative text-ink transition-colors hover:text-vermilion"
              aria-label={`Wishlist, ${wishlistCount} saved artworks`}
            >
              <FaHeart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-vermilion px-1 font-sans text-[9px] text-ivory">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative text-ink transition-colors hover:text-vermilion"
              aria-label={`Open cart, ${cartCount} items`}
            >
              <FaBagShopping size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigoDeep px-1 font-sans text-[9px] text-ivory">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={toggleMobileNav}
              className="text-ink transition-colors hover:text-vermilion lg:hidden"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="absolute inset-x-0 top-full border-b border-ink/10 bg-ivory p-5 shadow-soft">
            <div className="mx-auto flex max-w-3xl items-center gap-4">
              <FaMagnifyingGlass aria-hidden="true" className="text-charcoal/50" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by artwork, motif or style…"
                aria-label="Search artworks"
                className="w-full border-b border-ink/20 bg-transparent py-2 font-display text-xl text-ink outline-none placeholder:text-charcoal/40 focus:border-vermilion"
              />
              <button type="submit" className="font-sans text-[10px] uppercase tracking-wide2 text-vermilion">
                Search
              </button>
            </div>
          </form>
        )}
      </Container>

      {/* Mobile navigation */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 top-[74px] z-40 overflow-y-auto border-t border-ink/10 bg-ivory px-6 pb-10 pt-6 transition-transform duration-300 lg:hidden',
          mobileNavOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full',
        )}
        aria-hidden={!mobileNavOpen}
      >
        <nav aria-label="Mobile" className="flex flex-col divide-y divide-ink/10">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={closeMobileNav}
              className={({ isActive }) =>
                cn(
                  'py-4 font-display text-2xl',
                  isActive ? 'text-vermilion' : 'text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-8 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/50">Shop by category</p>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              to={category.slug === 'custom' ? '/custom' : `/shop?category=${category.slug}`}
              onClick={closeMobileNav}
              className="py-2 text-sm text-charcoal/80"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
