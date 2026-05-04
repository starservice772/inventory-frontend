import SessionTimer from "../SessionTimer";
import comlogo from "../../assets/comlogo3.png";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  BadgeIndianRupee,
  ArrowLeftRight,
  Search,
  FileSpreadsheet,
  Settings,
  Package2
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/purchases", label: "Purchases", icon: ShoppingCart },
  { to: "/sales", label: "Sales", icon: BadgeIndianRupee },
  { to: "/transfers", label: "Stock Transfer", icon: ArrowLeftRight },
  { to: "/stock-search", label: "Stock Search", icon: Search },
  { to: "/reports", label: "Reports", icon: FileSpreadsheet },
  { to: "/admin", label: "Admin", icon: Settings },
];

export default function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* ✅ SIDEBAR */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white p-5 flex flex-col">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-xl">
              <img
                src={comlogo}
                alt="Logo"
                className="h-20 w-auto"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">Star Service</h1>
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
        <div className="mt-auto pt-50 border-t border-slate-700">
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
      <main className="ml-64 w-[calc(100%-16rem)] min-h-screen bg-gray-100">
        {/* 🔥 TOP BAR */}
        <div className="flex justify-between items-center bg-white px-6 py-3 border-b shadow-sm">

          {/* LEFT → Session Timer */}
          {/* <SessionTimer /> */}
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <div className="bg-white rounded-2xl shadow-sm min-h-[calc(100vh-3rem)] p-4 md:p-6 overflow-y-auto">
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
}