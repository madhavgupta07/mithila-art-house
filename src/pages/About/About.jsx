import { Link } from 'react-router-dom';
import { FaArrowRight, FaEye, FaLeaf, FaPenNib } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import SectionHeading from '../../components/Common/SectionHeading';
import Reveal from '../../components/Common/Reveal';
import Button from '../../components/Common/Button';
import DecorativeRule from '../../components/Common/DecorativeRule';
import ArtImage from '../../components/Common/ArtImage';

const principles = [
  {
    icon: FaEye,
    title: 'Clear about what is a sample',
    text: 'Prices, stock, profiles, policies and payments are labelled as sample data. Nothing here is presented as a verified commercial offer.',
  },
  {
    icon: FaPenNib,
    title: 'Close to the visual language',
    text: 'Compositions use the paired motifs, fine outlines, flat colour and dense patterning associated with Mithila painting.',
  },
  {
    icon: FaLeaf,
    title: 'Context alongside beauty',
    text: 'Each artwork page explains the motif and where it appears in the tradition, instead of treating the image as mere decoration.',
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="Our Story"
        description="Learn why this Mithila art gallery is built as an honest sample storefront, with original illustrations and clearly labelled sample data."
        canonical="/about"
      />
      <PageHeader
        eyebrow="About the gallery"
        title="A gallery, honestly made."
        description="Mithila Art House is a sample storefront: a place to explore Mithila-inspired visual language through original illustrations, careful catalogue writing and a transparent shopping flow."
        breadcrumbs={[{ label: 'About' }]}
      />

      <Container className="py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="grid grid-cols-2 gap-4">
            <ArtImage
              src="/images/heritage/painting-bihar.webp"
              alt="Documentary photograph of a Madhubani painting from Bihar"
              className="aspect-[3/4] w-full border border-ink/10"
            />
            <div className="mt-10 space-y-4">
              <ArtImage
                src="/images/heritage/painting-detail.webp"
                alt="Documentary detail of Madhubani line work"
                className="aspect-square w-full border border-ink/10"
              />
              <ArtImage
                src="/images/heritage/craft-detail.webp"
                alt="Documentary photograph of Mithila craft detail"
                className="aspect-[3/4] w-full border border-ink/10"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="The starting point"
              title={<>The beauty is in the <em className="font-normal text-terracotta">lines</em>.</>}
              description="Mithila painting, also known as Madhubani art, comes from the Mithila region of Bihar. Its visual vocabulary — fish, lotus, peacocks, celestial discs, borders filled with pattern — has been carried through generations and into new contexts."
            />
            <Reveal delay={0.1} className="mt-8 space-y-5 text-[14px] leading-7 text-charcoal/75">
              <p>
                This gallery takes that vocabulary as a starting point. The catalogue artworks are original
                illustrations created for this project. They are inspired by the tradition, but they are not
                presented as antique, ritual, certified or hand-painted works by named artisans.
              </p>
              <p>
                That distinction matters. A beautiful storefront should not quietly borrow cultural meaning and
                then blur where an image came from. So we explain each motif, credit editorial photographs, and
                label every commercial detail as sample data.
              </p>
            </Reveal>
            <Reveal delay={0.16} className="mt-9">
              <Button to="/shop">Browse the collection</Button>
            </Reveal>
          </div>
        </div>
      </Container>

      <section className="border-y border-ink/10 bg-paper/50 py-20">
        <Container>
          <SectionHeading eyebrow="What guides this storefront" title="Three promises we can actually keep." align="center" />
          <div className="mt-14 grid gap-px bg-ink/10 md:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <Reveal key={principle.title} delay={index * 0.08} className="bg-paper/80 p-8">
                  <Icon aria-hidden="true" className="text-2xl text-terracotta" />
                  <h3 className="mt-6 font-display text-2xl text-ink">{principle.title}</h3>
                  <p className="mt-3 text-[13px] leading-6 text-charcoal/70">{principle.text}</p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <Container className="py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">How this catalogue was built</p>
            <h2 className="mt-5 font-display text-5xl leading-[1.05] text-ink">From motif to sample listing.</h2>
            <DecorativeRule className="mt-7" />
            <p className="mt-7 text-[14px] leading-7 text-charcoal/70">
              The process below describes this project, not a claim about how traditional paintings are made or how a real art business operates.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="divide-y divide-ink/10 border-y border-ink/10">
              {[
                ['01', 'Study the vocabulary', 'Look at the recurring motifs, colour relationships and border patterns in openly documented Mithila paintings.'],
                ['02', 'Draw an original composition', 'Build a distinct SVG illustration with ink-like outlines and layered colour — no claim of authenticity is made.'],
                ['03', 'Write honest context', 'Explain the symbolism and inspiration in catalogue copy, while keeping provenance and artist claims out of the storefront.'],
                ['04', 'Add a sample shopping flow', 'Present pricing, cart, wishlist and sample checkout so the storefront can be evaluated end to end.'],
              ].map(([number, title, text]) => (
                <li key={number} className="grid gap-4 py-7 sm:grid-cols-[60px_1fr]">
                  <span className="font-display text-3xl text-terracotta/50">{number}</span>
                  <div>
                    <h3 className="font-display text-2xl text-ink">{title}</h3>
                    <p className="mt-2 text-[13px] leading-6 text-charcoal/70">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>

      <section className="relative overflow-hidden bg-indigoDeep text-ivory">
        <div className="pointer-events-none absolute inset-0 paper-texture opacity-[0.06]" aria-hidden="true" />
        <Container className="relative grid items-center gap-10 py-20 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-luxe text-mustard">Keep exploring</p>
            <h2 className="mt-5 max-w-2xl font-display text-5xl leading-tight text-ivory">
              Art is easier to understand when its context comes with it.
            </h2>
            <p className="mt-5 max-w-xl text-[14px] leading-7 text-ivory/70">
              Read motif notes on each artwork, explore the placeholder artist profiles, or see which photographs were credited.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button to="/artists" variant="light">Artist profiles</Button>
            <Link
              to="/image-credits"
              className="inline-flex items-center gap-2 border-b border-mustard/60 pb-1 font-sans text-[11px] uppercase tracking-wide2 text-mustard hover:text-ivory"
            >
              Image credits <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
