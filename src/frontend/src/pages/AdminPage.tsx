import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

export function AdminPage() {
  const { currentUser, hotels, bookings, users, approveHotel, rejectHotel } =
    useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "bookings" | "users">(
    "pending",
  );

  if (!currentUser || currentUser.role !== "admin") {
    navigate("/login");
    return null;
  }

  const pendingHotels = hotels.filter((h) => h.status === "pending");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-500 text-sm mb-6">
          Manage hotels, bookings, and users
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Hotels",
              value: hotels.length,
              color: "bg-blue-50 text-blue-700",
            },
            {
              label: "Pending Approval",
              value: pendingHotels.length,
              color: "bg-yellow-50 text-yellow-700",
            },
            {
              label: "Total Bookings",
              value: bookings.length,
              color: "bg-green-50 text-green-700",
            },
            {
              label: "Total Users",
              value: users.length,
              color: "bg-purple-50 text-purple-700",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.color} rounded-2xl p-4 text-center`}
            >
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          {(["pending", "bookings", "users"] as const).map((t) => (
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
              {t === "pending"
                ? `Pending Approvals (${pendingHotels.length})`
                : t === "bookings"
                  ? "All Bookings"
                  : "All Users"}
            </button>
          ))}
        </div>

        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingHotels.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">✅</div>
                <p>No pending hotels for approval.</p>
              </div>
            ) : (
              pendingHotels.map((h) => {
                const owner = users.find((u) => u.id === h.ownerId);
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
                      <h3 className="font-bold text-gray-900">{h.name}</h3>
                      <p className="text-sm text-gray-500">
                        {h.city} • ₹{h.pricePerNight.toLocaleString()}/night
                      </p>
                      <p className="text-xs text-gray-400">
                        Owner: {owner?.name ?? "Unknown"} ({owner?.email})
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {h.description.slice(0, 100)}...
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => approveHotel(h.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectHotel(h.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Booking ID
                  </th>
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
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      No bookings
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => {
                    const h = hotels.find((x) => x.id === b.hotelId);
                    return (
                      <tr key={b.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                        <td className="px-4 py-3">{h?.name}</td>
                        <td className="px-4 py-3">{b.guestName}</td>
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

        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : u.role === "owner"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {u.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
