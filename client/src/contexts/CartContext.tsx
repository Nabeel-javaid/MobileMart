import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
  isCartOpen: false,
  toggleCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Cart keys are user-specific, using unique keys for each user
  const getCartKey = () => {
    return user ? `cart_${user.uid}` : 'cart_guest';
  };
  
  // Load cart from localStorage on initial render or when user changes
  useEffect(() => {
    const loadCart = () => {
      const cartKey = getCartKey();
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          setCartItems([]);
        }
      } else {
        // Clear cart if no saved cart exists for this user
        setCartItems([]);
      }
    };
    
    loadCart();
  }, [user]); // Re-run when user changes
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, user]);
  
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      // Check if the product is already in the cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If it exists, increase the quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Otherwise, add the new product to the cart
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Item added to cart",
      description: `${product.name} has been added to your cart`,
    });
    
    // Open the cart when a product is added
    setIsCartOpen(true);
  };
  
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  // Calculate cart count and total
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + (parseFloat(item.price) * item.quantity), 
    0
  );
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isCartOpen,
    toggleCart,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;