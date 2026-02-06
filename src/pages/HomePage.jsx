import Hero from '../components/home/Hero';
import WhatWeOffer from '../components/home/WhatWeOffer';
import HighSellingProducts from '../components/home/HighSellingProducts';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhatWeOffer />
      <HighSellingProducts />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </main>
  );
}
