import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@shared/schema';

interface MobileProductsSectionProps {
  products: Product[];
}

export default function MobileProductsSection({ products }: MobileProductsSectionProps) {
  const [sortBy, setSortBy] = useState('Sort by');

  // Sort products based on selection
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = parseFloat(a.price.toString());
    const priceB = parseFloat(b.price.toString());

    switch (sortBy) {
      case 'Price: Low to High':
        return priceA - priceB;
      case 'Price: High to Low':
        return priceB - priceA;
      case 'Newest First':
        return a.isNew ? -1 : 1;
      case 'Popularity':
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="mobile" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">Premium Selection</span>
            <h2 className="text-3xl font-montserrat font-bold mt-2">Latest Smartphones</h2>
          </motion.div>

          <motion.div
            className="flex mt-4 md:mt-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <select
                className="appearance-none bg-white border border-slate-200 rounded-full py-2 pl-4 pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-primary text-slate-700"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Sort by</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Popularity</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <ChevronDown className="text-slate-400 h-4 w-4" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="#"
            className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition-colors"
          >
            View All Smartphones <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
