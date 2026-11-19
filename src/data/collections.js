import { products } from './products';

const countFor = (slug) =>
  products.filter((p) => p.category === slug || p.categories.includes(slug)).length;

export const categories = [
  {
    slug: 'all-art',
    name: 'All Art',
    short: 'The complete collection',
    description: 'Every work in the sample catalogue, from traditional compositions to contemporary studies.',
    image: '/images/art/art-cosmic-lotus.svg',
  },
  {
    slug: 'traditional-madhubani',
    name: 'Traditional Madhubani',
    short: 'Rooted in the classic vocabulary',
    description: 'Paired birds, lotuses and narrative scenes drawn in the classic Mithila visual language.',
    image: '/images/art/art-peacock-dance.svg',
  },
  {
    slug: 'contemporary-mithila',
    name: 'Contemporary Mithila',
    short: 'Heritage, newly framed',
    description: 'Familiar motifs reworked with bolder space, graphic rhythm and modern palettes.',
    image: '/images/art/art-modern-abstract.svg',
  },
  {
    slug: 'nature-wildlife',
    name: 'Nature & Wildlife',
    short: 'Birds, trees and the monsoon',
    description: 'Peacocks, parrots, fish and flowering trees — the natural world of Mithila painting.',
    image: '/images/art/art-tree-of-life.svg',
  },
  {
    slug: 'religious-spiritual',
    name: 'Religious & Spiritual',
    short: 'Devotion in colour and line',
    description: 'Lotus, diya and divine storytelling compositions for quiet corners and sacred spaces.',
    image: '/images/art/art-temple-diya.svg',
  },
  {
    slug: 'wedding-auspicious',
    name: 'Wedding & Auspicious',
    short: 'For new beginnings',
    description: 'Kohbar-inspired forms, wedding scenes and motifs traditionally associated with good fortune.',
    image: '/images/art/art-kohbar-auspicious.svg',
  },
  {
    slug: 'home-decor',
    name: 'Home Decor',
    short: 'Made to live with',
    description: 'Balanced compositions chosen for entryways, living rooms, studios and gallery walls.',
    image: '/images/art/art-lotus-bloom.svg',
  },
  {
    slug: 'gifts',
    name: 'Gift Collections',
    short: 'Thoughtful, meaningful giving',
    description: 'Artworks that make personal gifts for housewarmings, weddings and festive occasions.',
    image: '/images/art/art-fish-harmony.svg',
  },
  {
    slug: 'custom',
    name: 'Custom Paintings',
    short: 'Made around your story',
    description: 'Share a theme, palette and size — explore a personal artwork request with us.',
    image: '/images/art/art-geometric-mandala.svg',
  },
].map((category) => ({
  ...category,
  count: category.slug === 'all-art' ? products.length : countFor(category.slug),
}));

export const themes = [
  { name: 'Peacock', slug: 'peacock', image: '/images/art/art-peacock-dance.svg', query: 'peacock' },
  { name: 'Lotus', slug: 'lotus', image: '/images/art/art-lotus-bloom.svg', query: 'lotus' },
  { name: 'Fish', slug: 'fish', image: '/images/art/art-fish-harmony.svg', query: 'fish' },
  { name: 'Mandala', slug: 'mandala', image: '/images/art/art-geometric-mandala.svg', query: 'mandala' },
  { name: 'Wedding', slug: 'wedding', image: '/images/art/art-wedding-mandap.svg', query: 'wedding' },
];

export const categoryBySlug = (slug) => categories.find((c) => c.slug === slug);
