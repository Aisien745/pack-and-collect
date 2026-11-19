export type PackageSlug = "kitchen" | "bedroom" | "bathroom" | "cleaning";

export interface StarterPackage {
  slug: PackageSlug;
  name: string;
  tagline: string;
  categoryLabel: string;
  priceEur: number;
  depositEur: number;
  isConsumable: boolean;
  imageUrl: string;
  items: string[];
}

export const PACKAGES: StarterPackage[] = [
  {
    slug: "kitchen",
    name: "Kitchen Package",
    tagline: "Everything you need to cook and eat at home.",
    categoryLabel: "Kitchen essentials",
    priceEur: 59,
    depositEur: 25,
    isConsumable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80",
    items: [
      "1x Stainless steel frying pan (24 cm)",
      "1x Stainless steel saucepan with lid (2 L)",
      "2x Tempered opal glass dinner plates & 2x bowls",
      "2x Drinking glasses & 2x mugs",
      "16-piece stainless steel cutlery set",
      "1x Chef's knife, 1x paring knife & 2x cutting boards",
      "1x Spatula, 1x wooden spoon, 1x ladle & 1x colander",
      "2x Food containers, 2x tea towels & 1x oven glove",
    ],
  },
  {
    slug: "bedroom",
    name: "Bedroom Package",
    tagline: "A comfortable setup for a good night's sleep.",
    categoryLabel: "Bedding essentials",
    priceEur: 69,
    depositEur: 25,
    isConsumable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    items: [
      "1x All-season duvet (140×200 cm)",
      "1x Firm pillow (50×60 cm)",
      "1x 100% white cotton duvet cover & pillowcase",
      "1x Fitted sheet (90×200 cm)",
      "1x LED desk / bedside lamp + bulb",
      "1x Foldable laundry bag & 5x hangers",
    ],
  },
  {
    slug: "bathroom",
    name: "Bathroom Package",
    tagline: "The essential bathroom textiles for your stay.",
    categoryLabel: "Bathroom essentials",
    priceEur: 35,
    depositEur: 15,
    isConsumable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80",
    items: [
      "2x Large bath towels (70×140 cm)",
      "2x Hand towels (50×100 cm)",
      "1x Cotton bath mat",
      "1x Soap dispenser & 1x bathroom organizer",
    ],
  },
  {
    slug: "cleaning",
    name: "Cleaning Package",
    tagline: "Keep your accommodation clean and tidy with ease.",
    categoryLabel: "Cleaning essentials",
    priceEur: 10,
    depositEur: 0,
    isConsumable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80",
    items: [
      "2x Cleaning sponges & 2x microfiber cloths",
      "1x Multi-purpose cleaner (1 L)",
      "1x Dishwashing liquid (500 ml)",
      "1x Roll of bin bags (20-pack)",
    ],
  },
];

export interface CartSummary {
  rentalSubtotal: number;
  consumableSubtotal: number;
  bundleDiscount: number;
  deliveryFee: number;
  depositTotal: number;
  totalDueToday: number;
  isCompleteBundle: boolean;
}

export function calculateCart(
  selectedSlugs: PackageSlug[],
  deliveryMethod: "doorstep" | "campus_hub" = "doorstep"
): CartSummary {
  const selected = PACKAGES.filter((p) => selectedSlugs.includes(p.slug));

  const hasKitchen = selectedSlugs.includes("kitchen");
  const hasBedroom = selectedSlugs.includes("bedroom");
  const hasBathroom = selectedSlugs.includes("bathroom");
  const isCompleteBundle = hasKitchen && hasBedroom && hasBathroom;

  const rentalSubtotal = selected
    .filter((p) => !p.isConsumable)
    .reduce((sum, p) => sum + p.priceEur, 0);

  const consumableSubtotal = selected
    .filter((p) => p.isConsumable)
    .reduce((sum, p) => sum + p.priceEur, 0);

  // €14 bundle discount when Kitchen + Bedroom + Bathroom are combined (€163 -> €149)
  const bundleDiscount = isCompleteBundle ? 14 : 0;
  const netRental = rentalSubtotal - bundleDiscount;

  // Deposit capped at €45 for Complete Bundle (vs €65 separate)
  const rawDeposit = selected.reduce((sum, p) => sum + p.depositEur, 0);
  const depositTotal = isCompleteBundle ? 45 : rawDeposit;

  const merchandiseTotal = netRental + consumableSubtotal;
  const deliveryFee =
    deliveryMethod === "campus_hub" || merchandiseTotal >= 50 || merchandiseTotal === 0
      ? 0
      : 8;

  const totalDueToday = merchandiseTotal + deliveryFee + depositTotal;

  return {
    rentalSubtotal,
    consumableSubtotal,
    bundleDiscount,
    deliveryFee,
    depositTotal,
    totalDueToday,
    isCompleteBundle,
  };
}