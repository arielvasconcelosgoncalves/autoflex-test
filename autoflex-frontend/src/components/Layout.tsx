import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Package,
  Factory,
  Layers,
  BarChart3,
  ClipboardList,
} from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const menu = [
    { name: "Production", path: "/", icon: Factory },
    { name: "Products", path: "/products", icon: Package },
    { name: "Raw Materials", path: "/materials", icon: Layers },
    { name: "History", path: "/history", icon: ClipboardList },
    { name: "Reports", path: "/reports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Autoflex</h1>

        <nav className="flex flex-col gap-3">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  active
                    ? "bg-white text-blue-600 font-semibold"
                    : "hover:bg-blue-700"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar (mobile) */}
        <header className="md:hidden bg-blue-600 text-white p-4 text-lg font-bold">
          Autoflex Production
        </header>

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
