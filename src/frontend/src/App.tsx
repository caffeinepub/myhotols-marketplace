import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { AdminPage } from "./pages/AdminPage";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage";
import { BookingPage } from "./pages/BookingPage";
import { DownloadAppPage } from "./pages/DownloadAppPage";
import { HomePage } from "./pages/HomePage";
import { HotelDetailPage } from "./pages/HotelDetailPage";
import { HotelListingPage } from "./pages/HotelListingPage";
import { LoginPage } from "./pages/LoginPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { OwnerDashboardPage } from "./pages/OwnerDashboardPage";

export default function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelListingPage />} />
          <Route path="/hotel/:hotelId" element={<HotelDetailPage />} />
          <Route path="/booking/:hotelId/:roomId" element={<BookingPage />} />
          <Route
            path="/booking/confirmation"
            element={<BookingConfirmationPage />}
          />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/owner" element={<OwnerDashboardPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/download" element={<DownloadAppPage />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}
