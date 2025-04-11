import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertSpecialOfferSchema, insertSubscriberSchema } from "@shared/schema";
import { json } from "express";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sample data for hero slider
  const heroSlides = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Next-Gen Tech",
      description: "Discover the latest in mobile and laptop technology with deals you won't find anywhere else.",
      primaryButtonText: "Shop Mobiles",
      primaryButtonLink: "#mobile",
      secondaryButtonText: "Shop Laptops",
      secondaryButtonLink: "#laptop"
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1551651653-c5186a1fbba2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Premium Devices",
      description: "Experience excellence with our range of premium laptops engineered for performance.",
      primaryButtonText: "Explore Laptops",
      primaryButtonLink: "#laptop",
      secondaryButtonText: "Special Offers",
      secondaryButtonLink: "#special-offers",
      primaryButtonColor: "secondary"
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
      title: "Smart Connectivity",
      description: "Stay connected with cutting-edge smartphones that enhance your digital lifestyle.",
      primaryButtonText: "Browse Smartphones",
      primaryButtonLink: "#mobile",
      secondaryButtonText: "View Accessories",
      secondaryButtonLink: "#accessories",
      primaryButtonColor: "accent"
    }
  ];

  // Initialize product data
  await initializeProducts();
  await initializeSpecialOffers();

  // API routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/special-offers", async (req, res) => {
    try {
      const offers = await storage.getAllSpecialOffers();
      res.json(offers);
    } catch (error) {
      console.error("Error fetching special offers:", error);
      res.status(500).json({ message: "Failed to fetch special offers" });
    }
  });

  app.get("/api/hero-slides", (req, res) => {
    res.json(heroSlides);
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      const now = new Date().toISOString();
      
      const subscriber = await storage.createSubscriber({
        ...data,
        subscribedAt: now
      });
      
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating subscriber:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize product data
async function initializeProducts() {
  // Check if we already have products
  const existingProducts = await storage.getAllProducts();
  if (existingProducts.length > 0) {
    return;
  }

  // Mobile products
  const mobileProducts = [
    {
      name: "UltraPhone X23",
      description: "6.7\" AMOLED Display, 8GB RAM, 256GB Storage",
      category: "mobile",
      price: "799",
      imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["processor:Quantum Processor", "camera:108MP Camera", "battery:5000mAh Battery", "storage:256GB Storage"],
      rating: "4.5",
      reviewCount: 42,
      badge: "New",
      isNew: true,
      stockCount: 50
    },
    {
      name: "Galaxy S23",
      description: "6.5\" Dynamic AMOLED, 12GB RAM, 512GB Storage",
      category: "mobile",
      price: "849",
      originalPrice: "999",
      imageUrl: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["processor:Exynos 2200", "camera:50MP Camera", "battery:4500mAh Battery", "storage:512GB Storage"],
      rating: "4.0",
      reviewCount: 38,
      badge: "-15%",
      stockCount: 35
    },
    {
      name: "Pixel 7 Pro",
      description: "6.3\" OLED Display, 12GB RAM, 128GB Storage",
      category: "mobile",
      price: "749",
      imageUrl: "https://images.unsplash.com/photo-1550367083-9fa5411cb8af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["processor:Google Tensor", "camera:48MP Camera", "battery:4700mAh Battery", "storage:128GB Storage"],
      rating: "5.0",
      reviewCount: 52,
      stockCount: 20
    },
    {
      name: "iPhoneXS",
      description: "6.1\" Super Retina XDR, 6GB RAM, 256GB Storage",
      category: "mobile",
      price: "899",
      imageUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["processor:A15 Bionic", "camera:12MP Camera", "battery:3200mAh Battery", "storage:256GB Storage"],
      rating: "4.5",
      reviewCount: 128,
      badge: "Top Rated",
      stockCount: 45
    }
  ];

  // Laptop products
  const laptopProducts = [
    {
      name: "MacBook Pro M2",
      description: "14\" Retina Display, 16GB RAM, 512GB SSD",
      category: "laptop",
      price: "1999",
      imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["processor:M2 Pro", "memory:16GB RAM", "storage:512GB SSD", "display:14\" Retina"],
      rating: "5.0",
      reviewCount: 74,
      badge: "New",
      isNew: true,
      stockCount: 25
    },
    {
      name: "Dell XPS 15",
      description: "15.6\" 4K UHD, 32GB RAM, 1TB SSD, RTX 3050",
      category: "laptop",
      price: "1599",
      originalPrice: "1999",
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["processor:Intel i9", "memory:32GB RAM", "storage:1TB SSD", "gpu:RTX 3050"],
      rating: "4.5",
      reviewCount: 56,
      badge: "-20%",
      stockCount: 15
    },
    {
      name: "HP Spectre x360",
      description: "13.5\" OLED Touch, 16GB RAM, 1TB SSD",
      category: "laptop",
      price: "1349",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["processor:Intel i7", "memory:16GB RAM", "storage:1TB SSD", "display:13.5\" OLED Touch"],
      rating: "4.0",
      reviewCount: 41,
      badge: "Best Seller",
      stockCount: 18
    }
  ];

  // Accessory products
  const accessoryProducts = [
    {
      name: "Wireless Earbuds Pro",
      description: "Noise cancellation, 24h battery life",
      category: "accessory",
      price: "129",
      imageUrl: "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["noise-cancellation:Active", "battery:24h", "waterproof:IPX4"],
      rating: "4.3",
      reviewCount: 87,
      stockCount: 120
    },
    {
      name: "SmartWatch X1",
      description: "Health tracking, GPS, 7-day battery",
      category: "accessory",
      price: "199",
      imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["battery:7 days", "gps:Built-in", "waterproof:50m"],
      rating: "4.7",
      reviewCount: 65,
      stockCount: 30
    },
    {
      name: "Fast Wireless Charger",
      description: "15W Qi charging, compatible with all devices",
      category: "accessory",
      price: "49",
      imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["power:15W", "compatibility:Universal", "type:Qi Standard"],
      rating: "4.2",
      reviewCount: 129,
      stockCount: 200
    },
    {
      name: "Pro Laptop Backpack",
      description: "Water-resistant, anti-theft, USB charging port",
      category: "accessory",
      price: "89",
      imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["material:Water-resistant", "security:Anti-theft", "charging:USB Port"],
      rating: "4.8",
      reviewCount: 204,
      stockCount: 75
    }
  ];

  // Featured product
  const featuredProduct = {
    name: "UltraPhone X23 Pro",
    description: "Experience next-level photography and performance with our flagship smartphone featuring a revolutionary camera system and the fastest processor yet.",
    category: "mobile",
    price: "999",
    originalPrice: "1099",
    imageUrl: "https://images.unsplash.com/photo-1600541519467-937869997e34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    features: ["processor:Quantum Processor", "camera:108MP Camera", "battery:5000mAh Battery", "storage:12GB RAM"],
    rating: "4.9",
    reviewCount: 156,
    badge: "New Arrival",
    isNew: true,
    isFeatured: true,
    stockCount: 10
  };

  // Add all products to storage
  try {
    // Validate and insert the products
    for (const product of [...mobileProducts, ...laptopProducts, ...accessoryProducts, featuredProduct]) {
      const validatedProduct = insertProductSchema.parse(product);
      await storage.createProduct(validatedProduct);
    }
    console.log("Products initialized successfully");
  } catch (error) {
    console.error("Error initializing products:", error);
  }
}

// Initialize special offers
async function initializeSpecialOffers() {
  // Check if we already have special offers
  const existingOffers = await storage.getAllSpecialOffers();
  if (existingOffers.length > 0) {
    return;
  }

  const specialOffers = [
    {
      title: "UltraPhone X23 Pro + Wireless Earbuds",
      description: "Get our flagship smartphone bundled with wireless earbuds at a special price.",
      price: "1099",
      originalPrice: "1228",
      imageUrl: "https://images.unsplash.com/photo-1606041011872-596597976b25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      badge: "Deal of the Day",
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
    },
    {
      title: "Dell XPS 15 + Backpack",
      description: "Premium laptop bundled with a pro backpack for the ultimate portable setup.",
      price: "1649",
      originalPrice: "2088",
      imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      badge: "Flash Sale",
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days from now
    }
  ];

  try {
    // Validate and insert the special offers
    for (const offer of specialOffers) {
      const validatedOffer = insertSpecialOfferSchema.parse(offer);
      await storage.createSpecialOffer(validatedOffer);
    }
    console.log("Special offers initialized successfully");
  } catch (error) {
    console.error("Error initializing special offers:", error);
  }
}
