import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";
import { ALL_STATES, getDistricts } from "../data/indiaLocations";

export function OwnerDashboardPage() {
  const {
    currentUser,
    hotels,
    bookings,
    rooms,
    addHotel,
    blockedDates,
    blockDates,
    unblockDates,
  } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "hotels" | "add" | "bookings" | "earnings" | "block"
  >("hotels");

  // Add hotel form state
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [wifi, setWifi] = useState(false);
  const [ac, setAc] = useState(false);
  const [parking, setParking] = useState(false);
  const [success, setSuccess] = useState(false);

  // Block dates form state
  const [blockHotelId, setBlockHotelId] = useState("");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockSuccess, setBlockSuccess] = useState(false);
  const [blockError, setBlockError] = useState("");

  if (!currentUser || currentUser.role !== "owner") {
    navigate("/login");
    return null;
  }

  const myHotels = hotels.filter((h) => h.ownerId === currentUser.id);
  const myHotelIds = myHotels.map((h) => h.id);
  const myBookings = bookings.filter((b) => myHotelIds.includes(b.hotelId));
  const myBlockedDates = blockedDates.filter((b) =>
    myHotelIds.includes(b.hotelId),
  );

  const confirmedBookings = myBookings.filter((b) => b.status === "confirmed");
  const totalEarnings = confirmedBookings.reduce(
    (sum, b) => sum + (b.initialPaid ?? b.totalPrice),
    0,
  );
  const pendingCollection = myBookings
    .filter(
      (b) =>
        b.status === "confirmed" &&
        (b.paymentStatus ?? "partial") !== "refunded",
    )
    .reduce((sum, b) => sum + (b.remainingDue ?? 0), 0);

  const handleAddHotel = () => {
    if (!name.trim() || !address.trim() || !price || !state || !city) return;
    addHotel({
      ownerId: currentUser.id,
      name: name.trim(),
      city: `${state} - ${city}`,
      address: address.trim(),
      description: description.trim(),
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      ],
      pricePerNight: Number(price),
      amenities: { wifi, ac, parking },
    });
    setName("");
    setState("");
    setCity("");
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

  const handleBlockDates = () => {
    setBlockError("");
    if (!blockHotelId || !blockStart || !blockEnd) {
      setBlockError("Please fill all fields.");
      return;
    }
    if (blockEnd < blockStart) {
      setBlockError("End date must be after start date.");
      return;
    }
    blockDates(
      blockHotelId,
      blockStart,
      blockEnd,
      blockReason.trim() || undefined,
    );
    setBlockStart("");
    setBlockEnd("");
    setBlockReason("");
    setBlockSuccess(true);
    setTimeout(() => setBlockSuccess(false), 3000);
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold mb-6">Hotel Owner Dashboard</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {(["hotels", "add", "block", "bookings", "earnings"] as const).map(
            (t) => (
              <button
                type="button"
                key={t}
                onClick={() => setActiveTab(t)}
                data-ocid={`owner.${t}.tab`}
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
                    : t === "block"
                      ? "🚫 Block Dates"
                      : t === "bookings"
                        ? "Bookings"
                        : "Earnings"}
              </button>
            ),
          )}
        </div>

        {activeTab === "hotels" && (
          <div className="space-y-4">
            {myHotels.length === 0 ? (
              <div
                data-ocid="owner.hotels.empty_state"
                className="text-center py-16 text-gray-400"
              >
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
              <div
                data-ocid="owner.add.success_state"
                className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm"
              >
                ✅ Hotel submitted for approval!
              </div>
            )}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Hotel Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="owner.hotel.input"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCity("");
                }}
                data-ocid="owner.state.select"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F] bg-white"
              >
                <option value="">Select State / Union Territory</option>
                {ALL_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!state}
                data-ocid="owner.district.select"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select District</option>
                {getDistricts(state).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                data-ocid="owner.address.input"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                data-ocid="owner.description.textarea"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <input
                type="number"
                placeholder="Price per night (₹)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                data-ocid="owner.price.input"
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
                      data-ocid="owner.wifi.checkbox"
                      className="accent-[#E58A1F]"
                    />{" "}
                    WiFi
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ac}
                      onChange={(e) => setAc(e.target.checked)}
                      data-ocid="owner.ac.checkbox"
                      className="accent-[#E58A1F]"
                    />{" "}
                    AC
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parking}
                      onChange={(e) => setParking(e.target.checked)}
                      data-ocid="owner.parking.checkbox"
                      className="accent-[#E58A1F]"
                    />{" "}
                    Parking
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddHotel}
                disabled={
                  !name.trim() || !address.trim() || !price || !state || !city
                }
                data-ocid="owner.add.submit_button"
                className="w-full bg-[#E58A1F] hover:bg-[#C97A1D] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        )}

        {activeTab === "block" && (
          <div className="space-y-6">
            {/* Block Dates Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6 max-w-xl">
              <h2 className="font-bold text-gray-900 mb-1">Block Dates</h2>
              <p className="text-sm text-gray-500 mb-4">
                Block specific dates to prevent bookings (maintenance, holidays,
                etc.)
              </p>

              {blockSuccess && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
                  ✅ Dates blocked successfully!
                </div>
              )}
              {blockError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                  ⚠️ {blockError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="block-hotel"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Hotel
                  </label>
                  <select
                    id="block-hotel"
                    value={blockHotelId}
                    onChange={(e) => setBlockHotelId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F] bg-white"
                  >
                    <option value="">Choose a hotel...</option>
                    {myHotels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="block-start"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date
                    </label>
                    <input
                      id="block-start"
                      type="date"
                      value={blockStart}
                      min={today}
                      onChange={(e) => setBlockStart(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="block-end"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date
                    </label>
                    <input
                      id="block-end"
                      type="date"
                      value={blockEnd}
                      min={blockStart || today}
                      onChange={(e) => setBlockEnd(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="block-reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason (optional)
                  </label>
                  <input
                    id="block-reason"
                    type="text"
                    placeholder="e.g. Maintenance, Renovation, Holiday..."
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleBlockDates}
                  disabled={!blockHotelId || !blockStart || !blockEnd}
                  className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  🚫 Block These Dates
                </button>
              </div>
            </div>

            {/* Existing Blocked Ranges */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Blocked Date Ranges ({myBlockedDates.length})
              </h3>
              {myBlockedDates.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">⚫</div>
                  <p className="text-sm">No blocked dates yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myBlockedDates.map((b) => {
                    const hotel = myHotels.find((h) => h.id === b.hotelId);
                    return (
                      <div
                        key={b.id}
                        className="flex items-center justify-between border border-gray-100 rounded-xl p-4"
                      >
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {hotel?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{b.startDate}</span> →{" "}
                            <span className="font-medium">{b.endDate}</span>
                          </p>
                          {b.reason && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {b.reason}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => unblockDates(b.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
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
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              b.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
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

        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-2xl p-5 text-center">
                <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide mb-1">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-orange-700">
                  ₹{totalEarnings.toLocaleString()}
                </p>
                <p className="text-xs text-orange-500 mt-1">
                  Token payments received
                </p>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-5 text-center">
                <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wide mb-1">
                  Pending Collection
                </p>
                <p className="text-2xl font-bold text-yellow-700">
                  ₹{pendingCollection.toLocaleString()}
                </p>
                <p className="text-xs text-yellow-500 mt-1">Due at check-in</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 text-center">
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {myBookings.length}
                </p>
                <p className="text-xs text-green-500 mt-1">All time</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Hotel
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Guest
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Payment Method
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Token Received
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Balance Due
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-10 text-gray-400"
                      >
                        No earnings yet
                      </td>
                    </tr>
                  ) : (
                    myBookings.map((b) => {
                      const h = hotels.find((x) => x.id === b.hotelId);
                      const initialPaid = b.initialPaid ?? b.totalPrice;
                      const remainingDue = b.remainingDue ?? 0;
                      const paymentStatus = b.paymentStatus ?? "partial";
                      return (
                        <tr key={b.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">{h?.name}</td>
                          <td className="px-4 py-3">{b.guestName}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {b.paymentMethod ?? "UPI"}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#E58A1F]">
                            ₹{initialPaid.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            ₹{remainingDue.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                paymentStatus === "refunded"
                                  ? "bg-green-100 text-green-700"
                                  : paymentStatus === "full"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {paymentStatus === "refunded"
                                ? "Refunded"
                                : paymentStatus === "full"
                                  ? "Fully Paid"
                                  : "Token Paid"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
