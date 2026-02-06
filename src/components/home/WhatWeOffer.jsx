const offers = [
  {
    title: 'Bull-driven oil extraction',
    text: 'Oil extracted the traditional way, with bull-driven wooden presses. Slow, cold, and pure.',
    icon: (
      <svg className="w-10 h-10 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: 'Natural farming products',
    text: 'Farm-fresh produce grown without synthetic inputs. What you get is what we grow.',
    icon: (
      <svg className="w-10 h-10 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: 'Millets & traditional grains',
    text: 'Heritage grains and millets—nutritious, time-tested, and grown the natural way.',
    icon: (
      <svg className="w-10 h-10 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'No chemicals, no shortcuts',
    text: 'We don\'t use chemicals or shortcuts. What you get is what we grow and press.',
    icon: (
      <svg className="w-10 h-10 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function WhatWeOffer() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-offwhiteWarm">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-xl sm:text-2xl font-medium text-darkgreen text-center mb-8">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {offers.map((offer, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-offwhite border border-borderSoft shadow-soft"
            >
              <div className="mb-3">{offer.icon}</div>
              <h3 className="font-medium text-textPrimary">{offer.title}</h3>
              <p className="mt-2 text-sm text-textSecondary leading-relaxed">{offer.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
