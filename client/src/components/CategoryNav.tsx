import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'Smartphones',
    description: 'Latest models',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#mobile'
  },
  {
    id: 2,
    name: 'Laptops',
    description: 'Performance machines',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#laptop'
  },
  {
    id: 3,
    name: 'Accessories',
    description: 'Must-have gadgets',
    image: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#accessories'
  },
  {
    id: 4,
    name: 'Special Deals',
    description: 'Limited time offers',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#deals'
  }
];

export default function CategoryNav() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" ref={ref}>
      {/* Decorative elements */}
      <motion.div
        className="absolute right-0 top-0 w-64 h-64 bg-primary opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-3xl font-montserrat font-bold text-center mb-16 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
        >
          <span className="relative inline-block">
            Shop by Category
            <motion.span
              className="absolute -bottom-3 left-0 right-0 h-1 bg-primary rounded-full"
              initial={{ width: 0, x: "50%" }}
              animate={isInView ? { width: "100%", x: 0 } : { width: 0, x: "50%" }}
              transition={{ delay: 0.5, duration: 0.7 }}
            />
          </span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {categories.map((category) => (
            <motion.a
              key={category.id}
              href={category.link}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-montserrat font-semibold">{category.name}</h3>
                  <p className="text-sm text-slate-200">{category.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
