import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto text-center">
      <h1 className="font-serif text-2xl sm:text-3xl font-medium text-darkgreen leading-tight">
        Traditional bull-driven oils and natural farming products
      </h1>
      <p className="mt-4 text-textSecondary text-base sm:text-lg leading-relaxed">
        Pure oils and grains from our land. No chemicals, no shortcuts—just the way it&apos;s been done for generations.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/products"
          className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors"
        >
          Shop Products
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg border border-darkgreen text-darkgreen font-medium hover:bg-offwhiteWarm transition-colors"
        >
          Learn Our Process
        </Link>
      </div>
    </section>
  );
}
