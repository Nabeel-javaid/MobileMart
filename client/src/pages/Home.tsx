import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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

// Loader component
const Loader = () => (
    <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
    </div>
);

export default function Home() {
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
        <div className="font-inter text-slate-800 overflow-x-hidden">
            <Navbar />

            <main>
                <HeroSlider slides={Array.isArray(heroSlides) ? heroSlides : []} />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CategoryNav />
                </motion.div>

                {featuredProduct && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <FeaturedProduct product={featuredProduct} />
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <MobileProductsSection products={mobileProducts} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <LaptopProductsSection products={laptopProducts} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <PromoBanner />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <AccessoriesSection accessories={accessories} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <SpecialOffersSection offers={specialOffers || []} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    {/* <NewsletterSection /> */}
                </motion.div>
            </main>

            <Footer />
            <BackToTop />
        </div>
    );
}