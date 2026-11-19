import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaInstagram } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { siteConfig } from '../../config/site';
import { categories } from '../../data/collections';
import Container from '../Common/Container';
import DecorativeRule from '../Common/DecorativeRule';
import Logo from './Logo';

const helpLinks = [
  { label: 'FAQ', to: '/faq' },
  { label: 'Shipping & Delivery', to: '/policies/shipping' },
  { label: 'Returns & Refunds', to: '/policies/returns' },
  { label: 'Privacy Policy', to: '/policies/privacy' },
  { label: 'Terms & Conditions', to: '/policies/terms' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const subscribe = (event) => {
    event.preventDefault();
    setEmail('');
    toast.success('Sample only — no email was sent or stored.');
  };

  return (
    <footer className="relative mt-24 bg-indigoDeep text-ivory">
      <div className="pointer-events-none absolute inset-0 bg-paper-grain opacity-[0.06]" aria-hidden="true" />
      <Container className="relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-ivory/90">
              A catalogue celebrating the line work, colour and stories of Mithila painting.
            </p>
            <p className="mt-4 max-w-sm text-[12px] leading-6 text-ivory/55">
              This is a sample storefront. Artwork visuals are original illustrations, artist
              profiles and policies are placeholders, and no live payment is taken.
            </p>
            {siteConfig.instagram && (
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-wide2 text-ivory/70 hover:text-mustard"
              >
                <FaInstagram aria-hidden="true" /> Instagram
              </a>
            )}
          </div>

          <div>
            <h2 className="font-sans text-[10px] uppercase tracking-luxe text-mustard">Explore</h2>
            <ul className="mt-6 space-y-3 text-[13px] text-ivory/70">
              {[
                { label: 'All Artwork', to: '/shop' },
                { label: 'Our Story', to: '/about' },
                { label: 'Artist Stories', to: '/artists' },
                { label: 'Custom Artwork', to: '/custom' },
                { label: 'Contact', to: '/contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-mustard">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-[10px] uppercase tracking-luxe text-mustard">Collections</h2>
            <ul className="mt-6 space-y-3 text-[13px] text-ivory/70">
              {categories.slice(1, 7).map((category) => (
                <li key={category.slug}>
                  <Link to={`/shop?category=${category.slug}`} className="transition-colors hover:text-mustard">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-[10px] uppercase tracking-luxe text-mustard">Stay close</h2>
            <p className="mt-6 text-[13px] leading-6 text-ivory/65">
              Occasional notes on new motifs, art stories and the studio. This sample form does not send email.
            </p>
            <form onSubmit={subscribe} className="mt-5 flex items-center border-b border-ivory/30 pb-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent py-2 text-[13px] text-ivory outline-none placeholder:text-ivory/40"
              />
              <button type="submit" aria-label="Subscribe" className="text-mustard hover:text-ivory">
                <FaArrowRight aria-hidden="true" />
              </button>
            </form>
            <ul className="mt-8 space-y-2 text-[12px] text-ivory/55">
              {helpLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-mustard">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/image-credits" className="hover:text-mustard">
                  Image Credits
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-mustard">
                  Admin (sample)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <DecorativeRule dark className="mt-14 w-full max-w-xs" />
        <div className="mt-8 flex flex-col justify-between gap-3 font-sans text-[10px] uppercase tracking-wide2 text-ivory/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Mithila Art House · Sample project</p>
          <p>Made with respect for the Mithila painting tradition</p>
        </div>
      </Container>
    </footer>
  );
}
