import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  featured: boolean;
  ingredients?: string[];
  benefits?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const mockCategories: Category[] = [
  { id: "all", name: "All Products", description: "Browse our entire catalog of premium skincare and haircare.", icon: "Activity" },
  { id: "serums", name: "Serums", description: "Targeted active serums to address acne, aging, and dullness.", icon: "Sparkles" },
  { id: "creams", name: "Creams & Moisturizers", description: "Deeply hydrating gel formulas and lipid barrier creams.", icon: "Pill" },
  { id: "sunblock", name: "Sun Protection", description: "Broad-spectrum mineral SPF blocks to shield your skin daily.", icon: "Shield" },
  { id: "haircare", name: "Hair Care", description: "Sulfate-free cleansing shampoos and nourishing conditions.", icon: "Moon" },
];

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Dulcis Hydrate + Glow Niacinamide Serum",
    price: 29.00,
    description: "Vibrant daily serum containing 10% niacinamide and zinc PCA to balance sebum and restore radiant skin tone.",
    details: "Formulated under dermatological guidelines, our Niacinamide Serum targets hyperpigmentation, reduces pore sizes, and regulates oil production. Enriched with zinc PCA to soothe skin irritation.",
    category: "serums",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 142,
    stock: 50,
    featured: true,
    ingredients: ["10% Niacinamide (Vitamin B3)", "1% Zinc PCA", "Hyaluronic Acid", "Organic Centella Asiatica Extract"],
    benefits: ["Minimizes appearance of enlarged pores", "Regulates excess sebum secretion", "Fades dark patches and post-acne scars", "Lightweight, water-soluble absorption"]
  },
  {
    id: "prod-2",
    name: "Dulcis Daily Renew Gel Moisturizer",
    price: 28.00,
    description: "Ultra-lightweight hydrating gel moisturizer with hyaluronic acid and green tea extract for all day skin cooling.",
    details: "A water-gel cream that floods the skin barrier with long-lasting hydration without clogging pores. Green tea extract acts as a calming antioxidant to soothe redness.",
    category: "creams",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 185,
    stock: 35,
    featured: true,
    ingredients: ["Hyaluronic Acid Complex", "Organic Green Tea Hydrosol", "Aloe Vera Leaf Juice", "Squalane"],
    benefits: ["Sustained 24-hour hydration barrier", "Extremely cooling, non-greasy gel base", "Calms skin redness and dry irritation", "Dermatologist tested, non-comedogenic"]
  },
  {
    id: "prod-3",
    name: "Dulcis Radiance Vitamin C Serum",
    price: 32.00,
    description: "Stabilized 15% Vitamin C serum with ferulic acid and Vitamin E to diminish dark spots and boost skin luminosity.",
    details: "Designed to counteract dullness and free-radical aging, this serum combines a highly active form of Vitamin C (L-Ascorbic Acid) with ferulic acid to double its natural antioxidant strength.",
    category: "serums",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    reviewsCount: 96,
    stock: 45,
    featured: true,
    ingredients: ["15% L-Ascorbic Acid (Vitamin C)", "0.5% Ferulic Acid", "1% Tocopherol (Vitamin E)", "Panthenol (Pro-Vitamin B5)"],
    benefits: ["Brightens dull skin tones", "Encourages healthy collagen synthesis", "Combats sun-induced oxidative damage", "Improves overall skin elasticity"]
  },
  {
    id: "prod-4",
    name: "Dulcis UV-Shield SPF 50 Sunblock",
    price: 24.00,
    description: "Broad-spectrum mineral SPF 50 sunscreen with zinc oxide, leaving a clean matte finish with zero white cast.",
    details: "Our daily physical barrier SPF 50 sunscreen protects skin cells from UVA and UVB rays. Lightweight formulation enriched with antioxidants for advanced cellular safety.",
    category: "sunblock",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    reviewsCount: 208,
    stock: 40,
    featured: true,
    ingredients: ["20% Zinc Oxide (Non-Nano)", "Organic Shea Butter", "Vitamin E (Antioxidant)", "Green Tea Extract"],
    benefits: ["Broad-spectrum UVA/UVB shield", "Completely matte, shine-free finish", "Leaves zero white cast on all skin tones", "Reef-safe, biodegradable, paraben-free"]
  },
  {
    id: "prod-5",
    name: "Dulcis Volumizing Biotin Shampoo",
    price: 22.00,
    description: "Sulfate-free scalp purifying shampoo infused with biotin and rosemary oil to encourage hair volume and follicle health.",
    details: "Cleanse scalp build-up while fortifying hair shafts. Biotin adds structural volume, and rosemary essential oil stimulates the follicles to support natural hair growth cycles.",
    category: "haircare",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    reviewsCount: 115,
    stock: 25,
    featured: false,
    ingredients: ["Biotin (Vitamin B7)", "Rosemary Leaf Oil Extract", "Hydrolyzed Wheat Protein", "Coconut-Derived Cleansers"],
    benefits: ["Adds weightless volume and bounce", "Soothes dry, itchy scalp build-up", "Sulfate-free, color-safe cleanser", "Strengthens brittle, thin hair strands"]
  },
  {
    id: "prod-6",
    name: "Dulcis Nourishing Argan Conditioner",
    price: 24.00,
    description: "Deep hydrating conditioner rich in Moroccan argan oil and silk proteins to detangle, smooth frizz, and add weightless shine.",
    details: "Restore elasticity and moisture to dry, frizzy strands. Enriched with cold-pressed Moroccan argan oil and plant proteins to repair cuticles and lock in shine.",
    category: "haircare",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 154,
    stock: 30,
    featured: false,
    ingredients: ["Cold-Pressed Moroccan Argan Oil", "Silk Amino Acids", "Organic Shea Butter", "Panthenol"],
    benefits: ["Detangles instantly & prevents split ends", "Smooths stubborn frizz and flyaways", "Deeply conditions without weighing down hair", "Improves overall hair elasticity and texture"]
  },
  {
    id: "prod-7",
    name: "Dulcis Clarifying Salicylic Serum",
    price: 30.00,
    description: "Targeted 2% BHA salicylic acid serum to clear congested pores, reduce blackheads, and prevent acne breakouts.",
    details: "An oil-soluble exfoliating serum that penetrates deep inside pores to clear acne blockages, dissolve sebum, and soothe inflammation for clear, uniform skin.",
    category: "serums",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 220,
    stock: 20,
    featured: false,
    ingredients: ["2% Salicylic Acid (BHA)", "Licorice Root Extract", "Tea Tree Hydrosol", "Hyaluronic Acid"],
    benefits: ["Clears congested pores & reduces acne", "Soothes skin blemishes and inflammation", "Evens out texture and rough skin", "Formulated with an optimal pH of 3.8"]
  },
  {
    id: "prod-8",
    name: "Dulcis Ceramide Barrier Cream",
    price: 34.00,
    description: "Rich, lipid-replenishing face cream formulated with 3 essential ceramides and squalane to heal damaged skin barriers.",
    details: "A lipid-rich recovery moisturizer that locks in moisture and speeds up barrier healing. Ideal for extremely dry, peeling, or sensitive skin types.",
    category: "creams",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 132,
    stock: 15,
    featured: false,
    ingredients: ["Ceramides AP, NP, and EOP", "Pure Squalane (Olive-derived)", "Colloidal Oatmeal Extract", "Allantoin"],
    benefits: ["Heals peeling, dry skin barriers", "Provides deep, lipid-rich recovery", "Calms itching & sensitivity", "Fragrance-free, hypoallergenic"]
  },
  {
    id: "prod-9",
    name: "Dulcis Mineral Tinted Sunscreen",
    price: 26.00,
    description: "Tinted SPF 30 daily sunscreen that blends seamlessly into all skin tones, providing UV cover and a light dewy glow.",
    details: "Protects against UV radiation while replacing a light foundation. Universal tint adapts to your unique skin tone to blur blemishes and uneven shades.",
    category: "sunblock",
    image: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    reviewsCount: 110,
    stock: 60,
    featured: false,
    ingredients: ["12% Titanium Dioxide", "6% Zinc Oxide", "Iron Oxide Pigments", "Organic Jojoba Oil"],
    benefits: ["Combines SPF protection with tone correction", "Blends easily for a dewy, glowing finish", "Enriched with cellular antioxidants", "Hydrates all skin types all day"]
  },
  {
    id: "prod-10",
    name: "Dulcis Restorative Hair Mask",
    price: 28.00,
    description: "Intense weekly treatment mask with coconut oil and keratin to restore dry, damaged, or color-treated hair strands.",
    details: "An intensive protein and moisture treatment that penetrates the hair cortex to rebuild keratin linkages, smoothing rough follicles and sealing dry ends.",
    category: "haircare",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 88,
    stock: 28,
    featured: false,
    ingredients: ["Hydrolyzed Keratin Protein", "Cold-Pressed Coconut Oil", "Panthenol", "Organic Honey Extract"],
    benefits: ["Rebuilds structural hair keratin", "Locks in intensive shine & moisture", "Seals cuticles to prevent split ends", "Excellent for processed or colored hair"]
  }
];

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { category?: string; search?: string } | void>({
      queryFn: async (arg) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        let filteredProducts = [...mockProducts];
        
        if (arg) {
          const { category, search } = arg;
          
          if (category && category !== "all") {
            filteredProducts = filteredProducts.filter(
              (product) => product.category.toLowerCase() === category.toLowerCase()
            );
          }
          
          if (search) {
            const query = search.toLowerCase();
            filteredProducts = filteredProducts.filter(
              (product) =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
          }
        }
        
        return { data: filteredProducts };
      },
    }),
    getProductById: builder.query<Product, string>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        const product = mockProducts.find((p) => p.id === id);
        if (!product) {
          return { error: { status: 404, statusText: "Product not found", data: null } };
        }
        
        return { data: product };
      },
    }),
    getCategories: builder.query<Category[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: mockCategories };
      },
    }),
    getFeaturedProducts: builder.query<Product[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: mockProducts.filter((p) => p.featured) };
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetFeaturedProductsQuery,
} = productsApi;
export default productsApi;
