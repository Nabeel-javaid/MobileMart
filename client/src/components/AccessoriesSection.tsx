import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@shared/schema';

interface AccessoriesSectionProps {
  accessories: Product[];
}

export default function AccessoriesSection({ accessories }: AccessoriesSectionProps) {
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
    <section id="accessories" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium">Enhance Your Tech</span>
          <h2 className="text-3xl font-montserrat font-bold mt-2 mb-4">Essential Accessories</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Complete your tech setup with our premium selection of accessories designed to enhance your experience.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {accessories.map((accessory) => (
            <motion.div 
              key={accessory.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="overflow-hidden">
                <img 
                  src={accessory.imageUrl} 
                  alt={accessory.name} 
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm md:text-base mb-1">{accessory.name}</h3>
                <p className="text-primary font-bold text-sm md:text-base">
                  ${parseFloat(accessory.price.toString()).toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a href="#" className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition-colors">
            View All Accessories <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
