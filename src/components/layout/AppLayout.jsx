import SessionTimer from "../SessionTimer";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  BadgeIndianRupee,
  ArrowLeftRight,
  Search,
  FileSpreadsheet,
  Settings,
  Package2,
} from "lucide-react";
const currentUser = JSON.parse(localStorage.getItem("user"));
const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/purchases", label: "Purchases", icon: ShoppingCart },
  { to: "/sales", label: "Sales", icon: BadgeIndianRupee },
  { to: "/transfers", label: "Stock Transfer", icon: ArrowLeftRight },
  { to: "/stock-search", label: "Stock Search", icon: Search },
  { to: "/reports", label: "Reports", icon: FileSpreadsheet },
  { to: "/admin", label: "Admin", icon: Settings, roles: ["ROLE_ADMIN"] },
];

export default function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* ✅ SIDEBAR */}
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-slate-900 text-white p-5">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Package2 size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Star Service</h1>
              <p className="text-xs text-slate-300">Inventory System</p>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 🔥 LOGOUT AT BOTTOM */}
        <div className="mt-auto pt-80 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 
            px-4 py-2 rounded-lg font-medium
            bg-white text-black border border-black-500
            transition-all duration-300 ease-in-out
            hover:bg-red-500
            hover:text-white 
            hover:border-red-600 
            hover:shadow-[0_8px_20px_rgba(239,68,68,0.3)]
            hover:-translate-y-0.5
            active:scale-95"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ✅ MAIN AREA */}
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-4 md:p-6">
        {/* 🔥 TOP BAR */}
        <div className="flex justify-between items-center bg-white px-6 py-3 border-b shadow-sm">

          {/* LEFT → Session Timer */}
          {/* <SessionTimer /> */}

          {/* RIGHT → Logout */}
          {/* <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg 
            hover:bg-red-600 transition duration-200"
          >
            Logout
          </button> */}
        </div>

        {/* CONTENT */}
        <div className="p-4 md:p-6 flex-1">
          <div className="bg-white rounded-2xl shadow-sm min-h-[calc(100vh-3rem)] p-4 md:p-6">
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
}
