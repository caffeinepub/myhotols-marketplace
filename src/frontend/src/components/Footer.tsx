import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#123A63] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏨</span>
              <span className="text-xl font-bold">Myhotols</span>
            </div>
            <p className="text-blue-200 text-sm">
              Budget stays across India's top cities. Book with confidence.
            </p>
            <div className="flex gap-3 mt-4">
              <span className="text-xl cursor-pointer hover:text-blue-300">
                📘
              </span>
              <span className="text-xl cursor-pointer hover:text-blue-300">
                📷
              </span>
              <span className="text-xl cursor-pointer hover:text-blue-300">
                🐦
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <div>
                <Link
                  to="/"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
              </div>
              <div>
                <Link
                  to="/hotels"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Hotels
                </Link>
              </div>
              <div>
                <Link
                  to="/login"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Login
                </Link>
              </div>
              <div>
                <Link
                  to="/my-bookings"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  My Bookings
                </Link>
              </div>
              <div>
                <Link
                  to="/download"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Download App
                </Link>
              </div>
            </div>
          </div>

          {/* Col 3: For Hotel Owners */}
          <div>
            <h4 className="font-semibold mb-4">For Hotel Owners</h4>
            <div className="space-y-2">
              <div>
                <Link
                  to="/login"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Register as Owner
                </Link>
              </div>
              <div>
                <Link
                  to="/owner"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Owner Dashboard
                </Link>
              </div>
              <div>
                <Link
                  to="/login"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  List Your Property
                </Link>
              </div>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-blue-200 text-sm">📧 support@myhotols.com</p>
            <p className="text-blue-200 text-sm mt-1">
              📞 1800-123-4567 (Toll Free)
            </p>
            <p className="text-blue-200 text-sm mt-1">Available 24/7</p>
            <div className="mt-4">
              <Link
                to="/download"
                className="inline-flex items-center gap-2 bg-[#E58A1F] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#C97A1D] transition-colors"
              >
                📱 Download App
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-blue-300 text-sm">
            © {year} Myhotols. All rights reserved.
          </p>
          <p className="text-blue-400 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-200 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
