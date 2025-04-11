import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { 
  ChevronLeft, 
  Star, 
  Truck, 
  ShieldCheck, 
  PlusCircle, 
  MinusCircle,
  Heart,
  Share2,
  Check,
  Smartphone,
  Cpu,
  Battery,
  Camera,
  Milestone
} from 'lucide-react';
import { Product } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

export default function ProductDetail() {
  const [_, params] = useRoute('/product/:id');
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Fetch product data
  const { data: products, isLoading, error } = useQuery<Product[]>({ 
    queryKey: ['/api/products'],
  });
  
  // Find the specific product in the data
  const product = products?.find(p => p.id === productId);
  
  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [productId]);
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setShowAddedAnimation(true);
      
      setTimeout(() => {
        setShowAddedAnimation(false);
      }, 2000);
    }
  };
  
  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: product ? `${product.name} has been added to your wishlist` : "Product added to wishlist",
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-slate-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Link href="/">
          <a className="inline-flex items-center text-primary font-medium hover:underline">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </a>
        </Link>
      </div>
    );
  }
  
  // Generate product images array (using main image and placeholders for demo)
  const productImages = [
    product.imageUrl,
    `https://picsum.photos/seed/${product.id}-1/600/600`,
    `https://picsum.photos/seed/${product.id}-2/600/600`,
    `https://picsum.photos/seed/${product.id}-3/600/600`,
  ];
  
  // Generate dummy reviews
  const reviews = [
    { id: 1, author: "Alex Johnson", rating: 5, date: "2 weeks ago", comment: "Excellent product! It exceeded all my expectations. The battery life is incredible and the camera quality is outstanding." },
    { id: 2, author: "Samantha Lee", rating: 4, date: "1 month ago", comment: "Great value for the price. The features are impressive, though the UI could use some improvements." },
    { id: 3, author: "Michael Chen", rating: 5, date: "2 months ago", comment: "This is exactly what I was looking for. Fast performance and beautiful design. Highly recommended!" },
  ];
  
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Format price with commas
  const formattedPrice = parseFloat(product.price).toLocaleString();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Back navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <a className="inline-flex items-center text-slate-600 hover:text-primary transition-colors">
              <ChevronLeft className="mr-1 h-5 w-5" />
              Back to Shopping
            </a>
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Product Images */}
          <div className="p-6">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-slate-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={productImages[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {/* Added to cart animation overlay */}
              <AnimatePresence>
                {showAddedAnimation && (
                  <motion.div
                    className="absolute inset-0 bg-black/60 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white rounded-full p-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="h-16 w-16 text-green-500" />
                    </motion.div>
                    <motion.p 
                      className="absolute bottom-8 text-white font-medium text-xl"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Added to Cart!
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Thumbnail images */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, index) => (
                <motion.button
                  key={index}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    index === activeImage ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} alt={`Product view ${index + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="p-6 flex flex-col">
            <div className="flex-1">
              {/* Category */}
              <div className="mb-2">
                <span className="text-primary text-sm font-medium uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              
              {/* Product name */}
              <motion.h1 
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {product.name}
              </motion.h1>
              
              {/* Ratings */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= averageRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-slate-600">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">${formattedPrice}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-slate-500 line-through">
                      ${parseFloat(product.originalPrice).toLocaleString()}
                    </span>
                  )}
                </div>
                
                {product.originalPrice && (
                  <div className="mt-1">
                    <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2 py-0.5 rounded">
                      Save ${(parseFloat(product.originalPrice) - parseFloat(product.price)).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Short description */}
              <div className="mb-6">
                <p className="text-slate-600">{product.description}</p>
              </div>
              
              {/* Key features */}
              <div className="mb-8 grid grid-cols-2 gap-3">
                <div className="flex items-start">
                  <Smartphone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">6.7" Display</p>
                    <p className="text-sm text-slate-500">Super Retina XDR</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Cpu className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">A16 Bionic Chip</p>
                    <p className="text-sm text-slate-500">Fastest processor</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Battery className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">All-day battery</p>
                    <p className="text-sm text-slate-500">Up to 29 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Camera className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">48MP Camera</p>
                    <p className="text-sm text-slate-500">Pro-level photos</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add to cart section */}
            <div className="mt-auto">
              <div className="border-t pt-6">
                {/* Quantity selector */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-medium">Quantity</span>
                  <div className="flex items-center">
                    <motion.button
                      className="p-1 rounded-full hover:bg-slate-100"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MinusCircle className="h-6 w-6 text-slate-600" />
                    </motion.button>
                    <span className="mx-4 font-medium text-lg w-6 text-center">{quantity}</span>
                    <motion.button
                      className="p-1 rounded-full hover:bg-slate-100"
                      onClick={incrementQuantity}
                      whileTap={{ scale: 0.9 }}
                    >
                      <PlusCircle className="h-6 w-6 text-slate-600" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Delivery & returns info */}
                <div className="mb-6 flex flex-col gap-2">
                  <div className="flex items-center text-slate-600">
                    <Truck className="h-4 w-4 mr-2" />
                    <span className="text-sm">Free delivery available</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    <span className="text-sm">30-day money-back guarantee</span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart
                  </motion.button>
                  
                  <div className="flex gap-2">
                    <motion.button
                      className="bg-slate-100 hover:bg-slate-200 p-3 rounded-lg flex items-center justify-center"
                      onClick={handleAddToWishlist}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Add to wishlist"
                    >
                      <Heart className="h-6 w-6" />
                    </motion.button>
                    
                    <motion.button
                      className="bg-slate-100 hover:bg-slate-200 p-3 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Share product"
                    >
                      <Share2 className="h-6 w-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product tabs */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-4 font-medium transition-colors relative ${
                    activeTab === tab
                      ? 'text-primary'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                <p className="text-slate-600 mb-4">
                  {product.description}
                </p>
                <p className="text-slate-600 mb-4">
                  Experience next-level performance with the {product.name}. Designed for those who demand the best, this device combines cutting-edge technology with elegant design to deliver an unparalleled user experience.
                </p>
                <p className="text-slate-600">
                  The stunning display brings your content to life with vibrant colors and sharp details. Powered by the latest processor, it handles even the most demanding tasks with ease. The advanced camera system lets you capture professional-quality photos and videos in any lighting condition.
                </p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2 text-lg">General</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Brand</td>
                          <td className="py-2 font-medium">TechTreasure</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Model</td>
                          <td className="py-2 font-medium">{product.name}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Release Date</td>
                          <td className="py-2 font-medium">September 2023</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Dimensions</td>
                          <td className="py-2 font-medium">160.7 x 77.6 x 7.85 mm</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-600">Weight</td>
                          <td className="py-2 font-medium">240g</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-lg">Display</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Type</td>
                          <td className="py-2 font-medium">Super Retina XDR OLED</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Size</td>
                          <td className="py-2 font-medium">6.7 inches</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Resolution</td>
                          <td className="py-2 font-medium">2796 x 1290 pixels</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Protection</td>
                          <td className="py-2 font-medium">Ceramic Shield</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-600">Features</td>
                          <td className="py-2 font-medium">HDR10, 120Hz refresh rate</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-lg">Performance</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Chipset</td>
                          <td className="py-2 font-medium">A16 Bionic</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">CPU</td>
                          <td className="py-2 font-medium">6-core CPU (2 performance, 4 efficiency)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">GPU</td>
                          <td className="py-2 font-medium">5-core GPU</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-600">RAM</td>
                          <td className="py-2 font-medium">8GB</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-lg">Camera</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Main Camera</td>
                          <td className="py-2 font-medium">48MP, f/1.8, OIS</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Ultra Wide</td>
                          <td className="py-2 font-medium">12MP, f/2.2, 120° FOV</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Telephoto</td>
                          <td className="py-2 font-medium">12MP, f/2.8, 3x optical zoom</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-600">Front Camera</td>
                          <td className="py-2 font-medium">12MP, f/1.9, autofocus</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Customer Reviews</h2>
                  <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Write a Review
                  </button>
                </div>
                
                <div className="mb-8 flex items-center justify-between pb-6 border-b">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= averageRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">{reviews.length} reviews</div>
                    </div>
                    
                    <div className="flex-1 max-w-xs">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = (count / reviews.length) * 100;
                        
                        return (
                          <div key={rating} className="flex items-center mb-1">
                            <div className="flex items-center w-8">
                              <span className="text-sm text-slate-600">{rating}</span>
                              <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="w-32 h-2 ml-2 bg-slate-200 rounded">
                              <div
                                className="h-2 bg-yellow-400 rounded"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-500 ml-2">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <motion.div 
                      key={review.id} 
                      className="border-b pb-6 last:border-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{review.author}</h3>
                        <span className="text-slate-500 text-sm">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-slate-600">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products?.filter(p => p.id !== productId).slice(0, 4).map((relatedProduct) => (
              <Link href={`/product/${relatedProduct.id}`} key={relatedProduct.id}>
                <motion.div 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    // Force a page reload with the new product
                    setTimeout(() => {
                      window.scrollTo(0, 0);
                    }, 100);
                  }}
                >
                  <div className="aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1 truncate">{relatedProduct.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = relatedProduct.rating ? parseFloat(relatedProduct.rating.toString()) : 4;
                          return (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="ml-1 text-xs text-slate-500">
                        ({relatedProduct.reviewCount || 0})
                      </span>
                    </div>
                    <div className="font-bold">${parseFloat(relatedProduct.price).toLocaleString()}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}