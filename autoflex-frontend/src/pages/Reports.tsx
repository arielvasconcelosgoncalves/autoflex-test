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
    <div>
      <h1 className="text-2xl font-bold mb-4">Material Consumption Report</h1>

      <div className="grid gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {report.map((item: any) => (
          <div key={item.rawMaterialId} className="bg-white shadow p-4 rounded">
            <p className="font-semibold">{item.rawMaterialName}</p>
            <p>Total Consumed: {item.totalConsumed}</p>
            <p>Current Stock: {item.currentStock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
