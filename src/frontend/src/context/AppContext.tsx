import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  seedBookings,
  seedHotels,
  seedReviews,
  seedRooms,
  seedUsers,
} from "../data/seedData";

export type UserRole = "customer" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface Hotel {
  id: string;
  ownerId: string;
  name: string;
  city: string;
  address: string;
  description: string;
  images: string[];
  pricePerNight: number;
  rating: number;
  amenities: { wifi: boolean; ac: boolean; parking: boolean };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface Room {
  id: string;
  hotelId: string;
  roomType: string;
  price: number;
  description: string;
  available: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  guests: number;
  initialPaid: number;
  remainingDue: number;
  paymentMethod: string;
  paymentStatus: "partial" | "full" | "refunded";
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  hotelId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BlockedDateRange {
  id: string;
  hotelId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  createdAt: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  hotels: Hotel[];
  rooms: Room[];
  bookings: Booking[];
  reviews: Review[];
  blockedDates: BlockedDateRange[];
  login: (email: string, password: string) => User | null;
  logout: () => void;
  register: (data: Omit<User, "id" | "createdAt">) => User;
  addHotel: (
    hotel: Omit<Hotel, "id" | "createdAt" | "status" | "rating">,
  ) => Hotel;
  addRoom: (room: Omit<Room, "id">) => Room;
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => Booking;
  addReview: (review: Omit<Review, "id" | "createdAt">) => Review;
  approveHotel: (hotelId: string) => void;
  rejectHotel: (hotelId: string) => void;
  refundBooking: (bookingId: string) => void;
  blockDates: (
    hotelId: string,
    startDate: string,
    endDate: string,
    reason?: string,
  ) => BlockedDateRange;
  unblockDates: (id: string) => void;
  isDateBlocked: (hotelId: string, date: string) => boolean;
  isRangeBlocked: (
    hotelId: string,
    startDate: string,
    endDate: string,
  ) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

const INITIALIZED_KEY = "myhotols_initialized";

export function AppContextProvider({
  children,
}: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    if (!localStorage.getItem(INITIALIZED_KEY)) return seedUsers;
    return load("mh_users", seedUsers);
  });
  const [hotels, setHotels] = useState<Hotel[]>(() => {
    if (!localStorage.getItem(INITIALIZED_KEY)) return seedHotels;
    return load("mh_hotels", seedHotels);
  });
  const [rooms, setRooms] = useState<Room[]>(() => {
    if (!localStorage.getItem(INITIALIZED_KEY)) return seedRooms;
    return load("mh_rooms", seedRooms);
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (!localStorage.getItem(INITIALIZED_KEY)) return seedBookings;
    return load("mh_bookings", seedBookings);
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (!localStorage.getItem(INITIALIZED_KEY)) return seedReviews;
    return load("mh_reviews", seedReviews);
  });
  const [blockedDates, setBlockedDates] = useState<BlockedDateRange[]>(() =>
    load("mh_blocked_dates", []),
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    load("mh_current_user", null),
  );

  useEffect(() => {
    if (!localStorage.getItem(INITIALIZED_KEY)) {
      localStorage.setItem(INITIALIZED_KEY, "1");
    }
    save("mh_users", users);
  }, [users]);
  useEffect(() => {
    save("mh_hotels", hotels);
  }, [hotels]);
  useEffect(() => {
    save("mh_rooms", rooms);
  }, [rooms]);
  useEffect(() => {
    save("mh_bookings", bookings);
  }, [bookings]);
  useEffect(() => {
    save("mh_reviews", reviews);
  }, [reviews]);
  useEffect(() => {
    save("mh_blocked_dates", blockedDates);
  }, [blockedDates]);
  useEffect(() => {
    save("mh_current_user", currentUser);
  }, [currentUser]);

  const login = (email: string, password: string): User | null => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) setCurrentUser(user);
    return user ?? null;
  };

  const logout = () => setCurrentUser(null);

  const register = (data: Omit<User, "id" | "createdAt">): User => {
    const user: User = {
      ...data,
      id: `u_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    return user;
  };

  const addHotel = (
    data: Omit<Hotel, "id" | "createdAt" | "status" | "rating">,
  ): Hotel => {
    const hotel: Hotel = {
      ...data,
      id: `h_${Date.now()}`,
      status: "pending",
      rating: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setHotels((prev) => [...prev, hotel]);
    return hotel;
  };

  const addRoom = (data: Omit<Room, "id">): Room => {
    const room: Room = { ...data, id: `r_${Date.now()}` };
    setRooms((prev) => [...prev, room]);
    return room;
  };

  const addBooking = (data: Omit<Booking, "id" | "createdAt">): Booking => {
    const booking: Booking = {
      ...data,
      id: `b_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBookings((prev) => [...prev, booking]);
    return booking;
  };

  const addReview = (data: Omit<Review, "id" | "createdAt">): Review => {
    const review: Review = {
      ...data,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [...prev, review]);
    setHotels((prev) =>
      prev.map((h) => {
        if (h.id !== data.hotelId) return h;
        const hotelReviews = [
          ...reviews.filter((r) => r.hotelId === data.hotelId),
          review,
        ];
        const avg =
          hotelReviews.reduce((s, r) => s + r.rating, 0) / hotelReviews.length;
        return { ...h, rating: Math.round(avg * 10) / 10 };
      }),
    );
    return review;
  };

  const approveHotel = (hotelId: string) =>
    setHotels((prev) =>
      prev.map((h) => (h.id === hotelId ? { ...h, status: "approved" } : h)),
    );

  const rejectHotel = (hotelId: string) =>
    setHotels((prev) =>
      prev.map((h) => (h.id === hotelId ? { ...h, status: "rejected" } : h)),
    );

  const refundBooking = (bookingId: string) =>
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, paymentStatus: "refunded", status: "cancelled" }
          : b,
      ),
    );

  const blockDates = (
    hotelId: string,
    startDate: string,
    endDate: string,
    reason?: string,
  ): BlockedDateRange => {
    const range: BlockedDateRange = {
      id: `bd_${Date.now()}`,
      hotelId,
      startDate,
      endDate,
      reason,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBlockedDates((prev) => [...prev, range]);
    return range;
  };

  const unblockDates = (id: string) =>
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));

  const isDateBlocked = (hotelId: string, date: string): boolean => {
    return blockedDates.some(
      (b) => b.hotelId === hotelId && date >= b.startDate && date <= b.endDate,
    );
  };

  const isRangeBlocked = (
    hotelId: string,
    startDate: string,
    endDate: string,
  ): boolean => {
    return blockedDates.some(
      (b) =>
        b.hotelId === hotelId &&
        startDate <= b.endDate &&
        endDate >= b.startDate,
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        hotels,
        rooms,
        bookings,
        reviews,
        blockedDates,
        login,
        logout,
        register,
        addHotel,
        addRoom,
        addBooking,
        addReview,
        approveHotel,
        rejectHotel,
        refundBooking,
        blockDates,
        unblockDates,
        isDateBlocked,
        isRangeBlocked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppContextProvider");
  return ctx;
}
