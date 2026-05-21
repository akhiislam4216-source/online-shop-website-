import { Product, Category, BlogPost } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Laptop',
    bannerImage: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&q=80&w=1200',
    description: 'Cutting edge widgets and workspace accessories to simplify your daily hardware setup.'
  },
  {
    id: 'apparel',
    name: 'Apparel & Footwear',
    icon: 'Shirt',
    bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
    description: 'Unisex loungewear, custom knits, and comfortable sneakers built for everyday wear.'
  },
  {
    id: 'home',
    name: 'Home & Living',
    icon: 'Home',
    bannerImage: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=1200',
    description: 'Minimalist ceramics, comfortable furniture, and visual products that elevate your domestic interior.'
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: 'Sparkles',
    bannerImage: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=1200',
    description: 'Sustainably sourced botanical formulas, skincare kits, and cleansing engines.'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Smart Over-Ear Active Noise-Cancelling Headphones',
    description: 'Experience pure architectural acoustic bliss. These noise-cancelling headphones blend premium memory foam comfort, high-fidelity wireless spatial audio formats, and robust gestures to deliver a peaceful listening cocoon anywhere.',
    price: 299.99,
    discountPrice: 249.99,
    rating: 4.8,
    ratingCount: 124,
    stock: 25,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Driver Unit': '40mm Dynamic Driver',
      'Frequency Response': '4Hz - 40,000Hz',
      'Bluetooth Version': 'v5.2 LE Audio Enabled',
      'Battery Life': 'Up to 34 hours (ANC On)',
      'Charging Time': '10-minute quick charge yields 5 hours playback'
    },
    reviews: [
      { id: 'r1', user: 'Emma Stone', rating: 5, comment: 'The soundscape is absolutely brilliant! Quietest commute of my life.', date: '2026-05-10' },
      { id: 'r2', user: 'David Kim', rating: 4, comment: 'Pristine highs, but sometimes the touchpad sensor is a bit too sensitive. Extremely comfy.', date: '2026-05-14' }
    ],
    featured: true,
    trending: true,
    flashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 3).toISOString() // 3 days from now
  },
  {
    id: 'p2',
    title: 'Minimalist Walnut Mechanical Keyboard',
    description: 'Designed for tactile typists and elegant desk setups. Features solid black walnut wood frame casing, premium hot-swappable tactile switches, and high-quality double-shot PBT keycaps with warm amber backlighting.',
    price: 120.00,
    discountPrice: 99.99,
    rating: 4.9,
    ratingCount: 88,
    stock: 12,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Layout': '75% Compact (84 keys)',
      'Case Material': 'Solid North American Black Walnut',
      'Switch Type': 'Gateron Brown Switches (Tactile, Hot-Swappable)',
      'Connectivity': 'USB-C / Bluetooth 5.1 / 2.4Ghz Wireless',
      'Backlight': 'Warm White/Amber Ambient LED'
    },
    reviews: [
      { id: 'r3', user: 'Sarah Connor', rating: 5, comment: 'Typing feels incredibly smooth and looks like a piece of mid-century art on my desk.', date: '2026-04-18' }
    ],
    featured: true
  },
  {
    id: 'p3',
    title: 'Elegant Smart OLED Watch',
    description: 'A masterpiece on your wrist. Tracks essential wellness telemetry with pristine styling. High-contrast round always-on display, sapphire glass panel, multi-day smart battery, and friendly digital companion notifications.',
    price: 199.99,
    discountPrice: 179.99,
    rating: 4.6,
    ratingCount: 96,
    stock: 40,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Screen Type': '1.43" Always-on AMOLED Display',
      'Glass Material': 'Scratch-resistant Sapphire Crystal',
      'Water Resistance': '5 ATM (swim-proof)',
      'Battery Rating': '7 days in standard mode, 14 days in saver mode',
      'Sensors': 'Optical heart rate, SpO2 tracker, Accelerometer, Gyroscope'
    },
    reviews: [
      { id: 'r4', user: 'Alex Mercer', rating: 4, comment: 'Beautiful and functional. The battery really does last almost a full week.', date: '2026-05-02' }
    ],
    trending: true
  },
  {
    id: 'p4',
    title: 'Heavyweight Custom Terry Sweat Hood',
    description: 'This hoodie is crafted from luxurious 450gsm dense cotton French terry. Designed with a structured boxy draping silhouette, minimal seamless side pockets, and durable ribbed trim detailing. Standard genderless fit.',
    price: 79.99,
    discountPrice: 59.99,
    rating: 4.7,
    ratingCount: 110,
    stock: 5,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Material': '100% Organic Cotton French Terry (450gsm)',
      'Fit': 'Relatively Boxy, Classic Drop Shoulder',
      'Washing Guide': 'Cold machine wash, flat dry in shade',
      'Detailing': 'Hidden custom drawcords within hood seam'
    },
    reviews: [
      { id: 'r5', user: 'Liam Vance', rating: 5, comment: 'So heavy and structured! Feels like a $200 artisan piece.', date: '2026-05-05' }
    ],
    featured: true,
    flashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 2).toISOString()
  },
  {
    id: 'p5',
    title: 'Comfort Flow Knit Athletic Sneaker',
    description: 'Constructed with dynamic elastic knit threads for maximum breathability. Features a responsive, hyper-flexible dual-density sole that absorbs impact, returning visual energy to each stride. Ideal for long walking, running, or styling.',
    price: 110.00,
    rating: 4.5,
    ratingCount: 230,
    stock: 18,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Upper': 'Seamless engineered Recycled Polyester Knit',
      'Midsole': 'Responsive bio-foam cushion technology',
      'Outsole': 'High-grip durable vulcanized rubber inserts',
      'Weight': '240g per shoe'
    },
    reviews: [
      { id: 'r6', user: 'Tina Fey', rating: 5, comment: 'Lighter than air. No blisters even after running 10k right away.', date: '2026-03-24' }
    ],
    trending: true
  },
  {
    id: 'p6',
    title: 'Heritage Classic Canvas Backpack',
    description: 'A vintage silhouette meets modern laptop compartments. Constructed with heavy water-resistant canvas, handsome bridle harness leather buckles, padded sleeve dividers, and custom quick-stash utility pockets.',
    price: 65.00,
    discountPrice: 49.00,
    rating: 4.8,
    ratingCount: 74,
    stock: 22,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Capacity': '22 Liters',
      'Dimensions': '18" x 12.5" x 6.5"',
      'Laptop Sleeve Size': 'Fits up to 16" device',
      'Materials': '20oz waxed cotton canvas, vegetable-tanned leather trim'
    },
    reviews: [
      { id: 'r7', user: 'James Patterson', rating: 4.5, comment: 'Superb leather work. Truly repels rains easily during my daily cycles.', date: '2026-05-11' }
    ],
    featured: true
  },
  {
    id: 'p7',
    title: 'Ceramic Minimalist Vase Tableware',
    description: 'Meteoric matte white finished aesthetic ceramic. Handmade by craft houses utilizing high-fired stoneware. Features beautiful organic asymmetric ribbed curves that reflect natural ambient light with quiet elegance.',
    price: 45.00,
    rating: 4.9,
    ratingCount: 42,
    stock: 8,
    category: 'home',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Stature Height': '9.5 Inches',
      'Opening Width': '2.3 Inches',
      'Material Composition': 'Clay Stoneware, interior glazed to host fresh water',
      'Origin Country': 'Japan (Shigaraki Craft House)'
    },
    reviews: [
      { id: 'r8', user: 'Yoko Ono', rating: 5, comment: 'Its simplicity is poetry itself. Houses my wildflowers perfectly.', date: '2026-02-15' }
    ],
    featured: true
  },
  {
    id: 'p8',
    title: 'Aromatherapy Soy Wax Candle Trio',
    description: 'Set of three hand-poured soy wax candles. Masterfully blended with certified natural botanical absolute oils. Scent profiles include Cedar & Fig, Wild Basil & Lime, and Santal Coconut.',
    price: 35.00,
    discountPrice: 28.00,
    rating: 4.7,
    ratingCount: 65,
    stock: 30,
    category: 'home',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Total Net Weight': '3 x 4.5 oz tins',
      'Estimated Burn Time': '28 - 32 hours per tin',
      'Wax Type': '100% natural biodegradable soybean wax',
      'Wick Spec': 'Lead-free unbleached woven cotton wicks'
    },
    reviews: [
      { id: 'r9', user: 'Diana Rose', rating: 5, comment: 'Absolutely divine smells. No black soot, clean burning.', date: '2026-05-19' }
    ],
    trending: true,
    flashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 1.5).toISOString()
  },
  {
    id: 'p9',
    title: 'Ergonomic Premium Desk Chair',
    description: 'Designed for complete anatomical posture alignment. Backed with robust self-adjusting lumbar support, high-tension breathable poly-mesh backing, adjustable synchronous seat slide tilt mechanism, and 3D armrests.',
    price: 320.00,
    discountPrice: 279.00,
    rating: 4.7,
    ratingCount: 153,
    stock: 4,
    category: 'home',
    images: [
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Weight Capacity': 'Fully supports up to 300 lbs',
      'Tilt Adjustment': '4 locks, tilt ranges 95 to 135 degrees',
      'Base Spec': 'Heavy duty aluminum five-star base with silent nylon casters',
      'Assembly Duration': 'Approximately 20 minutes (included instruction & tool kit)'
    },
    reviews: [
      { id: 'r10', user: 'Toby Flenderson', rating: 4, comment: 'A massive relief for my lower lumbar disc. Adjustable headrest is lovely too.', date: '2026-04-30' }
    ]
  },
  {
    id: 'p10',
    title: 'Organic Herbal Botanical Skincare Kit',
    description: 'Four curated formulas designed for daily skin rebalancing. Contains Lavender Foaming Face Wash (120ml), Rose Hip Face Oil (30ml), Balancing Chamomile Moisturizer (60ml), and Botanical Clay Exfoliator (50ml). Packed with natural active plant enzymes.',
    price: 89.00,
    discountPrice: 75.00,
    rating: 4.8,
    ratingCount: 112,
    stock: 14,
    category: 'personal-care',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Skin Compatibility': 'Suitable for normal, combination, and sensitive skins',
      'Chemical Restrictions': 'Completely free of silicones, synthetic parabens, and sulfates',
      'Certification Labels': 'Cruelty-Free, Certified Organic and Vegan',
      'Approximate Supply': '60-day supply if applied twice daily'
    },
    reviews: [
      { id: 'r11', user: 'Lana Del Rey', rating: 5, comment: 'Smells like a fresh garden meadow in southern France. Transformed my skin texture entirely!', date: '2026-05-15' }
    ],
    featured: true
  },
  {
    id: 'p11',
    title: 'Sonic Facial Cleansing Brush Plus',
    description: 'A revolutionary sonic skin cleanser that purifies beneath pores with gentle micro-pulses. Over 8000 acoustic pulses per minute, coated with premium medical-grade quick-dry antimicrobial silicone bristles. Features 8 custom speeds.',
    price: 55.00,
    rating: 4.5,
    ratingCount: 52,
    stock: 20,
    category: 'personal-care',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600'
    ],
    specifications: {
      'Motor Power': '8000 RPM Acoustic Transverse Pulser',
      'Speed Steps': '8 levels of progressive intensity',
      'Waterproof Scale': 'IPX7 certified (can completely submerge in bath/shower)',
      'Battery Rating': 'Single charge delivers up to 180 uses (USB-Rechargeable)'
    },
    reviews: [
      { id: 'r12', user: 'Kim C.', rating: 5, comment: 'Cleanses so well without irritation. Best accessory in my skincare stash.', date: '2026-05-08' }
    ],
    trending: true
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Art of Constructing a Modern Minimalist Desk Setup',
    excerpt: 'How decluttering your desk, picking acoustic wood components, and choosing proper task lighting coordinates a space of singular focus.',
    content: 'We spend the majority of our creative life seated before monitor platforms. Yet many setups are a messy collage of plastic cords, visual clutter, and poor ergonomic balance. In this article, our senior workspace designer details how utilizing natural acoustics, pairing wood elements (like walnut and wool felt desk pads), and securing targeted, shadowless lighting coordinates a sanctuary of immense workflow speed.\n\n### Step 1: Establish Your Core Materials\nNatural fibers and woods speak calm to our central nervous system. Consider matching walnut casings, custom keycaps, and leather mats.\n\n### Step 2: Manage Your Cables\nOut of sight is out of mind. Run cable trays beneath your solid wood surface. Use velcro ties and magnetic cord anchors on the side edges.\n\n### Step 3: Layered Lighting\nAvoid harsh ceiling downlighting. Use a computer monitor light bar to wash your hands in light while keeping the screen free of glare, paired with small accent warm lamps.',
    category: 'Minimal Workspaces',
    author: 'Liam Vance',
    date: '2026-05-12',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b2',
    title: 'Curating a Sustainable Botanical Daily Skincare Flow',
    excerpt: 'Demystifying synthetic formulas. Transition easily to mineral clays, cold-pressed face oils, and active herbal rebalancing toners.',
    content: 'The skin is our body’s largest respiratory and protective field. Synthetic paraben preservatives and aggressive foaming agents can strip our beneficial acid mantle layer, triggering cyclic breakouts or dry patches. This deep dive untangles how simple plant components—chamomile, lavender extract, rose hip essential lipids, and mineral bentonites—coordinate with your natural cellular renewal flows for a balanced, quiet glow.\n\n### The Cleanser Rule\nStop stripping your skin. Traditional foaming systems use sulfates designed for industrial dishwashers. Secure a botanical oil or foaming organic herbal wash instead.\n\n### Balancing with Actives\nDon’t fear essential lipids. Organic cold-pressed cold oils (like Rose Hip) mimic sebum patterns, signalling your skin to cease sebum over-production, clarifying blemishes beautifully.',
    category: 'Clean Living',
    author: 'Emma Stone',
    date: '2026-05-18',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b3',
    title: 'Why Premium French Terry is the Ultimate Loungewear Choice',
    excerpt: 'Explore why weaving density, loop architecture, and premium organic knit weights determine thermal longevity and shape hold.',
    content: 'All hoodies are not constructed of equal quality. Polyester-blend fleece hoodies feel incredibly soft for three initial washes, then quickly ball up, trap sweat, and lose their vertical structure. Heavy loop French Terry knit on specialized circular machines holds thousands of highly resilient, tiny yarn loops on the underside. Here is why investing in heavyweight high-density cotton hoodies delivers permanent, structured genderless drapes that dry-wick thermal layers efficiently.',
    category: 'Premium Fabrics',
    author: 'James Patterson',
    date: '2026-05-20',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=600'
  }
];
