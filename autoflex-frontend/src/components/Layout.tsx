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
    { name: "Produção", path: "/production", icon: Factory },
    { name: "Produtos", path: "/products", icon: Package },
    { name: "Matéria Prima", path: "/materials", icon: Layers },
    { name: "Histórico", path: "/history", icon: ClipboardList },
    { name: "Relatórios", path: "/reports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-14 py-8 flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-bold tracking-wide">
          Mão na Massa - Autoflex
        </h1>

        <nav className="flex gap-6 flex-nowrap overflow-hidden">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 whitespace-nowrap
        ${
          active
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-white text-blue-700 hover:bg-blue-100 hover:scale-105"
        }`}
              >
                <Icon size={24} className="shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Conteúdo */}
      <main className="p-10">
        <Outlet />
      </main>
    </div>
  );
}
