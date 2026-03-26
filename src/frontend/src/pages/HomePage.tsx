import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { HotelCard } from "../components/HotelCard";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

const CITIES = [
  {
    name: "Delhi",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200",
  },
  {
    name: "Mumbai",
    img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200",
  },
  {
    name: "Patna",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200",
  },
  {
    name: "Bangalore",
    img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=200",
  },
  {
    name: "Kolkata",
    img: "https://images.unsplash.com/photo-1558431382-27e303142255?w=200",
  },
  {
    name: "Jaipur",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=200",
  },
];

const WHY_CHOOSE = [
  {
    icon: "💰",
    title: "Best Prices",
    desc: "We guarantee the lowest prices on budget hotels across India.",
  },
  {
    icon: "🏨",
    title: "1000+ Hotels",
    desc: "Choose from over 1000 verified hotels in 100+ Indian cities.",
  },
  {
    icon: "🔒",
    title: "Safe & Secure",
    desc: "Your bookings and payments are fully protected and secure.",
  },
  {
    icon: "⚡",
    title: "Instant Booking",
    desc: "Get instant confirmation on all your hotel bookings.",
  },
];

export function HomePage() {
  const { hotels } = useApp();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  const today = new Date().toISOString().split("T")[0];
  const featuredHotels = hotels
    .filter((h) => h.status === "approved")
    .slice(0, 6);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#E58A1F] to-[#C97A1D] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Affordable Stays. Amazing India.
          </h1>
          <p className="text-orange-100 text-lg mb-8">
            Budget stays across India's top cities. Book instantly.
          </p>
          <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-semibold text-gray-500 mb-1 text-left"
                >
                  CITY
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E58A1F]"
                />
              </div>
              <div>
                <label
                  htmlFor="checkIn"
                  className="block text-xs font-semibold text-gray-500 mb-1 text-left"
                >
                  CHECK-IN
                </label>
                <input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E58A1F]"
                />
              </div>
              <div>
                <label
                  htmlFor="checkOut"
                  className="block text-xs font-semibold text-gray-500 mb-1 text-left"
                >
                  CHECK-OUT
                </label>
                <input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E58A1F]"
                />
              </div>
              <div>
                <label
                  htmlFor="guests"
                  className="block text-xs font-semibold text-gray-500 mb-1 text-left"
                >
                  GUESTS
                </label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E58A1F]"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} Guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="mt-4 w-full md:w-auto bg-[#123A63] hover:bg-[#0f2e52] text-white font-bold px-10 py-3 rounded-xl transition-colors text-sm tracking-wide"
            >
              SEARCH HOTELS
            </button>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            Featured Budget Hotels across India
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            Popular Indian Cities
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {CITIES.map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                  onClick={() => navigate(`/hotels?city=${c.name}`)}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-orange-100 group-hover:ring-[#E58A1F] transition-all">
                    <img
                      src={c.img}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-gray-800">{c.name}</span>
                  <span className="text-xs border border-gray-300 group-hover:border-[#E58A1F] group-hover:text-[#E58A1F] px-3 py-1 rounded-full transition-colors">
                    Explore
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            Why Choose Myhotols?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
