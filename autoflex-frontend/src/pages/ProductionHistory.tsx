import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function ProductionHistory() {
  const [productions, setProductions] = useState([]);

  async function fetchProductions() {
    const response = await api.get("/productions");
    setProductions(response.data);
  }

  useEffect(() => {
    const load = async () => {
      await fetchProductions();
    };

    load();
  }, []);

  async function handleDelete(id: number) {
    await api.delete(`/productions/${id}`);
    fetchProductions();
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Histórico de Produção</h1>

      <div className="grid gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {productions.map((production: any) => (
          <div
            key={production.id}
            className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-xl"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{production.product.name}</p>
                <p>Quantidade: {production.quantityProduced}</p>
                <p className="text-sm text-gray-500">
                  {new Date(production.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(production.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
