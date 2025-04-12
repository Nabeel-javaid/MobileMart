import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SpecialOffer } from '@shared/schema';
import { Clock, ShoppingCart, Tag, ArrowRight } from 'lucide-react';

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
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 12
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

  // Animated badge components
  const AnimatedDiscountBadge = ({ percentage }: { percentage: number }) => (
    <div
      className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold px-3 py-1.5 rounded-md overflow-hidden relative"
    >
      <Tag className="w-3 h-3 mr-1" />
      <span>{percentage}% OFF</span>
    </div>
  );

  return (
    <section id="deals" className="py-16 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full"
        style={{ filter: "blur(80px)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-secondary opacity-5 rounded-full"
        style={{ filter: "blur(70px)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05],
          y: [0, 30, 0]
        }}
        transition={{ duration: 10, delay: 5, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.2
              }}
              className="bg-slate-900 text-white px-4 py-1.5 rounded-full mb-4"
            >
              <span className="flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Limited Time Deals
              </span>
            </motion.div>

            <h2 className="text-3xl font-montserrat font-bold relative inline-block">
              Special Offers
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full"
                initial={{ width: 0, left: "50%" }}
                whileInView={{ width: "100%", left: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </h2>
          </div>
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
            const savingAmount = (parseFloat(offer.originalPrice.toString()) - parseFloat(offer.price.toString())).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });

            return (
              <motion.div
                key={offer.id}
                className="bg-slate-900 rounded-xl overflow-hidden shadow-xl perspective-1000"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
                  transition: { duration: 0 }
                }}
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-1/2 p-8 flex flex-col justify-between relative overflow-hidden">
                    {/* Subtle gradient background */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        background: "radial-gradient(circle at top right, rgba(79, 70, 229, 0.4) 0%, transparent 70%)"
                      }}
                    />

                    {/* Content */}
                    <div>
                      {/* Timer with animated ring */}
                      {timeRemaining && (
                        <div className="flex items-center text-gray-400 text-sm mb-4">
                          <div className="relative mr-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                              <motion.circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke="#4F46E5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: "63 63", strokeDashoffset: 63 }}
                                animate={{ strokeDashoffset: 0 }}
                                transition={{
                                  duration: 2,
                                  ease: "easeInOut",
                                  repeat: Infinity,
                                  repeatType: "loop"
                                }}
                              />
                            </svg>
                            <Clock className="w-3 h-3 absolute inset-0 m-auto text-gray-300" />
                          </div>
                          <span className="font-medium">
                            {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m left
                          </span>
                        </div>
                      )}

                      <h3 className="text-white text-2xl font-bold mb-3 transition-none">
                        {offer.title}
                      </h3>

                      <p className="text-gray-300 mb-6">
                        {offer.description}
                      </p>

                      <div className="mb-6">
                        {/* Price with animated save badge */}
                        <div className="flex items-center mb-3">
                          <span className="text-white text-3xl font-bold">
                            ${formatPrice(offer.price.toString())}
                          </span>
                          <span className="ml-3 text-gray-400 line-through">
                            ${formatPrice(offer.originalPrice.toString())}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <AnimatedDiscountBadge percentage={discountPercentage} />
                          <motion.div
                            className="text-white text-sm bg-primary/20 px-3 py-1.5 rounded-md"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0 }}
                          >
                            Save ${savingAmount}
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Shop Now Button with animations */}
                    <motion.a
                      href={`/product/${offer.id}`}
                      className="relative inline-flex items-center justify-center bg-white hover:bg-gray-50 text-slate-900 font-bold px-8 py-3 rounded-full text-center overflow-hidden group"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0 }}
                    >
                      <motion.span
                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20"
                        style={{ transitionProperty: 'opacity', transitionDuration: '0s' }}
                      />
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" style={{ transitionProperty: 'opacity', transitionDuration: '0s' }} />
                    </motion.a>
                  </div>

                  <div className="w-full md:w-1/2 relative h-64 md:h-auto">
                    {/* Remove gradient overlay hover effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-30"
                    />

                    {/* Remove image hover scale effect */}
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Floating discount bubble */}
                    <div
                      className="absolute top-4 right-4 bg-slate-900 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg"
                    >
                      <span className="mr-1">{discountPercentage}%</span>
                      <span className="text-primary">OFF</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View all button with animation */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href="/special-offers"
            className="inline-flex items-center text-primary font-medium hover:text-primary-dark group"
            whileHover={{ x: 5 }}
          >
            View all special offers
            <motion.span
              className="inline-flex ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
