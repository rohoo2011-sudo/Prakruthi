import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IMAGES = [
  '/assets/hero-image-bull.jpg',
  '/assets/hero-cooking.jpg',
  '/assets/hero-millets.jpg',
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[320px] sm:min-h-[420px] overflow-hidden">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
          }`}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white leading-tight drop-shadow-sm">
          Traditional bull-driven oils and natural farming products
        </h1>
        <p className="mt-4 text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl">
          Pure oils and grains from our land. No chemicals, no shortcuts—just the way it&apos;s been done for generations.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-darkgreenMuted text-offwhite font-medium hover:bg-darkgreenMuted/93 transition-colors"
          >
            Shop Products
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
          >
            Learn Our Process
          </Link>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
