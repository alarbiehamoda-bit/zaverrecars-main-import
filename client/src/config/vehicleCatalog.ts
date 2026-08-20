/**
 * ZAVERRE — The Atelier Ledger design system.
 * Public customer-facing vehicle data only.
 */

import { partnerCatalog } from "@/data/archivePartnerCatalog";
import { workbookFleetEntries } from "@/data/workbookFleet";

export type VehicleSpecification = {
  label: string;
  value: string;
};

export type VehicleImageSettings = {
  fit?: "contain" | "cover" | "fill";
  position?: "center" | "top" | "bottom" | "left" | "right" | string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
};

export const defaultVehicleImageSettings: Required<VehicleImageSettings> = {
  fit: "contain",
  position: "center",
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export function resolveVehicleImageSettings(settings?: VehicleImageSettings): Required<VehicleImageSettings> {
  return { ...defaultVehicleImageSettings, ...settings };
}

export type Vehicle = {
  id: string;
  index: number;
  brand: string;
  brandLogoUrl?: string;
  model: string;
  fullName: string;
  category: 'Performance' | 'Luxury SUV' | 'Convertible';
  image: string;
  imageSettings?: VehicleImageSettings;
  galleryImageFit?: VehicleImageSettings["fit"];
  gallery?: string[];
  sourceReference: string;
  color?: string;
  sourceCategories?: string[];
  filterBrands?: string[];
  priceAedPerDay: number;
  description?: string;
  specifications: VehicleSpecification[];
  rentalDetails?: VehicleSpecification[];
  features?: string[];
  conditions: string[];
  cardPresentation?: {
    kicker?: string;
    title?: string;
    facts?: VehicleSpecification[];
    ctaLabel?: string;
  };
  detailPresentation?: {
    eyebrow?: string;
    title?: string;
    colour?: string;
    priceLabel?: string;
    priceNote?: string;
  };
};

const legacyVehicleCatalog: Vehicle[] = [
  {
    "id": "vehicle-001",
    "index": 1,
    "brand": "Lamborghini",
    "model": "Revuelto",
    "fullName": "Lamborghini Revuelto",
    "category": "Performance",
    "image": "/manus-storage/lamborghini-revuelto-orange_f88b62a0.jpg",
    "priceAedPerDay": 11000,
    "description": "The Lamborghini Revuelto combines a naturally aspirated 6.5L V12 with three electric motors in a plug-in hybrid supercar. Its carbon-fibre chassis, all-wheel drive and dual-clutch gearbox blend dramatic performance with advanced hybrid engineering.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V12 · 6.5L" }, { "label": "0–100 km/h", "value": "2.5 seconds" }, { "label": "Power", "value": "1015 horsepower" }, { "label": "Transmission", "value": "8-speed Graziano dual-clutch automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2025" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Orange"
  },
  {
    "id": "vehicle-002",
    "index": 2,
    "brand": "Lamborghini",
    "model": "Aventador SVJ",
    "fullName": "Lamborghini Aventador SVJ",
    "category": "Performance",
    "image": "/manus-storage/lamborghini-aventador-svj-yellow_8827ca29.jpg",
    "priceAedPerDay": 9000,
    "description": "The Lamborghini Aventador SVJ Roadster is a mid-engine V12 supercar with all-wheel drive, scissor doors and a two-seat open-air configuration. Its low, wide proportions and naturally aspirated engine define a highly focused supercar experience.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V12 · 6.5L" }, { "label": "0–100 km/h", "value": "2.98 seconds" }, { "label": "Power", "value": "770 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Yellow"
  },
  {
    "id": "vehicle-003",
    "index": 3,
    "brand": "Lamborghini",
   "model": "Huracan STO",
   "fullName": "Lamborghini Huracan STO",
   "category": "Performance",
    "image": "/manus-storage/lamborghini-huracan-sto-green-primary_3c1a6ab7.jpg",
   "priceAedPerDay": 4000,
    "description": "The Lamborghini Huracan STO is a track-focused, road-legal supercar built around a naturally aspirated V10 and rear-wheel drive. Its lower weight, performance brakes and focused aerodynamics deliver a highly direct driving experience.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V10 · 5.2L" }, { "label": "0–100 km/h", "value": "3.0 seconds" }, { "label": "Power", "value": "640 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2022" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Green"
  },
  {
    "id": "vehicle-004",
    "index": 4,
    "brand": "Lamborghini",
   "model": "Urus Mansory",
   "fullName": "Lamborghini Urus Mansory",
   "category": "Luxury SUV",
    "image": "/manus-storage/lamborghini-urus-mansory-black-green_b16f9d77.jpg",
   "priceAedPerDay": 4000,
    "description": "The Lamborghini Urus Mansory Venatus combines super sport utility vehicle performance with the practicality of a luxury SUV. It is configured with a V8 engine, all-wheel drive and a distinctive Mansory treatment.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.3 seconds" }, { "label": "Power", "value": "900 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "4" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Black / Green"
  },
  {
    "id": "vehicle-005",
    "index": 5,
    "brand": "Lamborghini",
   "model": "Huracan STO",
   "fullName": "Lamborghini Huracan STO",
   "category": "Performance",
    "image": "/manus-storage/lamborghini-huracan-sto-orange_e0fe32a4.jpg",
   "priceAedPerDay": 4000,
    "description": "The Lamborghini Huracan STO is a street-legal, track-focused Huracan with a naturally aspirated V10 and rear-wheel drive. Its lower weight, performance brakes and focused aerodynamics deliver a highly direct driving experience.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V10 · 5.2L" }, { "label": "0–100 km/h", "value": "3.0 seconds" }, { "label": "Power", "value": "640 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Orange"
  },
  {
    "id": "vehicle-006",
    "index": 6,
    "brand": "Lamborghini",
   "model": "Urus",
   "fullName": "Lamborghini Urus",
   "category": "Luxury SUV",
    "image": "/manus-storage/lamborghini-urus-blue_21efaff4.jpg",
   "priceAedPerDay": 2800,
    "description": "The Lamborghini Urus combines supercar performance with luxury SUV versatility. Its twin-turbo V8, all-wheel drive, adaptive air suspension and multiple drive modes balance performance, comfort and everyday usability.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.6 seconds" }, { "label": "Power", "value": "650 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Blue"
  },
  {
    "id": "vehicle-007",
    "index": 7,
    "brand": "Lamborghini",
    "model": "Urus",
    "fullName": "Lamborghini Urus",
    "category": "Luxury SUV",
    "image": "/manus-storage/lamborghini-urus-purple_c79c9393.jpg",
    "priceAedPerDay": 2800,
    "description": "The Lamborghini Urus combines supercar performance with luxury SUV versatility. Its twin-turbo V8, all-wheel drive, adaptive air suspension and multiple drive modes balance performance, comfort and everyday usability.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.6 seconds" }, { "label": "Power", "value": "650 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Purple"
  },
  {
    "id": "vehicle-008",
    "index": 8,
    "brand": "Lamborghini",
    "model": "Urus",
    "fullName": "Lamborghini Urus",
    "category": "Luxury SUV",
    "image": "/manus-storage/lamborghini-urus-yellow_ea857068.jpg",
    "priceAedPerDay": 2800,
    "description": "The Lamborghini Urus combines the performance character of a twin-turbo V8 with the everyday versatility of a luxury SUV. All-wheel drive and a practical five-seat layout support both long-distance comfort and dynamic road use.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.6 seconds" }, { "label": "Power", "value": "650 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Yellow"
  },
  {
    "id": "vehicle-009",
    "index": 9,
    "brand": "Lamborghini",
    "model": "Urus",
    "fullName": "Lamborghini Urus",
    "category": "Luxury SUV",
    "image": "/manus-storage/lamborghini-urus-black_30f60fe7.jpg",
    "priceAedPerDay": 2800,
    "description": "The Lamborghini Urus combines the performance character of a twin-turbo V8 with the everyday versatility of a luxury SUV. All-wheel drive and a practical five-seat layout support both long-distance comfort and dynamic road use.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.6 seconds" }, { "label": "Power", "value": "650 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-010",
    "index": 10,
    "brand": "Lamborghini",
   "model": "Huracan Tecnica",
   "fullName": "Lamborghini Huracan Tecnica",
   "category": "Performance",
    "image": "/manus-storage/lamborghini-huracan-tecnica_506d8de9.jpg",
   "priceAedPerDay": 3500,
    "description": "The Lamborghini Huracan Tecnica is a rear-wheel-drive supercar combining a naturally aspirated 5.2L V10 with focused aerodynamics, rear-wheel steering and driver-oriented materials. It balances sharp handling with long-drive usability.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V10 · 5.2L" }, { "label": "0–100 km/h", "value": "3.2 seconds" }, { "label": "Power", "value": "640 horsepower" }, { "label": "Transmission", "value": "7-Dual Clutch Speed Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2023" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg"
  },
  {
    "id": "vehicle-011",
    "index": 11,
    "brand": "Lamborghini",
   "model": "Huracan Evo Spyder",
   "fullName": "Lamborghini Huracan Evo Spyder",
   "category": "Performance",
    "image": "/manus-storage/lamborghini-huracan-evo-spyder-black_00911571.jpg",
   "priceAedPerDay": 3000,
    "description": "The Lamborghini Huracan EVO Spyder combines a naturally aspirated V10 with rear-wheel drive, advanced aerodynamics and an open-top cabin. Its engineered driving systems focus on precision, high-revving performance and convertible touring.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V10 · 5.2L" }, { "label": "0–100 km/h", "value": "3.1 seconds" }, { "label": "Power", "value": "640 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2023" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-012",
    "index": 12,
    "brand": "Lamborghini",
    "model": "Huracan Evo Spyder",
    "fullName": "Lamborghini Huracan Evo Spyder",
    "category": "Performance",
    "image": "/manus-storage/lamborghini-huracan-evo-spyder-red_00498b7a.jpg",
    "priceAedPerDay": 3000,
    "description": "The Lamborghini Huracan EVO Spyder combines a naturally aspirated V10 with rear-wheel drive, advanced aerodynamics and an open-top cabin. Its engineered driving systems focus on precision, high-revving performance and convertible touring.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V10 · 5.2L" }, { "label": "0–100 km/h", "value": "3.1 seconds" }, { "label": "Power", "value": "640 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Red"
  },
  {
    "id": "vehicle-013",
    "index": 13,
    "brand": "Lamborghini",
   "model": "Huracan Evo Spyder",
   "fullName": "Lamborghini Huracan Evo Spyder",
   "category": "Performance",
    "image": "/manus-storage/lamborghini-huracan-evo-spyder-blue_ebf00434.jpg",
   "priceAedPerDay": 3000,
    "description": "The Lamborghini Huracan EVO Spyder is an open-top V10 performance car with rear-wheel drive and lightweight forged-carbon construction. Its compact proportions and naturally aspirated engine create a focused, high-revving driving experience.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V10 · 5.2L" }, { "label": "0–100 km/h", "value": "3.1 seconds" }, { "label": "Power", "value": "640 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2022" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Blue"
  },
  {
    "id": "vehicle-014",
    "index": 14,
    "brand": "Lamborghini",
    "model": "Huracan Evo Spyder",
    "fullName": "Lamborghini Huracan Evo Spyder",
    "category": "Performance",
    "image": "/manus-storage/lamborghini-huracan-evo-spyder-green_5eb6a085.jpg",
    "priceAedPerDay": 3000,
    "description": "The Lamborghini Huracan EVO Spyder combines a naturally aspirated V10 with rear-wheel drive, advanced aerodynamics and an open-top cabin. Its engineered driving systems focus on precision, high-revving performance and convertible touring.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V10 · 5.2L" }, { "label": "0–100 km/h", "value": "3.1 seconds" }, { "label": "Power", "value": "640 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Green"
  },
  {
    "id": "vehicle-015",
    "index": 15,
    "brand": "Lamborghini",
   "model": "Huracan Evo Coupe",
   "fullName": "Lamborghini Huracan Evo Coupe",
   "category": "Performance",
    "image": "/manus-storage/lamborghini-huracan-evo-coupe-orange_bbaca4ef.jpg",
   "priceAedPerDay": 2500,
    "description": "The Lamborghini Huracan EVO Coupe pairs a naturally aspirated V10 with all-wheel drive, two-seat proportions and a streamlined performance-focused design. Italian craftsmanship and sharp aerodynamic lines define the cabin and exterior treatment.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V10 · 5.2L" }, { "label": "0–100 km/h", "value": "2.9 seconds" }, { "label": "Power", "value": "602 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2021" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_02.jpg",
    "color": "Orange"
  },
  {
    "id": "vehicle-016",
    "index": 16,
    "brand": "Ferrari",
   "model": "Purosangue Novitec",
   "fullName": "Ferrari Purosangue Novitec",
   "category": "Performance",
    "image": "/manus-storage/ferrari-purosangue-novitec-black_8e3716d0.jpg",
   "priceAedPerDay": 10000,
    "description": "The Ferrari Purosangue Novitec combines a naturally aspirated V12 with all-wheel drive and a four-seat, four-door layout. Novitec styling and performance enhancements add a more distinctive visual character while preserving a driver-focused luxury SUV cabin.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V12 · 6.5L" }, { "label": "0–100 km/h", "value": "3.3 seconds" }, { "label": "Power", "value": "725 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "4" }, { "label": "Year", "value": "2024" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_03.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-017",
    "index": 17,
    "brand": "Ferrari",
   "model": "812 GTS Novitec Spider",
   "fullName": "Ferrari 812 GTS Novitec Spider",
   "category": "Convertible",
    "image": "/manus-storage/ferrari-812-gts-novitec-spider-gray_2ce45117.jpg",
   "priceAedPerDay": 10000,
    "description": "The Ferrari 812 GTS Novitec Spyder is a two-seat, front-engined V12 convertible with rear-wheel drive and automatic transmission. Its Novitec-tuned character, open-top configuration and 840-horsepower output combine dramatic performance with a focused luxury cockpit.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V12 · 6.5L" }, { "label": "0–100 km/h", "value": "2.8 seconds" }, { "label": "Power", "value": "840 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Colour", "value": "Gray" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_03.jpg",
    "color": "Gray"
  },
  {
    "id": "vehicle-018",
    "index": 18,
    "brand": "Ferrari",
   "model": "SF90 Spider",
   "fullName": "Ferrari SF90 Spider",
   "category": "Convertible",
    "image": "/manus-storage/ferrari-sf90-spider-red_95712cfc.jpg",
   "priceAedPerDay": 9000,
    "description": "The Ferrari SF90 Spider combines a twin-turbo V8 with three electric motors in an all-wheel-drive plug-in hybrid supercar. Its eight-speed automatic transmission and electrified powertrain pair high output with open-top performance.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "2.5 seconds" }, { "label": "Power", "value": "986 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2022" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_03.jpg",
    "color": "Red"
  },
  {
    "id": "vehicle-019",
    "index": 19,
    "brand": "Ferrari",
    "model": "296 GTS Spider",
    "fullName": "Ferrari 296 GTS Spider",
    "category": "Convertible",
    "image": "/manus-storage/ferrari-296-gts-spider-red_cea18f18.jpg",
    "priceAedPerDay": 4000,
    "description": "The Ferrari 296 GTS Spider is an open-top V6 plug-in hybrid supercar that combines advanced hybrid power with classic Ferrari design. Its rear-wheel-drive layout delivers high performance while retaining everyday usability.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V6 · 3.0L" }, { "label": "0–100 km/h", "value": "2.9 seconds" }, { "label": "Power", "value": "819 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2023" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_03.jpg",
    "color": "Red"
  },
  {
    "id": "vehicle-020",
    "index": 20,
    "brand": "Ferrari",
    "model": "F8 Novitec Spider",
    "fullName": "Ferrari F8 Novitec Spider",
    "category": "Convertible",
    "image": "/manus-storage/ferrari-f8-novitec-spider-red_3ff0b150.jpg",
    "priceAedPerDay": 4000,
    "description": "The 2022 Ferrari F8 Tributo Spider Novitec is a two-seat, mid-engine V8 supercar with strong chassis response and high cornering grip. Its performance-focused configuration retains the refined, open-top character of the F8 while delivering immediate acceleration and rear-wheel-drive engagement.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 3.9L" }, { "label": "0–100 km/h", "value": "2.8 seconds" }, { "label": "Power", "value": "802 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Colour", "value": "Red" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_03.jpg",
    "color": "Red"
  },
  {
    "id": "vehicle-021",
    "index": 21,
    "brand": "Ferrari",
    "model": "F8 Spider",
    "fullName": "Ferrari F8 Spider",
    "category": "Convertible",
    "image": "/manus-storage/ferrari-f8-spider-yellow_217a8f61.jpg",
    "priceAedPerDay": 3500,
    "description": "The 2022 Ferrari F8 Tributo is a two-seat supercar with a twin-turbo 3.9L V8, substantial torque and a strong chassis. Its rear-wheel-drive layout and refined cabin combine quick response with the comfort expected of a modern open-top performance car.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 3.9L" }, { "label": "0–100 km/h", "value": "2.8 seconds" }, { "label": "Power", "value": "710 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Colour", "value": "Yellow" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_03.jpg",
    "color": "Yellow"
  },
  {
    "id": "vehicle-022",
    "index": 22,
    "brand": "Ferrari",
   "model": "Roma Spider",
   "fullName": "Ferrari Roma Spider",
   "category": "Convertible",
    "image": "/manus-storage/ferrari-roma-spider-red_515c2175.jpg",
   "priceAedPerDay": 3300,
    "description": "The Ferrari Roma Spyder pairs a twin-turbo V8 with rear-wheel drive and a two-seat convertible layout. Its streamlined grand-touring design, eight-speed dual-clutch transmission and modern driver-assistance features balance open-air style with performance.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 3.9L" }, { "label": "0–100 km/h", "value": "3.4 seconds" }, { "label": "Power", "value": "611 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2024" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_03.jpg",
    "color": "Red"
  },
  {
    "id": "vehicle-023",
    "index": 23,
    "brand": "Ferrari",
    "model": "F8 Spider",
    "fullName": "Ferrari F8 Spider",
    "category": "Convertible",
    "image": "/manus-storage/ferrari-f8-spider-matt-black_6ccaec6e.jpg",
    "priceAedPerDay": 3500,
    "description": "The Ferrari F8 Tributo Spyder combines mid-engine V8 performance, advanced aerodynamic solutions and a retractable rear spoiler in an open-top supercar. Its 3.9L twin-turbocharged V8 delivers responsive power, while the S-Duct and airflow management systems are engineered to improve high-speed stability and downforce.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 3.9L" }, { "label": "0–100 km/h", "value": "2.8 seconds" }, { "label": "Power", "value": "710 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Colour", "value": "Matte Black" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_03.jpg",
    "color": "Matt Black"
  },
  {
    "id": "vehicle-024",
    "index": 24,
    "brand": "McLaren",
    "model": "750S Spider",
    "fullName": "McLaren 750S Spider",
    "category": "Convertible",
    "image": "/manus-storage/mclaren-750s-spider-purple_2f8fd1ba.jpg",
    "priceAedPerDay": 4500,
    "description": "The McLaren 750S Spyder pairs a twin-turbo V8 and rear-wheel drive with an open-roof configuration. Its lightweight construction, responsive hydraulic steering and active rear wing focus the experience on immediate performance and road feedback.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "2.8 seconds" }, { "label": "Power", "value": "740 horsepower" }, { "label": "Transmission", "value": "7-Dual Clutch Speed Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2025" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_04.jpg",
    "color": "Purple"
  },
  {
    "id": "vehicle-025",
    "index": 25,
    "brand": "McLaren",
    "model": "765 LT",
    "fullName": "McLaren 765 LT",
    "category": "Performance",
    "image": "/manus-storage/mclaren-765-lt_420153b5.jpg",
    "priceAedPerDay": 5000,
    "description": "The McLaren 765 LT is a Longtail supercar built around a 4.0L V8, low weight and aerodynamic precision. Its focused rear-wheel-drive configuration and performance engineering draw on McLaren’s established Longtail lineage.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "2.8 seconds" }, { "label": "Power", "value": "765 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2022" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_04.jpg"
  },
  {
    "id": "vehicle-026",
    "index": 26,
    "brand": "McLaren",
   "model": "750S Spider",
   "fullName": "McLaren 750S Spider",
   "category": "Convertible",
    "image": "/manus-storage/mclaren-750s-spider-tiffany-blue_e6c02112.jpg",
   "priceAedPerDay": 4500,
    "description": "The McLaren 750S Spyder pairs a twin-turbo V8 and rear-wheel drive with an open-roof configuration. Its lightweight construction, responsive hydraulic steering and active rear wing focus the experience on immediate performance and road feedback.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "2.8 seconds" }, { "label": "Power", "value": "740 horsepower" }, { "label": "Transmission", "value": "7-Dual Clutch Speed Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2025" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_04.jpg",
    "color": "Tiffany Blue"
  },
  {
    "id": "vehicle-027",
    "index": 27,
    "brand": "McLaren",
   "model": "720s Novitec Spider",
   "fullName": "McLaren 720s Novitec Spider",
   "category": "Convertible",
    "image": "/manus-storage/mclaren-720s-novitec-spider-orange_d4798a8d.jpg",
   "priceAedPerDay": 4000,
    "description": "The McLaren 720S Novitec Spyder combines a carbon-fibre chassis, a twin-turbo 4.0L V8 and rear-wheel drive. Its lightweight construction, adjustable suspension and automatic transmission are tailored to a fast, agile open-air supercar experience.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "2.7 seconds" }, { "label": "Power", "value": "806 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Colour", "value": "Orange" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_04.jpg",
    "color": "Orange"
  },
  {
    "id": "vehicle-028",
    "index": 28,
    "brand": "McLaren",
   "model": "Artura Spider",
    "fullName": "McLaren Artura Spider",
   "category": "Convertible",
    "image": "/manus-storage/mclaren-artura-spider-orange-complete_22778bd3.webp",
   "priceAedPerDay": 3500,
    "description": "The McLaren Artura Spyder blends a 3.0L twin-turbo V6 hybrid powertrain with a lightweight carbon-fibre monocoque. Its open-air design, rear-wheel drive and performance-focused chassis bring responsive acceleration and precise handling to a two-seat convertible.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V6 · 3.0L" }, { "label": "0–100 km/h", "value": "3.0 seconds" }, { "label": "Power", "value": "700 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Colour", "value": "Orange" }, { "label": "Year", "value": "2024" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_04.jpg",
    "color": "Orange"
  },
  {
    "id": "vehicle-029",
    "index": 29,
    "brand": "McLaren",
   "model": "Artura Spider",
   "fullName": "McLaren Artura Spider",
   "category": "Convertible",
    "image": "/manus-storage/mclaren-artura-spider-white_85b9494e.jpg",
   "priceAedPerDay": 3500,
    "description": "The white McLaren Artura Spyder is a two-seat hybrid supercar pairing a 3.0L twin-turbo V6 with an eight-speed automatic transmission. Its folding hardtop, lightweight carbon-fibre structure and rear-wheel-drive layout combine open-air driving with focused performance.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V6 · 3.0L" }, { "label": "0–100 km/h", "value": "3.0 seconds" }, { "label": "Power", "value": "691 horsepower" }, { "label": "Transmission", "value": "8-Speed Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Colour", "value": "White" }, { "label": "Year", "value": "2025" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_04.jpg",
    "color": "White"
  },
  {
    "id": "vehicle-030",
    "index": 30,
    "brand": "McLaren",
    "model": "720s Spider",
    "fullName": "McLaren 720s Spider",
    "category": "Convertible",
    "image": "/manus-storage/mclaren-720s-spider_1b2aacd6.jpg",
    "priceAedPerDay": 3500,
    "description": "The McLaren 720S is a lightweight twin-turbo V8 supercar built with extensive aluminium and carbon-fibre construction. Rear-wheel drive, rapid acceleration and a sleek aerodynamic design define its focused performance character.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "2.8 seconds" }, { "label": "Power", "value": "710 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2020" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_04.jpg"
  },
  {
    "id": "vehicle-031",
    "index": 31,
    "brand": "McLaren",
   "model": "Artura",
   "fullName": "McLaren Artura",
   "category": "Performance",
    "image": "/manus-storage/mclaren-artura_7439887c.jpg",
   "priceAedPerDay": 3000,
    "description": "The McLaren Artura is a two-seat hybrid supercar built around a twin-turbo 3.0L V6 and electric motor. Its carbon-fibre architecture, compact performance powertrain and rear-wheel-drive configuration bring a balance of immediate response, everyday usability and efficiency.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V6 · 3.0L" }, { "label": "0–100 km/h", "value": "3.0 seconds" }, { "label": "Power", "value": "680 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Colour", "value": "Baby Blue" }, { "label": "Year", "value": "2023" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_04.jpg"
  },
  {
    "id": "vehicle-032",
    "index": 32,
    "brand": "Mercedes-Benz",
    "model": "Brabus G800 63",
    "fullName": "Mercedes-Benz Brabus G800 63",
    "category": "Performance",
    "image": "/manus-storage/mercedes-benz-brabus-g800-63-mauve_68d4202c.jpg",
    "priceAedPerDay": 3000,
    "description": "The Mercedes Brabus G63 800 Widestar brings a Brabus exterior body kit, extended wheel arches and revised exhaust to the G-Class platform, with twin-turbo V8 power and all-wheel drive.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 biturbo · 4.0L" }, { "label": "0–100 km/h", "value": "4.1 seconds" }, { "label": "Power", "value": "700 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Mauve"
  },
  {
    "id": "vehicle-033",
    "index": 33,
    "brand": "Mercedes-Benz",
    "model": "Brabus G800 63",
    "fullName": "Mercedes-Benz Brabus G800 63",
    "category": "Performance",
    "image": "/manus-storage/mercedes-benz-brabus-g800-63-tiffany-blue_cc3cb1e8.jpg",
    "priceAedPerDay": 3000,
    "description": "The Mercedes Brabus G63 800 Widestar brings a Brabus exterior body kit, extended wheel arches and revised exhaust to the G-Class platform, with twin-turbo V8 power and all-wheel drive.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 biturbo · 4.0L" }, { "label": "0–100 km/h", "value": "4.1 seconds" }, { "label": "Power", "value": "700 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Tiffany Blue"
  },
  {
    "id": "vehicle-034",
    "index": 34,
    "brand": "Mercedes-Benz",
    "model": "Brabus G800 63",
    "fullName": "Mercedes-Benz Brabus G800 63",
    "category": "Performance",
    "image": "/manus-storage/mercedes-benz-brabus-g800-63-green_6b99d6c2.jpg",
    "priceAedPerDay": 3000,
    "description": "The Mercedes Brabus G63 800 Widestar brings a Brabus exterior body kit, extended wheel arches and revised exhaust to the G-Class platform, with twin-turbo V8 power and all-wheel drive.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 biturbo · 4.0L" }, { "label": "0–100 km/h", "value": "4.1 seconds" }, { "label": "Power", "value": "700 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Green"
  },
  {
    "id": "vehicle-035",
    "index": 35,
    "brand": "Mercedes-Benz",
    "model": "Brabus G800 63",
    "fullName": "Mercedes-Benz Brabus G800 63",
    "category": "Performance",
    "image": "/manus-storage/mercedes-benz-brabus-g800-63-purple_f547c9c3.jpg",
    "priceAedPerDay": 3000,
    "description": "The Mercedes Brabus G63 800 Widestar brings a Brabus exterior body kit, extended wheel arches and revised exhaust to the G-Class platform, with twin-turbo V8 power and all-wheel drive.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 biturbo · 4.0L" }, { "label": "0–100 km/h", "value": "4.1 seconds" }, { "label": "Power", "value": "700 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Purple"
  },
  {
    "id": "vehicle-036",
    "index": 36,
    "brand": "Mercedes-Benz",
    "model": "GLS 63 S Brabus",
    "fullName": "Mercedes-Benz GLS 63 S Brabus",
    "category": "Luxury SUV",
    "image": "/manus-storage/mercedes-benz-gls-63-s-brabus-black_93a69332.jpg",
    "priceAedPerDay": 2000,
    "description": "The Mercedes-Benz AMG GLS63 S BRABUS combines a three-row SUV layout with V8 performance, all-wheel drive and AMG-focused exterior and cabin details.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V8 · 4.4L" }, { "label": "0–100 km/h", "value": "3.6 seconds" }, { "label": "Power", "value": "800 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "7" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-037",
    "index": 37,
    "brand": "Mercedes-Benz",
   "model": "GLS600 Maybach",
   "fullName": "Mercedes-Benz GLS600 Maybach",
   "category": "Luxury SUV",
    "image": "/manus-storage/mercedes-benz-gls600-maybach-black_7e6864e3.jpg",
   "priceAedPerDay": 2000,
    "description": "The Mercedes-Benz GLS600 Maybach is a luxury SUV with a twin-turbo V8, all-wheel drive and a spacious four-seat cabin. Its focus is refined long-distance comfort, premium materials and integrated technology.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "4.9 seconds" }, { "label": "Power", "value": "550 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "4" }, { "label": "Year", "value": "2021" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-038",
    "index": 38,
    "brand": "Mercedes-Benz",
   "model": "C63",
   "fullName": "Mercedes-Benz C63",
   "category": "Performance",
    "image": "/manus-storage/mercedes-benz-c63_c714384e.jpg",
   "priceAedPerDay": 1500,
    "description": "The Mercedes-Benz AMG C63 is a four-door performance saloon with all-wheel drive and automatic transmission. Its AMG-focused design, performance suspension and technology-rich cabin combine strong acceleration with everyday comfort for up to five passengers.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "I4 · 4.0L" }, { "label": "0–100 km/h", "value": "3.4 seconds" }, { "label": "Power", "value": "671 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Colour", "value": "Nardo Gray" }, { "label": "Year", "value": "2024" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg"
  },
  {
    "id": "vehicle-039",
    "index": 39,
    "brand": "Mercedes-Benz",
    "model": "AMG GT63",
    "fullName": "Mercedes-Benz AMG GT63",
    "category": "Performance",
    "image": "/manus-storage/mercedes-benz-amg-gt63-grey_5cfc4ff1.jpg",
    "priceAedPerDay": 2500,
    "description": "The Mercedes-Benz AMG GT63 Coupe combines a twin-turbo V8, all-wheel drive and a four-seat grand-touring layout. Its active aerodynamics, adaptive suspension and premium performance cabin balance straight-line speed with everyday usability.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.2 seconds" }, { "label": "Power", "value": "577 horsepower" }, { "label": "Transmission", "value": "9-Speed Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "4" }, { "label": "Year", "value": "2025" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Grey"
  },
  {
    "id": "vehicle-040",
    "index": 40,
    "brand": "Mercedes-Benz",
    "model": "AMG G63",
    "fullName": "Mercedes-Benz AMG G63",
    "category": "Performance",
    "image": "/manus-storage/mercedes-benz-amg-g63-matt-gray_348d407b.jpg",
    "priceAedPerDay": 1800,
    "specifications": [{ "label": "Engine", "value": "V8" }, { "label": "0–100 km/h", "value": "4.5 seconds" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Matt Gray"
  },
  {
    "id": "vehicle-041",
    "index": 41,
    "brand": "Mercedes-Benz",
    "model": "AMG G63",
    "fullName": "Mercedes-Benz AMG G63",
    "category": "Performance",
    "image": "/manus-storage/mercedes-benz-amg-g63-matt-black_ebd966e4.jpg",
    "priceAedPerDay": 1800,
    "specifications": [{ "label": "Engine", "value": "V8" }, { "label": "0–100 km/h", "value": "4.5 seconds" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Matt Black"
  },
  {
    "id": "vehicle-042",
    "index": 42,
    "brand": "Mercedes-Benz",
    "model": "AMG G63 Matte black",
    "fullName": "Mercedes-Benz AMG G63 Matte black",
    "category": "Performance",
    "image": "/manus-storage/mercedes-benz-amg-g63-matte-black-black_4365eda9.jpg",
    "priceAedPerDay": 1800,
    "specifications": [{ "label": "Engine", "value": "V8" }, { "label": "0–100 km/h", "value": "4.5 seconds" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-043",
    "index": 43,
    "brand": "Mercedes-Benz",
   "model": "AMG G63 Matte gray",
   "fullName": "Mercedes-Benz AMG G63 Matte gray",
   "category": "Performance",
    "image": "/manus-storage/mercedes-benz-amg-g63-matte-gray-white_7d19b472.jpg",
   "priceAedPerDay": 1800,
    "specifications": [{ "label": "Engine", "value": "V8" }, { "label": "0–100 km/h", "value": "4.5 seconds" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "White"
  },
  {
    "id": "vehicle-044",
    "index": 44,
    "brand": "Mercedes-Benz",
    "model": "V 250",
    "fullName": "Mercedes-Benz V 250",
    "category": "Performance",
    "image": "/manus-storage/mercedes-benz-v-250-black_9a6773cd.jpg",
    "priceAedPerDay": 1800,
    "description": "The Mercedes V250 VIP Line is a seven-seat people carrier with a black luxury cabin, rear-wheel drive and automatic transmission. Its four-door layout, passenger capacity and VIP-oriented comfort equipment support group and executive travel.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "11–12 seconds" }, { "label": "Power", "value": "211 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "7" }, { "label": "Colour", "value": "Black" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Push Button Ignition", "Rear AC", "Premium Audio", "Parking Assist", "Tinted Windows", "Blind Spot Warning", "Front & Rear Airbags", "Adaptive Cruise Control", "Parking Sensors", "Cooling Seats", "Sunroof / Moonroof", "Daytime Running Lights", "Fog Lights", "Reverse Camera", "Built-in GPS", "Leather Seats", "Seat Belt Reminder", "SRS Airbags", "Memory Front Seats", "Climate Control", "Android Auto", "Powered Tailgate", "USB"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-045",
    "index": 45,
    "brand": "Mercedes-Benz",
   "model": "GT63 S",
   "fullName": "Mercedes-Benz GT63 S",
   "category": "Performance",
    "image": "/manus-storage/mercedes-benz-gt63-s_e13d37a1.jpg",
   "priceAedPerDay": 1500,
    "description": "The Mercedes-Benz AMG GT63 S is a four-door performance saloon with a 4.0L V8 and all-wheel drive. Its streamlined bodywork, automatic transmission and technology-rich cabin combine high-output performance with practical four-seat accommodation.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.2 seconds" }, { "label": "Power", "value": "630 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "4" }, { "label": "Colour", "value": "White" }, { "label": "Year", "value": "2021" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "White"
  },
  {
    "id": "vehicle-046",
    "index": 46,
    "brand": "Mercedes-Benz",
   "model": "GLE63s",
   "fullName": "Mercedes-Benz GLE63s",
   "category": "Luxury SUV",
    "image": "/manus-storage/mercedes-benz-gle63s-blue_e51d1814.jpg",
   "priceAedPerDay": 1300,
    "description": "The Mercedes-Benz AMG GLE63s is a five-seat performance SUV with a 4.0L V8, all-wheel drive and automatic transmission. Its powerful chassis, luxury-oriented cabin and driver-focused technology blend everyday practicality with performance capability.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.8 seconds" }, { "label": "Power", "value": "603 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Colour", "value": "Blue" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Blue"
  },
  {
    "id": "vehicle-047",
    "index": 47,
    "brand": "Mercedes-Benz",
    "model": "GLC 63s Coupe",
    "fullName": "Mercedes-Benz GLC 63s Coupe",
    "category": "Luxury SUV",
    "image": "/manus-storage/mercedes-benz-glc-63s-coupe-matt-grey_7b23b78f.jpg",
    "priceAedPerDay": 1000,
    "description": "The Mercedes-Benz AMG GLC 63S Coupe is a five-seat performance SUV with coupé-style bodywork, a twin-turbo 4.0L V8 and all-wheel drive. Its AMG-tuned suspension and luxury interior bring sharp response and refined comfort to a compact SUV format.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.8 seconds" }, { "label": "Power", "value": "503 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2021" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "White"
  },
  {
    "id": "vehicle-048",
    "index": 48,
    "brand": "Mercedes-Benz",
    "model": "GLC 63s",
    "fullName": "Mercedes-Benz GLC 63s",
    "category": "Luxury SUV",
    "image": "/manus-storage/mercedes-benz-glc-63s-white_1fb6a09d.jpg",
    "priceAedPerDay": 1000,
    "specifications": [],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_05.jpg",
    "color": "Matt Grey"
  },
  {
    "id": "vehicle-049",
    "index": 49,
    "brand": "Porsche",
   "model": "911 GT3 RS",
   "fullName": "Porsche 911 GT3 RS",
   "category": "Performance",
    "image": "/manus-storage/porsche-911-gt3-rs-green_90a137f1.jpg",
   "priceAedPerDay": 6500,
    "description": "The Porsche 911 GT3 RS is a high-performance sports car with lightweight construction, aerodynamic design and a naturally aspirated engine. Racing-inspired suspension and precise steering support agility and responsiveness, while the driver-focused cabin balances purposeful control with comfort.",
    "specifications": [
      { "label": "Body type", "value": "Sports" },
      { "label": "Engine", "value": "4.0L F-6" },
      { "label": "0–100 km/h", "value": "3.2 seconds" },
      { "label": "Power", "value": "518 horsepower" },
      { "label": "Transmission", "value": "Automatic" },
      { "label": "Drivetrain", "value": "Rear Wheel Drive" },
      { "label": "Doors", "value": "2" },
      { "label": "Seats", "value": "2" },
      { "label": "Year", "value": "2023" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_06.jpg",
    "color": "Acid Green"
  },
  {
    "id": "vehicle-050",
    "index": 50,
    "brand": "Porsche",
    "model": "911 Turbo S brabus",
    "fullName": "Porsche 911 Turbo S brabus",
    "category": "Performance",
    "image": "/manus-storage/porsche-911-turbo-s-brabus-black_828f47dd.jpg",
    "priceAedPerDay": 3000,
    "description": "The Porsche 911 Turbo S combines a flat-six engine, all-wheel drive and an automatic dual-clutch transmission for rapid acceleration and confident high-speed touring. Its four-seat layout and refined cabin support both performance and longer journeys.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "3.7L F-6" }, { "label": "0–100 km/h", "value": "3.2 seconds" }, { "label": "Power", "value": "640 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "4" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_06.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-051",
    "index": 51,
    "brand": "Porsche",
   "model": "911 GT3",
   "fullName": "Porsche 911 GT3",
   "category": "Performance",
    "image": "/manus-storage/porsche-911-gt3_b767c122.jpg",
   "priceAedPerDay": 3500,
    "description": "The 2021 Porsche 911 GT3 is a race-bred sports car with a naturally aspirated four-litre flat-six, an updated chassis and adaptive dampers. Its focused suspension, larger brakes, sport seats and driver-oriented controls support precise road and track performance.",
    "specifications": [
      { "label": "Body type", "value": "Sports" },
      { "label": "Engine", "value": "3996cc · 4.0L" },
      { "label": "0–100 km/h", "value": "3.9 seconds" },
      { "label": "Power", "value": "510 horsepower" },
      { "label": "Transmission", "value": "Automatic" },
      { "label": "Drivetrain", "value": "Rear Wheel Drive" },
      { "label": "Doors", "value": "2" },
      { "label": "Seats", "value": "2" },
      { "label": "Year", "value": "2021" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_06.jpg",
    "color": "Shark Blue"
  },
  {
    "id": "vehicle-052",
    "index": 52,
    "brand": "Porsche",
    "model": "911 Carrera S",
    "fullName": "Porsche 911 Carrera S",
    "category": "Convertible",
    "image": "/manus-storage/porsche-911-carrera-s_344b9121.jpg",
    "priceAedPerDay": 1500,
    "description": "The Porsche 911 Carrera S Spyder is a compact two-seat sports car with a 3.0L flat-six, rear-wheel drive and automatic transmission. Its open-top format pairs focused performance with premium comfort and driver-assistance features.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "3.0L F-6" }, { "label": "0–100 km/h", "value": "3.5 seconds" }, { "label": "Power", "value": "443 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2020" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_06.jpg"
  },
  {
    "id": "vehicle-053",
    "index": 53,
    "brand": "Porsche",
    "model": "Cayenne S",
    "fullName": "Porsche Cayenne S",
    "category": "Luxury SUV",
    "image": "/manus-storage/porsche-cayenne-s-white_2ca93d4a.jpg",
    "priceAedPerDay": 1300,
    "description": "The Porsche Cayenne Coupe combines a performance-focused SUV profile with five-seat practicality, all-wheel drive and an automatic transmission. Its sloping roofline and turbocharged engine character support a dynamic yet versatile luxury driving experience.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 · 2.9L" }, { "label": "0–100 km/h", "value": "5.3 seconds" }, { "label": "Power", "value": "434 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2021" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_06.jpg",
    "color": "White"
  },
  {
    "id": "vehicle-054",
    "index": 54,
    "brand": "Porsche",
    "model": "Macan S",
    "fullName": "Porsche Macan S",
    "category": "Luxury SUV",
    "image": "/manus-storage/porsche-macan-s-black_b1fca74f.jpg",
    "priceAedPerDay": 1000,
    "description": "The Porsche Macan Sports is a performance-oriented SUV with a twin-turbo V6, all-wheel drive and a five-seat cabin. Its refined chassis and strong turbocharged engine combine everyday comfort with dynamic road performance.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V6 · 2.9L" }, { "label": "0–100 km/h", "value": "4.8 seconds" }, { "label": "Power", "value": "375 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2021" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_06.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-055",
    "index": 55,
    "brand": "Rolls-Royce",
    "model": "Cullinan Mansory",
    "fullName": "Rolls-Royce Cullinan Mansory",
    "category": "Luxury SUV",
    "image": "/manus-storage/rolls-royce-cullinan-mansory-tiffany-blue_e8f9a37f.jpg",
    "priceAedPerDay": 5500,
    "description": "The Rolls-Royce Cullinan Mansory is a full-size luxury SUV with five seats, all-wheel drive and a twin-turbo V12. Its eight-speed automatic transmission and all-wheel-drive capability support composed progress on long journeys and a confident grand-touring character.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V12 · 6.7L" }, { "label": "0–100 km/h", "value": "5.0 seconds" }, { "label": "Power", "value": "610 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_07.jpg",
    "color": "Tiffany Blue"
  },
  {
    "id": "vehicle-056",
    "index": 56,
    "brand": "Rolls-Royce",
   "model": "Cullinan Mansory",
   "fullName": "Rolls-Royce Cullinan Mansory",
   "category": "Luxury SUV",
    "image": "/manus-storage/rolls-royce-cullinan-mansory-black_8f6c5aa5.jpg",
   "priceAedPerDay": 4500,
    "description": "The Rolls-Royce Cullinan Mansory is a full-size luxury SUV with five seats, all-wheel drive and a twin-turbo V12. Its eight-speed automatic transmission and all-wheel-drive capability support composed progress on long journeys and a confident grand-touring character.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V12 · 6.7L" }, { "label": "0–100 km/h", "value": "5.0 seconds" }, { "label": "Power", "value": "610 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Colour", "value": "Black" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_07.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-057",
    "index": 57,
    "brand": "Rolls-Royce",
    "model": "Cullinan",
    "fullName": "Rolls-Royce Cullinan",
    "category": "Luxury SUV",
    "image": "/manus-storage/rolls-royce-cullinan-57_00db8580.jpg",
    "priceAedPerDay": 4000,
    "description": "The Rolls-Royce Cullinan is a full-size luxury SUV with a V12 engine, all-wheel drive and a focus on refined travel. Its spacious cabin, premium materials and capable drivetrain combine comfort with assured performance.",
    "specifications": [{ "label": "Body type", "value": "Luxury SUV" }, { "label": "Engine", "value": "V12 · 6.7L" }, { "label": "0–100 km/h", "value": "4.6 seconds" }, { "label": "Power", "value": "592 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "4" }, { "label": "Year", "value": "2022" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_07.jpg"
  },
  {
    "id": "vehicle-058",
    "index": 58,
    "brand": "Rolls-Royce",
    "model": "Cullinan",
    "fullName": "Rolls-Royce Cullinan",
    "category": "Luxury SUV",
    "image": "/manus-storage/rolls-royce-cullinan-58_38ec80b0.jpg",
    "priceAedPerDay": 4000,
    "description": "The Rolls-Royce Cullinan is a full-size luxury SUV with a V12 engine, all-wheel drive and a focus on refined travel. Its spacious cabin, premium materials and capable drivetrain combine comfort with assured performance.",
    "specifications": [{ "label": "Body type", "value": "Luxury SUV" }, { "label": "Engine", "value": "V12 · 6.7L" }, { "label": "0–100 km/h", "value": "4.6 seconds" }, { "label": "Power", "value": "592 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "4" }, { "label": "Year", "value": "2022" }],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_07.jpg"
  },
  {
    "id": "vehicle-059",
    "index": 59,
    "brand": "Rolls-Royce",
    "model": "Dawn",
    "fullName": "Rolls-Royce Dawn",
    "category": "Convertible",
    "image": "/manus-storage/rolls-royce-dawn-black_07229a9c.jpg",
    "priceAedPerDay": 3000,
    "description": "The Rolls-Royce Dawn is a four-seat convertible that combines a 6.6L V12 with rear-wheel drive and a refined automatic transmission. Its open-air design, smooth ride and luxury-focused cabin suit relaxed, long-distance grand touring.",
    "specifications": [{ "label": "Body type", "value": "Convertible" }, { "label": "Engine", "value": "V12 · 6.6L" }, { "label": "0–100 km/h", "value": "4.7 seconds" }, { "label": "Power", "value": "563 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "4" }, { "label": "Colour", "value": "Black" }, { "label": "Year", "value": "2021" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_07.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-060",
    "index": 60,
    "brand": "Rolls-Royce",
    "model": "Dawn",
    "fullName": "Rolls-Royce Dawn",
    "category": "Convertible",
    "image": "/manus-storage/rolls-royce-dawn-white_682fd044.jpg",
    "priceAedPerDay": 3000,
    "description": "The Rolls-Royce Dawn is a four-seat convertible that combines a 6.6L V12 with rear-wheel drive and a refined automatic transmission. Its open-air design, smooth ride and luxury-focused cabin suit relaxed, long-distance grand touring.",
    "specifications": [{ "label": "Body type", "value": "Convertible" }, { "label": "Engine", "value": "V12 · 6.6L" }, { "label": "0–100 km/h", "value": "4.7 seconds" }, { "label": "Power", "value": "563 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "4" }, { "label": "Colour", "value": "White" }, { "label": "Year", "value": "2021" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_07.jpg",
    "color": "White"
  },
  {
    "id": "vehicle-061",
    "index": 61,
    "brand": "Range Rover",
   "model": "Vogue Mansory",
   "fullName": "Range Rover Vogue Mansory",
   "category": "Luxury SUV",
    "image": "/manus-storage/range-rover-vogue-mansory-white_59adc7d0.jpg",
   "priceAedPerDay": 2500,
    "description": "The Range Rover Vogue Mansory is a seven-seat performance SUV with a 4.4L V8, all-wheel drive and an eight-speed automatic transmission. Mansory enhancements include a lowered suspension, a widebody carbon-fibre exterior treatment and a bespoke luxury interior.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V8 · 4.4L" }, { "label": "0–100 km/h", "value": "4.3 seconds" }, { "label": "Power", "value": "620 horsepower" }, { "label": "Transmission", "value": "8-Speed Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "7" }, { "label": "Colour", "value": "White" }, { "label": "Year", "value": "2024" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_08.jpg",
    "color": "White"
  },
  {
    "id": "vehicle-062",
    "index": 62,
    "brand": "Range Rover",
    "model": "Vogue 2023",
    "fullName": "Range Rover Vogue 2023",
    "category": "Luxury SUV",
    "image": "/manus-storage/range-rover-vogue-2023-black_5082ecd4.jpg",
    "priceAedPerDay": 1500,
    "description": "The Range Rover Vogue HSE combines a 3.0L V6, all-wheel drive and a five-seat luxury SUV cabin. Advanced driver-assistance systems, infotainment and Terrain Response technology support refined road travel alongside confident all-terrain capability.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V6 · 3.0L" }, { "label": "0–100 km/h", "value": "6.1 seconds" }, { "label": "Power", "value": "395 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Colour", "value": "Black" }, { "label": "Year", "value": "2023" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_08.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-063",
    "index": 63,
    "brand": "Audi",
    "model": "R8",
    "fullName": "Audi R8",
    "category": "Performance",
    "image": "/manus-storage/audi-r8_81c49f31.jpg",
    "priceAedPerDay": 1800,
    "description": "The Audi R8 Spyder pairs a naturally aspirated V10 with all-wheel drive in an open-top performance car. Its focused driving position, fast-shifting automatic transmission and balanced chassis create an engaging experience for drivers seeking sharp response and everyday usability.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V10 · 5.2L" }, { "label": "0–100 km/h", "value": "3.5 seconds" }, { "label": "Power", "value": "562 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "2" }, { "label": "Year", "value": "2021" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_09.jpg"
  },
  {
    "id": "vehicle-064",
    "index": 64,
    "brand": "Audi",
   "model": "RS7 performance",
   "fullName": "Audi RS7 performance",
   "category": "Performance",
    "image": "/manus-storage/audi-rs7-performance-black_0b2709d5.jpg",
   "priceAedPerDay": 2000,
    "description": "The Audi RS7 combines a 4.0L twin-turbo V8 with quattro all-wheel drive in a four-door performance grand tourer. Its RS mode, adaptive suspension and advanced cabin technology balance high-speed response with long-distance comfort.",
    "specifications": [{ "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 Twin-Turbo · 4.0L" }, { "label": "0–100 km/h", "value": "3.3 seconds" }, { "label": "Power", "value": "621 horsepower" }, { "label": "Transmission", "value": "8-Speed Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2025" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_09.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-065",
    "index": 65,
    "brand": "Audi",
   "model": "SQ7",
   "fullName": "Audi SQ7",
   "category": "Luxury SUV",
    "image": "/manus-storage/audi-sq7-black_b1a8fab4.jpg",
   "priceAedPerDay": 1800,
    "description": "The 2025 Audi SQ7 combines a 4.0L twin-turbo V8, Quattro all-wheel drive and adaptive air suspension in a practical seven-seat SUV. Its flexible second and third rows, cargo capacity and comfort-focused cabin support longer journeys and group travel.",
    "specifications": [
      { "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V8 Twin-Turbo · 4.0L" }, { "label": "0–100 km/h", "value": "4.1 seconds" }, { "label": "Power", "value": "500 horsepower" }, { "label": "Transmission", "value": "8-Speed Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "7" }, { "label": "Year", "value": "2025" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_09.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-066",
    "index": 66,
    "brand": "Audi",
   "model": "RS6",
   "fullName": "Audi RS6",
   "category": "Performance",
    "image": "/manus-storage/audi-rs6-gray_b4c8c66c.jpg",
   "priceAedPerDay": 1800,
    "description": "The Audi RS6 is a high-performance luxury wagon that combines a twin-turbo V8, Quattro all-wheel drive and a refined, technology-led cabin. Its practical cargo space complements confident traction and performance for longer journeys.",
    "specifications": [
      { "label": "Body type", "value": "Sports" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "3.6 seconds" }, { "label": "Power", "value": "600 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2023" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_09.jpg",
    "color": "Gray"
  },
  {
    "id": "vehicle-067",
    "index": 67,
    "brand": "Audi",
   "model": "RS5",
   "fullName": "Audi RS5",
   "category": "Performance",
    "image": "/manus-storage/audi-rs5-blue_26f3b3f0.jpg",
   "priceAedPerDay": 1500,
    "description": "The 2025 Audi RS5 combines a twin-turbo 2.9L engine, Quattro all-wheel drive and an eight-speed automatic transmission in a five-seat performance car. Its RS-specific exhaust, adaptive lighting and practical Sportback layout balance pace, control and everyday comfort.",
    "specifications": [
      { "label": "Body type", "value": "Sports" },
      { "label": "Engine", "value": "V6 Twin-Turbo · 2.9L" },
      { "label": "0–100 km/h", "value": "3.8 seconds" },
      { "label": "Power", "value": "450 horsepower" },
      { "label": "Transmission", "value": "8-Speed Automatic" },
      { "label": "Drivetrain", "value": "All Wheel Drive" },
      { "label": "Doors", "value": "4" },
      { "label": "Seats", "value": "5" },
      { "label": "Year", "value": "2025" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_09.jpg",
    "color": "Blue"
  },
  {
    "id": "vehicle-068",
    "index": 68,
    "brand": "Audi",
   "model": "RS3",
   "fullName": "Audi RS3",
   "category": "Performance",
    "image": "/manus-storage/audi-rs3-black_a30d0018.jpg",
   "priceAedPerDay": 1000,
    "description": "The Audi RS3 is a compact performance car designed around confident all-weather capability. It pairs a 2.5L five-cylinder engine with all-wheel drive, a practical five-seat layout and a performance-focused character.",
    "specifications": [
      { "label": "Body type", "value": "Sports" },
      { "label": "Engine", "value": "V5 · 2.5L" },
      { "label": "0–100 km/h", "value": "3.8 seconds" },
      { "label": "Power", "value": "400 horsepower" },
      { "label": "Transmission", "value": "Automatic" },
      { "label": "Drivetrain", "value": "All Wheel Drive" },
      { "label": "Doors", "value": "4" },
      { "label": "Seats", "value": "5" },
      { "label": "Year", "value": "2022" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_09.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-069",
    "index": 69,
    "brand": "BMW",
   "model": "M5 Competition",
   "fullName": "BMW M5 Competition",
   "category": "Performance",
    "image": "/manus-storage/bmw-m5-competition-black_1d608edb.jpg",
   "priceAedPerDay": 2000,
    "description": "The 2025 BMW M5 Competition combines a 4.4L V8, all-wheel drive and an eight-speed automatic with paddle shifters in a four-door performance saloon. Its updated cockpit uses a curved display, M-specific controls and a performance-focused chassis for a distinctly modern driving experience.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 · 4.4L" }, { "label": "0–100 km/h", "value": "3.5 seconds" }, { "label": "Power", "value": "717 horsepower" }, { "label": "Transmission", "value": "8-Speed Automatic with Paddle Shifters" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Colour", "value": "Matte Black" }, { "label": "Year", "value": "2025" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_10.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-070",
    "index": 70,
    "brand": "BMW",
    "model": "X7M M60i 2023",
    "fullName": "BMW X7M M60i 2023",
    "category": "Luxury SUV",
    "image": "/manus-storage/bmw-x7m-m60i-2023-black_18242005.jpg",
    "priceAedPerDay": 1500,
    "description": "The BMW X7 M60i pairs a 4.4L V8 with all-wheel drive and seven seats in a large luxury SUV. Its performance-focused powertrain, Dynamic Stability Control and high-end cabin equipment balance family space with a responsive long-distance driving character.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V8 · 4.4L" }, { "label": "0–100 km/h", "value": "4.5 seconds" }, { "label": "Power", "value": "523 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "7" }, { "label": "Colour", "value": "Black" }, { "label": "Year", "value": "2023" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_10.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-071",
    "index": 71,
    "brand": "BMW",
   "model": "735i",
   "fullName": "BMW 735i",
   "category": "Performance",
    "image": "/manus-storage/bmw-735i-black_97f22e21.jpg",
   "priceAedPerDay": 1300,
    "description": "The BMW 735i is a luxury saloon with a 3.0L inline-six, rear-wheel drive and a five-seat cabin. Its automatic transmission and four-door layout support comfortable, composed travel for business and leisure journeys.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "3.0-liter I6 · 3.0L" }, { "label": "0–100 km/h", "value": "6.7 seconds" }, { "label": "Power", "value": "272 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Colour", "value": "Black" }, { "label": "Year", "value": "2023" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_10.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-072",
    "index": 72,
    "brand": "BMW",
    "model": "X6M Competition",
    "fullName": "BMW X6M Competition",
    "category": "Luxury SUV",
    "image": "/manus-storage/bmw-x6m-competition-blue_17de1d5a.jpg",
    "priceAedPerDay": 1500,
    "description": "The 2022 BMW X6 M Competition is a high-performance SUV with all-wheel drive, a four-seat cabin and a distinctive coupé-style roofline. Its M-specific chassis, driver-assistance systems and configurable displays pair performance response with luxury-oriented everyday usability.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V8 · 3.0L" }, { "label": "0–100 km/h", "value": "3.9 seconds" }, { "label": "Power", "value": "617 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "4" }, { "label": "Colour", "value": "Blue" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_10.jpg",
    "color": "Blue"
  },
  {
    "id": "vehicle-073",
    "index": 73,
    "brand": "BMW",
    "model": "X7M Competition",
    "fullName": "BMW X7M Competition",
    "category": "Luxury SUV",
    "image": "/manus-storage/bmw-x7m-competition_6a1268fa.jpg",
    "priceAedPerDay": 1300,
    "specifications": [],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_10.jpg"
  },
  {
    "id": "vehicle-074",
    "index": 74,
    "brand": "Bentley",
    "model": "Bentayga Mansory",
    "fullName": "Bentley Bentayga Mansory",
    "category": "Luxury SUV",
    "image": "/manus-storage/bentley-bentayga-mansory-black-gray_d28df3c9.jpg",
    "priceAedPerDay": 4500,
    "description": "The Bentley Bentayga Mansory is a luxury SUV with a twin-turbo V8, all-wheel drive and an eight-speed automatic transmission. Mansory bodywork and carbon-fibre detailing give its spacious five-seat cabin and Bentley craftsmanship a more assertive road presence.",
    "specifications": [{ "label": "Engine", "value": "4.0L twin-turbo V8" }, { "label": "0–100 km/h", "value": "3.5 seconds" }, { "label": "Power", "value": "750 horsepower" }, { "label": "Transmission", "value": "8 Speed Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2025" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_11.jpg",
    "color": "Black / Gray"
  },
  {
    "id": "vehicle-075",
    "index": 75,
    "brand": "Bentley",
   "model": "Continental GTC",
   "fullName": "Bentley Continental GTC",
   "category": "Convertible",
    "image": "/manus-storage/bentley-continental-gtc-black_387ee8b2.jpg",
   "priceAedPerDay": 2500,
    "description": "The Bentley Continental GTC is a four-seat grand-touring convertible with a W12 engine, all-wheel drive and an automatic transmission. Its sculpted form, cabin craftsmanship and open-top character combine luxury with effortless performance.",
    "specifications": [
      { "label": "Body type", "value": "Convertible" }, { "label": "Engine", "value": "W12 · 6.0L" }, { "label": "0–100 km/h", "value": "4.5 seconds" }, { "label": "Power", "value": "567 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "4" }, { "label": "Year", "value": "2021" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_11.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-076",
    "index": 76,
    "brand": "Bentley",
    "model": "Bentayga 2022",
    "fullName": "Bentley Bentayga 2022",
    "category": "Luxury SUV",
    "image": "/manus-storage/bentley-bentayga-2022-primary-complete_acf69696.jpg",
    "priceAedPerDay": 2200,
    "description": "The Bentley Bentayga 2022 is a five-seat luxury SUV with a V8 engine, all-wheel drive and an automatic transmission. Its spacious cabin, advanced infotainment and premium comfort features complement a performance-oriented SUV platform.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 · 6.0L" }, { "label": "0–100 km/h", "value": "4.5 seconds" }, { "label": "Power", "value": "542 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_11.jpg"
  },
  {
    "id": "vehicle-077",
    "index": 77,
    "brand": "Bentley",
   "model": "Continental GT",
   "fullName": "Bentley Continental GT",
   "category": "Performance",
    "image": "/manus-storage/bentley-continental-gt-white_ca9f6f33.jpg",
   "priceAedPerDay": 2200,
    "description": "The Bentley Continental GT is a four-seat grand tourer with a 4.0L V8, all-wheel drive and automatic transmission. Its power, long-distance comfort, advanced safety technology and craftsmanship create a refined performance-focused driving experience.",
    "specifications": [
      { "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 · 4.0L" }, { "label": "0–100 km/h", "value": "4.0 seconds" }, { "label": "Power", "value": "542 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "2" }, { "label": "Seats", "value": "4" }, { "label": "Year", "value": "2021" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_11.jpg",
    "color": "White"
  },
  {
    "id": "vehicle-078",
    "index": 78,
    "brand": "Bentley",
    "model": "Bentayga",
    "fullName": "Bentley Bentayga",
    "category": "Luxury SUV",
    "image": "/manus-storage/bentley-bentayga_e816f78f.jpg",
    "priceAedPerDay": 2200,
    "description": "The Bentley Bentayga is a five-seat luxury SUV that combines a V8 engine, all-wheel drive and an automatic transmission. Its refined interior, generous passenger space and advanced technology are paired with a responsive performance character.",
    "specifications": [{ "label": "Body type", "value": "Luxury" }, { "label": "Engine", "value": "V8 · 6.0L" }, { "label": "0–100 km/h", "value": "4.5 seconds" }, { "label": "Power", "value": "542 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "All Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "5" }, { "label": "Year", "value": "2022" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_11.jpg"
  },
  {
    "id": "vehicle-079",
    "index": 79,
    "brand": "Aston Martin",
   "model": "DBX 707",
   "fullName": "Aston Martin DBX 707",
   "category": "Luxury SUV",
    "image": "/manus-storage/aston-martin-dbx-707-white_5d67a262.jpg",
   "priceAedPerDay": 2500,
    "description": "The Aston Martin DBX 707 is a five-seat luxury SUV that combines comfort and performance. Its adaptive suspension, carbon-ceramic brakes, active aerodynamics and driver-assistance systems support confident, refined travel with practical cargo space.",
    "specifications": [
      { "label": "Body type", "value": "SUV" },
      { "label": "Engine", "value": "V8 · 4.0L" },
      { "label": "0–100 km/h", "value": "3.3 seconds" },
      { "label": "Power", "value": "697 horsepower" },
      { "label": "Transmission", "value": "Automatic" },
      { "label": "Drivetrain", "value": "All Wheel Drive" },
      { "label": "Doors", "value": "4" },
      { "label": "Seats", "value": "5" },
      { "label": "Year", "value": "2023" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_12.jpg",
    "color": "White"
  },
  {
    "id": "vehicle-080",
    "index": 80,
    "brand": "Aston Martin",
   "model": "Vantage",
   "fullName": "Aston Martin Vantage",
   "category": "Performance",
    "image": "/manus-storage/aston-martin-vantage-black_311296b2.jpg",
   "priceAedPerDay": 1800,
    "description": "The Aston Martin Vantage is a low-slung two-seat sports car that blends hand-finished craftsmanship with responsive performance. Its compact proportions, rear-wheel drive and focused handling create a distinctive grand-touring experience.",
    "specifications": [
      { "label": "Body type", "value": "Sports" },
      { "label": "Engine", "value": "V8 · 4.0L" },
      { "label": "0–100 km/h", "value": "3.6 seconds" },
      { "label": "Power", "value": "656 horsepower" },
      { "label": "Transmission", "value": "Automatic" },
      { "label": "Drivetrain", "value": "Rear Wheel Drive" },
      { "label": "Doors", "value": "2" },
      { "label": "Seats", "value": "2" },
      { "label": "Year", "value": "2021" }
    ],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_12.jpg",
    "color": "Black"
  },
  {
    "id": "vehicle-081",
    "index": 81,
    "brand": "Cadillac",
   "model": "Escalade S",
   "fullName": "Cadillac Escalade S",
   "category": "Luxury SUV",
    "image": "/manus-storage/cadillac-escalade-s_febdda30.jpg",
   "priceAedPerDay": 1300,
    "description": "The Cadillac Escalade Sports Platinum is a seven-seat luxury SUV with a 6.2L V8, rear-wheel drive and automatic transmission. Its spacious interior, dynamic performance and poised handling are designed for comfortable large-group travel.",
    "specifications": [{ "label": "Body type", "value": "SUV" }, { "label": "Engine", "value": "V8 · 6.2L" }, { "label": "0–100 km/h", "value": "7 seconds" }, { "label": "Power", "value": "420 horsepower" }, { "label": "Transmission", "value": "Automatic" }, { "label": "Drivetrain", "value": "Rear Wheel Drive" }, { "label": "Doors", "value": "4" }, { "label": "Seats", "value": "7" }, { "label": "Colour", "value": "Black" }, { "label": "Year", "value": "2023" }],
    "rentalDetails": [{ "label": "Security deposit", "value": "AED 5,000" }, { "label": "Mileage limit", "value": "250 km/day" }, { "label": "Extra km charge", "value": "AED 20/km" }, { "label": "Insurance", "value": "Included" }],
    "features": ["Navigation System", "Cruise Control", "Leather Seats", "Active steering", "Touchscreen LCD", "Apple CarPlay", "Blind Spot Warning", "Android Auto", "Reverse Camera", "Digital HUD", "Sunroof / Panoramic roof", "Adaptive Cruise Control", "Power Seats", "Climate Control", "USB Type-C", "Tinted Windows", "Parking Assist", "Parking Sensors", "SRS Airbags", "Bluetooth", "Premium Audio"],
    "conditions": [
      "Available on request"
    ],
    "sourceReference": "catalog_page_13.jpg",
    "color": "Black"
  }
];

const partnerExtensionDefinitions = [
  { id: "vehicle-082", archiveId: "partner-015", brand: "BMW", model: "M3 Competition", category: "Performance" as const },
  { id: "vehicle-083", archiveId: "partner-016", brand: "BMW", model: "M4 Competition", category: "Performance" as const },
  { id: "vehicle-084", archiveId: "partner-020", brand: "BMW", model: "X7 M50i", category: "Luxury SUV" as const },
  { id: "vehicle-085", archiveId: "partner-024", brand: "Ferrari", model: "488 Spyder", category: "Convertible" as const },
  { id: "vehicle-086", archiveId: "partner-029", brand: "Ferrari", model: "Portofino", category: "Convertible" as const },
  { id: "vehicle-087", archiveId: "partner-034", brand: "Lamborghini", model: "Huracan Coupe", category: "Performance" as const },
  { id: "vehicle-088", archiveId: "partner-052", brand: "McLaren", model: "570S", category: "Performance" as const },
  { id: "vehicle-089", archiveId: "partner-054", brand: "McLaren", model: "720S", category: "Performance" as const },
  { id: "vehicle-090", archiveId: "partner-071", brand: "Mercedes-Benz", model: "AMG GT63 Coupe", category: "Performance" as const },
  { id: "vehicle-091", archiveId: "partner-084", brand: "Porsche", model: "911 GT3 2026", category: "Performance" as const },
  { id: "vehicle-092", archiveId: "partner-095", brand: "Rolls-Royce", model: "Wraith Black Badge", category: "Performance" as const },
] as const;

const partnerExtensionVehicles: Vehicle[] = partnerExtensionDefinitions.map((definition, offset) => {
  const source = partnerCatalog.find((vehicle) => vehicle.id === definition.archiveId);
  if (!source || !source.images[0] || !source.price) {
    throw new Error(`ZAVERRE extension catalogue source missing: ${definition.archiveId}`);
  }

  const specifications = Object.entries(source.specs).flatMap(([label, value]) =>
    typeof value === "string" && value.trim().length > 0 && !(label === "Engine" && /^(and|with|that)\b/i.test(value))
      ? [{ label, value }]
      : [],
  );

  return {
    id: definition.id,
    index: 82 + offset,
    brand: definition.brand,
    model: definition.model,
    fullName: `${definition.brand} ${definition.model}`,
    category: definition.category,
    image: source.images[0],
    priceAedPerDay: Number(source.price),
    specifications,
    conditions: ["Availability subject to confirmation"],
    sourceReference: source.sourceUrl,
    color: source.specs.Colour ?? undefined,
  };
});

legacyVehicleCatalog.push(...partnerExtensionVehicles);

export const vehicleCatalog: Vehicle[] = workbookFleetEntries.map((vehicle) => ({
  ...vehicle,
  specifications: vehicle.specifications.map((specification) => ({ ...specification })),
  conditions: [...vehicle.conditions],
  sourceCategories: vehicle.sourceCategories ? [...vehicle.sourceCategories] : undefined,
  filterBrands: vehicle.filterBrands ? [...vehicle.filterBrands] : undefined,
}));

if (vehicleCatalog.length !== 95) {
  throw new Error(`ZAVERRE catalogue integrity error: expected exactly 95 verified non-duplicated vehicles, received ${vehicleCatalog.length}.`);
}

export function vehicleFilterBrands(vehicle: Vehicle) {
  return vehicle.filterBrands?.length ? vehicle.filterBrands : [vehicle.brand];
}

export const vehicleBrands = ['All', ...Array.from(new Set(vehicleCatalog.flatMap(vehicleFilterBrands)))];

/**
 * Edit these canonical IDs to change the three homepage feature vehicles without
 * changing the showroom components, prices, routes, or customer enquiry flows.
 */
export const featuredVehicleIds = vehicleCatalog.slice(0, 3).map((vehicle) => vehicle.id);
