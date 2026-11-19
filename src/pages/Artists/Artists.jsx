import { Link } from 'react-router-dom';
import { FaArrowRight, FaCircleInfo, FaMapPin } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import Reveal from '../../components/Common/Reveal';
import SectionHeading from '../../components/Common/SectionHeading';
import ArtImage from '../../components/Common/ArtImage';
import Button from '../../components/Common/Button';
import { artists } from '../../data/artists';

export default function Artists() {
  return (
    <>
      <Seo
        title="Artist Stories"
        description="Placeholder profiles showing where verified Mithila artist biographies could live. No real artist credentials or biographies are claimed in this storefront."
        canonical="/artists"
      />
      <PageHeader
        eyebrow="The people behind the work"
        title="Artist stories."
        description="A place reserved for real voices. These profiles are illustrative placeholders — not real people, not claimed collaborators and not invented biographies."
        breadcrumbs={[{ label: 'Artists' }]}
      />

      <Container className="py-14">
        <div className="border border-vermilion/25 bg-vermilion/5 p-6">
          <p className="flex items-start gap-3 text-[13px] leading-6 text-charcoal/75">
            <FaCircleInfo aria-hidden="true" className="mt-0.5 shrink-0 text-vermilion" />
            <span>
              Replace these placeholders only with details the artists have shared and approved: their own account of
              their practice, a photograph they consented to, and any motifs or techniques they want named. Do not add
              awards, certifications or years of experience unless they can be verified.
            </span>
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <Reveal className="self-start lg:sticky lg:top-28">
            <ArtImage
              src="/images/heritage/artisan-portrait.webp"
              alt="Documentary photograph of a Mithila painting artist at work"
              className="aspect-[3/4] w-full border border-ink/10"
            />
            <p className="mt-3 font-sans text-[9px] uppercase tracking-wide2 text-charcoal/45">
              Documentary photograph from Wikimedia Commons. The person shown is not a listed artist or collaborator in this storefront. Credit: Abhishek Singh, CC BY-SA 2.0.
            </p>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Placeholder profiles"
              title="Space for real stories."
              description="Each card shows the kind of information a verified artist profile could hold. The portraits below are abstract illustrations, not depictions of people."
            />
            <div className="mt-12 space-y-12">
              {artists.map((artist, index) => (
                <Reveal key={artist.id} delay={index * 0.08}>
                  <article className="grid gap-6 border-t border-ink/12 pt-8 sm:grid-cols-[180px_1fr]">
                    <div>
                      <ArtImage
                        src={artist.portrait}
                        alt="Abstract illustrative portrait placeholder"
                        className="aspect-[3/4] w-full border border-ink/10"
                      />
                      <p className="mt-2 text-[10px] leading-4 text-charcoal/45">Illustrative placeholder portrait</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <h3 className="font-display text-3xl text-ink">{artist.name}</h3>
                        <span className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/50">
                          <FaMapPin aria-hidden="true" /> {artist.location}
                        </span>
                      </div>
                      <p className="mt-2 font-sans text-[10px] uppercase tracking-wide2 text-vermilion">{artist.style}</p>
                      <p className="mt-5 text-[14px] leading-7 text-charcoal/75">{artist.story}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-5">
                        <Link
                          to="/shop"
                          className="inline-flex items-center gap-2 border-b border-vermilion pb-1 font-sans text-[10px] uppercase tracking-wide2 text-vermilion hover:text-ink"
                        >
                          See the sample artwork <FaArrowRight aria-hidden="true" />
                        </Link>
                        <span className="text-[11px] text-charcoal/50">{artist.signatureCaption}</span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <section className="bg-paper/50 py-20">
        <Container className="flex flex-col items-center text-center">
          <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">Want to tell a real story?</p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl leading-tight text-ink">
            Start with consent, context and the artist's own words.
          </h2>
          <p className="mt-5 max-w-xl text-[14px] leading-7 text-charcoal/70">
            The contact page shows how an inquiry form can be wired up. Use it to ask artists what they want shared — not to extract a biography for marketing.
          </p>
          <div className="mt-8">
            <Button to="/contact">Open the contact page</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
