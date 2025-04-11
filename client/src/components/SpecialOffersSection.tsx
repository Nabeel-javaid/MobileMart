import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SpecialOffer } from '@shared/schema';
import { Clock } from 'lucide-react';

interface SpecialOffersSectionProps {
  offers: SpecialOffer[];
}

export default function SpecialOffersSection({ offers }: SpecialOffersSectionProps) {
  // State for countdown timers
  const [timeLeft, setTimeLeft] = useState<Record<number, { days: number; hours: number; minutes: number }>>({});

  // Set up countdown timers for each offer
  useEffect(() => {
    if (!offers.length) return;

    const calculateTimeLeft = () => {
      const newTimeLeft: Record<number, { days: number; hours: number; minutes: number }> = {};

      offers.forEach(offer => {
        const endDate = new Date(offer.endDate);
        const now = new Date();
        const difference = endDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

          newTimeLeft[offer.id] = { days, hours, minutes };
        }
      });

      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [offers]);

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

  // Format price with commas
  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate savings percentage
  const calculateSavings = (originalPrice: string, currentPrice: string) => {
    const original = parseFloat(originalPrice);
    const current = parseFloat(currentPrice);
    const percentage = Math.round(((original - current) / original) * 100);
    return percentage;
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
          <h2 className="text-3xl font-montserrat font-bold">Special Offers</h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {offers.map((offer) => {
            const discountPercentage = calculateSavings(offer.originalPrice.toString(), offer.price.toString());
            const timeRemaining = timeLeft[offer.id];

            return (
              <motion.div
                key={offer.id}
                className="bg-slate-900 rounded-xl overflow-hidden shadow-lg"
                variants={itemVariants}
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                    {/* Title */}
                    <div>
                      {/* Timer */}
                      {timeRemaining && (
                        <div className="flex items-center text-gray-400 text-sm mb-4">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{timeRemaining.days}d{timeRemaining.hours}h {timeRemaining.minutes}m left</span>
                        </div>
                      )}

                      <h3 className="text-white text-2xl font-bold mb-3">
                        {offer.title}
                      </h3>

                      <p className="text-gray-300 mb-6">
                        {offer.description}
                      </p>

                      <div className="mb-6">
                        {/* Price */}
                        <div className="flex items-center mb-2">
                          <span className="text-white text-3xl font-bold">
                            ${formatPrice(offer.price.toString())}
                          </span>
                          <span className="ml-3 text-gray-400 line-through">
                            ${formatPrice(offer.originalPrice.toString())}
                          </span>
                        </div>

                        {/* Discount badge */}
                        <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
                          {discountPercentage}% off
                        </div>
                      </div>
                    </div>

                    {/* Shop Now Button */}
                    <a
                      href={`/product/${offer.id}`}
                      className="inline-block bg-white hover:bg-gray-50 text-slate-900 font-medium px-8 py-3 rounded-full text-center"
                    >
                      Shop Now
                    </a>
                  </div>

                  <div className="w-full md:w-1/2 relative h-64 md:h-auto">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover object-center"
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
