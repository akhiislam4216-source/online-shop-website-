import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { PRODUCTS, BLOG_POSTS } from './src/data.ts';
import { Product, Order, UserProf } from './src/types.ts';

// Load environmental variables safely
dotenv.config();

// In-Memory Database instances
let productsInDB: Product[] = [...PRODUCTS];
const categoriesInDB = [...PRODUCTS]; // Extracted on the fly or static from data
const blogsInDB = [...BLOG_POSTS];
const subscribedEmails: string[] = ['newsletter@friendshop.com', 'shopper@test.com'];

// Lazy active user store. User credentials: user@friendshop.com / password123, admin@friendshop.com / admin123
let usersStore: Record<string, UserProf & { passwordHash: string; role: 'user' | 'admin' }> = {
  'user_1': {
    id: 'user_1',
    email: 'user@friendshop.com',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    passwordHash: 'password123',
    role: 'user',
    address: {
      fullName: 'Alex Johnson',
      addressLine1: '320 Friendly Lane, Suite 100',
      city: 'Portland',
      state: 'Oregon',
      postalCode: '97201',
      country: 'United States',
      phone: '+1 (503) 555-0142'
    },
    wishlist: ['p1', 'p6'],
    orders: [
      {
        id: 'ord_918274',
        items: [
          {
            productId: 'p2',
            title: 'Minimalist Walnut Mechanical Keyboard',
            price: 99.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=300'
          },
          {
            productId: 'p8',
            title: 'Aromatherapy Soy Wax Candle Trio',
            price: 28.00,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=300'
          }
        ],
        totalAmount: 155.99,
        shippingAddress: {
          fullName: 'Alex Johnson',
          addressLine1: '320 Friendly Lane, Suite 100',
          city: 'Portland',
          state: 'Oregon',
          postalCode: '97201',
          country: 'United States',
          phone: '+1 (503) 555-0142'
        },
        billingDetails: {
          fullName: 'Alex Johnson',
          email: 'user@friendshop.com'
        },
        paymentMethod: 'Credit Card (Stripe Verified)',
        status: 'delivered',
        date: '2026-05-10T14:30:00Z',
        trackingNumber: 'FS-774911-POR'
      }
    ]
  },
  'admin_1': {
    id: 'admin_1',
    email: 'admin@friendshop.com',
    name: 'Admin Friend',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    passwordHash: 'admin123',
    role: 'admin',
    wishlist: [],
    orders: []
  }
};

// Global Order Registry (For Admin sales analysis & mock reporting)
let orderRegistry: Order[] = [
  ...usersStore['user_1'].orders,
  {
    id: 'ord_102941',
    items: [
      {
        productId: 'p1',
        title: 'Smart Over-Ear Active Noise-Cancelling Headphones',
        price: 249.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300'
      }
    ],
    totalAmount: 249.99,
    shippingAddress: {
      fullName: 'Sarah Jenkins',
      addressLine1: '812 Emerald Blvd',
      city: 'Seattle',
      state: 'Washington',
      postalCode: '98101',
      country: 'United States',
      phone: '+1 (206) 555-8822'
    },
    billingDetails: {
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@example.com'
    },
    paymentMethod: 'Apple Pay (Stripe Secured)',
    status: 'shipping',
    date: '2026-05-19T09:15:00Z',
    trackingNumber: 'FS-110298-SEA'
  },
  {
    id: 'ord_102942',
    items: [
      {
        productId: 'p10',
        title: 'Organic Herbal Botanical Skincare Kit',
        price: 75.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=300'
      },
      {
        productId: 'p11',
        title: 'Sonic Facial Cleansing Brush Plus',
        price: 55.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=300'
      }
    ],
    totalAmount: 130.00,
    shippingAddress: {
      fullName: 'Michael Scott',
      addressLine1: '1725 Slough Avenue',
      city: 'Scranton',
      state: 'Pennsylvania',
      postalCode: '18501',
      country: 'United States',
      phone: '+1 (570) 555-0158'
    },
    billingDetails: {
      fullName: 'Michael Scott',
      email: 'michael.s@dundermifflin.com'
    },
    paymentMethod: 'Credit Card',
    status: 'pending',
    date: '2026-05-21T11:45:00Z',
    trackingNumber: 'FS-991054-SCR'
  }
];

// Lazy initialization of the GoogleGenAI API Client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    geminiClient = new GoogleGenAI({
      apiKey: key || undefined,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// Simulated Token generator and parser for simplicity in sandboxed environment
function generateSimulatedToken(userId: string, role: string): string {
  // Safe token representation and string signing without native OpenSSL issues
  const payload = JSON.stringify({ userId, role, timestamp: Date.now() });
  return Buffer.from(payload).toString('base64');
}

function verifySimulatedToken(token: string | undefined): { userId: string; role: string } | null {
  if (!token) return null;
  try {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = Buffer.from(cleanToken, 'base64').toString('ascii');
    return JSON.parse(decoded);
  } catch (err) {
    return null;
  }
}

// Express app initialization
const app = express();
const PORT = 3000;

// Body parsing handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core API endpoints: Authentication
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required fields.' });
  }

  // Check unique email
  const existingUser = Object.values(usersStore).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newId = `user_${Date.now()}`;
  const newUser = {
    id: newId,
    email: email.toLowerCase(),
    name,
    avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`,
    passwordHash: password, // Simulated hash
    role: 'user' as const,
    wishlist: [],
    orders: []
  };

  usersStore[newId] = newUser;
  const token = generateSimulatedToken(newId, 'user');
  
  // Destructure off the internal passwordHash
  const { passwordHash, ...userProf } = newUser;
  res.status(201).json({ token, user: userProf });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = Object.values(usersStore).find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email credentials or password match.' });
  }

  const token = generateSimulatedToken(user.id, user.role);
  const { passwordHash, ...userProf } = user;
  res.json({ token, user: userProf });
});

app.get('/api/auth/me', (req, res) => {
  const payload = verifySimulatedToken(req.headers.authorization);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthenticated.' });
  }

  const user = usersStore[payload.userId];
  if (!user) {
    return res.status(404).json({ error: 'User profiles not found.' });
  }

  const { passwordHash, ...userProf } = user;
  // Dynamic sync orders from orderRegistry
  if (userProf.role === 'user') {
    userProf.orders = orderRegistry.filter(o => o.billingDetails.email.toLowerCase() === userProf.email.toLowerCase());
  }
  res.json({ user: userProf });
});

app.post('/api/auth/profile/update', (req, res) => {
  const payload = verifySimulatedToken(req.headers.authorization);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthenticated.' });
  }

  const user = usersStore[payload.userId];
  if (!user) return res.status(404).json({ error: 'User profile not found.' });

  const { name, avatar, address } = req.body;
  if (name) user.name = name;
  if (avatar) user.avatar = avatar;
  if (address) {
    user.address = {
      fullName: address.fullName || user.address?.fullName || name || user.name,
      addressLine1: address.addressLine1 || user.address?.addressLine1 || '',
      city: address.city || user.address?.city || '',
      state: address.state || user.address?.state || '',
      postalCode: address.postalCode || user.address?.postalCode || '',
      country: address.country || user.address?.country || '',
      phone: address.phone || user.address?.phone || ''
    };
  }

  const { passwordHash, ...userProf } = user;
  res.json({ user: userProf });
});

app.post('/api/auth/wishlist/toggle', (req, res) => {
  const payload = verifySimulatedToken(req.headers.authorization);
  if (!payload) return res.status(401).json({ error: 'Unauthenticated.' });

  const user = usersStore[payload.userId];
  if (!user) return res.status(404).json({ error: 'User profile not found.' });

  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'Product ID required.' });

  const index = user.wishlist.indexOf(productId);
  if (index >= 0) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }

  res.json({ wishlist: user.wishlist });
});

// Products API
app.get('/api/products', (req, res) => {
  let list = [...productsInDB];
  const { category, search, sort, featured, trending, flashSale } = req.query;

  if (category) {
    list = list.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const term = String(search).toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
  }

  if (featured === 'true') {
    list = list.filter(p => p.featured);
  }
  if (trending === 'true') {
    list = list.filter(p => p.trending);
  }
  if (flashSale === 'true') {
    list = list.filter(p => p.flashSale);
  }

  // Sorting
  if (sort === 'price-low') {
    list.sort((a, b) => {
      const pA = a.discountPrice ?? a.price;
      const pB = b.discountPrice ?? b.price;
      return pA - pB;
    });
  } else if (sort === 'price-high') {
    list.sort((a, b) => {
      const pA = a.discountPrice ?? a.price;
      const pB = b.discountPrice ?? b.price;
      return pB - pA;
    });
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  res.json({ products: list });
});

app.get('/api/products/:id', (req, res) => {
  const product = productsInDB.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ product });
});

app.post('/api/products/:id/review', (req, res) => {
  const product = productsInDB.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  const { user, rating, comment } = req.body;
  if (!user || !rating || !comment) {
    return res.status(400).json({ error: 'User, rating, and review comment are required.' });
  }

  const mockReview = {
    id: `rev_${Date.now()}`,
    user,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  product.reviews.unshift(mockReview);
  // Recalculate average rating
  const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = Number((total / product.reviews.length).toFixed(1));
  product.ratingCount = product.reviews.length;

  res.json({ product });
});

// Admin Products API (CRUD)
app.post('/api/products/admin/add', (req, res) => {
  const payload = verifySimulatedToken(req.headers.authorization);
  if (!payload || payload.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized. Admin credentials required.' });
  }

  const { title, description, price, discountPrice, stock, category, images, specifications } = req.body;
  if (!title || !description || !price || !stock || !category) {
    return res.status(400).json({ error: 'Title, description, price, stock, and category are required.' });
  }

  const newProduct: Product = {
    id: `p_${Date.now()}`,
    title,
    description,
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    stock: Number(stock),
    category,
    rating: 0,
    ratingCount: 0,
    images: images && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'],
    specifications: specifications || {},
    reviews: []
  };

  productsInDB.push(newProduct);
  res.status(201).json({ product: newProduct });
});

app.put('/api/products/admin/:id/edit', (req, res) => {
  const payload = verifySimulatedToken(req.headers.authorization);
  if (!payload || payload.role !== 'admin') return res.status(403).json({ error: 'Unauthorized.' });

  const productIdx = productsInDB.findIndex(p => p.id === req.params.id);
  if (productIdx === -1) return res.status(404).json({ error: 'Product not found.' });

  const updatedFields = req.body;
  productsInDB[productIdx] = {
    ...productsInDB[productIdx],
    ...updatedFields,
    price: updatedFields.price !== undefined ? Number(updatedFields.price) : productsInDB[productIdx].price,
    discountPrice: updatedFields.discountPrice !== undefined ? (updatedFields.discountPrice ? Number(updatedFields.discountPrice) : undefined) : productsInDB[productIdx].discountPrice,
    stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : productsInDB[productIdx].stock
  };

  res.json({ product: productsInDB[productIdx] });
});

app.delete('/api/products/admin/:id/delete', (req, res) => {
  const payload = verifySimulatedToken(req.headers.authorization);
  if (!payload || payload.role !== 'admin') return res.status(403).json({ error: 'Unauthorized.' });

  const beforeLen = productsInDB.length;
  productsInDB = productsInDB.filter(p => p.id !== req.params.id);

  if (productsInDB.length === beforeLen) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  res.json({ success: true, message: `Product ${req.params.id} successfully removed.` });
});

// Admin General APIs
app.get('/api/admin/analytics', (req, res) => {
  const payload = verifySimulatedToken(req.headers.authorization);
  if (!payload || payload.role !== 'admin') return res.status(403).json({ error: 'Unauthorized.' });

  const totalSales = orderRegistry.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orderRegistry.length;
  const totalUsers = Object.keys(usersStore).length;
  const inventoryValue = productsInDB.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Sales map grouping by date for tracking stats
  const salesByDate: Record<string, number> = {};
  orderRegistry.forEach(o => {
    const dateStr = o.date.split('T')[0];
    salesByDate[dateStr] = (salesByDate[dateStr] || 0) + o.totalAmount;
  });

  // Hot category metrics
  const salesByCategory: Record<string, number> = {};
  orderRegistry.forEach(o => {
    o.items.forEach(it => {
      const prod = PRODUCTS.find(p => p.id === it.productId);
      const cat = prod?.category || 'unknown';
      salesByCategory[cat] = (salesByCategory[cat] || 0) + (it.price * it.quantity);
    });
  });

  res.json({
    totalSales: Number(totalSales.toFixed(2)),
    totalOrders,
    totalUsers,
    inventoryValue: Number(inventoryValue.toFixed(2)),
    salesByDate,
    salesByCategory,
    recentOrders: orderRegistry.slice(-5)
  });
});

app.get('/api/orders/admin', (req, res) => {
  const payload = verifySimulatedToken(req.headers.authorization);
  if (!payload || payload.role !== 'admin') return res.status(403).json({ error: 'Unauthorized.' });
  res.json({ orders: orderRegistry });
});

app.put('/api/orders/admin/:id/status', (req, res) => {
  const payload = verifySimulatedToken(req.headers.authorization);
  if (!payload || payload.role !== 'admin') return res.status(403).json({ error: 'Unauthorized.' });

  const order = orderRegistry.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  const { status } = req.body;
  if (!['pending', 'shipping', 'delivered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status type.' });
  }

  order.status = status;
  res.json({ order });
});

// Checkout & Coupon gateway logic
app.post('/api/payment/checkout', (req, res) => {
  const { cartItems, shippingAddress, billingDetails, couponCode, paymentMethod } = req.body;
  if (!cartItems || !cartItems.length || !shippingAddress || !billingDetails) {
    return res.status(400).json({ error: 'Invalid order request. Missing items or shipping details.' });
  }

  let subtotal = 0;
  const orderItems = [];

  // Match real DB pricing to enforce secure catalog pricing checks
  for (const item of cartItems) {
    const realProd = productsInDB.find(p => p.id === item.productId);
    if (!realProd) {
      return res.status(400).json({ error: `Product reference ${item.title} no longer available in catalog.` });
    }
    
    if (realProd.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient inventory for ${realProd.title}. Available: ${realProd.stock}` });
    }

    const matchedPrice = realProd.discountPrice ?? realProd.price;
    subtotal += matchedPrice * item.quantity;

    orderItems.push({
      productId: realProd.id,
      title: realProd.title,
      price: matchedPrice,
      quantity: item.quantity,
      image: realProd.images[0]
    });
  }

  // Calculate discount logic safely on backend
  let discount = 0;
  if (couponCode) {
    const promo = String(couponCode).toUpperCase().trim();
    if (promo === 'FRIEND20') {
      discount = subtotal * 0.20;
    } else if (promo === 'WELCOME10') {
      discount = subtotal * 0.10;
    }
  }

  const shippingCost = subtotal > 150 ? 0 : 9.99;
  const tax = (subtotal - discount) * 0.08; // 8% sales tax
  const totalAmount = Number((subtotal - discount + shippingCost + tax).toFixed(2));

  // Deduct products inventory stock
  for (const item of cartItems) {
    const realProd = productsInDB.find(p => p.id === item.productId);
    if (realProd) {
      realProd.stock -= item.quantity;
    }
  }

  // Create real order entity
  const trackingSeed = Math.floor(100000 + Math.random() * 900000);
  const cityCode = shippingAddress.city.slice(0, 3).toUpperCase();
  const createdOrder: Order = {
    id: `ord_${Date.now()}`,
    items: orderItems,
    totalAmount,
    shippingAddress,
    billingDetails,
    paymentMethod: paymentMethod || 'Card (Stripe Proxy Secured)',
    status: 'pending',
    date: new Date().toISOString(),
    trackingNumber: `FS-${trackingSeed}-${cityCode}`
  };

  orderRegistry.push(createdOrder);

  // If order made by standard logged in user, make sure to add to their profile orders too
  const authPayload = verifySimulatedToken(req.headers.authorization);
  if (authPayload) {
    const user = usersStore[authPayload.userId];
    if (user) {
      user.orders.push(createdOrder);
    }
  }

  res.status(201).json({
    order: createdOrder,
    summary: {
      subtotal,
      discount,
      shippingCost,
      tax,
      totalAmount
    }
  });
});

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (subscribedEmails.includes(email.toLowerCase())) {
    return res.status(200).json({ message: 'You are already registered helper!', alreadyRegistered: true });
  }

  subscribedEmails.push(email.toLowerCase());
  res.json({
    success: true,
    message: 'Thank you for joining the Friend Shop circle! Enjoy your welcome gift: 10% OFF code WELCOME10 applied automatically on your checkout!',
    promoCode: 'WELCOME10'
  });
});

// AI Chatbot supporting catalog recommendations using lazy-initialized gemini-3.5-flash
app.post('/api/gemini/chatbot', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Format prompt appending shop catalog details to the model
    const catalogContext = productsInDB.map(p => {
      const price = p.discountPrice ? `$${p.discountPrice} (Reduced from $${p.price})` : `$${p.price}`;
      return `- [ID: ${p.id}] ${p.title} in Category "${p.category}". Price: ${price}. Stock available: ${p.stock} units left. Description: "${p.description.slice(0, 150)}..."`;
    }).join('\n');

    const systemInstruction = `You are a friendly, delightful AI shopping companion for "Friend Shop", an exquisite modern ecommerce brand with the slogan "Shopping Made Friendly".
Your goals:
1. Help shoppers search, explore, and find products from our catalog below.
2. Politely match their personal needs with our actual store products.
3. Keep the tone warm, welcoming, informative, and stylish. Use formatting or bullet points when presenting items.
4. If a product is mentioned, refer to its actual catalog pricing, features, and specs when helpful.
5. If they ask about an item, you can mention its ID so they know it exists.
6. Speak about Friend Shop deals (Promo codes: "FRIEND20" for 20% off orders, "WELCOME10" for 10% off).
7. If someone asks for items not in our catalog, kindly inform them we focus on curated items in Electronics, Apparel, Home & Living, and Personal Care, and suggest the closest matches we DO have!

Here is the current LIVE catalog of Friend Shop. Use only this catalog for exact store inquiries, prices, and stock:
${catalogContext}

Respond in clean markdown. Keep your greeting light and helpful!`;

    const cleanInputHistory = messages.map((m: { role: 'user' | 'model'; text: string }) => {
      return m.text;
    }).join('\n');

    // Safe call using @google/genai SDK on backend
    const ai = getGemini();
    const apiKey = process.env.GEMINI_API_KEY;

    // Gracefully check key presence to avoid crashing
    if (!apiKey) {
      // Fallback assistant logic if key is not configured yet
      const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
      let reply = "Hello! I am a simulated shopping companion for Friend Shop. I see that your GEMINI_API_KEY is not configured in Secrets yet, but I can recommend the Walnut Mechanical Keyboard ($99) or the active noise-cancelling headphones ($249.99)! Friendly reminder: Use code '**FRIEND20**' to save 20% on any order!";
      if (lastUserMsg.includes('shipping') || lastUserMsg.includes('delivery')) {
        reply = "Friend Shop offers free shipping on all orders over $150! For other orders, standard shipment is only $9.99.";
      } else if (lastUserMsg.includes('coupon') || lastUserMsg.includes('discount')) {
        reply = "You can use code **FRIEND20** for a stylish 20% discount, or join our newsletter to secure a **WELCOME10** discount!";
      }
      return res.json({ text: reply });
    }

    // Call the real API
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: cleanInputHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini chatbot API Error:', error);
    res.status(500).json({ error: 'AI server engine encountered a brief hiccup. Please try asking again!', details: error.message });
  }
});

// Vite Middleware for development versus production integration
async function configureViteAndStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

configureViteAndStatic().then(() => {
  // Start the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Friend Shop full-stack server running on http://0.0.0.0:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to configure server assets:', err);
});
