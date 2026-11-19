export interface DeliveryZone {
    id: "zone_1_south_east" | "zone_2_center_west" | "zone_3_woluwe_north";
    name: string;
    campuses: string;
    postcodes: string[];
    deliveryDays: string[];
  }
  
  export const BRUSSELS_ZONES: DeliveryZone[] = [
    {
      id: "zone_1_south_east",
      name: "Zone 1 — Etterbeek, Ixelles & Auderghem",
      campuses: "ULB Solbosch/Plaine & VUB Etterbeek",
      postcodes: ["1040", "1050", "1160"],
      deliveryDays: ["Monday", "Thursday"],
    },
    {
      id: "zone_2_center_west",
      name: "Zone 2 — Brussels City, Saint-Gilles & Forest",
      campuses: "Brik Residences & Saint-Louis",
      postcodes: ["1000", "1060", "1190", "1070", "1080"],
      deliveryDays: ["Tuesday", "Friday"],
    },
    {
      id: "zone_3_woluwe_north",
      name: "Zone 3 — Woluwe, Schaerbeek & Evere",
      campuses: "EPHEC Woluwe & UCLouvain Brussels",
      postcodes: ["1200", "1150", "1030", "1140"],
      deliveryDays: ["Wednesday", "Saturday"],
    },
  ];
  
  export const TIME_WINDOWS = [
    { id: "10-12", label: "10:00 – 12:00", maxCapacity: 15 },
    { id: "14-16", label: "14:00 – 16:00", maxCapacity: 15 },
    { id: "16-18", label: "16:00 – 18:00", maxCapacity: 15 },
  ];
  
  export const CAMPUS_HUBS = [
    { id: "vub_etterbeek", name: "VUB Campus Hub (Etterbeek — 1050)", hours: "Mon–Fri 11:00–17:00" },
    { id: "ulb_solbosch", name: "ULB Solbosch Hub (Ixelles — 1050)", hours: "Mon–Fri 11:00–17:00" },
    { id: "ephec_woluwe", name: "EPHEC Campus Hub (Woluwe — 1200)", hours: "Tue & Thu 12:00–16:00" },
  ];
  
  export function findZoneByPostcode(postcode: string): DeliveryZone | null {
    const clean = postcode.trim();
    return BRUSSELS_ZONES.find((z) => z.postcodes.includes(clean)) ?? null;
  }