export const faqs = [
  {
    question: 'Are the artworks in this sample catalogue authentic, hand-painted Mithila paintings?',
    answer:
      'No. This is a sample storefront. The artwork visuals are original illustrations created for this project and are shown as sample product imagery. Replace them with photographs of actual artworks, and add verified provenance and artist information, before selling anything.',
  },
  {
    question: 'Which currency do you use?',
    answer:
      'All sample prices are shown in Indian rupees (₹). The price formatting is centralised so another currency can be added later.',
  },
  {
    question: 'Can I request a custom artwork?',
    answer:
      'The custom artwork page collects a sample inquiry. With the API connected it is stored in MongoDB; otherwise it stays in this browser. No email is sent — connect a notification service so inquiries reach your team.',
  },
  {
    question: 'How does checkout work?',
    answer:
      'Checkout shows the full form flow, order summary and order-success screen. No live payment is taken. Razorpay test mode is available only when test keys are configured, and its payments are verified on the server. A production gateway must be integrated and clearly disclosed before launch.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Shipping options and charges in this storefront are illustrative estimates only. Publish your own shipping policy and actual rates before accepting orders.',
  },
  {
    question: 'Can I save artworks I like?',
    answer:
      'Yes. The heart button adds an artwork to your wishlist, which is stored in this browser using localStorage. It is not synced to an account.',
  },
  {
    question: 'Where do the documentary photographs come from?',
    answer:
      'Editorial photographs are openly licensed images from Wikimedia Commons and are credited on the Image Credits page. They are used to illustrate the cultural context, not as product imagery.',
  },
];

export const policySections = {
  shipping: {
    title: 'Shipping & Delivery Policy',
    intro:
      'Template copy for this sample. Replace every statement below with the actual shipping terms you offer before accepting orders.',
    sections: [
      {
        heading: 'Dispatch timelines',
        body: 'Describe how long it takes to prepare, pack and dispatch an order. Distinguish between ready-to-ship works and made-to-order pieces, and avoid promising a fixed delivery date you cannot meet.',
      },
      {
        heading: 'Shipping charges',
        body: `The sample checkout currently uses an illustrative flat fee and free-shipping threshold (${'configured in .env'}). Replace these with real rates, including any international surcharges and customs responsibilities.`,
      },
      {
        heading: 'Packaging',
        body: 'Explain how paintings are protected in transit — for example, flat packing, rolled tubes or framed crates — and what the customer should check on arrival.',
      },
      {
        heading: 'Delivery questions',
        body: 'Add the contact route customers should use if a shipment is delayed or arrives damaged, with your real contact details.',
      },
    ],
  },
  returns: {
    title: 'Return & Refund Policy',
    intro:
      'Template copy for this sample. Have this reviewed and replaced with your actual policy before launch.',
    sections: [
      {
        heading: 'Eligibility',
        body: 'State which items may be returned, any time window, and how custom or made-to-order pieces are handled.',
      },
      {
        heading: 'Condition on return',
        body: 'Describe the expected condition of the artwork and packaging, and how damage in transit should be reported.',
      },
      {
        heading: 'Refunds',
        body: 'Explain when refunds are issued, how long they take, and which payment method they are returned to.',
      },
      {
        heading: 'Contact',
        body: 'Provide a real returns contact address or form. No contact details are supplied in this storefront.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro:
      'Template copy for this sample. Replace with a policy that accurately reflects the data your live site collects.',
    sections: [
      {
        heading: 'What this storefront stores',
        body: 'This sample storefront stores cart and wishlist data in your browser using localStorage. When the API is connected, inquiries and orders are stored in MongoDB; otherwise they stay in this browser. No payment details are collected.',
      },
      {
        heading: 'What a live store might collect',
        body: 'List the personal data your real store processes — contact details, delivery address, order records, analytics and any newsletter consent — and the legal basis for each.',
      },
      {
        heading: 'Cookies and analytics',
        body: 'Disclose the analytics, advertising or cookies you actually use, and how visitors can manage their preferences.',
      },
      {
        heading: 'Your rights and contact',
        body: 'Add the rights available to visitors and the real contact point for privacy requests.',
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro:
      'Template copy for this sample. Replace with terms reviewed for your business and jurisdiction.',
    sections: [
      {
        heading: 'Sample catalogue',
        body: 'The artworks, prices, artist placeholders and availability shown here are illustrative. No offer to sell is made by this sample site.',
      },
      {
        heading: 'Orders and pricing',
        body: 'Describe how orders are accepted, when a contract is formed, how prices and taxes are shown, and how you handle errors.',
      },
      {
        heading: 'Intellectual property',
        body: 'Clarify who owns the artwork, what reproduction rights buyers receive, and how you handle custom commissions.',
      },
      {
        heading: 'Liability and governing law',
        body: 'Replace this section with the appropriate legal wording for your business and jurisdiction.',
      },
    ],
  },
};
