import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

const CITIES = [
  "Delhi",
  "Mumbai",
  "Patna",
  "Bangalore",
  "Kolkata",
  "Jaipur",
  "Chennai",
  "Hyderabad",
  "Goa",
  "Agra",
  "Pune",
  "Ahmedabad",
];

export function OwnerDashboardPage() {
  const { currentUser, hotels, bookings, rooms, addHotel } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"hotels" | "add" | "bookings">(
    "hotels",
  );

  // Form state - must be before any conditional returns
  const [name, setName] = useState("");
  const [city, setCity] = useState("Delhi");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [wifi, setWifi] = useState(false);
  const [ac, setAc] = useState(false);
  const [parking, setParking] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!currentUser || currentUser.role !== "owner") {
    navigate("/login");
    return null;
  }

  const myHotels = hotels.filter((h) => h.ownerId === currentUser.id);
  const myHotelIds = myHotels.map((h) => h.id);
  const myBookings = bookings.filter((b) => myHotelIds.includes(b.hotelId));

  const handleAddHotel = () => {
    if (!name.trim() || !address.trim() || !price) return;
    addHotel({
      ownerId: currentUser.id,
      name: name.trim(),
      city,
      address: address.trim(),
      description: description.trim(),
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      ],
      pricePerNight: Number(price),
      amenities: { wifi, ac, parking },
    });
    setName("");
    setAddress("");
    setDescription("");
    setPrice("");
    setWifi(false);
    setAc(false);
    setParking(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setActiveTab("hotels");
    }, 2000);
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold mb-6">Hotel Owner Dashboard</h1>
        <div className="flex gap-2 mb-6">
          {(["hotels", "add", "bookings"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === t
                  ? "bg-[#E58A1F] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#E58A1F]"
              }`}
            >
              {t === "hotels"
                ? "My Hotels"
                : t === "add"
                  ? "Add Hotel"
                  : "Bookings"}
            </button>
          ))}
        </div>

        {activeTab === "hotels" && (
          <div className="space-y-4">
            {myHotels.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">🏨</div>
                <p>No hotels yet. Add your first hotel!</p>
              </div>
            ) : (
              myHotels.map((h) => {
                const hotelRooms = rooms.filter((r) => r.hotelId === h.id);
                return (
                  <div
                    key={h.id}
                    className="bg-white rounded-2xl shadow-sm p-5 flex gap-4"
                  >
                    <img
                      src={h.images[0]}
                      alt={h.name}
                      className="w-24 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">{h.name}</h3>
                          <p className="text-sm text-gray-500">
                            {h.city} • ₹{h.pricePerNight.toLocaleString()}/night
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {hotelRooms.length} room types
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor[h.status]}`}
                        >
                          {h.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "add" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 max-w-xl">
            <h2 className="font-bold text-gray-900 mb-4">Add New Hotel</h2>
            {success && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
                ✅ Hotel submitted for approval!
              </div>
            )}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Hotel Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <input
                type="number"
                placeholder="Price per night (₹)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wifi}
                      onChange={(e) => setWifi(e.target.checked)}
                      className="accent-[#E58A1F]"
                    />{" "}
                    WiFi
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ac}
                      onChange={(e) => setAc(e.target.checked)}
                      className="accent-[#E58A1F]"
                    />{" "}
                    AC
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parking}
                      onChange={(e) => setParking(e.target.checked)}
                      className="accent-[#E58A1F]"
                    />{" "}
                    Parking
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddHotel}
                disabled={!name.trim() || !address.trim() || !price}
                className="w-full bg-[#E58A1F] hover:bg-[#C97A1D] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Hotel
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Guest
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Dates
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {myBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  myBookings.map((b) => {
                    const h = hotels.find((x) => x.id === b.hotelId);
                    return (
                      <tr key={b.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{h?.name}</td>
                        <td className="px-4 py-3">
                          {b.guestName}
                          <br />
                          <span className="text-xs text-gray-400">
                            {b.guestPhone}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {b.checkIn} → {b.checkOut}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          ₹{b.totalPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
