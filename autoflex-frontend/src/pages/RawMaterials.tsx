import { useEffect, useState } from "react";
import { api } from "../api/api";

interface RawMaterial {
  id: number;
  code: string;
  name: string;
  stockQuantity: number;
}

export default function RawMaterials() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    stockQuantity: "",
  });

  async function fetchMaterials() {
    const response = await api.get("/raw-materials");
    setMaterials(response.data);
  }

  useEffect(() => {
    const load = async () => {
      await fetchMaterials();
    };

    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId !== null) {
      await api.put(`/raw-materials/${editingId}`, {
        ...form,
        stockQuantity: Number(form.stockQuantity),
      });
      setEditingId(null);
    } else {
      await api.post("/raw-materials", {
        ...form,
        stockQuantity: Number(form.stockQuantity),
      });
    }

    setForm({ code: "", name: "", stockQuantity: "" });
    fetchMaterials();
  }

  async function handleDelete(id: number) {
    await api.delete(`/raw-materials/${id}`);
    fetchMaterials();
  }

  function handleEdit(material: RawMaterial) {
    setForm({
      code: material.code,
      name: material.name,
      stockQuantity: material.stockQuantity.toString(),
    });

    setEditingId(material.id);
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? "Editar Matéria Prima" : "Matérias Primas"}
      </h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          placeholder="Código"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="w-full border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          placeholder="Quantidade em Estoque (kg)"
          type="number"
          value={form.stockQuantity}
          onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
          className="w-full border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button className="bg-blue-500 text-white px-4 py-2">
          {editingId ? "Atualizar Matéria Prima" : "Adicionar Matéria Prima"}
        </button>
      </form>

      <ul>
        {materials.map((material) => (
          <li
            key={material.id}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <span>
              {material.code} - {material.name} - {material.stockQuantity} kg
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(material)}
                className="bg-yellow-500 text-white px-2 py-1"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(material.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
