import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Reports() {
  const [report, setReport] = useState([]);

  async function fetchReports() {
    const response = await api.get("/reports/material-consumption");
    setReport(response.data);
  }

  useEffect(() => {
    const load = async () => {
      await fetchReports();
    };
    load();
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        Relatório de Consumo de Matérias-Primas
      </h1>

      <div className="grid gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {report.map((item: any) => (
          <div
            key={item.rawMaterialId}
            className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-xl"
          >
            <p className="font-semibold">{item.rawMaterialName}</p>
            <p>Total Consumido: {item.totalConsumed}</p>
            <p>Estoque Atual: {item.currentStock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
