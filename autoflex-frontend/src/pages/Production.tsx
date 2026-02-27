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
    if (!productId || !quantityProduced || selectedMaterials.length === 0) {
      alert("Fill all fields");
      return;
    }

    await api.post("/productions", {
      productId: Number(productId),
      quantityProduced: Number(quantityProduced),
      materials: selectedMaterials,
    });

    alert("Production created!");

    setProductId("");
    setQuantityProduced("");
    setSelectedMaterials([]);
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
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
          className="border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2 rounded-lg w-full"
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
            className="border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2 rounded-lg w-full"
          />

          <button
            type="button"
            onClick={() => {
              if (!selectedMaterialId || !materialQuantity) {
                alert("Select material and quantity");
                return;
              }

              const alreadyAdded = selectedMaterials.some(
                (m) => m.rawMaterialId === Number(selectedMaterialId),
              );

              if (alreadyAdded) {
                alert("Material already added");
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
            Add Material
          </button>
          {selectedMaterials.length > 0 && (
            <div className="mt-3">
              <h3 className="font-semibold mb-2">Selected Materials</h3>

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
                        Remove
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Create Production
        </button>
      </div>
    </div>
  );
}
