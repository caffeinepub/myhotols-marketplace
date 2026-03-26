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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Your reservation has been confirmed. Have a great stay!
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
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
              <span className="text-gray-500 text-sm">Check-in</span>
              <span className="text-sm">{booking.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Check-out</span>
              <span className="text-sm">{booking.checkOut}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Total Paid</span>
              <span className="font-bold text-[#E58A1F]">
                ₹{booking.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Go Home
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
