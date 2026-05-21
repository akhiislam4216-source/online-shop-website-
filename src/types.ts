export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  ratingCount: number;
  stock: number;
  category: string;
  images: string[];
  specifications: Record<string, string>;
  reviews: Review[];
  featured?: boolean;
  trending?: boolean;
  flashSale?: boolean;
  flashSaleEndsAt?: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  bannerImage: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billingDetails: {
    fullName: string;
    email: string;
  };
  paymentMethod: string;
  status: 'pending' | 'shipping' | 'delivered';
  date: string;
  trackingNumber: string;
}

export interface UserProf {
  id: string;
  email: string;
  name: string;
  avatar: string;
  address?: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  wishlist: string[]; // List of product IDs
  orders: Order[];
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
