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
import AdminLayout from "../layouts/AdminLayout";
import AdminLayoutTest from "../layouts/AdminLayoutTest";
import ProtectedRoute from "../routes/ProtectedRoute";
import CustomerListTest from "../pages/Admin/CustomerListTest";
import ContractsTest from "../pages/Admin/ContractsTest";

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/movie-view/:id" element={<MovieView />} />
          <Route element={<AdminLayoutTest />}>
            <Route path="/admin" element={<div className="text-gray-500 font-medium">Dashboard Test Page</div>} />
            <Route path="/admin/customerstest" element={<CustomerListTest />} />
            <Route path="/admin/contractstest" element={<ContractsTest />} />
            <Route path="/admin/moviestest" element={<div className="text-gray-500 font-medium">Movies Test Page</div>} />
            <Route path="/admin/packagestest" element={<div className="text-gray-500 font-medium">Packages Test Page</div>} />
            <Route path="/admin/premieretest" element={<div className="text-gray-500 font-medium">Premiere Test Page</div>} />
            <Route path="/admin/supporttest" element={<div className="text-gray-500 font-medium">Support Test Page</div>} />
            <Route path="/admin/reportstest" element={<div className="text-gray-500 font-medium">Reports Test Page</div>} />
          </Route>

          <Route element={<ProtectedRoute roles={["user"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-premium" element={<PremiumHistory />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/support" element={<Support />} />
            </Route>
          </Route>

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
