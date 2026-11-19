import { Link } from 'react-router-dom';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import Accordion from '../../components/Common/Accordion';
import Button from '../../components/Common/Button';
import DecorativeRule from '../../components/Common/DecorativeRule';
import { faqs } from '../../data/faqs';

export default function FAQ() {
  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Answers about this Mithila art sample catalogue, custom inquiries, checkout, shipping placeholders and image credits."
        canonical="/faq"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
      <PageHeader
        eyebrow="Good to know"
        title="Questions, answered."
        description="Because this is a sample storefront, the honest answers matter more than polished marketing copy."
        breadcrumbs={[{ label: 'FAQ' }]}
      />

      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
          <div>
            <Accordion items={faqs.map((faq) => ({ title: faq.question, content: faq.answer }))} />
            <div className="mt-10 border border-ink/12 bg-paper/40 p-7">
              <h2 className="font-display text-3xl text-ink">Still curious?</h2>
              <p className="mt-3 text-[13px] leading-7 text-charcoal/70">
                The contact page explains which details are configured for this storefront and how a real inquiry flow would be connected.
              </p>
              <div className="mt-6">
                <Button to="/contact" variant="outline">Visit the contact page</Button>
              </div>
            </div>
          </div>

          <aside className="self-start border-t border-ink/12 pt-6 lg:sticky lg:top-28">
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">Before you buy</p>
            <DecorativeRule className="mt-4" />
            <div className="mt-6 space-y-5 text-[13px] leading-7 text-charcoal/70">
              <p>
                Artwork visuals in the catalogue are original illustrations made for this project. They are not
                photographs of named artists' hand-painted works.
              </p>
              <p>
                Prices, stock, artist profiles, policies and shipping estimates are sample data. No live payment is taken.
              </p>
              <p>
                Editorial photographs from Wikimedia Commons are credited on the Image Credits page.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-2 font-sans text-[10px] uppercase tracking-wide2">
              <Link className="text-ink hover:text-vermilion" to="/policies/shipping">Shipping policy</Link>
              <Link className="text-ink hover:text-vermilion" to="/policies/returns">Returns policy</Link>
              <Link className="text-ink hover:text-vermilion" to="/policies/privacy">Privacy policy</Link>
              <Link className="text-ink hover:text-vermilion" to="/image-credits">Image credits</Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
