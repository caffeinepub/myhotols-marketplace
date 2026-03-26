import type { Booking, Hotel, Review, Room, User } from "../context/AppContext";

export const seedUsers: User[] = [
  {
    id: "admin1",
    name: "Admin User",
    phone: "9999999999",
    email: "admin@myhotols.com",
    password: "admin123",
    role: "admin",
    createdAt: "2026-01-01",
  },
  {
    id: "owner1",
    name: "Rajesh Sharma",
    phone: "8888888888",
    email: "owner@myhotols.com",
    password: "owner123",
    role: "owner",
    createdAt: "2026-01-02",
  },
  {
    id: "user1",
    name: "Priya Patel",
    phone: "7777777777",
    email: "user@myhotols.com",
    password: "user123",
    role: "customer",
    createdAt: "2026-01-03",
  },
];

export const seedHotels: Hotel[] = [
  {
    id: "h1",
    ownerId: "owner1",
    name: "Hotel Sunrise Delhi",
    city: "Delhi",
    address: "Connaught Place, New Delhi",
    description:
      "Clean and comfortable budget hotel in the heart of Delhi. Walking distance from metro station.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    ],
    pricePerNight: 1299,
    rating: 4.2,
    amenities: { wifi: true, ac: true, parking: false },
    status: "approved",
    createdAt: "2026-01-05",
  },
  {
    id: "h2",
    ownerId: "owner1",
    name: "Mumbai Budget Inn",
    city: "Mumbai",
    address: "Andheri West, Mumbai",
    description:
      "Affordable stay near Mumbai airport and train station. Perfect for business travelers.",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    ],
    pricePerNight: 1599,
    rating: 4.0,
    amenities: { wifi: true, ac: true, parking: true },
    status: "approved",
    createdAt: "2026-01-06",
  },
  {
    id: "h3",
    ownerId: "owner1",
    name: "Patna Grand Stay",
    city: "Patna",
    address: "Boring Road, Patna",
    description:
      "Best budget hotel in Patna with modern amenities and friendly staff.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    ],
    pricePerNight: 899,
    rating: 4.3,
    amenities: { wifi: true, ac: false, parking: true },
    status: "approved",
    createdAt: "2026-01-07",
  },
  {
    id: "h4",
    ownerId: "owner1",
    name: "Bangalore Tech Suites",
    city: "Bangalore",
    address: "Koramangala, Bangalore",
    description:
      "Modern rooms with high-speed WiFi, ideal for IT professionals and startup founders.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ],
    pricePerNight: 1799,
    rating: 4.5,
    amenities: { wifi: true, ac: true, parking: true },
    status: "approved",
    createdAt: "2026-01-08",
  },
  {
    id: "h5",
    ownerId: "owner1",
    name: "Jaipur Heritage Inn",
    city: "Jaipur",
    address: "MI Road, Jaipur",
    description:
      "Experience Rajasthani hospitality in this charming heritage-style property near the Pink City center.",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
    ],
    pricePerNight: 1199,
    rating: 4.4,
    amenities: { wifi: true, ac: true, parking: false },
    status: "approved",
    createdAt: "2026-01-09",
  },
  {
    id: "h6",
    ownerId: "owner1",
    name: "Chennai Comfort Inn",
    city: "Chennai",
    address: "T. Nagar, Chennai",
    description:
      "Clean, affordable rooms in the busiest shopping district of Chennai. Close to temples and beaches.",
    images: [
      "https://images.unsplash.com/photo-1596701062351-8ac031b6adbb?w=800",
    ],
    pricePerNight: 999,
    rating: 3.9,
    amenities: { wifi: true, ac: true, parking: false },
    status: "approved",
    createdAt: "2026-01-10",
  },
];

export const seedRooms: Room[] = [
  {
    id: "r1",
    hotelId: "h1",
    roomType: "Standard Single",
    price: 1299,
    description: "Cozy single room with attached bathroom and TV.",
    available: true,
  },
  {
    id: "r2",
    hotelId: "h1",
    roomType: "Deluxe Double",
    price: 1799,
    description: "Spacious double room with AC and mini-fridge.",
    available: true,
  },
  {
    id: "r3",
    hotelId: "h2",
    roomType: "Standard Single",
    price: 1599,
    description: "Comfortable room with city view.",
    available: true,
  },
  {
    id: "r4",
    hotelId: "h2",
    roomType: "Business Suite",
    price: 2499,
    description: "Premium suite with work desk and high-speed WiFi.",
    available: true,
  },
  {
    id: "r5",
    hotelId: "h3",
    roomType: "Budget Single",
    price: 899,
    description: "Simple, clean room with all basic amenities.",
    available: true,
  },
  {
    id: "r6",
    hotelId: "h4",
    roomType: "Tech Studio",
    price: 1799,
    description:
      "Smart room with high-speed internet and multiple charging points.",
    available: true,
  },
  {
    id: "r7",
    hotelId: "h5",
    roomType: "Heritage Room",
    price: 1199,
    description: "Rajasthani-décor room with traditional charm.",
    available: true,
  },
  {
    id: "r8",
    hotelId: "h6",
    roomType: "Standard AC",
    price: 999,
    description: "Budget AC room near all city attractions.",
    available: true,
  },
];

export const seedBookings: Booking[] = [
  {
    id: "b1",
    userId: "user1",
    hotelId: "h1",
    roomId: "r1",
    guestName: "Priya Patel",
    guestPhone: "7777777777",
    checkIn: "2026-03-01",
    checkOut: "2026-03-03",
    totalPrice: 2598,
    guests: 2,
    initialPaid: 198,
    remainingDue: 2400,
    paymentMethod: "UPI - GPay",
    paymentStatus: "partial",
    status: "confirmed",
    createdAt: "2026-02-25",
  },
];

export const seedReviews: Review[] = [
  {
    id: "rev1",
    userId: "user1",
    hotelId: "h1",
    rating: 4,
    comment:
      "Great location, clean rooms and helpful staff. Would recommend for budget travelers!",
    createdAt: "2026-03-04",
  },
  {
    id: "rev2",
    userId: "user1",
    hotelId: "h2",
    rating: 4,
    comment: "Convenient for airport transfers. Breakfast was decent.",
    createdAt: "2026-03-05",
  },
];
