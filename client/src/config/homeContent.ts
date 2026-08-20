export type JournalArticle = {
  slug: string;
  title: string;
  summary: string;
  eyebrow: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
};

export const deliveryLocations = [
  "Palm Jumeirah",
  "Business Bay",
  "Dubai International Financial Centre",
  "Jumeirah Beach Residence",
  "Dubai Airport",
  "Jumeirah",
  "Al Barsha",
  "JVC",
  "Al Quoz",
  "Emirates Hills",
  "City Walk",
  "Bluewaters Island",
  "Dubai Motor City",
  "Abu Dhabi",
  "Sharjah",
  "Ras Al Khaimah",
  "Ajman",
  "Fujairah",
] as const;

export const rentalFaqs = [
  {
    question: "What is the minimum driver age?",
    answer:
      "Drivers must be at least 21 years old. Some supercars and high-performance models may require a minimum age of 25. ZAVERRE confirms the requirement for the selected vehicle before booking.",
  },
  {
    question: "Which driving licence is required?",
    answer:
      "Residents need a valid UAE driving licence. Visitors need a valid driving licence and, where required by the issuing country or insurer, an International Driving Permit.",
  },
  {
    question: "Which documents are required?",
    answer:
      "Typical requirements include a valid driving licence and suitable identification, such as Emirates ID for residents or a passport and visa for visitors. The team confirms the final documents and vehicle conditions before booking.",
  },
  {
    question: "How can I pay for my rental?",
    answer:
      "ZAVERRE shares the available payment options once availability and booking details are confirmed. The suitable option depends on the rental duration, vehicle, and collection or delivery arrangement.",
  },
  {
    question: "Is a deposit or insurance arrangement required?",
    answer:
      "Deposit and insurance arrangements may vary by vehicle category, rental duration, and driver profile. ZAVERRE confirms any applicable amount or policy in writing before booking is finalised.",
  },
] as const;

export const journalArticles: JournalArticle[] = [
  {
    slug: "ferrari-lamborghini-rental-guide-dubai",
    eyebrow: "THE JOURNAL · GUIDE 01",
    title: "A Practical Guide to Renting a Ferrari or Lamborghini in Dubai",
    summary:
      "From choosing the right model to arranging collection, a practical guide to planning a refined day of driving.",
    image: "/manus-storage/zaverre-journal-atlantis-optimized_08f1a2f8.webp",
    imageAlt: "Two supercars outside Atlantis in Dubai at sunset",
    paragraphs: [
      "A refined rental begins with choosing a car that suits the occasion, not only the specification. A Ferrari brings elegant sporting character to a coastal drive, while a Lamborghini makes a stronger visual statement for city plans and special occasions.",
      "Confirm passenger numbers, your day plan, and the collection point before sending an enquiry. These details help the rental team suggest the right vehicle, confirm availability, and arrange collection or delivery clearly.",
      "Review the licence and document requirements, and request written clarity on the daily rate, mileage terms, and insurance before confirmation. Planning early gives you more time to enjoy the car and the road.",
    ],
  },
  {
    slug: "best-dubai-supercar-driving-routes",
    eyebrow: "THE JOURNAL · GUIDE 02",
    title: "The Best Dubai Routes for a Supercar Drive",
    summary:
      "Dubai routes that combine memorable scenery, comfortable roads, and well-chosen stopping points for a considered drive.",
    image: "/manus-storage/zaverre-journal-lamborghini-optimized_a34fb235.webp",
    imageAlt: "Orange Lamborghini displayed below the Lamborghini crest",
    paragraphs: [
      "Dubai's coastal roads and landmark destinations suit a relaxed day of driving with thoughtful photo stops. Plan the route around peak traffic, parking, and local road rules.",
      "Palm Jumeirah, Jumeirah Beach Residence, and Bluewaters Island offer clear waterfront views, while Downtown and DIFC bring a different architectural character to an evening drive.",
      "Luxury driving is a balanced experience: respect posted speeds, stop only in appropriate places, and leave enough time for the agreed return or delivery.",
    ],
  },
  {
    slug: "luxury-car-rental-requirements-uae",
    eyebrow: "THE JOURNAL · GUIDE 03",
    title: "Luxury Car Rental Requirements in the UAE",
    summary:
      "A clear overview of licences, documents, age requirements, and insurance so you arrive prepared for booking.",
    image: "/manus-storage/zaverre-journal-rolls-royce-dawn-optimized_3d58e85c.webp",
    imageAlt: "White Rolls-Royce Dawn convertible in the desert",
    paragraphs: [
      "Luxury-car rental requirements vary by driver profile and vehicle type, but the starting point is always a valid driving licence and clear identification. Residents usually need a UAE licence, while visitors may need an International Driving Permit depending on their issuing country.",
      "Rental providers commonly set age limits by vehicle category. At ZAVERRE, the usual minimum is 21, while some supercars may require drivers to be 25 or older.",
      "Review payment, deposit, mileage, and insurance arrangements before booking. This guide is informational; ZAVERRE confirms the final conditions for the selected vehicle before accepting a request.",
    ],
  },
];
