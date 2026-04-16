import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import VerifyOtp from "../components/VerifyOtp";
import ForgotPassword from "../components/Forgotpassword";
import ResetPassword from "../components/Resetpassword";
import Profile from "../pages/Client/Profile/Profile";
import HistoryView from "../pages/Client/Profile/HistoryView";
import PremiumHistory from "../pages/Client/Profile/PremiumHistory";
import MovieList from "@/pages/MovieList";
import MovieDetail from "@/pages/MovieDetail";
import MovieView from "@/pages/MovieView";
import Support from "../pages/Client/Profile/Support";
import CustomerList from "../pages/Admin/CustomerList";
import ContractList from "../pages/Admin/ContractList";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import DashBoard from "../pages/Admin/DashBoard";
import UpgradePage from "../pages/Client/Premium/UpgradePage";
import PaymentPage from "../pages/Client/Premium/PaymentPage";
import SuccessPage from "../pages/Client/Premium/SuccessPage";
import MoviesListAdmin from "../pages/Admin/MovieListAdmin";
import WatchMovie from "../pages/WatchMovie";

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/:slug" element={<MovieDetail />} />
            <Route path="/movies/watch/:slug" element={<WatchMovie />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          <Route element={<ProtectedRoute roles={["user"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-premium" element={<PremiumHistory />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/support" element={<Support />} />
            </Route>
            {/* Premium flow — standalone pages (no AppLayout header/footer) */}
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/payment/:packageId" element={<PaymentPage />} />
            <Route path="/payment/success" element={<SuccessPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashBoard />} />
              <Route path="/admin/customers" element={<CustomerList />} />
              <Route path="/admin/contracts" element={<ContractList />} />
              <Route path="/admin/movies" element={<MoviesListAdmin />} />
            </Route>
          </Route>

          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
