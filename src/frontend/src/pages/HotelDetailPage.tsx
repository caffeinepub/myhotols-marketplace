import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { StarRating } from "../components/StarRating";
import { useApp } from "../context/AppContext";

function AvailabilityCalendar({ hotelId }: { hotelId: string }) {
  const { bookings, blockedDates } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const hotelBookings = bookings.filter(
    (b) => b.hotelId === hotelId && b.status === "confirmed",
  );
  const hotelBlocked = blockedDates.filter((b) => b.hotelId === hotelId);

  const pad = (n: number) => String(n).padStart(2, "0");

  const getDateStatus = (day: number): "available" | "booked" | "blocked" => {
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    const isBlocked = hotelBlocked.some(
      (b) => dateStr >= b.startDate && dateStr <= b.endDate,
    );
    if (isBlocked) return "blocked";
    const isBooked = hotelBookings.some(
      (b) => dateStr >= b.checkIn && dateStr < b.checkOut,
    );
    if (isBooked) return "booked";
    return "available";
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const statusStyle = {
    available: "bg-green-100 text-green-800 border border-green-200",
    booked: "bg-red-100 text-red-700 border border-red-200",
    blocked: "bg-gray-700 text-white border border-gray-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-10">
      <h2 className="text-xl font-bold mb-4">Availability Calendar</h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-green-100 border border-green-200 inline-block" />
          <span className="text-gray-600">🟢 Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-red-100 border border-red-200 inline-block" />
          <span className="text-gray-600">🔴 Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-gray-700 border border-gray-600 inline-block" />
          <span className="text-gray-600">⚫ Blocked</span>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="text-gray-600 hover:text-[#E58A1F] font-bold text-lg px-2"
        >
          &lt;
        </button>
        <span className="font-semibold text-gray-800">{monthName}</span>
        <button
          type="button"
          onClick={nextMonth}
          className="text-gray-600 hover:text-[#E58A1F] font-bold text-lg px-2"
        >
          &gt;
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {["pad0", "pad1", "pad2", "pad3", "pad4", "pad5", "pad6"]
          .slice(0, firstDay)
          .map((k) => (
            <div key={`${year}-${month}-${k}`} />
          ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const status = getDateStatus(day);
          return (
            <div
              key={`${year}-${month}-${day}`}
              className={`rounded-lg text-center text-xs py-1.5 font-medium ${statusStyle[status]}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    hotels,
    rooms,
    reviews,
    users,
    bookings,
    currentUser,
    addReview,
    isRangeBlocked,
  } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) return <div className="p-8 text-center">Hotel not found</div>;

  const hotelRooms = rooms.filter((r) => r.hotelId === id && r.available);
  const hotelReviews = reviews.filter((r) => r.hotelId === id);

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const datesBlocked =
    checkIn && checkOut && id ? isRangeBlocked(id, checkIn, checkOut) : false;

  const hasBooking =
    currentUser &&
    bookings.some(
      (b) =>
        b.userId === currentUser.id &&
        b.hotelId === id &&
        b.status === "confirmed",
    );
  const hasReview =
    currentUser &&
    reviews.some((r) => r.userId === currentUser.id && r.hotelId === id);

  const handleBookNow = (roomId: string) => {
    if (datesBlocked) return;
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (!currentUser) {
      navigate("/login");
      return;
    }
    navigate(`/booking/${hotel.id}/${roomId}?${params.toString()}`);
  };

  const handleSubmitReview = () => {
    if (!currentUser || !reviewComment.trim()) return;
    addReview({
      userId: currentUser.id,
      hotelId: hotel.id,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewSubmitted(true);
    setReviewComment("");
  };

  const images = hotel.images ?? [];
  const hasGallery = images.length >= 3;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero / Image Gallery */}
      {hasGallery ? (
        <div className="hidden md:grid grid-cols-3 h-72 lg:h-96">
          {/* Large image */}
          <div className="col-span-2 relative">
            <img
              src={images[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-2">
                  <StarRating rating={hotel.rating} size="md" />
                  <span className="text-white font-semibold">
                    {hotel.rating > 0 ? hotel.rating.toFixed(1) : "New"}
                  </span>
                  <span className="text-orange-200">• {hotel.city}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Two smaller images */}
          <div className="flex flex-col">
            <div className="flex-1 overflow-hidden">
              <img
                src={images[1]}
                alt={`${hotel.name} 2`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden border-t-2 border-white">
              <img
                src={images[2]}
                alt={`${hotel.name} 3`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile hero / fallback single image */}
      <div className={`relative h-64 md:h-96 ${hasGallery ? "md:hidden" : ""}`}>
        <img
          src={images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-2">
              <StarRating rating={hotel.rating} size="md" />
              <span className="text-white font-semibold">
                {hotel.rating > 0 ? hotel.rating.toFixed(1) : "New"}
              </span>
              <span className="text-orange-200">• {hotel.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Info */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-2">About this hotel</h2>
            <p className="text-gray-600 mb-4">{hotel.description}</p>
            <p className="text-gray-500 flex items-center gap-1">
              <span>📍</span> {hotel.address}
            </p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-5">
            <div className="text-2xl font-bold text-[#E58A1F] mb-1">
              ₹{hotel.pricePerNight.toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm mb-4">per night</div>
            <h3 className="font-semibold text-gray-800 mb-2">Amenities</h3>
            <div className="space-y-1">
              {hotel.amenities.wifi && (
                <div className="flex items-center gap-2 text-sm">
                  <span>📦</span> Free WiFi
                </div>
              )}
              {hotel.amenities.ac && (
                <div className="flex items-center gap-2 text-sm">
                  <span>❄️</span> Air Conditioning
                </div>
              )}
              {hotel.amenities.parking && (
                <div className="flex items-center gap-2 text-sm">
                  <span>🚗</span> Free Parking
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blocked date notice */}
        {datesBlocked && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">🚫</span>
            <div>
              <p className="font-bold text-red-700">Not Available</p>
              <p className="text-sm text-red-600">
                The selected dates are blocked. Please choose different dates.
              </p>
            </div>
          </div>
        )}

        {/* Rooms */}
        <h2 className="text-xl font-bold mb-4">Available Rooms</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {hotelRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">{room.roomType}</h3>
              <p className="text-gray-500 text-sm mb-3">{room.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-[#E58A1F]">
                    ₹{room.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-sm">/night</span>
                </div>
                {datesBlocked ? (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-lg">
                    🚫 Sold Out
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBookNow(room.id)}
                    className="bg-[#E58A1F] hover:bg-[#C97A1D] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Availability Calendar */}
        <AvailabilityCalendar hotelId={hotel.id} />

        {/* Reviews */}
        <h2 className="text-xl font-bold mb-4">
          Guest Reviews ({hotelReviews.length})
        </h2>
        {hotelReviews.length === 0 ? (
          <p className="text-gray-500 text-sm mb-6">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4 mb-8">
            {hotelReviews.map((rev) => {
              const reviewer = users.find((u) => u.id === rev.userId);
              return (
                <div
                  key={rev.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-[#E58A1F] text-white flex items-center justify-center font-bold text-sm">
                      {reviewer?.name?.[0] ?? "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {reviewer?.name ?? "Guest"}
                      </p>
                      <p className="text-xs text-gray-400">{rev.createdAt}</p>
                    </div>
                    <StarRating rating={rev.rating} size="sm" />
                  </div>
                  <p className="text-gray-700 text-sm">{rev.comment}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Review */}
        {currentUser &&
          currentUser.role === "customer" &&
          hasBooking &&
          !hasReview &&
          !reviewSubmitted && (
            <div className="bg-orange-50 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Write a Review</h3>
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setReviewRating(s)}
                    className={`text-2xl transition-all ${s <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E58A1F] mb-3"
              />
              <button
                type="button"
                onClick={handleSubmitReview}
                className="bg-[#E58A1F] hover:bg-[#C97A1D] text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
              >
                Submit Review
              </button>
            </div>
          )}
        {reviewSubmitted && (
          <p className="text-green-600 font-medium">
            ✅ Thank you for your review!
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
