import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import RawMaterials from "./pages/RawMaterials";
import Production from "./pages/Production";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Production />} />
        <Route path="/products" element={<Products />} />
        <Route path="/materials" element={<RawMaterials />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
