import { NavLink, Outlet } from "react-router-dom";
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
  return (
    <div className="min-h-screen grid grid-cols-12">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-slate-900 text-white p-5">
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
          {links
            .filter((link) => {
              if (!link.roles) return true; // visible to all
              const role = currentUser?.role?.toUpperCase();

              return link.roles.map((r) => r.toUpperCase() === role);
            })
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
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
      </aside>

      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-sm min-h-[calc(100vh-3rem)] p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
