import { Link } from "react-router-dom";
import { Factory, Package, Layers, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const cards = [
    {
      title: "Nova Produção",
      description: "Registre uma novar ordem de produção",
      icon: Factory,
      path: "/production",
    },
    {
      title: "Gerenciar Produtos",
      description: "Crie e edite produtos",
      icon: Package,
      path: "/products",
    },
    {
      title: "Matéria Prima",
      description: "Controle estoque e materiais",
      icon: Layers,
      path: "/materials",
    },
    {
      title: "Relatórios",
      description: "Visualize consumo de materiais",
      icon: BarChart3,
      path: "/reports",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        Painel de Produção
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              to={card.path}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon
                  size={30}
                  className="text-blue-600 group-hover:scale-110 transition"
                />
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                {card.title}
              </h2>
              <p className="text-sm text-gray-500">{card.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
