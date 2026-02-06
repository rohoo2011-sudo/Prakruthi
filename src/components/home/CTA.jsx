import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-offwhiteWarm">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-xl sm:text-2xl font-medium text-darkgreen mb-4">
          Order natural products directly from us
        </h2>
        <Link
          to="/products"
          className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </section>
  );
}
