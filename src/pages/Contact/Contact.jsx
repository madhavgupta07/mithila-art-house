import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaLocationDot, FaWhatsapp, FaCircleInfo } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import SectionHeading from '../../components/Common/SectionHeading';
import ArtImage from '../../components/Common/ArtImage';
import Button from '../../components/Common/Button';
import { TextArea, TextField } from '../../components/Forms/Fields';
import { siteConfig, whatsappEnabled, whatsappLink } from '../../config/site';
import { apiConfigured, saveInquiry } from '../../lib/api';

export default function Contact() {
  const [draft, setDraft] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const waHref = whatsappLink(
    `Hello, I have a question about Mithila Art House. ${draft?.subject ? `Subject: ${draft.subject}.` : ''}`,
  );

  const onSubmit = async (data) => {
    let persisted = false;
    try {
      await saveInquiry({ type: 'contact', ...data });
      persisted = true;
    } catch {
      // Backend offline — keep the browser-only behaviour.
    }
    setDraft({ ...data, persisted });
    reset();
    toast.success(
      persisted
        ? 'Message saved in MongoDB.'
        : 'Sample message prepared — nothing was sent or stored.',
    );
  };

  const details = [
    { icon: FaEnvelope, label: 'Email', value: siteConfig.email, href: siteConfig.email ? `mailto:${siteConfig.email}` : null },
    { icon: FaPhone, label: 'Phone', value: siteConfig.phone, href: siteConfig.phone ? `tel:${siteConfig.phone.replace(/[^\d+]/g, '')}` : null },
    { icon: FaLocationDot, label: 'Address', value: siteConfig.address },
  ];

  return (
    <>
      <Seo
        title="Contact"
        description={apiConfigured
          ? 'Contact page for the Mithila Art House sample. Messages are stored in MongoDB when the API is online; contact details appear only when configured.'
          : 'Contact page for the Mithila Art House sample, with configurable email, phone, address and WhatsApp links. No details are published unless configured.'}
        canonical="/contact"
      />
      <PageHeader
        eyebrow="Say hello"
        title="Contact."
        description={apiConfigured
          ? 'Send a sample message — it is stored in MongoDB when the API is online. No email is sent unless you configure a real service.'
          : 'A front-end contact form for the sample storefront. No message is sent unless you connect a form service or backend.'}
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <Container className="py-14">
        <div className="grid gap-14 lg:grid-cols-[1fr_400px] lg:gap-20">
          <div>
            <div className="border border-vermilion/25 bg-vermilion/5 p-5">
              <p className="flex items-start gap-3 text-[12px] leading-6 text-charcoal/75">
                <FaCircleInfo aria-hidden="true" className="mt-0.5 shrink-0 text-vermilion" />
                <span>
                  No business contact details are invented here. Email, phone, address, Instagram and WhatsApp appear
                  only when configured through environment variables.{' '}
                  {apiConfigured
                    ? 'Messages are stored in MongoDB when the API is online; otherwise they stay in this browser session. No email is sent.'
                    : 'Form submissions stay in this browser session.'}
                </span>
              </p>
            </div>

            {draft && (
              <div className="mt-6 border border-forest/30 bg-forest/5 p-6">
                <p className="font-sans text-[10px] uppercase tracking-luxe text-forest">
                  {draft.persisted ? 'Message saved in MongoDB' : 'Sample message prepared'}
                </p>
                <h2 className="mt-3 font-display text-3xl text-ink">{draft.subject || 'Hello'}</h2>
                <p className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-charcoal/70">{draft.message}</p>
                <p className="mt-4 text-[11px] text-charcoal/50">
                  From {draft.name} · {draft.email} —{' '}
                  {draft.persisted ? 'saved in MongoDB.' : 'nothing was transmitted (backend offline).'}
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

            <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
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
              <TextField
                label="Subject"
                name="subject"
                register={register}
                error={errors.subject}
                required
                placeholder="A question about an artwork, a custom brief, or the gallery"
              />
              <TextArea
                label="Message"
                name="message"
                register={register}
                error={errors.message}
                required
                rows={7}
                rules={{ required: 'Please add a message.', minLength: { value: 10, message: 'Please add a little more detail.' } }}
              />
              <Button type="submit" size="lg">{apiConfigured ? 'Save message' : 'Prepare sample message'}</Button>
              <p className="text-[11px] leading-5 text-charcoal/50">
                Please do not include sensitive personal or payment information in this sample form.
              </p>
            </form>
          </div>

          <aside className="space-y-10 lg:sticky lg:top-28">
            <div className="border border-ink/12 bg-paper/40 p-7">
              <SectionHeading eyebrow="Reach us" title="Configured details." />
              <div className="mt-7 space-y-5">
                {details.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-4">
                      <Icon aria-hidden="true" className="mt-0.5 shrink-0 text-terracotta" />
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/50">{item.label}</p>
                        {item.value ? (
                          item.href ? (
                            <a href={item.href} className="mt-1 block text-[13px] text-ink hover:text-vermilion">
                              {item.value}
                            </a>
                          ) : (
                            <p className="mt-1 whitespace-pre-line text-[13px] leading-6 text-ink">{item.value}</p>
                          )
                        ) : (
                          <p className="mt-1 text-[13px] text-charcoal/45">Not configured in this storefront</p>
                        )}
                      </div>
                    </div>
                  );
                })}
                {siteConfig.instagram && (
                  <div className="flex gap-4">
                    <span className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-wide2 text-charcoal/50">Instagram</p>
                      <a href={siteConfig.instagram} target="_blank" rel="noreferrer" className="mt-1 block text-[13px] text-ink hover:text-vermilion">
                        Open profile ↗
                      </a>
                    </div>
                  </div>
                )}
                {whatsappEnabled && waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-wide2 text-forest hover:text-vermilion"
                  >
                    <FaWhatsapp aria-hidden="true" /> Chat on WhatsApp
                  </a>
                )}
              </div>
            </div>

            <ArtImage
              src="/images/heritage/artist-at-work.webp"
              alt="Documentary photograph of a Mithila artist at work"
              className="aspect-[4/3] w-full border border-ink/10"
            />
            <p className="-mt-6 font-sans text-[9px] uppercase tracking-wide2 text-charcoal/45">
              Documentary photograph: Pallav.journo, CC BY-SA 4.0, Wikimedia Commons. Not a listed contact.
            </p>
          </aside>
        </div>
      </Container>
    </>
  );
}
