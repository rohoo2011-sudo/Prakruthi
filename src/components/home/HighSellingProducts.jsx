import { useProducts } from '../../context/ProductsContext';
import ProductCard from '../products/ProductCard';

export default function HighSellingProducts() {
  const { products } = useProducts();
  const bestSelling = products.filter((p) => p.bestSelling);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-xl sm:text-2xl font-medium text-darkgreen text-center mb-8">
          High Selling Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSelling.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
