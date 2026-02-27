import { useEffect, useState } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
}
interface RawMaterial {
  id: number;
  name: string;
  stockQuantity: number;
}

export default function Production() {
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);

  const [productId, setProductId] = useState("");
  const [quantityProduced, setQuantityProduced] = useState("");

  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState("");

  const [selectedMaterials, setSelectedMaterials] = useState<
    { rawMaterialId: number; quantityUsed: number }[]
  >([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const p = await api.get("/products");
      const m = await api.get("/raw-materials");

      setProducts(p.data);
      setMaterials(m.data);
    }

    load();
  }, []);

  async function handleCreate() {
    if (!productId || !quantityProduced || selectedMaterials.length === 0) {
      toast.error("Preencha todos os campos e adicione pelo menos um material");
      return;
    }

    try {
      setLoading(true);

      await api.post("/productions", {
        productId: Number(productId),
        quantityProduced: Number(quantityProduced),
        materials: selectedMaterials,
      });

      toast.success("Produto Criado com Sucesso!");
      setProductId("");
      setQuantityProduced("");
      setSelectedMaterials([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro na Criação do Produto");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Produção</h1>

      <div className="space-y-3">
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Selecionar o Produto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantidade Produzida"
          value={quantityProduced}
          onChange={(e) => setQuantityProduced(e.target.value)}
          className="border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2 rounded-lg w-full"
        />
        <div className="border p-3">
          <h2 className="font-bold mb-2">Adicionar Matéria Prima</h2>

          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="">Selecionar Material</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} (Stock: {m.stockQuantity})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantidade Usada"
            value={materialQuantity}
            onChange={(e) => setMaterialQuantity(e.target.value)}
            className="border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2 rounded-lg w-full mb-4"
          />

          <button
            type="button"
            onClick={() => {
              if (!selectedMaterialId || !materialQuantity) {
                toast.error("Selecione material e quantidade");
                return;
              }

              const alreadyAdded = selectedMaterials.some(
                (m) => m.rawMaterialId === Number(selectedMaterialId),
              );

              if (alreadyAdded) {
                toast.error("Material já adicionado");
                return;
              }

              setSelectedMaterials([
                ...selectedMaterials,
                {
                  rawMaterialId: Number(selectedMaterialId),
                  quantityUsed: Number(materialQuantity),
                },
              ]);

              setSelectedMaterialId("");
              setMaterialQuantity("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Adicionar Material
          </button>
          {selectedMaterials.length > 0 && (
            <div className="mt-3">
              <h3 className="font-semibold mb-2">Materiais Selecionados</h3>

              <ul className="space-y-1">
                {selectedMaterials.map((item, index) => {
                  const material = materials.find(
                    (m) => m.id === item.rawMaterialId,
                  );

                  return (
                    <li
                      key={index}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      <span>
                        {material?.name} - {item.quantityUsed}
                      </span>

                      <button
                        onClick={() =>
                          setSelectedMaterials(
                            selectedMaterials.filter((_, i) => i !== index),
                          )
                        }
                        className="bg-red-500 text-white px-2 py-1"
                      >
                        Remover
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
        >
          {loading ? "Criando..." : "Criar Produção"}
        </button>
      </div>
    </div>
  );
}
