import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaArrowRight, FaArrowUpRightFromSquare, FaLeaf, FaPaintbrush, FaHandshake, FaGlobe } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/pagination';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import SectionHeading from '../../components/Common/SectionHeading';
import Reveal from '../../components/Common/Reveal';
import Button from '../../components/Common/Button';
import DecorativeRule from '../../components/Common/DecorativeRule';
import ArtImage from '../../components/Common/ArtImage';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProducts } from '../../context/ProductsContext';
import { themes } from '../../data/collections';

const promises = [
  { icon: FaPaintbrush, title: 'Original artwork visuals', text: 'Each composition in this sample catalogue is an original Mithila-inspired illustration.' },
  { icon: FaLeaf, title: 'Cultural context, not clichés', text: 'Motifs are explained with care, so the stories behind the forms stay visible.' },
  { icon: FaHandshake, title: 'Transparent sample data', text: 'Prices, profiles and policies are labelled as samples — nothing is passed off as verified.' },
  { icon: FaGlobe, title: 'Ready for a wider audience', text: 'INR by default, with a structure that can grow into other currencies and markets.' },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const { products, productsByFlag } = useProducts();

  const subscribe = (event) => {
    event.preventDefault();
    setEmail('');
    toast.success('Sample only — no email was sent or stored.');
  };

  return (
    <>
      <Seo
        canonical="/"
        description="A curated gallery of original Mithila and Madhubani inspired illustrations, presented with the stories behind the motifs. Sample e-commerce catalogue."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: 'Mithila Art House',
          description: 'Sample online gallery for Mithila and Madhubani inspired artwork.',
          url: 'https://mithila-art.example',
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory">
        <div className="pointer-events-none absolute inset-0 paper-texture opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-paper/70 blur-3xl" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-20">
          <Reveal className="max-w-xl">
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">
              Madhubani · Mithila region · Bihar
            </p>
            <h1 className="mt-6 font-display text-[52px] font-medium leading-[0.98] text-ink sm:text-[70px] lg:text-[84px]">
              Where every line
              <span className="block italic text-terracotta">tells a story.</span>
            </h1>
            <DecorativeRule className="mt-7" />
            <p className="mt-6 max-w-md text-[15px] leading-8 text-charcoal/75">
              An online gallery of Mithila-inspired artwork — peacocks, lotuses, fish and celestial
              forms drawn with the patience and precision the tradition asks for.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button to="/shop" size="lg">
                Explore the collection <FaArrowRight aria-hidden="true" size={13} />
              </Button>
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] uppercase tracking-wide2 text-ink transition-colors hover:border-vermilion hover:text-vermilion"
              >
                The story behind the art
                <FaArrowUpRightFromSquare aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-ink/10 pt-6 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55">
              <span>16 original compositions</span>
              <span>Curated by theme</span>
              <span>Sample storefront</span>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative mx-auto w-full max-w-[620px]">
            <div className="absolute -left-4 top-8 hidden h-full w-full border border-mustard/70 sm:block" aria-hidden="true" />
            <div className="relative border-mithila bg-paper p-2">
              <ArtImage
                src={products[0].images[0].src}
                alt="Peacock Reverie — an original Mithila-inspired illustration"
                className="aspect-[4/5] w-full"
                eager
              />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden bg-ivory px-6 py-5 shadow-soft sm:block">
              <p className="font-sans text-[9px] uppercase tracking-luxe text-vermilion">Featured work</p>
              <p className="mt-2 font-display text-2xl text-ink">Peacock Reverie</p>
              <Link to={`/product/${products[0].slug}`} className="mt-2 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60 hover:text-vermilion">
                View artwork <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Promise strip */}
      <section className="border-y border-ink/10 bg-paper/50">
        <Container className="grid gap-6 py-7 sm:grid-cols-3">
          {[
            'Original Mithila-inspired illustrations',
            'Prices in INR · sample catalogue',
            'No live payment taken',
          ].map((item, index) => (
            <Reveal key={item} delay={index * 0.08} className="flex items-center justify-center gap-3 text-center">
              <span className="h-1.5 w-1.5 rotate-45 bg-vermilion" aria-hidden="true" />
              <p className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/70">{item}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Intro */}
      <section className="py-20 lg:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="relative">
            <div className="absolute -bottom-5 -left-5 hidden h-32 w-32 border border-terracotta/50 sm:block" aria-hidden="true" />
            <ArtImage
              src="/images/heritage/painting-bihar.webp"
              alt="Documentary photograph of Madhubani paintings"
              className="aspect-[4/5] w-full border border-ink/10"
            />
            <p className="mt-3 font-sans text-[9px] uppercase tracking-wide2 text-charcoal/45">
              Documentary photograph · Wikimedia Commons · credited in Image Credits
            </p>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="A living tradition"
              title={<>Not just decoration. A visual language.</>}
              description="Mithila painting comes from the Mithila region of Bihar. Its vocabulary of fish, lotus, birds, sun and moon, and intricate borders, has been passed between generations and adapted into new contexts."
            />
            <Reveal delay={0.1} className="mt-8 space-y-5 text-[14px] leading-7 text-charcoal/75">
              <p>
                Our gallery takes that vocabulary as its starting point. Each sample composition is
                drawn with fine ink outlines, layered colour and the dense patterning that makes the
                tradition instantly recognisable.
              </p>
              <p>
                We present the cultural context alongside the art, so a peacock is never just a
                peacock — it is part of a way of seeing, making and marking important moments.
              </p>
            </Reveal>
            <Reveal delay={0.16} className="mt-9">
              <Button to="/about" variant="outline">
                Read our story
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Featured collections */}
      <section className="bg-paper/50 py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Curated collections"
            title="Find the motif that speaks to you."
            description="Browse by tradition, subject or the feeling you want to bring into a room."
            action={
              <Link to="/shop" className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-wide2 text-vermilion hover:text-ink">
                All collections <FaArrowRight aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            {[
              { slug: 'traditional-madhubani', name: 'Traditional Madhubani', note: 'Classic motifs, drawn with intent', image: '/images/art/art-tree-of-life.svg', className: 'lg:col-span-5' },
              { slug: 'contemporary-mithila', name: 'Contemporary Mithila', note: 'Familiar forms, a modern frame', image: '/images/art/art-cosmic-lotus.svg', className: 'lg:col-span-4' },
              { slug: 'gifts', name: 'Gift Collections', note: 'Meaningful giving, beautifully packed in story', image: '/images/art/art-fish-harmony.svg', className: 'lg:col-span-3' },
            ].map((collection, index) => (
              <Reveal key={collection.slug} delay={index * 0.09} className={collection.className}>
                <Link to={`/shop?category=${collection.slug}`} className="group block">
                  <div className="relative overflow-hidden border border-ink/10">
                    <ArtImage
                      src={collection.image}
                      alt={collection.name}
                      className={index === 0 ? 'aspect-[4/5]' : index === 1 ? 'aspect-square' : 'aspect-[3/4]'}
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-6 pt-16 text-ivory">
                      <h3 className="font-display text-3xl leading-tight">{collection.name}</h3>
                      <p className="mt-1 text-[12px] text-ivory/75">{collection.note}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Bestsellers carousel */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Collector's favourites"
            title="Works people return to."
            description="A starting point for the sample catalogue — layered line work and compositions that reward a second look."
          />
          <div className="mt-12">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1.15}
              breakpoints={{
                640: { slidesPerView: 2.1 },
                1024: { slidesPerView: 3.2 },
                1280: { slidesPerView: 4 },
              }}
              autoplay={{ delay: 5200, disableOnInteraction: true }}
              pagination={{ clickable: true }}
              className="gallery-swiper pb-12"
            >
              {productsByFlag('bestseller').map((product) => (
                <SwiperSlide key={product.id} className="h-auto">
                  <ProductCard product={product} className="h-full" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Container>
      </section>

      {/* Heritage band */}
      <section className="relative overflow-hidden bg-indigoDeep text-ivory">
        <div className="pointer-events-none absolute inset-0 paper-texture opacity-[0.07]" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
          <Reveal>
            <p className="font-sans text-[10px] uppercase tracking-luxe text-mustard">The story of Mithila</p>
            <h2 className="mt-6 font-display text-5xl leading-[1.03] sm:text-6xl">
              Painted on walls. <span className="italic text-mustard">Carried forward.</span>
            </h2>
            <DecorativeRule dark className="mt-8" />
            <div className="mt-8 space-y-5 text-[14px] leading-7 text-ivory/70">
              <p>
                Madhubani painting is traditionally made in the Mithila region, with roots in
                household and ceremonial practice. Walls and floors became surfaces for images of
                gods, birds, fish, plants and scenes from daily life.
              </p>
              <p>
                The paintings use line, pattern and flat colour in ways that feel both ancient and
                strikingly modern. Our sample artworks draw from that visual language while being
                clear about their contemporary origins.
              </p>
            </div>
            <Link to="/about" className="mt-9 inline-flex items-center gap-2 border-b border-mustard/60 pb-1 font-sans text-[11px] uppercase tracking-wide2 text-mustard hover:text-ivory">
              Learn more about the tradition <FaArrowRight aria-hidden="true" />
            </Link>
          </Reveal>
          <Reveal delay={0.12} className="grid grid-cols-2 gap-4">
            <ArtImage src="/images/heritage/painting-detail.webp" alt="Detail of a Madhubani painting" className="aspect-[3/4] w-full border border-ivory/20" />
            <div className="mt-10 space-y-4">
              <ArtImage src="/images/heritage/craft-detail.webp" alt="Mithila art craft detail" className="aspect-[3/4] w-full border border-ivory/20" />
              <ArtImage src="/images/heritage/wedding-motifs.webp" alt="Auspicious motifs in Mithila painting" className="aspect-[4/3] w-full border border-ivory/20" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* New arrivals */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Just added"
            title="New to the gallery."
            description="Recent compositions that bring a lighter, more graphic touch to familiar motifs."
            action={<Link to="/shop?sort=newest" className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-wide2 text-vermilion hover:text-ink">See all new arrivals <FaArrowRight aria-hidden="true" /></Link>}
          />
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.filter((p) => p.newArrival).slice(0, 4).map((product, index) => (
              <Reveal key={product.id} delay={index * 0.07}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Shop by theme */}
      <section className="bg-paper/50 py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Shop by motif" title="The symbols, up close." align="center" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
            {themes.map((theme, index) => (
              <Reveal key={theme.slug} delay={index * 0.06}>
                <Link
                  to={`/search?q=${encodeURIComponent(theme.query)}`}
                  className={`group relative block overflow-hidden border border-ink/10 ${index === 0 ? 'md:col-span-2' : ''}`}
                >
                  <ArtImage
                    src={theme.image}
                    alt={theme.name}
                    className={index === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'}
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 font-display text-2xl text-ivory">{theme.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Artisan teaser */}
      <section className="py-20 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">The people behind the work</p>
            <h2 className="mt-5 font-display text-5xl leading-[1.05] text-ink">Every artwork has a hand behind it.</h2>
            <p className="mt-6 max-w-lg text-[14px] leading-7 text-charcoal/75">
              This page is reserved for real artist stories — where they work, the motifs they return
              to and how they learned the craft. Until those profiles are confirmed, we share
              illustrative placeholders rather than inventing biographies.
            </p>
            <div className="mt-8">
              <Button to="/artists" variant="outline">Meet the profiles</Button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 grid grid-cols-2 gap-4 lg:order-2">
            <ArtImage src="/images/art/portrait-placeholder-1.svg" alt="Illustrative artist portrait placeholder" className="aspect-[3/4] w-full" />
            <ArtImage src="/images/art/portrait-placeholder-2.svg" alt="Illustrative artist portrait placeholder" className="mt-10 aspect-[3/4] w-full" />
          </Reveal>
        </Container>
      </section>

      {/* Why choose us */}
      <section className="border-y border-ink/10 bg-ivory py-20">
        <Container>
          <SectionHeading eyebrow="Why this gallery" title="Thoughtful from first look to final wall." align="center" />
          <div className="mt-14 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((promise, index) => {
              const Icon = promise.icon;
              return (
                <Reveal key={promise.title} delay={index * 0.06} className="bg-ivory p-8">
                  <span className="font-display text-3xl text-terracotta/50">0{index + 1}</span>
                  <Icon aria-hidden="true" className="mt-6 text-2xl text-indigoDeep" />
                  <h3 className="mt-5 font-display text-2xl text-ink">{promise.title}</h3>
                  <p className="mt-3 text-[13px] leading-6 text-charcoal/70">{promise.text}</p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Custom artwork */}
      <section className="relative overflow-hidden bg-terracotta/10 py-20 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">Made for your story</p>
            <h2 className="mt-5 max-w-xl font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
              A painting built around <span className="italic text-terracotta">your idea.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[14px] leading-7 text-charcoal/75">
              Share a theme, a palette and a size. Our custom artwork page collects a sample inquiry
              so you can see how a personal commission brief would work.
            </p>
            <div className="mt-8">
              <Button to="/custom" variant="accent" size="lg">Start a custom inquiry <FaArrowRight aria-hidden="true" size={13} /></Button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <ArtImage src="/images/art/art-kohbar-auspicious.svg" alt="Kohbar inspired custom artwork example" className="mx-auto aspect-[4/5] w-full max-w-md border-mithila bg-paper p-2" />
          </Reveal>
        </Container>
      </section>

      {/* Gift edit */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="The gift edit"
            title="Give something with a story."
            description="For housewarmings, weddings and moments worth marking — selected for the meaning they carry."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {products.filter((p) => p.categories.includes('gifts')).slice(0, 3).map((product, index) => (
              <Reveal key={product.id} delay={index * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Studio gallery */}
      <section className="bg-paper/50 py-16">
        <Container>
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">From the studio</p>
              <h2 className="mt-3 font-display text-4xl text-ink">A wall of motifs.</h2>
            </div>
            <p className="max-w-sm text-[12px] leading-6 text-charcoal/60">
              A closer look at the drawings in this sample catalogue. Each one is an original illustration made for this project.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {products.slice(0, 6).map((product) => (
              <Reveal key={product.id}>
                <Link to={`/product/${product.slug}`} className="group block">
                  <ArtImage src={product.images[0].src} alt={product.name} className="aspect-square w-full" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">Stay in the loop</p>
            <h2 className="mt-4 font-display text-5xl leading-tight text-ink">Letters from the gallery.</h2>
          </div>
          <form onSubmit={subscribe} className="lg:justify-self-end">
            <label htmlFor="home-newsletter" className="mb-3 block font-sans text-[10px] uppercase tracking-wide2 text-charcoal/60">
              Email address
            </label>
            <div className="flex w-full max-w-md items-center gap-3 border-b border-ink/30 pb-3">
              <input
                id="home-newsletter"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent py-2 font-display text-xl text-ink outline-none placeholder:text-charcoal/35"
              />
              <button type="submit" className="font-sans text-[10px] uppercase tracking-wide2 text-vermilion hover:text-ink">
                Subscribe
              </button>
            </div>
            <p className="mt-3 text-[11px] text-charcoal/50">Sample form — nothing is sent or stored.</p>
          </form>
        </Container>
      </section>

      {/* Reviews placeholder */}
      <section className="bg-indigoDeep/5 py-14">
        <Container className="flex flex-col items-center text-center">
          <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">Customer voices</p>
          <h2 className="mt-4 font-display text-4xl text-ink">Reviews arrive with real purchases.</h2>
          <p className="mt-4 max-w-xl text-[14px] leading-7 text-charcoal/70">
            We have deliberately left this space empty rather than publish invented testimonials.
            Once a review system is connected, verified feedback from buyers can live here.
          </p>
        </Container>
      </section>
    </>
  );
}
