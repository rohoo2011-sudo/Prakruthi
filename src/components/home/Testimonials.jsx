import { testimonials } from '../../data/products';

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-xl sm:text-2xl font-medium text-darkgreen text-center mb-8">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-xl bg-offwhite border border-borderSoft shadow-soft"
            >
              <p className="text-textSecondary text-sm leading-relaxed">&ldquo;{t.feedback}&rdquo;</p>
              <p className="mt-3 text-sm font-medium text-darkgreen">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
