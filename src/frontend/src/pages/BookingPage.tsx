import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

export function BookingPage() {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const { hotels, rooms, currentUser, addBooking } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hotel = hotels.find((h) => h.id === hotelId);
  const room = rooms.find((r) => r.id === roomId);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [guestName, setGuestName] = useState(currentUser?.name ?? "");
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone ?? "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || today);
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") || tomorrow,
  );
  const [upiId, setUpiId] = useState("user@upi");
  const [step, setStep] = useState<"details" | "payment" | "processing">(
    "details",
  );

  if (!currentUser) {
    navigate("/login");
    return null;
  }
  if (!hotel || !room)
    return <div className="p-8 text-center">Booking not found</div>;

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
    ),
  );
  const totalPrice = nights * room.price;

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      const booking = addBooking({
        userId: currentUser.id,
        hotelId: hotel.id,
        roomId: room.id,
        guestName,
        guestPhone,
        checkIn,
        checkOut,
        totalPrice,
        status: "confirmed",
      });
      navigate(`/booking/confirmation?bookingId=${booking.id}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex gap-4">
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-24 h-20 object-cover rounded-xl"
            />
            <div>
              <h2 className="font-bold text-gray-900">{hotel.name}</h2>
              <p className="text-gray-500 text-sm">
                {hotel.city} • {room.roomType}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {checkIn} → {checkOut} ({nights} night{nights > 1 ? "s" : ""})
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between">
            <span className="text-gray-600">
              ₹{room.price.toLocaleString()} × {nights} night
              {nights > 1 ? "s" : ""}
            </span>
            <span className="text-xl font-bold text-[#E58A1F]">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {step === "details" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Guest Details</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="guestName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="guestName"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="guestPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="guestPhone"
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkIn"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Check-in
                  </label>
                  <input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkOut"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Check-out
                  </label>
                  <input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={!guestName.trim() || !guestPhone.trim()}
                onClick={() => setStep("payment")}
                className="w-full bg-[#E58A1F] hover:bg-[#C97A1D] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-2">Pay with UPI</h2>
            <p className="text-gray-500 text-sm mb-5">
              Instant, secure payment via UPI
            </p>
            <div className="bg-orange-50 rounded-xl p-4 text-center mb-5">
              <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-[#E58A1F]">
                ₹{totalPrice.toLocaleString()}
              </p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="upiId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                UPI ID
              </label>
              <input
                id="upiId"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                placeholder="yourname@upi"
              />
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Supported: GPay, PhonePe, Paytm, BHIM UPI
            </p>
            <button
              type="button"
              onClick={handlePay}
              className="w-full bg-[#E58A1F] hover:bg-[#C97A1D] text-white font-bold py-3 rounded-xl transition-colors"
            >
              Pay Now ₹{totalPrice.toLocaleString()}
            </button>
            <button
              type="button"
              onClick={() => setStep("details")}
              className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700"
            >
              ← Back to Details
            </button>
          </div>
        )}

        {step === "processing" && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">⌛</div>
            <p className="text-lg font-semibold text-gray-700">
              Processing Payment...
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Please wait, do not close this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
