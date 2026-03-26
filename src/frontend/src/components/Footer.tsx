import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#123A63] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-blue-200 text-sm">📧 support@myhotols.com</p>
            <p className="text-blue-200 text-sm mt-1">
              📞 1800-123-4567 (Toll Free)
            </p>
            <p className="text-blue-200 text-sm mt-1">Available 24/7</p>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-blue-300 text-sm">
          © 2026 Myhotols. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
