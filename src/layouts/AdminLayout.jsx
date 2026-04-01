import { Outlet } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
