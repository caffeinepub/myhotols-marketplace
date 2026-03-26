import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { AdminPage } from "./pages/AdminPage";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage";
import { BookingPage } from "./pages/BookingPage";
import { HomePage } from "./pages/HomePage";
import { HotelDetailPage } from "./pages/HotelDetailPage";
import { HotelListingPage } from "./pages/HotelListingPage";
import { LoginPage } from "./pages/LoginPage";
import { OwnerDashboardPage } from "./pages/OwnerDashboardPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelListingPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/booking/:hotelId/:roomId" element={<BookingPage />} />
          <Route
            path="/booking/confirmation"
            element={<BookingConfirmationPage />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  </React.StrictMode>,
);
