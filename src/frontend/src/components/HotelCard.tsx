import { useNavigate } from "react-router-dom";
import type { Hotel } from "../context/AppContext";
import { StarRating } from "./StarRating";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer text-left w-full"
      onClick={() => navigate(`/hotels/${hotel.id}`)}
    >
      <div className="relative">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 right-3 bg-white/90 text-xs font-semibold px-2 py-1 rounded-full text-gray-700">
          {hotel.city}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
          {hotel.name}
        </h3>
        <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
          <span>📍</span> {hotel.address}
        </p>
        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={hotel.rating} size="sm" />
          <span className="text-sm text-gray-600">
            {hotel.rating > 0 ? hotel.rating.toFixed(1) : "New"}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1 text-xs">
          {hotel.amenities.wifi && (
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              WiFi
            </span>
          )}
          {hotel.amenities.ac && (
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              AC
            </span>
          )}
          {hotel.amenities.parking && (
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              Parking
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ₹{hotel.pricePerNight.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm"> /night</span>
          </div>
          <span className="bg-[#E58A1F] text-white text-sm font-semibold px-4 py-2 rounded-lg">
            View Details
          </span>
        </div>
      </div>
    </button>
  );
}
