import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowRight, FaCircleInfo, FaWhatsapp } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import SectionHeading from '../../components/Common/SectionHeading';
import ArtImage from '../../components/Common/ArtImage';
import Button from '../../components/Common/Button';
import { CheckboxField, SelectField, TextArea, TextField } from '../../components/Forms/Fields';
import { siteConfig, whatsappEnabled, whatsappLink } from '../../config/site';
import { apiConfigured, saveInquiry } from '../../lib/api';

const themeOptions = [
  { value: '', label: 'Choose a starting point' },
  { value: 'peacock', label: 'Peacock & feathers' },
  { value: 'lotus', label: 'Lotus & water' },
  { value: 'wedding', label: 'Wedding / kohbar motifs' },
  { value: 'nature', label: 'Birds, trees & monsoon' },
  { value: 'geometric', label: 'Mandala & borders' },
  { value: 'other', label: 'Something else' },
];

const styleOptions = [
  { value: '', label: 'Choose a style' },
  { value: 'traditional', label: 'Traditional Madhubani' },
  { value: 'contemporary', label: 'Contemporary Mithila' },
  { value: 'fusion', label: 'A loose fusion' },
];

const sizeOptions = [
  { value: '', label: 'Choose a size' },
  { value: '30x40', label: '30 × 40 cm' },
  { value: '45x60', label: '45 × 60 cm' },
  { value: '60x80', label: '60 × 80 cm' },
  { value: 'custom', label: 'Another size (describe below)' },
];

const budgetOptions = [
  { value: '', label: 'Prefer not to say' },
  { value: 'under-10000', label: 'Under ₹10,000 (sample range)' },
  { value: '10000-20000', label: '₹10,000 – ₹20,000 (sample range)' },
  { value: 'above-20000', label: 'Above ₹20,000 (sample range)' },
];

const steps = [
  ['01', 'Share the idea', 'Tell us the motif, palette, scale and feeling you have in mind.'],
  ['02', 'Discuss the brief', 'A real studio would clarify scope, materials, timeline and price with you.'],
  ['03', 'Review a direction', 'A real studio would share a sketch or sample before any work begins.'],
];

export default function CustomArtwork() {
  const [submitted, setSubmitted] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const waHref = whatsappLink(
    "Hello, I'd like to discuss a custom Mithila-inspired artwork. My theme: " +
      (submitted?.theme || 'to be discussed'),
  );

  const onSubmit = async (data) => {
    let persisted = false;
    try {
      await saveInquiry({ type: 'custom', ...data });
      persisted = true;
    } catch {
      // Backend offline — keep the browser-only behaviour.
    }
    setSubmitted({ ...data, persisted });
    reset();
    toast.success(
      persisted
        ? 'Custom brief saved in MongoDB.'
        : 'Sample inquiry prepared — nothing was sent or stored.',
    );
  };

  return (
    <>
      <Seo
        title="Custom Artwork"
        description={apiConfigured
          ? 'A custom-artwork inquiry form for Mithila-inspired paintings. Briefs are stored in MongoDB when the API is online.'
          : 'A sample custom-artwork inquiry form for Mithila-inspired paintings. The form is a front-end sample and does not send data.'}
        canonical="/custom"
      />
      <PageHeader
        eyebrow="Made around your story"
        title="Custom artwork."
        description={apiConfigured
          ? 'A place to imagine a personal commission — a motif, a palette, a size and a meaning. Your brief is saved in MongoDB when the API is online; no email is sent.'
          : 'A place to imagine a personal commission — a motif, a palette, a size and a meaning. This inquiry form is a front-end sample only; it does not send your details anywhere.'}
        breadcrumbs={[{ label: 'Custom Artwork' }]}
      />

      <Container className="py-14">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_420px] lg:gap-20">
          <div>
            <div className="border border-vermilion/25 bg-vermilion/5 p-5">
              <p className="flex items-start gap-3 text-[12px] leading-6 text-charcoal/75">
                <FaCircleInfo aria-hidden="true" className="mt-0.5 shrink-0 text-vermilion" />
                <span>
                  {apiConfigured
                    ? 'This brief is saved to MongoDB when the API is online. No email is sent and nothing is forwarded to a studio. Do not enter sensitive or real payment information.'
                    : 'This is a front-end form. It shows the fields a commission brief might need, but submissions are not saved, emailed or forwarded. Do not enter sensitive or real payment information.'}
                </span>
              </p>
            </div>

            {submitted && (
              <div className="mt-6 border border-forest/30 bg-forest/5 p-6">
                <p className="font-sans text-[10px] uppercase tracking-luxe text-forest">
                  {submitted.persisted ? 'Brief saved in MongoDB' : 'Sample brief prepared'}
                </p>
                <h2 className="mt-3 font-display text-3xl text-ink">Thank you, {submitted.name}.</h2>
                <p className="mt-3 text-[13px] leading-6 text-charcoal/70">
                  Your sample brief mentions <strong>{themeOptions.find((option) => option.value === submitted.theme)?.label || submitted.theme}</strong>
                  {submitted.size ? ` at ${sizeOptions.find((option) => option.value === submitted.size)?.label || submitted.size}` : ''}.
                  {submitted.persisted
                    ? 'It was saved to MongoDB. Connect a real notification service before collecting live inquiries.'
                    : 'It stayed on this screen only — the backend was offline.'}
                </p>
                {waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-wide2 text-forest hover:text-vermilion"
                  >
                    <FaWhatsapp aria-hidden="true" /> Continue on WhatsApp
                  </a>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-10">
              <section>
                <h2 className="border-b border-ink/12 pb-4 font-display text-3xl text-ink">About you</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <TextField label="Name" name="name" register={register} error={errors.name} required autoComplete="name" />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    required
                    autoComplete="email"
                    rules={{ required: 'Email is required.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' } }}
                  />
                </div>
              </section>

              <section>
                <h2 className="border-b border-ink/12 pb-4 font-display text-3xl text-ink">The artwork</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Starting motif"
                    name="theme"
                    register={register}
                    error={errors.theme}
                    options={themeOptions}
                    rules={{ required: 'Choose a starting motif.' }}
                  />
                  <SelectField
                    label="Preferred style"
                    name="style"
                    register={register}
                    error={errors.style}
                    options={styleOptions}
                    rules={{ required: 'Choose a preferred style.' }}
                  />
                  <SelectField
                    label="Approximate size"
                    name="size"
                    register={register}
                    error={errors.size}
                    options={sizeOptions}
                    rules={{ required: 'Choose an approximate size.' }}
                  />
                  <SelectField
                    label="Indicative budget"
                    name="budget"
                    register={register}
                    error={errors.budget}
                    options={budgetOptions}
                  />
                  <TextField
                    label="Palette or colours"
                    name="palette"
                    register={register}
                    error={errors.palette}
                    className="sm:col-span-2"
                    placeholder="For example: indigo, vermilion, mustard and lots of ivory"
                  />
                  <TextArea
                    label="Tell us more"
                    name="description"
                    register={register}
                    error={errors.description}
                    required
                    className="sm:col-span-2"
                    rows={6}
                    placeholder="What should the artwork evoke? Any symbols, places or memories to include?"
                    rules={{ required: 'A short description helps shape the brief.', minLength: { value: 20, message: 'Please add a little more detail.' } }}
                  />
                </div>
              </section>

              <section>
                <h2 className="border-b border-ink/12 pb-4 font-display text-3xl text-ink">Practical details</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Hoped-for timing (optional)"
                    name="timeline"
                    register={register}
                    error={errors.timeline}
                    placeholder="For example: before a festive occasion"
                  />
                  <CheckboxField
                    name="consent"
                    label={apiConfigured
                      ? 'I understand this brief is stored in MongoDB and no email is sent.'
                      : 'I understand this is a sample form and no inquiry will be sent.'}
                    register={register}
                    error={errors.consent}
                    rules={{ required: 'Please confirm you understand.' }}
                  />
                </div>
              </section>

              <div>
                <Button type="submit" size="lg">
                  {apiConfigured ? 'Save brief' : 'Prepare sample brief'} <FaArrowRight aria-hidden="true" size={13} />
                </Button>
                <p className="mt-4 text-[11px] leading-5 text-charcoal/50">
                  {siteConfig.name} does not publish real contact details in this storefront. Configure them through environment variables before launch.
                </p>
              </div>
            </form>
          </div>

          <aside className="space-y-10 lg:sticky lg:top-28">
            <ArtImage
              src="/images/art/art-kohbar-auspicious.svg"
              alt="Kohbar-inspired sample composition"
              className="aspect-[4/5] w-full border-mithila bg-paper p-2"
            />
            <div>
              <SectionHeading eyebrow="How it would work" title="From idea to wall." />
              <ol className="mt-7 divide-y divide-ink/10 border-y border-ink/10">
                {steps.map(([number, title, text]) => (
                  <li key={number} className="grid grid-cols-[44px_1fr] gap-3 py-5">
                    <span className="font-display text-2xl text-terracotta/50">{number}</span>
                    <div>
                      <h3 className="font-display text-xl text-ink">{title}</h3>
                      <p className="mt-1 text-[12px] leading-6 text-charcoal/65">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-[11px] leading-5 text-charcoal/50">
                This description is a UX outline, not a promise of service, timeline or price.
              </p>
            </div>
            {whatsappEnabled && waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-wide2 text-forest hover:text-vermilion"
              >
                <FaWhatsapp aria-hidden="true" /> Message the configured WhatsApp number
              </a>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
