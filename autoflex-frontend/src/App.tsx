import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Products from "./pages/Products";
import RawMaterials from "./pages/RawMaterials";
import Production from "./pages/Production";
import ProductionHistory from "./pages/ProductionHistory";
import Reports from "./pages/Reports";
import { Toaster } from "react-hot-toast";
import "./index.css";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/production" element={<Production />} />
            <Route path="/products" element={<Products />} />
            <Route path="/materials" element={<RawMaterials />} />
            <Route path="/history" element={<ProductionHistory />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
