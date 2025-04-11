import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'Smartphones',
    description: 'Latest models',
    image: 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#mobile'
  },
  {
    id: 2,
    name: 'Laptops',
    description: 'Performance machines',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#laptop'
  },
  {
    id: 3,
    name: 'Accessories',
    description: 'Must-have gadgets',
    image: 'https://images.unsplash.com/photo-1625961332771-3be3656c5927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#accessories'
  },
  {
    id: 4,
    name: 'Special Deals',
    description: 'Limited time offers',
    image: 'https://images.unsplash.com/photo-1607083206203-cb414d59efd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-12 bg-slate-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-montserrat font-bold text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          Shop by Category
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
