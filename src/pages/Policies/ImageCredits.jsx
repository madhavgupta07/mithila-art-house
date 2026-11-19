import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import ArtImage from '../../components/Common/ArtImage';
import credits from '../../data/imageCredits.json';

export default function ImageCredits() {
  return (
    <>
      <Seo
        title="Image Credits"
        description="Attribution for openly licensed documentary photographs used in this storefront's editorial sections, plus a note on the original catalogue illustrations."
        canonical="/image-credits"
      />
      <PageHeader
        eyebrow="Attribution"
        title="Image credits."
        description="The product artwork in this catalogue is original to this storefront. The documentary photographs below come from Wikimedia Commons under the licences shown."
        breadcrumbs={[{ label: 'Image Credits' }]}
      />

      <Container className="py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {credits.map((credit) => (
            <article key={credit.file} className="border border-ink/12 bg-paper/30">
              <ArtImage src={credit.file} alt={credit.title} className="aspect-[4/3] w-full" />
              <div className="p-5">
                <h2 className="font-display text-xl leading-snug text-ink">{credit.title}</h2>
                <dl className="mt-4 space-y-2 text-[12px] leading-6 text-charcoal/70">
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/45">By</dt>
                    <dd>{credit.author}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/45">Licence</dt>
                    <dd>
                      <a href={credit.licenseUrl} target="_blank" rel="noreferrer" className="link-underline">
                        {credit.license}
                      </a>
                    </dd>
                  </div>
                </dl>
                <a
                  href={credit.source}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-block font-sans text-[10px] uppercase tracking-wide2 text-vermilion hover:text-ink"
                >
                  View source on Wikimedia Commons ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 max-w-3xl border border-ink/12 bg-ivory p-7">
          <h2 className="font-display text-3xl text-ink">About the catalogue illustrations</h2>
          <p className="mt-4 text-[14px] leading-7 text-charcoal/75">
            All images under <code className="bg-paper px-1.5 py-0.5 text-[13px]">/images/art/</code> were generated
            programmatically for this project as original SVG compositions. They are Mithila-inspired sample artwork,
            not reproductions of traditional paintings and not photographs of work by a named artisan. The three
            portrait placeholders are abstract illustrations, not depictions of real people.
          </p>
          <p className="mt-4 text-[14px] leading-7 text-charcoal/75">
            Source files can be regenerated with <code className="bg-paper px-1.5 py-0.5 text-[13px]">python scripts/generate_art.py</code>.
            Replace them with licensed photographs and verified artist information before using this site commercially.
          </p>
        </div>
      </Container>
    </>
  );
}
