import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  primaryButtonColor?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [isAnimating, slides.length]);

  const goToPrev = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [isAnimating, slides.length]);

  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
    }
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(goToNext, 7000); // Increased time for better user experience
    return () => clearTimeout(timer);
  }, [currentSlide, goToNext]);

  // Reset animation lock after transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 800); // Increased to match the longer animations
    return () => clearTimeout(timer);
  }, [currentSlide]);

  if (slides.length === 0) {
    return null;
  }
  
  // Enhanced animations
  const slideVariants = {
    enter: { opacity: 0, scale: 1.08, filter: 'brightness(0.8)' },
    center: { 
      opacity: 1, 
      scale: 1,
      filter: 'brightness(1)',
      transition: {
        opacity: { duration: 0.8, ease: "easeOut" },
        scale: { duration: 1.4, ease: "easeOut" },
        filter: { duration: 1.2 }
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.92,
      filter: 'brightness(0.8)',
      transition: { duration: 0.5 }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section className="relative h-[85vh] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Enhanced gradient overlay that won't fade text */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-slate-900/60"
                style={{
                  backdropFilter: 'brightness(0.9)',
                  WebkitBackdropFilter: 'brightness(0.9)',
                  mixBlendMode: 'multiply'
                }}
              >
                <motion.div 
                  className="absolute inset-0 opacity-50"
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  style={{
                    backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(0,0,0,0), rgba(0,0,0,0.4))',
                    backgroundSize: '150% 150%'
                  }}
                />
              </div>
              
              <div className="container mx-auto px-4 h-full flex items-center relative z-10">
                <motion.div 
                  className="max-w-xl text-white"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="relative">
                    <motion.span 
                      className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-10 h-2 bg-primary rounded-full"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 40, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    />
                    <motion.h2 
                      className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-4 pl-8 relative"
                      variants={itemVariants}
                    >
                      {slide.title}
                      
                      {/* Animated underline effect */}
                      <motion.span 
                        className="absolute bottom-0 left-8 h-1 bg-primary rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: "40%" }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                      />
                    </motion.h2>
                  </motion.div>
                  
                  <motion.p 
                    className="text-xl mb-8 text-white/90"
                    variants={itemVariants}
                  >
                    {slide.description}
                  </motion.p>
                  
                  <motion.div 
                    className="flex flex-wrap gap-4"
                    variants={itemVariants}
                  >
                    <motion.a 
                      href={slide.primaryButtonLink} 
                      className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center relative overflow-hidden shadow-lg group"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">{slide.primaryButtonText}</span>
                      <motion.span 
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ mixBlendMode: 'soft-light' }}
                      />
                    </motion.a>
                    
                    <motion.a 
                      href={slide.secondaryButtonLink} 
                      className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-slate-800 transition-all duration-300 shadow-lg"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.2)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {slide.secondaryButtonText}
                    </motion.a>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Animated overlay effects */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </motion.div>
          )
        ))}
      </AnimatePresence>
      
      {/* Stylish background pattern - add this */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-pattern" />
      
      {/* Enhanced slide indicators */}
      <motion.div 
        className="absolute bottom-10 left-0 right-0 flex justify-center space-x-5 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {slides.map((_, index) => (
          <motion.button
            key={index}
            className={`relative h-3 rounded-full transition-all duration-500 overflow-hidden ${
              index === currentSlide 
              ? 'bg-primary w-14 shadow-lg shadow-primary/30' 
              : 'bg-white/50 w-3 hover:bg-white/70'
            }`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <motion.span 
                className="absolute top-0 left-0 bottom-0 bg-white/30" 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 7, ease: "linear" }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
      
      {/* Enhanced navigation buttons */}
      <motion.button 
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-slate-800/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/10"
        onClick={goToPrev}
        aria-label="Previous slide"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ 
          scale: 1.1, 
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" 
        }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="h-6 w-6" />
      </motion.button>
      
      <motion.button 
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-slate-800/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/10"
        onClick={goToNext}
        aria-label="Next slide"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ 
          scale: 1.1, 
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" 
        }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="h-6 w-6" />
      </motion.button>
    </section>
  );
}
