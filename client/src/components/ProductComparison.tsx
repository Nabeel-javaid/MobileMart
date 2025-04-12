import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ChevronDown, ExternalLink, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Retailer {
    name: string;
    price: number;
    rating: number;
    inStock: boolean;
    delivery: string;
    warranty: string;
    promotion: string;
}

interface ComparisonData {
    retailers: Retailer[];
}

interface ProductComparisonProps {
    productId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductComparison({ productId, isOpen, onClose }: ProductComparisonProps) {
    const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            // Load comparison data from our JSON file
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    // In a real app, this would be an API call
                    // For demo purposes, we're importing the JSON directly
                    const response = await import('@/data/product-comparisons.json');
                    const data = response.default;
                    setComparisonData(data[productId.toString() as keyof typeof data]);
                } catch (error) {
                    console.error('Error loading comparison data:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [productId, isOpen]);

    // No need to render if not open
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-xl overflow-hidden w-full max-w-4xl max-h-[80vh] flex flex-col"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                            <h2 className="text-xl font-bold">Price Comparison</h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                                aria-label="Close comparison"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-auto p-4 flex-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : comparisonData ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-3 bg-slate-50 font-medium sticky left-0 z-10">Retailer</th>
                                                {comparisonData.retailers.map((retailer, index) => (
                                                    <th key={index} className="p-3 text-center min-w-[180px]">
                                                        <div className="font-bold text-lg mb-1">{retailer.name}</div>
                                                        <div className="flex items-center justify-center">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${i < Math.floor(retailer.rating)
                                                                            ? 'text-yellow-400 fill-yellow-400'
                                                                            : i + 0.5 <= retailer.rating
                                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                                : 'text-slate-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                            <span className="ml-1 text-sm text-slate-600">{retailer.rating}</span>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-3 font-medium bg-slate-50 sticky left-0 z-10">Price</td>
                                                {comparisonData.retailers.map((retailer, index) => (
                                                    <td key={index} className="p-3 text-center">
                                                        <div className="text-xl font-bold text-primary">${retailer.price.toFixed(2)}</div>
                                                        {index > 0 && (
                                                            <div className="text-sm text-slate-500 mt-1">
                                                                {retailer.price > comparisonData.retailers[0].price
                                                                    ? `$${(retailer.price - comparisonData.retailers[0].price).toFixed(2)} more`
                                                                    : retailer.price < comparisonData.retailers[0].price
                                                                        ? `$${(comparisonData.retailers[0].price - retailer.price).toFixed(2)} less`
                                                                        : 'Same price'}
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 font-medium bg-slate-50 sticky left-0 z-10">Availability</td>
                                                {comparisonData.retailers.map((retailer, index) => (
                                                    <td key={index} className="p-3 text-center">
                                                        {retailer.inStock ? (
                                                            <Badge variant="success" className="px-2 py-0.5">In Stock</Badge>
                                                        ) : (
                                                            <Badge variant="destructive" className="px-2 py-0.5">Out of Stock</Badge>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 font-medium bg-slate-50 sticky left-0 z-10">Delivery</td>
                                                {comparisonData.retailers.map((retailer, index) => (
                                                    <td key={index} className="p-3 text-center">
                                                        {retailer.delivery}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 font-medium bg-slate-50 sticky left-0 z-10">Warranty</td>
                                                {comparisonData.retailers.map((retailer, index) => (
                                                    <td key={index} className="p-3 text-center">
                                                        {retailer.warranty}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 font-medium bg-slate-50 sticky left-0 z-10">Special Offer</td>
                                                {comparisonData.retailers.map((retailer, index) => (
                                                    <td key={index} className="p-3 text-center">
                                                        <div className="text-primary font-medium">{retailer.promotion}</div>
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="p-3 font-medium bg-slate-50 sticky left-0 z-10">Action</td>
                                                {comparisonData.retailers.map((retailer, index) => (
                                                    <td key={index} className="p-3 text-center">
                                                        {index === 0 ? (
                                                            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center">
                                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                                Add to Cart
                                                            </button>
                                                        ) : (
                                                            <a href="/" className="text-primary hover:underline text-sm font-medium inline-flex items-center">
                                                                Visit Store <ExternalLink className="h-3 w-3 ml-1" />
                                                            </a>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center p-10 text-slate-500">
                                    No comparison data available for this product.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t bg-slate-50 text-center text-sm text-slate-500">
                            Price and availability information last updated today. Prices may vary by location and are subject to change.
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 