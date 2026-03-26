import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

export function LoginPage() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"customer" | "owner">("customer");

  const handleLogin = () => {
    setError("");
    const user = login(loginEmail, loginPassword);
    if (!user) {
      setError(
        "Invalid email or password. Try demo: user@myhotols.com / user123",
      );
      return;
    }
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "owner") navigate("/owner/dashboard");
    else navigate("/");
  };

  const handleRegister = () => {
    setError("");
    if (
      !regName.trim() ||
      !regPhone.trim() ||
      !regEmail.trim() ||
      !regPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }
    const user = register({
      name: regName,
      phone: regPhone,
      email: regEmail,
      password: regPassword,
      role: regRole,
    });
    if (user.role === "owner") navigate("/owner/dashboard");
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
          <div className="text-center mb-6">
            <span className="text-4xl">🏨</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Welcome to Myhotols
            </h1>
          </div>
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "login" ? "bg-white text-[#E58A1F] shadow-sm" : "text-gray-500"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "register" ? "bg-white text-[#E58A1F] shadow-sm" : "text-gray-500"}`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {tab === "login" ? (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-[#E58A1F] hover:bg-[#C97A1D] text-white font-bold py-3 rounded-xl transition-colors"
              >
                Login
              </button>
              <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700 space-y-1">
                <p className="font-semibold">Demo Accounts:</p>
                <p>Customer: user@myhotols.com / user123</p>
                <p>Owner: owner@myhotols.com / owner123</p>
                <p>Admin: admin@myhotols.com / admin123</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#E58A1F]"
              />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  I want to
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole("customer")}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors ${regRole === "customer" ? "border-[#E58A1F] text-[#E58A1F] bg-orange-50" : "border-gray-200 text-gray-500"}`}
                  >
                    Book Hotels
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole("owner")}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors ${regRole === "owner" ? "border-[#E58A1F] text-[#E58A1F] bg-orange-50" : "border-gray-200 text-gray-500"}`}
                  >
                    List My Hotel
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRegister}
                className="w-full bg-[#E58A1F] hover:bg-[#C97A1D] text-white font-bold py-3 rounded-xl transition-colors"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
