import { useEffect, useState } from "react";
import { api } from "../api/api";

interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
}

export default function Products() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    price: "",
  });

  async function fetchProducts() {
    const response = await api.get("/products");
    setProducts(response.data);
  }

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
    };

    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId !== null) {
      await api.put(`/products/${editingId}`, {
        ...form,
        price: Number(form.price),
      });

      setEditingId(null);
    } else {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
      });
    }

    setForm({ code: "", name: "", price: "" });
    fetchProducts();
  }
  async function handleDelete(id: number) {
    await api.delete(`/products/${id}`);
    fetchProducts();
  }

  function handleEdit(product: Product) {
    setForm({
      code: product.code,
      name: product.name,
      price: product.price.toString(),
    });

    setEditingId(product.id);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          Add Product
        </button>
      </form>

      <ul>
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <span>
              {product.code} - {product.name} - ${product.price}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-2 py-1"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
