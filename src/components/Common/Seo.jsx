import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../../config/site';

export default function Seo({
  title,
  description = 'Explore a curated gallery of Mithila and Madhubani inspired artworks, thoughtfully presented for modern spaces.',
  image = '/images/art/art-peacock-dance.svg',
  canonical,
  type = 'website',
  jsonLd,
}) {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`;
  const url = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteConfig.url}${image}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteConfig.url}${image}`} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
