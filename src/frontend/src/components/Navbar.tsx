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
        ? "/owner/dashboard"
        : null;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🏨</span>
          <span className="text-xl font-bold text-[#E58A1F]">Myhotols</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/hotels"
            className="text-gray-600 hover:text-[#E58A1F] transition-colors font-medium"
          >
            Hotels
          </Link>
          {currentUser && (
            <Link
              to="/hotels"
              className="text-gray-600 hover:text-[#E58A1F] transition-colors font-medium"
            >
              My Bookings
            </Link>
          )}
          {currentUser?.role === "owner" && (
            <Link
              to="/owner/dashboard"
              className="text-gray-600 hover:text-[#E58A1F] transition-colors font-medium"
            >
              My Dashboard
            </Link>
          )}
          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
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
                  className="text-sm text-[#123A63] hover:underline"
                >
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
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
          {currentUser?.role === "owner" && (
            <Link
              to="/owner/dashboard"
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
  );
}
