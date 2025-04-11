import { 
  users, type User, type InsertUser,
  type Product, type InsertProduct,
  type SpecialOffer, type InsertSpecialOffer,
  type Subscriber, type InsertSubscriber
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Special Offer methods
  getAllSpecialOffers(): Promise<SpecialOffer[]>;
  getSpecialOffer(id: number): Promise<SpecialOffer | undefined>;
  createSpecialOffer(offer: InsertSpecialOffer): Promise<SpecialOffer>;
  
  // Subscriber methods
  getSubscriber(id: number): Promise<Subscriber | undefined>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber & { subscribedAt: string }): Promise<Subscriber>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private specialOffers: Map<number, SpecialOffer>;
  private subscribers: Map<number, Subscriber>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private offerIdCounter: number;
  private subscriberIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.specialOffers = new Map();
    this.subscribers = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.offerIdCounter = 1;
    this.subscriberIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  // Special Offer methods
  async getAllSpecialOffers(): Promise<SpecialOffer[]> {
    return Array.from(this.specialOffers.values());
  }
  
  async getSpecialOffer(id: number): Promise<SpecialOffer | undefined> {
    return this.specialOffers.get(id);
  }
  
  async createSpecialOffer(insertOffer: InsertSpecialOffer): Promise<SpecialOffer> {
    const id = this.offerIdCounter++;
    const offer: SpecialOffer = { ...insertOffer, id };
    this.specialOffers.set(id, offer);
    return offer;
  }
  
  // Subscriber methods
  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    return this.subscribers.get(id);
  }
  
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email
    );
  }
  
  async createSubscriber(insertSubscriber: InsertSubscriber & { subscribedAt: string }): Promise<Subscriber> {
    const id = this.subscriberIdCounter++;
    const subscriber: Subscriber = { ...insertSubscriber, id };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
}

export const storage = new MemStorage();
