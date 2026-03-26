import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function Navbar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardLink =
    currentUser?.role === "admin"
      ? "/admin"
      : currentUser?.role === "owner"
        ? "/owner"
        : null;

  return (
    <header className="sticky top-0 z-50">
      {/* Top info bar - desktop only */}
      <div className="hidden md:block bg-[#123A63] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>📞 1800-123-4567 (Toll Free)</span>
            <span className="text-blue-400">|</span>
            <span>✉ support@myhotols.com</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              data-ocid="topbar.list_hotel.link"
              className="hover:text-orange-300 transition-colors font-medium"
            >
              List Your Hotel
            </Link>
            <span className="text-blue-400">|</span>
            <span className="text-blue-200">24/7 Customer Support</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏨</span>
            <span className="text-xl font-bold text-[#E58A1F]">Myhotols</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/hotels"
              data-ocid="nav.hotels.link"
              className="text-gray-600 hover:text-[#E58A1F] transition-colors font-medium"
            >
              Hotels
            </Link>
            {currentUser?.role === "customer" && (
              <Link
                to="/my-bookings"
                data-ocid="nav.mybookings.link"
                className="text-gray-600 hover:text-[#E58A1F] transition-colors font-medium"
              >
                My Bookings
              </Link>
            )}
            {currentUser?.role === "owner" && (
              <Link
                to="/owner"
                data-ocid="nav.dashboard.link"
                className="text-gray-600 hover:text-[#E58A1F] transition-colors font-medium"
              >
                My Dashboard
              </Link>
            )}
            {currentUser?.role === "admin" && (
              <Link
                to="/admin"
                data-ocid="nav.admin.link"
                className="text-gray-600 hover:text-[#E58A1F] transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-600">
                  Hi, {currentUser.name.split(" ")[0]}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    currentUser.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : currentUser.role === "owner"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {currentUser.role}
                </span>
                {dashboardLink && (
                  <Link
                    to={dashboardLink}
                    data-ocid="nav.dashboard.link"
                    className="text-sm text-[#123A63] hover:underline"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  data-ocid="nav.logout.button"
                  onClick={handleLogout}
                  className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                data-ocid="nav.login.link"
                className="bg-[#E58A1F] hover:bg-[#C97A1D] text-white font-semibold px-5 py-2 rounded-full transition-colors text-sm"
              >
                Login / Register
              </Link>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-gray-600" />
              <span className="block w-6 h-0.5 bg-gray-600" />
              <span className="block w-6 h-0.5 bg-gray-600" />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
            <Link
              to="/hotels"
              className="block text-gray-700 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Hotels
            </Link>
            {currentUser?.role === "customer" && (
              <Link
                to="/my-bookings"
                data-ocid="nav.mybookings.link"
                className="block text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                My Bookings
              </Link>
            )}
            {currentUser?.role === "owner" && (
              <Link
                to="/owner"
                className="block text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                My Dashboard
              </Link>
            )}
            {currentUser?.role === "admin" && (
              <Link
                to="/admin"
                className="block text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700"
              >
                Logout ({currentUser.name})
              </button>
            ) : (
              <Link
                to="/login"
                className="block bg-[#E58A1F] text-white font-semibold px-4 py-2 rounded-lg text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
