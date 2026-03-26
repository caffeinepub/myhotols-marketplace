import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

export function BookingConfirmationPage() {
  const [searchParams] = useSearchParams();
  const { bookings, hotels, rooms } = useApp();
  const navigate = useNavigate();

  const bookingId = searchParams.get("bookingId");
  const booking = bookings.find((b) => b.id === bookingId);
  const hotel = booking ? hotels.find((h) => h.id === booking.hotelId) : null;
  const room = booking ? rooms.find((r) => r.id === booking.roomId) : null;

  if (!booking || !hotel || !room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Booking not found</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 bg-[#E58A1F] text-white px-6 py-2 rounded-lg"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initialPaid = booking.initialPaid ?? booking.totalPrice;
  const remainingDue = booking.remainingDue ?? 0;
  const paymentMethod = booking.paymentMethod ?? "UPI";
  const paymentStatus = booking.paymentStatus ?? "partial";

  const isPartial = paymentStatus === "partial";
  const isRefunded = paymentStatus === "refunded";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-500 text-sm">
              Your reservation has been confirmed. Have a great stay!
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-5">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Booking ID</span>
              <span className="font-mono text-sm font-semibold">
                {booking.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Hotel</span>
              <span className="font-semibold text-sm">{hotel.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Room</span>
              <span className="text-sm">{room.roomType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Guest</span>
              <span className="text-sm">{booking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Guests</span>
              <span className="text-sm">
                {booking.guests ?? 1} person
                {(booking.guests ?? 1) > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Check-in</span>
              <span className="text-sm">{booking.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Check-out</span>
              <span className="text-sm">{booking.checkOut}</span>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
            <div className="bg-orange-50 px-4 py-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Payment Breakdown
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm text-gray-700">Initial Paid</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#E58A1F]">
                    ₹{initialPaid.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">via {paymentMethod}</p>
                </div>
              </div>
            </div>
            {remainingDue > 0 && !isRefunded && (
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>🏨</span>
                    <span className="text-sm text-gray-700">
                      Remaining Due at Check-in
                    </span>
                  </div>
                  <p className="font-semibold text-gray-600">
                    ₹{remainingDue.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Room Cost</span>
              <span className="font-bold text-gray-800">
                ₹{booking.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Status Badge */}
          <div className="text-center mb-6">
            {isRefunded ? (
              <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-2 rounded-full">
                💚 Refunded
              </span>
            ) : isPartial ? (
              <span className="inline-block bg-yellow-100 text-yellow-700 font-semibold text-sm px-4 py-2 rounded-full">
                🟡 Token Paid — Balance Due at Hotel
              </span>
            ) : (
              <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-2 rounded-full">
                ✅ Fully Paid
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              My Bookings
            </button>
            <button
              type="button"
              onClick={() => navigate("/hotels")}
              className="flex-1 bg-[#E58A1F] text-white font-semibold py-2.5 rounded-xl hover:bg-[#C97A1D] transition-colors"
            >
              Browse Hotels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
