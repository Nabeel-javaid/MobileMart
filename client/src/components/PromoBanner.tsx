import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 12,
    minutes: 45,
    seconds: 30
  });
  
  // Set countdown end date to 3 days from now
  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full transform -translate-x-1/3 translate-y-1/3"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{
            duration: 5,
            delay: 2.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Summer Tech Sale!
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-blue-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get up to 40% off on select devices and accessories. Limited time offer!
          </motion.p>
          
          <motion.div 
            className="flex justify-center space-x-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-3xl font-montserrat font-bold">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-blue-200 text-sm">Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-montserrat font-bold">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-blue-200 text-sm">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-montserrat font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-blue-200 text-sm">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-montserrat font-bold">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-blue-200 text-sm">Seconds</div>
            </div>
          </motion.div>
          
          <motion.a 
            href="#deals" 
            className="inline-block bg-white text-primary font-medium px-8 py-3 rounded-full hover:bg-opacity-90 transition-colors shadow-lg hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            Shop the Sale
          </motion.a>
        </div>
      </div>
    </section>
  );
}
