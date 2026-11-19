/**
 * Sample catalogue. Prices, dimensions and availability are placeholders.
 * All artwork visuals are original illustrations created for this storefront —
 * they are not claimed to be historically authentic or made by a named artisan.
 */

const art = (name) => `/images/art/${name}.svg`;
let productCount = 0;

function product(config) {
  const {
    slug,
    name,
    subtitle,
    price,
    originalPrice = null,
    category,
    categories = [category],
    artStyle,
    tags = [],
    artist = 'Mithila Studio (sample)',
    technique = 'Hand-drawn line work with layered natural-pigment colour',
    materials = 'Ink and pigment on acid-free paper',
    base = 'Natural handmade-paper finish',
    description,
    symbolism,
    inspiration,
    dimensions = [
      { label: '30 × 40 cm', modifier: 0 },
      { label: '45 × 60 cm', modifier: 4500 },
      { label: '60 × 80 cm', modifier: 9000 },
    ],
    framing = [
      { label: 'Unframed', modifier: 0 },
      { label: 'Rolled with protective border', modifier: 600 },
      { label: 'Framed — natural wood', modifier: 3200 },
    ],
    stock = 6,
    availability = 'in_stock',
    featured = false,
    bestseller = false,
    newArrival = false,
  } = config;

  return {
    id: `MAH-${String(++productCount).padStart(3, '0')}`,
    slug,
    name,
    subtitle,
    price,
    originalPrice,
    category,
    categories,
    artStyle,
    tags,
    artist,
    technique,
    materials,
    base,
    description,
    symbolism,
    inspiration,
    dimensions,
    framing,
    stock,
    availability,
    featured,
    bestseller,
    newArrival,
    images: [
      { src: art(slug), alt: `${name} — original Mithila-inspired illustration`, label: 'Full artwork' },
      { src: art(`${slug}-detail`), alt: `${name} — close view of line work`, label: 'Detail' },
      { src: art(`${slug}-framed`), alt: `${name} — shown with a sample frame`, label: 'Framed view' },
    ],
    care: 'Keep away from direct sunlight and moisture. Dust gently with a soft, dry cloth.',
  };
}

export const products = [
  product({
    slug: 'art-peacock-dance',
    name: 'Peacock Reverie',
    subtitle: 'A pair of peacocks in a lotus garden',
    price: 12400,
    originalPrice: 14900,
    category: 'nature-wildlife',
    categories: ['traditional-madhubani', 'nature-wildlife', 'home-decor'],
    artStyle: 'Traditional Madhubani',
    tags: ['peacock', 'lotus', 'birds', 'symmetry'],
    description:
      'Two peacocks face each other across a blooming lotus, their feather fans built from layered petals and fine ink lines. A celebratory composition that brings the rhythm of Mithila folk painting to a contemporary wall.',
    symbolism:
      'The peacock is a recurring motif in Mithila art, often associated with beauty, grace and the monsoon. Paired birds and lotuses are traditionally used in auspicious decorations, making this composition especially meaningful at entryways and in living spaces.',
    inspiration:
      'Drawn from the ornamental borders and paired-bird compositions seen in traditional Mithila wall painting, then simplified into a balanced modern layout.',
    featured: true,
    bestseller: true,
    stock: 5,
  }),
  product({
    slug: 'art-tree-of-life',
    name: 'Tree of Life',
    subtitle: 'A canopy of birds, blossoms and light',
    price: 15900,
    originalPrice: 18900,
    category: 'nature-wildlife',
    categories: ['traditional-madhubani', 'nature-wildlife', 'home-decor'],
    artStyle: 'Traditional Madhubani',
    tags: ['tree', 'birds', 'sun', 'moon', 'nature'],
    description:
      'A winding tree fills the frame with elliptical leaves, small birds and a canopy of patterned blooms. Sun and moon discs sit above, anchoring the composition in the cosmic imagery common to Mithila painting.',
    symbolism:
      'The tree of life speaks of growth, continuity and the connectedness of the natural world. Birds in the branches add a sense of arrival and everyday life.',
    inspiration:
      'Inspired by the way Mithila artists fill every available space with living detail — leaves, birds and celestial forms all sharing one surface.',
    featured: true,
    bestseller: true,
    stock: 4,
  }),
  product({
    slug: 'art-fish-harmony',
    name: 'Fish Harmony',
    subtitle: 'Two fish in a circular current',
    price: 8900,
    category: 'traditional-madhubani',
    categories: ['traditional-madhubani', 'auspicious', 'gifts'],
    artStyle: 'Traditional Madhubani',
    tags: ['fish', 'lotus', 'water', 'auspicious'],
    description:
      'Two patterned fish circle one another above a small lotus. Their scales are drawn as rows of fine arcs, a playful study in the line work that defines Madhubani painting.',
    symbolism:
      'Fish are among the most recognisable Mithila motifs and are associated with fertility, prosperity and good fortune. They are often painted at thresholds and in wedding spaces.',
    inspiration:
      'A study of fish motifs from Mithila household painting, reduced to two interlocking forms for a calm, contemporary composition.',
    newArrival: true,
    stock: 8,
  }),
  product({
    slug: 'art-lotus-bloom',
    name: 'Lotus Bloom',
    subtitle: 'A lotus rising through still water',
    price: 9800,
    category: 'religious-spiritual',
    categories: ['religious-spiritual', 'nature-wildlife', 'home-decor'],
    artStyle: 'Traditional Madhubani',
    tags: ['lotus', 'sun', 'water', 'spiritual'],
    description:
      'Layered rose and mustard petals open beneath a small sun disc, with rhythmic water lines below. The drawing keeps the spare elegance of a single bloom while retaining the dense detailing of folk painting.',
    symbolism:
      'The lotus is a symbol of purity and renewal across Indian artistic traditions. In Mithila art it appears in both domestic and ceremonial contexts.',
    inspiration:
      'A quiet study of pond life and the lotus forms that appear throughout Mithila visual culture.',
    bestseller: true,
    stock: 7,
  }),
  product({
    slug: 'art-wedding-mandap',
    name: 'Auspicious Union',
    subtitle: 'A ceremonial gathering under a decorated arch',
    price: 18400,
    originalPrice: 21000,
    category: 'wedding-auspicious',
    categories: ['wedding-auspicious', 'traditional-madhubani', 'gifts'],
    artStyle: 'Traditional Madhubani',
    tags: ['wedding', 'mandap', 'figures', 'celebration'],
    description:
      'A decorated ceremonial arch rises above a row of stylised figures in bright festival colours. Small petal motifs frame the scene like a painted invitation.',
    symbolism:
      'Wedding scenes are central to Mithila painting, especially the kohbar tradition, where rooms are painted to welcome a new couple. The work celebrates gathering, music and shared ritual.',
    inspiration:
      'Inspired by narrative wedding paintings in which figures, architecture and decorative pattern share equal importance.',
    featured: true,
    stock: 3,
  }),
  product({
    slug: 'art-sun-moon',
    name: 'Sun & Moon',
    subtitle: 'Celestial discs in conversation',
    price: 7600,
    category: 'contemporary-mithila',
    categories: ['contemporary-mithila', 'celestial', 'home-decor'],
    artStyle: 'Contemporary Mithila',
    tags: ['sun', 'moon', 'celestial', 'geometry'],
    description:
      'A glowing vermilion sun faces an indigo moon across a field of small hills. Bold shapes and measured line work give the piece a modern, graphic presence.',
    symbolism:
      'Sun and moon imagery appears widely in Mithila painting, marking time, seasons and the rhythms of daily life.',
    inspiration:
      'A contemporary reading of celestial motifs, keeping the colour language of traditional pigment painting but simplifying the composition.',
    newArrival: true,
    stock: 9,
  }),
  product({
    slug: 'art-geometric-mandala',
    name: 'Mandala of Lines',
    subtitle: 'A rhythmic study in diamonds and petals',
    price: 11200,
    category: 'contemporary-mithila',
    categories: ['contemporary-mithila', 'geometric', 'home-decor'],
    artStyle: 'Contemporary Mithila',
    tags: ['mandala', 'geometric', 'diamonds', 'pattern'],
    description:
      'Concentric rings of petals and diamonds build into a dense mandala. Each ring uses a different colour from the traditional Madhubani palette, held together by fine ink outlines.',
    symbolism:
      'Repetition and symmetry are core to Mithila visual language. The mandala form turns that repetition into a focused, meditative whole.',
    inspiration:
      'Developed from the border patterns of traditional paintings, enlarged to become the central subject.',
    featured: true,
    stock: 6,
  }),
  product({
    slug: 'art-radha-krishna',
    name: 'Radha Krishna',
    subtitle: 'A folk rendering of a timeless story',
    price: 16900,
    category: 'religious-spiritual',
    categories: ['religious-spiritual', 'traditional-madhubani', 'gifts'],
    artStyle: 'Traditional Madhubani',
    tags: ['radha', 'krishna', 'flute', 'divine'],
    description:
      'A blue figure with a flute stands beside a companion in rose, framed by a spray of petals. The flat forms and outlined details echo the storytelling style of Mithila painting.',
    symbolism:
      'Radha and Krishna are frequent subjects in Mithila art, representing devotion, companionship and the poetic imagination of the region.',
    inspiration:
      'Inspired by narrative paintings of Krishna and Radha held in museum and exhibition collections.',
    bestseller: true,
    stock: 4,
    availability: 'made_to_order',
  }),
  product({
    slug: 'art-elephant-procession',
    name: 'Elephant Procession',
    subtitle: 'A ceremonial elephant with a patterned blanket',
    price: 13800,
    category: 'nature-wildlife',
    categories: ['nature-wildlife', 'traditional-madhubani', 'home-decor'],
    artStyle: 'Traditional Madhubani',
    tags: ['elephant', 'procession', 'animals', 'festival'],
    description:
      'An elephant moves forward under a mustard-patterned blanket, with a small sun above and a row of lotus buds below. The large silhouette carries a surface of delicate, repeated marks.',
    symbolism:
      'Elephants appear in festival and courtly imagery across India. In a Mithila context they bring a sense of pageantry and good omen.',
    inspiration:
      'A study in balancing a bold animal form with the dense decorative detail typical of folk painting.',
    stock: 5,
  }),
  product({
    slug: 'art-kohbar-auspicious',
    name: 'Kohbar — The Auspicious Room',
    subtitle: 'A contemporary nod to wedding-room painting',
    price: 14900,
    category: 'wedding-auspicious',
    categories: ['wedding-auspicious', 'traditional-madhubani', 'gifts'],
    artStyle: 'Traditional Madhubani',
    tags: ['kohbar', 'wedding', 'fish', 'lotus', 'bamboo'],
    description:
      'A framed diagram of bamboo stalks, paired fish and a central lotus reimagines the painted kohbar room as a standalone artwork.',
    symbolism:
      'Kohbar paintings are made in the wedding chamber in the Mithila region. Fish, bamboo and lotus are recurring motifs connected to fertility, prosperity and new beginnings.',
    inspiration:
      'Based on the structure of traditional kohbar diagrams, simplified for a modern wall or a thoughtful wedding gift.',
    newArrival: true,
    stock: 6,
  }),
  product({
    slug: 'art-parrot-branch',
    name: 'Parrots in the Mango Grove',
    subtitle: 'Two parrots on a flowering branch',
    price: 9200,
    category: 'nature-wildlife',
    categories: ['nature-wildlife', 'home-decor', 'gifts'],
    artStyle: 'Contemporary Mithila',
    tags: ['parrot', 'birds', 'flowers', 'branch'],
    description:
      'A pair of green and indigo parrots perch on a sweeping branch, surrounded by leaves and small blooms. A light, lyrical piece with a strong diagonal composition.',
    symbolism:
      'Birds are among the most loved motifs in Mithila painting, often used to bring colour and movement to household walls.',
    inspiration:
      'Drawn from garden scenes and the stylised bird pairs found across regional folk art.',
    stock: 8,
  }),
  product({
    slug: 'art-temple-diya',
    name: 'Temple of Light',
    subtitle: 'A lamp-lit arch with two peacocks',
    price: 12700,
    category: 'religious-spiritual',
    categories: ['religious-spiritual', 'home-decor', 'gifts'],
    artStyle: 'Traditional Madhubani',
    tags: ['temple', 'diya', 'peacock', 'light'],
    description:
      'Nested arches lead to a glowing diya at the centre of the composition. Small lamps and peacocks complete the symmetrical, devotional scene.',
    symbolism:
      'The diya represents light and auspiciousness. Together with the temple arch and peacocks, it creates a composition suited to prayer corners and welcoming spaces.',
    inspiration:
      'Inspired by the way Mithila paintings layer arches, lamps and animals into a single devotional image.',
    stock: 5,
  }),
  product({
    slug: 'art-monsoon-peacock',
    name: 'Monsoon Dance',
    subtitle: 'A peacock in falling rain',
    price: 10500,
    category: 'contemporary-mithila',
    categories: ['contemporary-mithila', 'nature-wildlife', 'home-decor'],
    artStyle: 'Contemporary Mithila',
    tags: ['monsoon', 'peacock', 'rain', 'dance'],
    description:
      'Diagonal rain lines cross the panel while a peacock spreads its fan below. The composition uses movement and negative space for a lighter, more modern feel.',
    symbolism:
      'The peacock and the monsoon are closely linked in Indian imagination — the bird’s display is a familiar sign of the rains.',
    inspiration:
      'A contemporary interpretation of seasonal motifs, retaining the ink line work and earthy colour of the tradition.',
    newArrival: true,
    stock: 7,
  }),
  product({
    slug: 'art-cosmic-lotus',
    name: 'Cosmic Lotus',
    subtitle: 'A lotus at the centre of a painted universe',
    price: 15400,
    originalPrice: 17500,
    category: 'contemporary-mithila',
    categories: ['contemporary-mithila', 'geometric', 'spiritual', 'home-decor'],
    artStyle: 'Contemporary Mithila',
    tags: ['lotus', 'mandala', 'sun', 'cosmic'],
    description:
      'Four rings of petals and diamonds surround a small sun and lotus at the centre. It is the most intricate piece in the sample collection and rewards slow looking.',
    symbolism:
      'The lotus at the centre of a radiating field draws on both floral and celestial motifs in Mithila art.',
    inspiration:
      'An exercise in scale — taking the detail of a painted border and making it the whole composition.',
    featured: true,
    stock: 3,
  }),
  product({
    slug: 'art-village-life',
    name: 'Village Rhythms',
    subtitle: 'Homes, fields and a winding path',
    price: 11900,
    category: 'traditional-madhubani',
    categories: ['traditional-madhubani', 'storytelling', 'home-decor'],
    artStyle: 'Traditional Madhubani',
    tags: ['village', 'fields', 'story', 'sun'],
    description:
      'Two simple homes sit above a mustard field, with a path leading toward a bright sun. Small plants march along the bottom border like a row of painted seedlings.',
    symbolism:
      'Everyday life is a recurring subject in Mithila painting. Village scenes keep the tradition rooted in the place and routines that inspired it.',
    inspiration:
      'A narrative composition built from the everyday architecture and open fields of the Mithila landscape.',
    stock: 6,
  }),
  product({
    slug: 'art-modern-abstract',
    name: 'Line & Bloom',
    subtitle: 'A minimal lotus in a field of arcs',
    price: 6800,
    category: 'contemporary-mithila',
    categories: ['contemporary-mithila', 'abstract', 'gifts'],
    artStyle: 'Folk Fusion',
    tags: ['abstract', 'lotus', 'lines', 'minimal'],
    description:
      'Fine arcs rise behind a single coral lotus, creating an airy composition that works well in smaller spaces and layered gallery walls.',
    symbolism:
      'The lotus remains the anchor while the surrounding lines strip the motif back to its essential geometry.',
    inspiration:
      'Made for collectors who want a quiet, contemporary entry point into Mithila-inspired art.',
    newArrival: true,
    stock: 10,
    availability: 'made_to_order',
  }),
];

export const productBySlug = (slug) => products.find((p) => p.slug === slug);

export const getRelatedProducts = (product, limit = 4) =>
  products
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({
      product: p,
      score:
        p.categories.filter((c) => product.categories.includes(c)).length * 2 +
        (p.artStyle === product.artStyle ? 1 : 0) +
        (p.bestseller ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product: p }) => p);

export const productsByFlag = (flag) => products.filter((p) => p[flag]);
