import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.myhotols.app";
const APP_STORE_URL = "https://apps.apple.com/app/myhotols/id000000000";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Booking",
    desc: "Book in seconds with just a few taps.",
  },
  {
    icon: "💰",
    title: "App-only Deals",
    desc: "Exclusive discounts available only on the app.",
  },
  {
    icon: "🔔",
    title: "Live Alerts",
    desc: "Get real-time booking confirmations and reminders.",
  },
  {
    icon: "📍",
    title: "Nearby Hotels",
    desc: "Find hotels near you using GPS.",
  },
  {
    icon: "🧾",
    title: "Digital Receipts",
    desc: "All your invoices and booking history in one place.",
  },
  {
    icon: "🌐",
    title: "Offline Access",
    desc: "View your bookings even without internet.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Download the App",
    desc: "Available on Android and iOS for free.",
  },
  {
    step: "2",
    title: "Create an Account",
    desc: "Sign up in under 30 seconds.",
  },
  {
    step: "3",
    title: "Search & Book",
    desc: "Find budget hotels across India and confirm instantly.",
  },
];

export function DownloadAppPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#123A63] to-[#0f2e52] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#E58A1F]/20 border border-[#E58A1F]/30 rounded-full px-4 py-1.5 text-sm text-[#E58A1F] font-medium mb-6">
                📱 Now Available on Android & iOS
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                Book Hotels
                <br />
                <span className="text-[#E58A1F]">On the Go</span>
              </h1>
              <p className="text-blue-200 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                The Myhotols app makes it easier than ever to find and book
                budget stays across India. Fast, simple, and built for
                travelers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-[#123A63] rounded-xl px-6 py-3.5 hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <span className="text-3xl">▶</span>
                  <div className="text-left">
                    <div className="text-xs text-gray-500 font-medium">
                      GET IT ON
                    </div>
                    <div className="font-bold text-base">Google Play</div>
                  </div>
                </a>
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-[#123A63] rounded-xl px-6 py-3.5 hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <span className="text-3xl">🍎</span>
                  <div className="text-left">
                    <div className="text-xs text-gray-500 font-medium">
                      DOWNLOAD ON THE
                    </div>
                    <div className="font-bold text-base">App Store</div>
                  </div>
                </a>
              </div>

              <p className="text-blue-300 text-sm mt-5">
                Free to download · No hidden charges · Available pan-India
              </p>
            </div>

            {/* Right: Phone mockup */}
            <div className="relative flex-shrink-0">
              <div className="w-56 h-[440px] bg-white/10 border-2 border-white/20 rounded-[3rem] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-5 w-16 h-2 bg-white/20 rounded-full" />
                <div className="text-6xl mb-4">🏨</div>
                <div className="bg-[#E58A1F] text-white text-xs font-bold px-4 py-2 rounded-full">
                  Myhotols
                </div>
                <div className="mt-6 px-4 w-full space-y-3">
                  {["Delhi", "Mumbai", "Jaipur"].map((city) => (
                    <div
                      key={city}
                      className="bg-white/10 rounded-xl px-4 py-2.5 flex justify-between items-center"
                    >
                      <span className="text-white text-xs font-medium">
                        {city}
                      </span>
                      <span className="text-[#E58A1F] text-xs font-bold">
                        ₹799+
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-5 w-10 h-10 rounded-full bg-white/10 border border-white/20" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-28 h-48 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-4xl shadow-xl">
                📲
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            Everything you need, in your pocket
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            How it works
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex-1 text-center relative">
                <div className="w-14 h-14 rounded-full bg-[#E58A1F] text-white font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {s.step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] right-[-2rem] h-0.5 bg-orange-200" />
                )}
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#E58A1F] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to explore India on a budget?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Download the app now or browse hotels directly from your browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#123A63] text-white rounded-xl px-6 py-3.5 hover:bg-[#0f2e52] transition-colors shadow-lg"
            >
              <span className="text-2xl">▶</span>
              <span className="font-bold">Google Play</span>
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#123A63] text-white rounded-xl px-6 py-3.5 hover:bg-[#0f2e52] transition-colors shadow-lg"
            >
              <span className="text-2xl">🍎</span>
              <span className="font-bold">App Store</span>
            </a>
            <Link
              to="/hotels"
              className="flex items-center justify-center gap-2 bg-white text-[#E58A1F] font-bold rounded-xl px-6 py-3.5 hover:bg-orange-50 transition-colors shadow-lg"
            >
              Browse on Web →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
