import { useEffect, useState } from "react";
import { api } from "../api/api";

interface Product {
  id: number;
  name: string;
}

interface RawMaterial {
  id: number;
  name: string;
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
    await api.post("/productions", {
      productId: Number(productId),
      quantityProduced: Number(quantityProduced),
      materials: selectedMaterials,
    });

    alert("Production created!");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Production</h1>

      <div className="space-y-3">
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity Produced"
          value={quantityProduced}
          onChange={(e) => setQuantityProduced(e.target.value)}
          className="border p-2 w-full"
        />
        <div className="border p-3">
          <h2 className="font-bold mb-2">Add Raw Material</h2>

          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="">Select Material</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity Used"
            value={materialQuantity}
            onChange={(e) => setMaterialQuantity(e.target.value)}
            className="border p-2 w-full mb-2"
          />

          <button
            type="button"
            onClick={() => {
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
            className="bg-blue-500 text-white px-3 py-1"
          >
            Add Material
          </button>
        </div>

        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2"
        >
          Create Production
        </button>
      </div>
    </div>
  );
}
