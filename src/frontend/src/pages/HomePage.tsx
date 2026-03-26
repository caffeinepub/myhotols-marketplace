import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const STATS = [
  { value: "1000+", label: "Hotels" },
  { value: "100+", label: "Cities" },
  { value: "50,000+", label: "Guests" },
  { value: "4.8★", label: "Rating" },
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
      <section className="bg-gradient-to-br from-[#E58A1F] to-[#C97A1D] py-14 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop: 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: headline + CTA */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Affordable Stays.
                <br />
                <span className="text-orange-100">Amazing India.</span>
              </h1>
              <p className="text-orange-100 text-lg mb-6 max-w-lg mx-auto lg:mx-0">
                Budget stays across India's top cities. Book instantly with just
                ₹99 per guest upfront.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white text-sm">
                  <span>✅</span> Verified Hotels
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white text-sm">
                  <span>🔒</span> Secure Payments
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white text-sm">
                  <span>⚡</span> Instant Confirmation
                </div>
              </div>
              <button
                type="button"
                onClick={handleSearch}
                data-ocid="hero.search.button"
                className="hidden lg:inline-flex bg-white text-[#E58A1F] font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all text-base"
              >
                Explore Hotels →
              </button>
            </div>

            {/* Right: search card */}
            <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Find Your Perfect Stay
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-xs font-semibold text-gray-500 mb-1"
                  >
                    CITY
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Enter city..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    data-ocid="hero.city.input"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E58A1F]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkIn"
                    className="block text-xs font-semibold text-gray-500 mb-1"
                  >
                    CHECK-IN
                  </label>
                  <input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    data-ocid="hero.checkin.input"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E58A1F]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkOut"
                    className="block text-xs font-semibold text-gray-500 mb-1"
                  >
                    CHECK-OUT
                  </label>
                  <input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    data-ocid="hero.checkout.input"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E58A1F]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="guests"
                    className="block text-xs font-semibold text-gray-500 mb-1"
                  >
                    GUESTS
                  </label>
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    data-ocid="hero.guests.select"
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
                data-ocid="hero.search_hotels.button"
                className="mt-4 w-full bg-[#123A63] hover:bg-[#0f2e52] text-white font-bold px-10 py-3 rounded-xl transition-colors text-sm tracking-wide"
              >
                SEARCH HOTELS
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">
                Pay just ₹99/guest to book. Remaining at check-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-bold text-[#E58A1F]">
                  {s.value}
                </div>
                <div className="text-gray-500 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
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

      {/* App Download Section */}
      <section className="bg-[#123A63] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Take Myhotols Everywhere
              </h2>
              <p className="text-blue-200 text-lg max-w-md">
                Book hotels on the go with our mobile app. Get exclusive
                app-only deals and manage all your bookings from your phone.
              </p>
              <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                <Link
                  to="/download"
                  className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 hover:bg-white/20 transition-colors"
                >
                  <span className="text-2xl">▶</span>
                  <div className="text-left">
                    <div className="text-xs text-blue-200">GET IT ON</div>
                    <div className="font-bold text-sm">Google Play</div>
                  </div>
                </Link>
                <Link
                  to="/download"
                  className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 hover:bg-white/20 transition-colors"
                >
                  <span className="text-2xl">🍎</span>
                  <div className="text-left">
                    <div className="text-xs text-blue-200">DOWNLOAD ON THE</div>
                    <div className="font-bold text-sm">App Store</div>
                  </div>
                </Link>
              </div>
              <Link
                to="/download"
                className="inline-block mt-4 text-blue-300 hover:text-white text-sm underline transition-colors"
              >
                Learn more about the app →
              </Link>
            </div>
            <div className="relative hidden lg:block">
              <div className="w-48 h-80 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center text-7xl shadow-2xl">
                🏨
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-40 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-4xl shadow-xl">
                📲
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
