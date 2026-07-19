// Fallback catalog used when the backend (localhost:8000) is unavailable,
// e.g. in the v0 preview / demo environment. When the real API is reachable
// its data takes over automatically.

const SIZES_799 = {
  S: { price: 799, stock: 12 },
  M: { price: 799, stock: 12 },
  L: { price: 799, stock: 12 },
  XL: { price: 799, stock: 8 },
};

const SIZES_999 = {
  S: { price: 999, stock: 5 },
  M: { price: 999, stock: 5 },
  L: { price: 999, stock: 5 },
  XL: { price: 999, stock: 3 },
};

const DESC = 'Premium 240 GSM oversized unisex tee. Heavyweight cotton, drop-shoulder fit.';

// MAN products — order matches the reference layout.
export const MAN_PRODUCTS = [
  {
    product_id: 'man-rare-edition',
    name: 'RARE EDITION',
    images: ['/images/prod-rare.png'],
    sizes: SIZES_999,
    description: 'Not for everyone. Rare edition drop, limited quantities.',
    tagline: 'Main character energy, limited quantities.',
    reviews: { count: 24 },
  },
  {
    product_id: 'man-mountain',
    name: 'Zyvon Oversized Mountain Tee',
    images: ['/images/prod-mountain.png'],
    sizes: SIZES_799,
    description: 'Crafted from premium 240 GSM fabric for everyday wear.',
    tagline: 'Keep building in silence. Let your success be the noise.',
    reviews: { count: 41 },
  },
  {
    product_id: 'man-discipline',
    name: 'ZYVON Discipline Tee',
    images: ['/images/prod-discipline.png'],
    sizes: SIZES_799,
    description: 'Crafted from premium 240 GSM fabric with a clean minimal logo.',
    tagline: 'Built in silence. Moving with purpose.',
    reviews: { count: 33 },
  },
  {
    product_id: 'man-progress',
    name: 'ZYVON Progress Tee',
    images: ['/images/prod-progress.png'],
    sizes: SIZES_799,
    description: 'Made from premium 240 GSM french terry cotton.',
    tagline: 'Keep moving. Keep improving.',
    reviews: { count: 18 },
  },
  {
    product_id: 'man-green-street',
    name: 'Green Oversized Street Tee',
    images: ['/images/prod-greenstreet.png'],
    sizes: SIZES_799,
    description: 'Relaxed fit oversized t-shirt, street-ready silhouette.',
    tagline: 'Oversized comfort. Street-ready style. Made to stand out.',
    reviews: { count: 27 },
  },
  {
    product_id: 'man-brown-motivation',
    name: 'Brown Oversized Motivation Tee',
    images: ['/images/prod-brownmotivation.png'],
    sizes: SIZES_799,
    description: 'Oversized fit t-shirt made from heavyweight cotton.',
    tagline: 'Discipline today. Freedom tomorrow. No excuses. Just results.',
    reviews: { count: 36 },
  },
  {
    product_id: 'man-wooden-brown',
    name: 'Wooden Brown Oversized Growth Tee',
    images: ['/images/prod-woodenbrown.png'],
    sizes: SIZES_799,
    description: 'Premium 240 GSM french terry cotton with a vintage print.',
    tagline: 'Built in silence. Shining loud. Discipline today. Success tomorrow.',
    reviews: { count: 22 },
  },
];

// WOMEN products — order matches the reference layout.
export const WOMEN_PRODUCTS = [
  {
    product_id: 'women-bloom',
    name: 'Bloom Where You Are Oversized Tee',
    images: ['/images/prod-bloom.png'],
    sizes: SIZES_799,
    description: DESC,
    tagline: 'Grow through what you go through.',
    reviews: { count: 31 },
  },
  {
    product_id: 'women-chaos',
    name: 'Chaos Club Oversized Tee',
    images: ['/images/prod-chaos.png'],
    sizes: SIZES_799,
    description: DESC,
    tagline: "We are the chaos they couldn't handle.",
    reviews: { count: 29 },
  },
  {
    product_id: 'women-inner-peace',
    name: 'Inner Peace Oversized Tee',
    images: ['/images/prod-innerpeace.png'],
    sizes: SIZES_799,
    description: DESC,
    tagline: 'Protect your peace. Wear your vibe.',
    reviews: { count: 38 },
  },
  {
    product_id: 'women-mind-over',
    name: 'Mind Over Overthinking Oversized Tee',
    images: ['/images/prod-mindover.png'],
    sizes: SIZES_799,
    description: DESC,
    tagline: 'Train your mind. Change your direction.',
    reviews: { count: 26 },
  },
  {
    product_id: 'women-main-character',
    name: 'Main Character Energy Oversized Tee',
    images: ['/images/prod-maincharacter.png'],
    sizes: SIZES_799,
    description: DESC,
    tagline: "You're the main character. Dress like it.",
    reviews: { count: 45 },
  },
];

// Categories keyed by slug/id used in routes (/category/:categoryId).
export const DEMO_CATEGORIES_BY_ID = {
  man: {
    categoryId: 'man',
    slug: 'man',
    name: 'MAN',
    thumbnail: '/images/cat-man.png',
    parentId: null,
    children: [],
    products: MAN_PRODUCTS.map((p) => p.product_id),
  },
  women: {
    categoryId: 'women',
    slug: 'women',
    name: 'WOMEN',
    thumbnail: '/images/cat-women.png',
    parentId: null,
    children: [],
    products: WOMEN_PRODUCTS.map((p) => p.product_id),
  },
};

const ALL_PRODUCTS = [...MAN_PRODUCTS, ...WOMEN_PRODUCTS];

export function getDemoCategory(categoryId) {
  return DEMO_CATEGORIES_BY_ID[categoryId] || null;
}

export function getDemoProductsForCategory(categoryId) {
  if (categoryId === 'man') return MAN_PRODUCTS;
  if (categoryId === 'women') return WOMEN_PRODUCTS;
  return [];
}

export function getDemoProduct(productId) {
  return ALL_PRODUCTS.find((p) => p.product_id === productId) || null;
}

// Home page "THE DROPS" categories.
export const DEMO_HOME_CATEGORIES = [
  {
    ...DEMO_CATEGORIES_BY_ID.women,
    products: WOMEN_PRODUCTS.map((p) => p.product_id),
  },
  {
    ...DEMO_CATEGORIES_BY_ID.man,
    products: MAN_PRODUCTS.map((p) => p.product_id),
  },
];
