// src/data/products.js (or wherever your products array is located)

import tire1Image from "../assets/tire1.jpg";
import tire2Image from "../assets/tire2.jpg";
import tire3Image from "../assets/tire3.jpg";

export const categories = [
  { key: "all", label: "All Tires" },
  { key: "mud", label: "Mud Terrain" },
  { key: "rock", label: "Rock Terrain" },
  { key: "all-terrain", label: "All-Terrain" },
  { key: "highway", label: "Highway Terrain" }
];

export const products = [
  {
    id: 1,
    name: "MAULER MX-PRO",
    price: 20581,
    category: "mud",
    // Use the imported variable
    image: tire1Image, 
    description: "Extreme performance mud tire designed for deep mud and rugged trails."
  },
  {
    id: 2,
    name: "TRAILBLAZER AT",
    price: 17021,
    category: "all-terrain",
    // Use the imported variable
    image: tire2Image, 
    description: "Versatile all-terrain tire offering balanced performance on pavement and dirt."
  },
  {
    id: 3,
    name: "MUDSLAYER XL",
    price: 23561,
    category: "mud",
    // Use the imported variable
    image: tire3Image, 
    description: "Heavy-duty mud terrain tire with enhanced load capacity and aggressive tread."
  },
  {
    id: 4,
    name: "ROCK CRUSHER",
    price: 25311,
    category: "rock",
    // Use the imported variable
    image: tire1Image, 
    description: "Premium rock crawling tire featuring reinforced sidewalls for extreme puncture resistance."
  },
  {
    id: 5,
    name: "DESERT DOMINATOR",
    price: 18821,
    category: "rock",
    // Use the imported variable
    image: tire2Image, 
    description: "High-speed desert tire with heat-dissipating compounds for long runs."
  },
  {
    id: 6,
    name: "WINTER WARRIOR",
    price: 21711,
    category: "all-terrain",
    // Use the imported variable
    image: tire3Image, 
    description: "All-terrain tire certified for severe snow conditions, excellent grip on ice."
  },
  {
    id: 7,
    name: "STREET BEAST",
    price: 15281,
    category: "highway",
    // Use the imported variable
    image: tire1Image, 
    description: "Smooth and quiet highway tire focused on mileage and wet traction."
  },
  {
    id: 8,
    name: "GRIP MASTER PRO",
    price: 17611,
    category: "highway",
    // Use the imported variable
    image: tire2Image, 
    description: "Performance highway tire with exceptional cornering stability and responsive handling."
  }
];