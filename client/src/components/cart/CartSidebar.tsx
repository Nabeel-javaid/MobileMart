import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartSidebar() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    isCartOpen, 
    toggleCart 
  } = useCart();

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
            />
            
            {/* Cart Sidebar */}
            <motion.div 
              className="fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-xl z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="p-6 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-montserrat font-semibold">Your Cart</h2>
                  <span className="text-sm px-2 py-1 bg-slate-100 rounded-full">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <button 
                  onClick={toggleCart}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Cart Items */}
              {cartItems.length > 0 ? (
                <div className="flex-1 overflow-y-auto py-4 px-6">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id}
                        className="flex py-4 border-b"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium">{item.name}</h3>
                            <motion.button 
                              className="text-slate-400 hover:text-red-500 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id)}
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                          
                          <p className="text-sm text-slate-500 mt-1">${parseFloat(item.price.toString()).toFixed(2)}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border rounded-full">
                              <motion.button 
                                className="px-2 py-1 hover:bg-slate-100 transition-colors rounded-l-full"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity === 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </motion.button>
                              
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              
                              <motion.button 
                                className="px-2 py-1 hover:bg-slate-100 transition-colors rounded-r-full"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </motion.button>
                            </div>
                            
                            <p className="font-medium text-primary">
                              ${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <ShoppingCart className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">Your cart is empty</h3>
                  <p className="text-slate-500 text-center mb-6 max-w-xs">
                    Looks like you haven't added any products to your cart yet.
                  </p>
                  <motion.button 
                    className="inline-flex items-center text-primary font-medium hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleCart}
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              )}
              
              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <motion.button 
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Checkout <ArrowRight className="h-4 w-4" />
                  </motion.button>
                  
                  <button 
                    className="w-full text-center text-slate-600 mt-4 hover:text-primary transition-colors"
                    onClick={toggleCart}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}