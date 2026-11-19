import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaLock, FaCircleInfo, FaArrowLeft } from 'react-icons/fa6';
import Seo from '../../components/Common/Seo';
import Container from '../../components/Common/Container';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import EmptyState from '../../components/Common/EmptyState';
import OrderSummary from '../../components/Cart/OrderSummary';
import { CheckboxField, FieldError, SelectField, TextField } from '../../components/Forms/Fields';
import { useCartStore, useCartTotals } from '../../context/store';
import { generateOrderId } from '../../lib/utils';
import { siteConfig } from '../../config/site';
import {
  apiConfigured,
  createRazorpayOrder,
  openRazorpayCheckout,
  saveOrder,
  verifyRazorpayPayment,
} from '../../lib/api';

const placeholderOptions = [
  { value: 'upi', label: 'UPI (placeholder)', detail: 'No UPI ID is collected and no payment is requested.' },
  { value: 'card', label: 'Card (placeholder)', detail: 'No card number, CVV or expiry date is collected here.' },
  { value: 'netbanking', label: 'Net banking (placeholder)', detail: 'No bank credentials are collected here.' },
  { value: 'cod', label: 'Cash on delivery (placeholder)', detail: 'Availability and charges must be confirmed by a real store.' },
];

// Only offered when a Razorpay TEST key is configured on the client.
const razorpayOption = {
  value: 'razorpay',
  label: 'Pay securely with Razorpay (test mode)',
  detail: 'Opens Razorpay’s hosted checkout. Card details are entered there, never on this site.',
};

const paymentOptions = siteConfig.razorpayEnabled
  ? [{ value: 'sample', label: 'No payment — sample order', detail: 'Saves the order without taking any payment.' }, razorpayOption, ...placeholderOptions]
  : placeholderOptions;

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const couponCode = useCartStore((state) => state.couponCode);
  const totals = useCartTotals();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: { country: 'IN', payment: siteConfig.razorpayEnabled ? 'sample' : 'upi' },
  });

  const storeAndFinish = (order, message) => {
    try {
      sessionStorage.setItem('mithila-sample-order', JSON.stringify(order));
    } catch {
      // Session storage is optional; navigation state still carries the order.
    }
    clearCart();
    toast.success(message);
    navigate('/order-success', { state: order, replace: true });
  };

  const localSampleOrder = (data, payment) => ({
    id: generateOrderId(),
    placedAt: new Date().toISOString(),
    email: data.email,
    name: `${data.firstName} ${data.lastName}`.trim(),
    paymentMethod: payment?.label || data.payment,
    couponCode,
    totals,
    items: items.map(({ key, productId, slug, name, image, size, frame, unitPrice, quantity }) => ({
      key, productId, slug, name, image, size, frame, unitPrice, quantity,
    })),
    status: 'sample',
    sampleOnly: true,
    persisted: false,
  });

  const onSubmit = async (data) => {
    if (!items.length) {
      toast.error('Your cart is empty.');
      return;
    }

    const payment = paymentOptions.find((option) => option.value === data.payment);
    const useRazorpay = data.payment === 'razorpay' && siteConfig.razorpayEnabled;
    const payload = {
      items: items.map(({ key, productId, slug, name, image, size, frame, unitPrice, quantity }) => ({
        key, productId, slug, name, image, size, frame, unitPrice, quantity,
      })),
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
        notes: data.notes,
      },
      paymentMethod: payment?.label || data.payment,
      paymentMode: useRazorpay ? 'razorpay' : 'sample',
      couponCode,
      sampleOnly: true,
    };

    try {
      // The API recalculates totals from its own product records — the client
      // figures are only an estimate shown in the summary.
      const response = await saveOrder(payload);
      let order = {
        ...response.order,
        name: response.order?.customer
          ? `${response.order.customer.firstName} ${response.order.customer.lastName || ''}`.trim()
          : data.firstName,
        email: response.order?.customer?.email || data.email,
        placedAt: response.order?.placedAt || response.order?.createdAt,
        persisted: true,
      };

      if (useRazorpay) {
        toast.loading('Opening secure payment…', { id: 'payment' });
        try {
          const paymentOrder = await createRazorpayOrder(order.id);
          const result = await openRazorpayCheckout({
            keyId: paymentOrder.keyId || siteConfig.razorpayKeyId,
            orderId: paymentOrder.orderId,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency || 'INR',
            description: `Order ${order.id} — Mithila Art House`,
            prefill: { name: order.name, email: data.email, contact: data.phone },
          });

          const verified = await verifyRazorpayPayment({
            orderId: order.id,
            razorpay_order_id: result.razorpay_order_id,
            razorpay_payment_id: result.razorpay_payment_id,
            razorpay_signature: result.razorpay_signature,
          });
          order = { ...order, ...verified.order, name: order.name, email: order.email, persisted: true };
          toast.success('Payment verified and order recorded.', { id: 'payment' });
        } catch (error) {
          // Keep the cart intact so the customer can retry or choose another method.
          toast.error(error.message || 'The payment was not completed.', { id: 'payment' });
          return;
        }
        storeAndFinish(order, 'Payment verified — thank you.');
        return;
      }

      storeAndFinish(order, 'Sample order saved — no payment was taken.');
    } catch (error) {
      // Backend offline — the original browser-only still works.
      storeAndFinish(localSampleOrder(data, payment), 'Sample order created in this browser — no payment was taken.');
    }
  };

  return (
    <>
      <Seo
        title="Checkout"
        description={siteConfig.razorpayEnabled
          ? 'Checkout for the Mithila Art House sample catalogue. Razorpay test payments are verified on the server; no live payment is taken.'
          : 'Sample checkout for the Mithila Art House sample catalogue. No payment is taken.'}
        canonical="/checkout"
      />
      <PageHeader
        eyebrow="Almost there"
        title="Checkout."
        description={siteConfig.razorpayEnabled
          ? 'A MERN-backed checkout with Razorpay test-mode payments. Server verification decides whether an order is marked paid.'
          : 'A complete checkout sample. Orders are saved when the MERN API is connected; no payment is taken here.'}
        breadcrumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]}
      />

      <Container className="py-14">
        {items.length === 0 ? (
          <EmptyState
            title="Add an artwork before checking out."
            description="Your cart is empty. Browse the collection and return here when you have chosen a piece."
            actionLabel="Explore the collection"
            actionTo="/shop"
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid items-start gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <div className="space-y-12">
              <section>
                <div className="flex items-baseline justify-between border-b border-ink/12 pb-4">
                  <h2 className="font-display text-3xl text-ink">Contact details</h2>
                  <span className="font-sans text-[10px] uppercase tracking-wide2 text-vermilion">01</span>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <TextField label="First name" name="firstName" register={register} error={errors.firstName} required autoComplete="given-name" />
                  <TextField label="Last name" name="lastName" register={register} error={errors.lastName} required autoComplete="family-name" />
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
                  <TextField
                    label="Phone"
                    name="phone"
                    type="tel"
                    register={register}
                    error={errors.phone}
                    required
                    autoComplete="tel"
                    rules={{ required: 'Phone is required.', pattern: { value: /^[+\d][\d\s-]{6,15}$/, message: 'Enter a valid phone number.' } }}
                  />
                </div>
                <p className="mt-4 text-[11px] leading-5 text-charcoal/50">
                  {apiConfigured
                    ? 'These details are sent to the API and stored with the order. No email is sent and no payment details are collected.'
                    : 'These details stay in the form only. Nothing is sent, stored or used to contact you.'}
                </p>
              </section>

              <section>
                <div className="flex items-baseline justify-between border-b border-ink/12 pb-4">
                  <h2 className="font-display text-3xl text-ink">Delivery address</h2>
                  <span className="font-sans text-[10px] uppercase tracking-wide2 text-vermilion">02</span>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Address"
                    name="address"
                    register={register}
                    error={errors.address}
                    required
                    className="sm:col-span-2"
                    autoComplete="street-address"
                  />
                  <TextField label="City" name="city" register={register} error={errors.city} required autoComplete="address-level2" />
                  <TextField label="State / Territory" name="state" register={register} error={errors.state} required autoComplete="address-level1" />
                  <TextField
                    label="PIN code"
                    name="postcode"
                    register={register}
                    error={errors.postcode}
                    required
                    autoComplete="postal-code"
                    rules={{ required: 'PIN code is required.', pattern: { value: /^[1-9][0-9]{5}$/, message: 'Enter a 6-digit Indian PIN code.' } }}
                  />
                  <SelectField
                    label="Country"
                    name="country"
                    register={register}
                    error={errors.country}
                    options={[{ value: 'IN', label: 'India' }, { value: 'OTHER', label: 'Other (sample only)' }]}
                  />
                  <TextField
                    label="Delivery notes (optional)"
                    name="notes"
                    register={register}
                    error={errors.notes}
                    className="sm:col-span-2"
                    placeholder="Anything the delivery team should know"
                  />
                </div>
              </section>

              <section>
                <div className="flex items-baseline justify-between border-b border-ink/12 pb-4">
                  <h2 className="font-display text-3xl text-ink">Payment preference</h2>
                  <span className="font-sans text-[10px] uppercase tracking-wide2 text-vermilion">03</span>
                </div>

                <div className="mt-6 border border-vermilion/25 bg-vermilion/5 p-5">
                  <p className="flex items-start gap-3 text-[12px] leading-6 text-charcoal/75">
                    <FaCircleInfo aria-hidden="true" className="mt-0.5 shrink-0 text-vermilion" />
                    <span>
                      {siteConfig.razorpayEnabled
                        ? 'Razorpay test mode is available. Card details go directly to Razorpay’s hosted checkout — this site never sees them. Choosing a placeholder still creates a no-payment sample order.'
                        : 'No payment gateway is connected. Choosing an option records a preference only; the order is stored locally or in MongoDB when the API is online, and no money changes hands.'}
                    </span>
                  </p>
                </div>

                <div className="mt-5 space-y-3" role="radiogroup" aria-label="Payment preference">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-4 border border-ink/15 p-4 transition-colors hover:border-indigo/50 focus-within:border-vermilion"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register('payment', { required: 'Choose a payment preference.' })}
                        className="mt-1 h-4 w-4 shrink-0 accent-vermilion"
                      />
                      <span>
                        <span className="block font-sans text-[12px] font-medium uppercase tracking-wide2 text-ink">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-[11px] leading-5 text-charcoal/55">{option.detail}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <FieldError error={errors.payment} id="payment-error" />

                <div className="mt-6">
                  <CheckboxField
                    name="agree"
                    label={siteConfig.razorpayEnabled
                      ? 'I understand that only a verified Razorpay test payment marks this order as paid; no-payment options take no payment.'
                      : 'I understand this is a sample checkout and that no payment will be taken.'}
                    register={register}
                    error={errors.agree}
                    rules={{ required: 'Please confirm to continue.' }}
                  />
                </div>
              </section>

              <div>
                <Button type="submit" size="lg" disabled={isSubmitting || items.length === 0}>
                  <FaLock aria-hidden="true" /> {siteConfig.razorpayEnabled ? 'Continue to checkout' : 'Create sample order'}
                </Button>
                <p className="mt-4 text-[11px] leading-5 text-charcoal/50">
                  {siteConfig.razorpayEnabled
                    ? 'Payments are verified on the server before an order is marked paid. No live keys are used in this storefront.'
                    : 'If the API is online the order is saved to MongoDB; otherwise it stays in this browser. Neither path takes a payment.'}
                </p>
              </div>
            </div>

            <OrderSummary className="self-start lg:sticky lg:top-28">
              <div className="space-y-3 border-t border-ink/12 pt-5">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-3">
                    <img src={item.image} alt="" className="h-16 w-14 shrink-0 border border-ink/10 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg text-ink">{item.name}</p>
                      <p className="text-[11px] text-charcoal/50">{item.size} · {item.frame} · ×{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <LinkBack />
            </OrderSummary>
          </form>
        )}
      </Container>
    </>
  );
}

function LinkBack() {
  return (
    <Link
      to="/cart"
      className="mt-6 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-wide2 text-charcoal/55 hover:text-vermilion"
    >
      <FaArrowLeft aria-hidden="true" /> Back to cart
    </Link>
  );
}
