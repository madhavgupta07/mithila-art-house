import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import { policySections } from '../../data/faqs';
import NotFound from '../NotFound';

const policyBySlug = {
  shipping: policySections.shipping,
  returns: policySections.returns,
  privacy: policySections.privacy,
  terms: policySections.terms,
};

export default function Policy() {
  const { policy: policySlug } = useParams();
  const policy = policyBySlug[policySlug];

  if (!policy) return <NotFound />;

  return (
    <>
      <Seo
        title={policy.title}
        description={policy.intro}
        canonical={`/policies/${policySlug}`}
      />
      <PageHeader
        eyebrow="Store information"
        title={policy.title}
        description={policy.intro}
        breadcrumbs={[{ label: 'Policies' }, { label: policy.title }]}
      />

      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
          <nav aria-label="Policy pages" className="self-start lg:sticky lg:top-28">
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">All policies</p>
            <div className="mt-5 flex flex-col gap-3 font-sans text-[11px] uppercase tracking-wide2">
              {Object.entries(policyBySlug).map(([slug, item]) => (
                <Link
                  key={slug}
                  to={`/policies/${slug}`}
                  className={slug === policySlug ? 'text-vermilion' : 'text-charcoal/60 hover:text-ink'}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </nav>

          <article className="max-w-3xl">
            <div className="border border-vermilion/25 bg-vermilion/5 p-5 text-[12px] leading-6 text-charcoal/70">
              Template content only. Replace every section with accurate terms reviewed for your business before accepting orders.
            </div>
            <div className="mt-10 space-y-10">
              {policy.sections.map((section, index) => (
                <section key={section.heading} className="border-b border-ink/10 pb-10">
                  <div className="flex gap-5">
                    <span className="font-display text-3xl text-terracotta/50">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h2 className="font-display text-3xl text-ink">{section.heading}</h2>
                      <p className="mt-3 text-[14px] leading-7 text-charcoal/75">{section.body}</p>
                    </div>
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button to="/faq" variant="outline">Read the FAQ</Button>
              <Button to="/contact" variant="ghost">Questions?</Button>
            </div>
          </article>
        </div>
      </Container>
    </>
  );
}
