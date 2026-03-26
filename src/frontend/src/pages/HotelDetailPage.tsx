import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { StarRating } from "../components/StarRating";
import { useApp } from "../context/AppContext";

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { hotels, rooms, reviews, users, bookings, currentUser, addReview } =
    useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) return <div className="p-8 text-center">Hotel not found</div>;

  const hotelRooms = rooms.filter((r) => r.hotelId === id && r.available);
  const hotelReviews = reviews.filter((r) => r.hotelId === id);

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
    const params = new URLSearchParams();
    const ci = searchParams.get("checkIn");
    const co = searchParams.get("checkOut");
    if (ci) params.set("checkIn", ci);
    if (co) params.set("checkOut", co);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero image */}
      <div className="relative h-64 md:h-96">
        <img
          src={hotel.images[0]}
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

      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
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
                  <span>📶</span> Free WiFi
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
                <button
                  type="button"
                  onClick={() => handleBookNow(room.id)}
                  className="bg-[#E58A1F] hover:bg-[#C97A1D] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

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
