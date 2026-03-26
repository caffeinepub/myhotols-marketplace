import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

export function MyBookingsPage() {
  const { currentUser, bookings, hotels, rooms } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const myBookings = bookings.filter((b) => b.userId === currentUser.id);

  const paymentStatusBadge = (status: string) => {
    if (status === "refunded")
      return (
        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          💚 Refunded
        </span>
      );
    if (status === "full")
      return (
        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          ✅ Fully Paid
        </span>
      );
    return (
      <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
        🟡 Token Paid
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-500 text-sm mb-6">
          All your hotel reservations
        </p>

        {myBookings.length === 0 ? (
          <div
            data-ocid="mybookings.empty_state"
            className="text-center py-20 bg-white rounded-2xl shadow-sm"
          >
            <div className="text-5xl mb-4">🏨</div>
            <p className="text-gray-600 font-semibold text-lg mb-2">
              No bookings yet
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Browse hotels and make your first booking!
            </p>
            <button
              type="button"
              data-ocid="mybookings.browse.primary_button"
              onClick={() => navigate("/hotels")}
              className="bg-[#E58A1F] hover:bg-[#C97A1D] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myBookings.map((booking, idx) => {
              const hotel = hotels.find((h) => h.id === booking.hotelId);
              const room = rooms.find((r) => r.id === booking.roomId);
              const initialPaid = booking.initialPaid ?? booking.totalPrice;
              const remainingDue = booking.remainingDue ?? 0;
              const paymentStatus = booking.paymentStatus ?? "partial";

              return (
                <div
                  key={booking.id}
                  data-ocid={`mybookings.item.${idx + 1}`}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={
                        hotel?.images[0] ??
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
                      }
                      alt={hotel?.name}
                      className="w-24 h-20 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900 truncate">
                          {hotel?.name ?? "Hotel"}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {room?.roomType} • {booking.guests ?? 1} guest
                        {(booking.guests ?? 1) > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {booking.checkIn} → {booking.checkOut}
                      </p>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="border-t bg-gray-50 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Paid Now</p>
                            <p className="font-bold text-[#E58A1F]">
                              ₹{initialPaid.toLocaleString()}
                            </p>
                          </div>
                          {remainingDue > 0 && paymentStatus !== "refunded" && (
                            <div>
                              <p className="text-xs text-gray-400">
                                Due at Hotel
                              </p>
                              <p className="font-semibold text-gray-600">
                                ₹{remainingDue.toLocaleString()}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-400">Via</p>
                            <p className="text-xs font-medium text-gray-600">
                              {booking.paymentMethod ?? "UPI"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>{paymentStatusBadge(paymentStatus)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
