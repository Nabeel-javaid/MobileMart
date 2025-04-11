import { motion } from 'framer-motion';
import type { SpecialOffer } from '@shared/schema';

interface SpecialOffersSectionProps {
  offers: SpecialOffer[];
}

export default function SpecialOffersSection({ offers }: SpecialOffersSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section id="deals" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-secondary font-medium">Limited Time</span>
          <h2 className="text-3xl font-montserrat font-bold mt-2">Special Offers</h2>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {offers.map((offer) => {
            const savings = parseFloat(offer.originalPrice.toString()) - parseFloat(offer.price.toString());
            
            return (
              <motion.div 
                key={offer.id}
                className="bg-slate-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2">
                    <div className="p-8">
                      <span className={`inline-block px-4 py-1 rounded-full ${
                        offer.badge.toLowerCase().includes('day') 
                          ? 'bg-secondary' 
                          : 'bg-accent'
                      } text-white font-medium text-sm mb-4`}>
                        {offer.badge}
                      </span>
                      
                      <h3 className="text-white text-2xl font-montserrat font-bold mb-3">
                        {offer.title}
                      </h3>
                      
                      <p className="text-slate-300 mb-4">
                        {offer.description}
                      </p>
                      
                      <div className="mb-6">
                        <span className="text-white text-2xl font-bold">
                          ${parseFloat(offer.price.toString()).toFixed(2)}
                        </span>
                        <span className="ml-2 text-slate-400 line-through">
                          ${parseFloat(offer.originalPrice.toString()).toFixed(2)}
                        </span>
                        <span className={`ml-2 ${
                          offer.badge.toLowerCase().includes('day') 
                            ? 'bg-secondary' 
                            : 'bg-accent'
                        } text-white text-xs px-2 py-1 rounded`}>
                          Save ${savings.toFixed(2)}
                        </span>
                      </div>
                      
                      <motion.button 
                        className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-full font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Shop Now
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 relative overflow-hidden">
                    <img 
                      src={offer.imageUrl} 
                      alt={offer.title} 
                      className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
