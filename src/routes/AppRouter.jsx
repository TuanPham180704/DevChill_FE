import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import VerifyOtp from "../pages/VerifyOtp";
import ForgotPassword from "../components/Forgotpassword";
import ResetPassword from "../components/Resetpassword";
import Profile from "../pages/Client/Profile/Profile";
import HistoryView from "../pages/Client/Profile/HistoryView";
import PremiumHistory from "../pages/Client/Profile/PremiumHistory";
import Support from "../pages/Client/Profile/Support";
import CustomerList from "../pages/Admin/CustomerList";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route element={<ProtectedRoute roles={["user"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-premium" element={<PremiumHistory />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/support" element={<Support />} />
            </Route>
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/customers" element={<CustomerList />} />
            </Route>
          </Route>

          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
