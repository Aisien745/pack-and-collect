export type PackageSlug = "kitchen" | "bedroom" | "bathroom" | "cleaning";

export interface StarterPackage {
  slug: PackageSlug;
  name: string;
  tagline: string;
  priceEur: number;
  depositEur: number;
  isConsumable: boolean;
  badge?: string;
  items: string[];
}

export const PACKAGES: StarterPackage[] = [
  {
    slug: "kitchen",
    name: "Kitchen Package",
    tagline: "Cook & host from day one — packed in a padded divider bag",
    priceEur: 59,
    depositEur: 20,
    isConsumable: false,
    badge: "Break-Resistant Opal Glass",
    items: [
      "1x Stainless steel frying pan (24 cm)",
      "1x Stainless steel saucepan with lid (2 L)",
      "2x Tempered opal glass dinner plates & 2x bowls",
      "2x Drinking glasses & 2x mugs",
      "16-piece stainless steel cutlery set",
      "1x Sharp chef's knife, 1x paring knife & 2x cutting boards",
      "1x Spatula, 1x wooden spoon, 1x ladle & 1x colander",
      "2x Food containers, 2x tea towels & 1x oven glove",
    ],
  },
  {
    slug: "bedroom",
    name: "Bedroom Package",
    tagline: "Ready for Night 1 — thermal-sanitized 100% white cotton",
    priceEur: 69,
    depositEur: 20,
    isConsumable: false,
    badge: "Most Popular",
    items: [
      "1x All-season duvet (140×200 cm)",
      "1x Firm pillow (50×60 cm)",
      "1x 100% cotton duvet cover & pillowcase set",
      "1x Fitted bed sheet (90×200 cm)",
      "1x LED desk / bedside lamp + bulb",
      "1x Foldable laundry bag & 5x clothes hangers",
    ],
  },
  {
    slug: "bathroom",
    name: "Bathroom Package",
    tagline: "High-GSM hotel-grade towels sealed after sanitization",
    priceEur: 35,
    depositEur: 20,
    isConsumable: false,
    items: [
      "2x Large bath towels (70×140 cm)",
      "2x Hand towels (50×100 cm)",
      "1x Cotton bath mat",
      "1x Soap dispenser & 1x bathroom organizer",
    ],
  },
  {
    slug: "cleaning",
    name: "Cleaning Kit (Keep It)",
    tagline: "Day-1 consumables — outright purchase, no return needed",
    priceEur: 10,
    depositEur: 0,
    isConsumable: true,
    badge: "No Deposit",
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
  qualifiesForFreeDelivery: boolean;
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

  // €14 bundle discount when all 3 rental kits are chosen (€163 -> €149)
  const bundleDiscount = isCompleteBundle ? 14 : 0;
  const netRental = rentalSubtotal - bundleDiscount;

  // Deposit capped at €35 for Complete Bundle, €20 per standalone rental kit
  const rawDeposit = selected.reduce((sum, p) => sum + p.depositEur, 0);
  const depositTotal = isCompleteBundle ? 35 : rawDeposit;

  // Free cargo-bike delivery for orders >= €50, or campus hub pickup
  const orderMerchandiseTotal = netRental + consumableSubtotal;
  const qualifiesForFreeDelivery = orderMerchandiseTotal >= 50;
  const deliveryFee =
    deliveryMethod === "campus_hub" || qualifiesForFreeDelivery || orderMerchandiseTotal === 0
      ? 0
      : 8;

  const totalDueToday = orderMerchandiseTotal + deliveryFee + depositTotal;

  return {
    rentalSubtotal,
    consumableSubtotal,
    bundleDiscount,
    deliveryFee,
    depositTotal,
    totalDueToday,
    isCompleteBundle,
    qualifiesForFreeDelivery,
  };
}