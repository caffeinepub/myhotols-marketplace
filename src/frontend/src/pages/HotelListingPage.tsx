import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { HotelCard } from "../components/HotelCard";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

export function HotelListingPage() {
  const { hotels } = useApp();
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city") || "";

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [filterWifi, setFilterWifi] = useState(false);
  const [filterAc, setFilterAc] = useState(false);
  const [filterParking, setFilterParking] = useState(false);

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      if (h.status !== "approved") return false;
      if (city && !h.city.toLowerCase().includes(city.toLowerCase()))
        return false;
      if (minPrice && h.pricePerNight < Number(minPrice)) return false;
      if (maxPrice && h.pricePerNight > Number(maxPrice)) return false;
      if (minRating && h.rating < minRating) return false;
      if (filterWifi && !h.amenities.wifi) return false;
      if (filterAc && !h.amenities.ac) return false;
      if (filterParking && !h.amenities.parking) return false;
      return true;
    });
  }, [
    hotels,
    city,
    minPrice,
    maxPrice,
    minRating,
    filterWifi,
    filterAc,
    filterParking,
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {city ? `Hotels in ${city}` : "All Hotels"}
          <span className="ml-2 text-base font-normal text-gray-500">
            ({filtered.length} found)
          </span>
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
              <h2 className="font-bold text-gray-900 mb-4">Filters</h2>
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Price Range (₹/night)
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#E58A1F]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#E58A1F]"
                  />
                </div>
              </div>
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Minimum Rating
                </h3>
                {[3, 4, 5].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 cursor-pointer py-1"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(minRating === r ? 0 : r)}
                      className="accent-[#E58A1F]"
                    />
                    <span className="text-yellow-400">{"★".repeat(r)}</span>
                    <span className="text-sm text-gray-600">{r}★ & above</span>
                  </label>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Amenities
                </h3>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={filterWifi}
                    onChange={(e) => setFilterWifi(e.target.checked)}
                    className="accent-[#E58A1F]"
                  />
                  <span className="text-sm text-gray-700">WiFi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={filterAc}
                    onChange={(e) => setFilterAc(e.target.checked)}
                    className="accent-[#E58A1F]"
                  />
                  <span className="text-sm text-gray-700">AC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={filterParking}
                    onChange={(e) => setFilterParking(e.target.checked)}
                    className="accent-[#E58A1F]"
                  />
                  <span className="text-sm text-gray-700">Parking</span>
                </label>
              </div>
            </div>
          </aside>
          {/* Results */}
          <main className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-5xl mb-4">🏨</div>
                <p className="text-xl font-semibold">No hotels found</p>
                <p className="text-sm mt-2">
                  Try adjusting your filters or search a different city.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((h) => (
                  <HotelCard key={h.id} hotel={h} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
