export default function AboutPage() {
  return (
    <main className="min-h-[60vh] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-darkgreen mb-8">
          About Us
        </h1>
        <div className="space-y-8 text-textSecondary leading-relaxed">
          <section>
            <h2 className="font-serif text-lg font-medium text-darkgreen mb-3">
              Who we are
            </h2>
            <p>
              We are a small family from the land, and we started this because we
              wanted to share what we grow and press—the same way our grandparents
              did. We are not a big company. We are farmers and traditional
              oil-makers who decided to bring our products to more people.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-lg font-medium text-darkgreen mb-3">
              Why bull-driven oil
            </h2>
            <p>
              Bull-driven oil isn’t a gimmick for us—it’s how we’ve always done it.
              The bull turns the wooden press slowly, and the oil that comes out
              is cold, pure, and untouched by machines or chemicals. It takes time,
              but the result is oil that tastes and feels the way it should. We
              believe that some things are worth doing the old way.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-lg font-medium text-darkgreen mb-3">
              Our commitment to natural farming
            </h2>
            <p>
              We don’t use synthetic fertilisers, pesticides, or shortcuts. Our
              millets and rice come from our fields. Our oils come from seeds we
              trust. We don’t sell anything we wouldn’t use in our own kitchen.
              When you buy from us, you’re buying from people who care about the
              land and the way things used to be made.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
