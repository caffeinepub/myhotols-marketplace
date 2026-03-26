import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

const STEPS = [
  { key: "details", label: "Guest Details" },
  { key: "payment", label: "Payment" },
  { key: "otp", label: "Verify OTP" },
] as const;

const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM"];
const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "PNB", "Kotak", "BOB"];

type PaymentTab = "upi" | "netbanking" | "card";

export function BookingPage() {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const { hotels, rooms, currentUser, addBooking, isRangeBlocked } = useApp();
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
  const [guests, setGuests] = useState(1);

  // Payment state
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState("GPay");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardType, setCardType] = useState<"debit" | "credit">("debit");

  const [step, setStep] = useState<
    "details" | "payment" | "otp" | "processing"
  >("details");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!currentUser) {
    navigate("/login");
    return null;
  }
  if (!hotel || !room)
    return <div className="p-8 text-center">Booking not found</div>;

  const rangeBlocked = hotelId
    ? isRangeBlocked(hotelId, checkIn, checkOut)
    : false;

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
    ),
  );
  const totalPrice = nights * room.price;
  const initialPaid = 99 * guests;
  const remainingDue = totalPrice - initialPaid;

  const getPaymentMethodLabel = () => {
    if (paymentTab === "upi") return `UPI - ${selectedUpiApp}`;
    if (paymentTab === "netbanking") return `Net Banking - ${selectedBank}`;
    return `${cardType === "debit" ? "Debit" : "Credit"} Card`;
  };

  const sendOtp = () => {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    setEnteredOtp("");
    setOtpError("");
    setResendTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp) {
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
          guests,
          initialPaid,
          remainingDue,
          paymentMethod: getPaymentMethodLabel(),
          paymentStatus: "partial",
          status: "confirmed",
        });
        navigate(`/booking/confirmation?bookingId=${booking.id}`);
      }, 1500);
    } else {
      setOtpError("Incorrect OTP. Please try again.");
    }
  };

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const progressIndex = step === "processing" ? 3 : stepIndex;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>

        {/* Progress Steps */}
        {step !== "processing" && (
          <div className="flex items-center mb-6">
            {STEPS.map((s, i) => {
              const isCompleted = progressIndex > i;
              const isActive = progressIndex === i;
              return (
                <div
                  key={s.key}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-[#E58A1F] text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-xs mt-1 whitespace-nowrap ${
                        isActive
                          ? "text-[#E58A1F] font-semibold"
                          : isCompleted
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mb-4 ${
                        progressIndex > i ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Summary Card */}
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

        {/* Blocked Dates Notice */}
        {rangeBlocked && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <span className="text-xl font-bold text-red-600">!</span>
            <div>
              <p className="font-bold text-red-700">Dates Not Available</p>
              <p className="text-sm text-red-600">
                The selected dates ({checkIn} to {checkOut}) are blocked. Please
                go back and choose different dates.
              </p>
            </div>
          </div>
        )}

        {/* Step: Guest Details */}
        {step === "details" && (
          <div
            className="bg-white rounded-2xl shadow-sm p-6"
            data-ocid="booking.details.panel"
          >
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
                  data-ocid="booking.name.input"
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
                  data-ocid="booking.phone.input"
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
                    data-ocid="booking.checkin.input"
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
                    data-ocid="booking.checkout.input"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="numGuests"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Guests
                </label>
                <input
                  id="numGuests"
                  data-ocid="booking.guests.input"
                  type="number"
                  min={1}
                  max={10}
                  value={guests}
                  onChange={(e) =>
                    setGuests(Math.max(1, Number(e.target.value)))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                />
              </div>

              {/* Payment Split Info */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-[#E58A1F] mb-2">
                  💳 Split Payment Plan
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Initial Booking Payment (₹99 × {guests} guest
                      {guests > 1 ? "s" : ""})
                    </span>
                    <span className="font-bold text-[#E58A1F]">
                      ₹{initialPaid}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Remaining due at hotel check-in
                    </span>
                    <span className="font-semibold text-gray-600">
                      ₹{remainingDue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                data-ocid="booking.proceed.primary_button"
                disabled={
                  !guestName.trim() || !guestPhone.trim() || rangeBlocked
                }
                onClick={() => setStep("payment")}
                className="w-full bg-[#E58A1F] hover:bg-[#C97A1D] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && (
          <div
            className="bg-white rounded-2xl shadow-sm p-6"
            data-ocid="booking.payment.panel"
          >
            <h2 className="font-bold text-gray-900 mb-4">
              Choose Payment Method
            </h2>

            {/* Payment Split Summary */}
            <div className="rounded-xl border border-gray-100 overflow-hidden mb-6">
              <div className="bg-orange-50 px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    PAY NOW (Token)
                  </p>
                  <p className="text-2xl font-bold text-[#E58A1F]">
                    ₹{initialPaid}
                  </p>
                  <p className="text-xs text-gray-500">
                    ₹99 × {guests} guest{guests > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-2xl">💳</div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    PAY AT HOTEL
                  </p>
                  <p className="text-xl font-bold text-gray-500">
                    ₹{remainingDue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Due at check-in</p>
                </div>
                <div className="text-2xl">🏨</div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex gap-2 mb-5">
              {(["upi", "netbanking", "card"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  data-ocid={`booking.${tab}.tab`}
                  onClick={() => setPaymentTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                    paymentTab === tab
                      ? "bg-[#E58A1F] text-white border-[#E58A1F]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#E58A1F]"
                  }`}
                >
                  {tab === "upi"
                    ? "UPI"
                    : tab === "netbanking"
                      ? "Net Banking"
                      : "Card"}
                </button>
              ))}
            </div>

            {/* UPI */}
            {paymentTab === "upi" && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedUpiApp(app)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-colors ${
                        selectedUpiApp === app
                          ? "bg-[#E58A1F] text-white border-[#E58A1F]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#E58A1F]"
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
                <div>
                  <label
                    htmlFor="upiId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    UPI ID
                  </label>
                  <input
                    id="upiId"
                    data-ocid="booking.upi.input"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                    placeholder={`yourname@${selectedUpiApp.toLowerCase()}`}
                  />
                </div>
              </div>
            )}

            {/* Net Banking */}
            {paymentTab === "netbanking" && (
              <div>
                <label
                  htmlFor="bankSelect"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Bank
                </label>
                <select
                  id="bankSelect"
                  data-ocid="booking.bank.select"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F] bg-white"
                >
                  <option value="">Choose your bank</option>
                  {BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b} Bank
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Card */}
            {paymentTab === "card" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(["debit", "credit"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCardType(t)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                        cardType === t
                          ? "bg-[#E58A1F] text-white border-[#E58A1F]"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {t === "debit" ? "Debit Card" : "Credit Card"}
                    </button>
                  ))}
                </div>
                <input
                  data-ocid="booking.card_number.input"
                  type="text"
                  maxLength={4}
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                  placeholder="Last 4 digits of card"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    data-ocid="booking.card_expiry.input"
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                    placeholder="MM/YY"
                  />
                  <input
                    data-ocid="booking.card_name.input"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                    placeholder="Name on card"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              data-ocid="booking.send_otp.primary_button"
              onClick={sendOtp}
              className="w-full mt-5 bg-[#E58A1F] hover:bg-[#C97A1D] text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Pay ₹{initialPaid} Now &amp; Send OTP
            </button>
            <button
              type="button"
              data-ocid="booking.back.secondary_button"
              onClick={() => setStep("details")}
              className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700"
            >
              ← Back to Details
            </button>
          </div>
        )}

        {/* Step: OTP Verification */}
        {step === "otp" && (
          <div
            className="bg-white rounded-2xl shadow-sm p-6"
            data-ocid="booking.otp.panel"
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-[#E58A1F] rounded-full flex items-center justify-center text-3xl mb-3">
                📱
              </div>
              <h2 className="font-bold text-gray-900 text-xl">
                OTP Verification
              </h2>
              <p className="text-gray-500 text-sm mt-1 text-center">
                A 6-digit OTP has been sent to your registered mobile number
              </p>
              <p className="text-[#E58A1F] font-semibold text-sm mt-1">
                {guestPhone}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-center">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
                Demo Mode
              </p>
              <p className="text-blue-800 text-sm">
                Your OTP is:{" "}
                <span className="font-bold text-lg tracking-widest">
                  {generatedOtp}
                </span>
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="otpInput"
                className="block text-sm font-medium text-gray-700 mb-2 text-center"
              >
                Enter 6-digit OTP
              </label>
              <input
                id="otpInput"
                data-ocid="booking.otp.input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value.replace(/\D/g, ""));
                  setOtpError("");
                }}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#E58A1F] text-center text-2xl font-bold tracking-widest"
                placeholder="——————"
              />
              {otpError && (
                <p
                  className="text-red-500 text-sm mt-2 text-center"
                  data-ocid="booking.otp.error_state"
                >
                  {otpError}
                </p>
              )}
            </div>

            <button
              type="button"
              data-ocid="booking.verify_otp.primary_button"
              disabled={enteredOtp.length < 6}
              onClick={handleVerifyOtp}
              className="w-full bg-[#E58A1F] hover:bg-[#C97A1D] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mb-4"
            >
              Verify &amp; Confirm ₹{initialPaid} Payment
            </button>

            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-gray-400 text-sm">
                  Resend OTP in{" "}
                  <span className="font-semibold text-gray-600">
                    {resendTimer}s
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  data-ocid="booking.resend_otp.button"
                  onClick={sendOtp}
                  className="text-[#E58A1F] text-sm font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              data-ocid="booking.back_to_payment.secondary_button"
              onClick={() => setStep("payment")}
              className="w-full mt-4 text-gray-500 text-sm hover:text-gray-700"
            >
              ← Change Payment Method
            </button>
          </div>
        )}

        {/* Step: Processing */}
        {step === "processing" && (
          <div
            className="bg-white rounded-2xl shadow-sm p-10 text-center"
            data-ocid="booking.processing.loading_state"
          >
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
