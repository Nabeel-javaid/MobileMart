import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import type { Product, SpecialOffer } from "@shared/schema";

// Components
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import CategoryNav from "@/components/CategoryNav";
import FeaturedProduct from "@/components/FeaturedProduct";
import MobileProductsSection from "@/components/MobileProductsSection";
import PromoBanner from "@/components/PromoBanner";
import LaptopProductsSection from "@/components/LaptopProductsSection";
import AccessoriesSection from "@/components/AccessoriesSection";
import SpecialOffersSection from "@/components/SpecialOffersSection";
// import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

// Loader component with enhanced animation
const Loader = () => (
    <motion.div
        className="fixed top-0 left-0 w-full h-full bg-white flex flex-col justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
            className="mt-4 text-slate-600 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            Loading amazing tech...
        </motion.p>
    </motion.div>
);

// Floating decoration component
interface FloatingDecorationProps {
    delay?: number;
    size?: number;
    color?: string;
    left?: string;
    top?: string;
    bottom?: string;
    right?: string;
}

const FloatingDecoration = ({
    delay = 0,
    size = 100,
    color = "primary",
    left,
    top,
    bottom,
    right
}: FloatingDecorationProps) => (
    <motion.div
        className={`absolute rounded-full bg-${color} opacity-10 -z-10`}
        style={{
            width: size,
            height: size,
            left: left,
            top: top,
            bottom: bottom,
            right: right
        }}
        animate={{
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
            duration: 5,
            delay: delay,
            repeat: Infinity,
            repeatType: "reverse"
        }}
    />
);

// Section divider with animated wave
const SectionDivider = ({ flip = false }) => (
    <div className={`relative w-full h-16 overflow-hidden ${flip ? 'transform rotate-180' : ''}`}>
        <svg className="absolute w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <motion.path
                d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 C1150,100 1350,0 1440,50 L1440,100 L0,100 Z"
                fill="currentColor"
                className="text-white"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{
                    duration: 1,
                    ease: "easeOut"
                }}
            />
        </svg>
    </div>
);

export default function Home() {
    // Reference for scroll progress
    const ref = useRef(null);

    // Scroll progress animation
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        damping: 30,
        stiffness: 100
    });

    // Page transition animation state
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsPageLoaded(true);
        }, 300);
    }, []);

    // Fetch all products
    const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
        queryKey: ['/api/products'],
        staleTime: 60000, // 1 minute
    });

    // Fetch special offers
    const { data: specialOffers, isLoading: offersLoading } = useQuery<SpecialOffer[]>({
        queryKey: ['/api/special-offers'],
        staleTime: 60000, // 1 minute
    });

    // Check if hero slides are loaded
    const { data: heroSlides, isLoading: slidesLoading } = useQuery({
        queryKey: ['/api/hero-slides'],
        staleTime: 60000, // 1 minute
    });

    // Scroll to anchor smoothly
    useEffect(() => {
        const handleHashChange = () => {
            const id = window.location.hash.replace('#', '');
            if (id) {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        // Handle initial hash on load
        if (window.location.hash) {
            setTimeout(handleHashChange, 500);
        }

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Filter products by category
    const mobileProducts = Array.isArray(products)
        ? products.filter((product) => product.category === 'mobile')
        : [];
    const laptopProducts = Array.isArray(products)
        ? products.filter((product) => product.category === 'laptop')
        : [];
    const accessories = Array.isArray(products)
        ? products.filter((product) => product.category === 'accessory')
        : [];
    const featuredProduct = Array.isArray(products)
        ? products.find((product) => product.isFeatured === true)
        : null;

    const isLoading = productsLoading || offersLoading || slidesLoading;

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="font-inter text-slate-800 overflow-x-hidden relative" ref={ref}>
            {/* Scroll progress indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
                style={{ scaleX: smoothProgress }}
            />

            {/* Background decorative elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <FloatingDecoration size={300} left="5%" top="20%" color="primary" delay={0} />
                <FloatingDecoration size={200} right="10%" top="40%" color="secondary" delay={1.5} />
                <FloatingDecoration size={250} left="15%" bottom="15%" color="accent" delay={3} />
                <FloatingDecoration size={180} right="5%" bottom="30%" color="primary" delay={4.5} />
            </div>

            {/* Page fade-in animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isPageLoaded ? 1 : 0,
                    y: isPageLoaded ? 0 : 20
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Navbar />

                <main>
                    <HeroSlider slides={Array.isArray(heroSlides) ? heroSlides : []} />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 0.7,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                    >
                        <CategoryNav />
                    </motion.div>

                    {featuredProduct && (
                        <>
                            <SectionDivider />
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.25, 0.1, 0.25, 1]
                                }}
                            >
                                <FeaturedProduct product={featuredProduct} />
                            </motion.div>
                        </>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 0.8,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                    >
                        <MobileProductsSection products={mobileProducts} />
                    </motion.div>

                    <SectionDivider flip={true} />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 0.8,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                    >
                        <LaptopProductsSection products={laptopProducts} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 0.8,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                    >
                        <PromoBanner />
                    </motion.div>

                    <SectionDivider />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 0.8,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                    >
                        <AccessoriesSection accessories={accessories} />
                    </motion.div>

                    <SectionDivider flip={true} />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 0.8,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                    >
                        <SpecialOffersSection offers={specialOffers || []} />
                    </motion.div>
                </main>

                <Footer />
                <BackToTop />
            </motion.div>
        </div>
    );
}