export const navBar = ['Product', 'Brand', 'Shop', 'By Solution'] as const;
export type NavBar = typeof navBar[number];

export const navBarSubcategories: Record<NavBar, string[]> = {
  Product: [],
  Brand: [],
  Shop: ['Shop', 'Cart'],
  'By Solution': [
    'Gas/Bloating',
    'Acidity',
    'Constipation',
    'Piles',
    'Digestion health',
    'Jaundice',
    'Fatty Liver',
    'Heart health',
    'High Blood pressure',
    'Low blood pressure',
    'High Cholesterol',
    'Stress',
    'Sleep disorders',
    'Kidney health',
    'UTI',
    'Kidney stone',
    'Prostate Health',
    'Joint health',
    'Women health',
    'Anaemia',
    'Hormonal Disorders',
    'PCOS/PCOD',
    'Leucorrhea',
    'Irregular Periods',
    'Painful Periods',
    'Anti Ageing',
    'Cough',
    'Asthma Support',
    'Raised Blood glucose',
    'High blood Glucose',
    'Body detox',
    'Anti oxidant support',
    'Thyroid',
    'Skin Health',
    'Hair health',
    'Acne',
    'Kids health',
    'Weight management',
    'Male Health',
  ],
};

type Category = {
  name: string;
  image: string;
};

export const categories: Category[] = [
  { name: 'Be Nutrition', image: '/images/categories/be-nutrition.jpg' },
  { name: 'DA Maulik Organics', image: '/images/categories/da-maulik-organic.jpg' },
  { name: 'RJUV9', image: '/images/categories/darjuv9.jpg' },
  { name: 'Energie9 Pro', image: '/images/categories/energie9.jpg' },
  { name: 'F-Armour', image: '/images/categories/f-armour.jpg' },
  { name: 'Herbs and Hills', image: '/images/categories/herb-hill.jpg' },
  { name: 'Darjuv9', image: '/images/categories/rjuv9.jpg' },
  { name: 'Rootin', image: '/images/categories/rootin.jpg' },
  { name: 'Sages and Seas', image: '/images/categories/sages-seas.jpg' }
];

type BestSeller = {
  name: string;
  image: string;
};

export const bestSeller: BestSeller[] = [
  { name: 'Be Nutrition Muru Instant Drink Mix (Blue Raspberry) -100g', image: '/images/bestseller/Blue_Raspberry.jpg' },
  { name: 'Be Nutrition Destress 60 N Capsules', image: '/images/bestseller/Destress.jpg' },
  { name: 'Be Nutrition Kids Formula Cookies and Cream Flavour 500gm', image: '/images/bestseller/Kids_Formula_Cookies_Cream.jpg' },
  { name: 'BE Nutrition Essentials 360 Probiotics Drink Mix - Mango Flavour 100g', image: '/images/bestseller/Probiotics_Drink_Mix_Mango_Flavour.png' },
  { name: 'Be Nutrition Curcumin C3 Powder 60 N Capsule', image: '/images/bestseller/Curcumin_C3_Powder.jpg' },
  { name: 'Be Nutrition Muru Instant Drink Mix (Mango Flavour) -100g', image: '/images/bestseller/Muru_Instant_Drink_Mix_Mango_Flavour.png' },
  { name: 'Be Nutrition Kids Formula Kulfi Flavour 500gm', image: '/images/bestseller/Kids_Formula_Kulfi.jpeg' },
  { name: 'Be Nutrition Muru Instant Drink Mix (Peach Flavour) -100g', image: '/images/bestseller/Muru_Instant_Drink_Mix_Peach_Flavour.jpg' },
];

export const banners = [
  {
    id: 1,
    image: "/images/hero-banner/07.jpg",
    link: "/category/ayurveda",
    alt: "Ayurveda Products",
  },
  {
    id: 2,
    image: "/images/hero-banner/08.jpg",
    link: "/category/wellness",
    alt: "Wellness",
  },
  {
    id: 3,
    image: "/images/hero-banner/09.jpg",
    alt: "Special Offer",
  },
  {
    id: 4,
    image: "/images/hero-banner/07.jpg",
    link: "/category/ayurveda",
    alt: "Ayurveda Products",
  },
  {
    id: 5,
    image: "/images/hero-banner/08.jpg",
    link: "/category/wellness",
    alt: "Wellness",
  },
  {
    id: 6,
    image: "/images/hero-banner/09.jpg",
    alt: "Special Offer",
  }
];