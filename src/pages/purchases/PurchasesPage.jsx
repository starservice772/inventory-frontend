import { useState } from "react";

export default function PurchasesPage() {
  const [items, setItems] = useState([
    { itemCode: "", description: "", hsn: "", rate: "", qty: "", gst: "" }
  ]);

  const addRow = () => {
    setItems([...items, { itemCode: "", description: "", hsn: "", rate: "", qty: "", gst: "" }]);
  };

  const updateRow = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Purchases</h2>
        <p className="text-slate-500">Add purchase invoice and update office stock</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input className="border rounded-xl p-3" placeholder="Company" />
        <input className="border rounded-xl p-3" placeholder="GST No." />
        <input className="border rounded-xl p-3" placeholder="Invoice No." />
        <input type="date" className="border rounded-xl p-3" />
      </div>

      <div className="overflow-x-auto border rounded-2xl">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              {["Item Code", "Description", "HSN", "Rate", "Qty", "GST"].map((head) => (
                <th key={head} className="text-left p-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2"><input className="border rounded-lg p-2 w-full" value={item.itemCode} onChange={(e) => updateRow(index, "itemCode", e.target.value)} /></td>
                <td className="p-2"><input className="border rounded-lg p-2 w-full" value={item.description} onChange={(e) => updateRow(index, "description", e.target.value)} /></td>
                <td className="p-2"><input className="border rounded-lg p-2 w-full" value={item.hsn} onChange={(e) => updateRow(index, "hsn", e.target.value)} /></td>
                <td className="p-2"><input className="border rounded-lg p-2 w-full" value={item.rate} onChange={(e) => updateRow(index, "rate", e.target.value)} /></td>
                <td className="p-2"><input className="border rounded-lg p-2 w-full" value={item.qty} onChange={(e) => updateRow(index, "qty", e.target.value)} /></td>
                <td className="p-2"><input className="border rounded-lg p-2 w-full" value={item.gst} onChange={(e) => updateRow(index, "gst", e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <button onClick={addRow} className="bg-slate-800 text-white px-4 py-3 rounded-xl">
          Add Row
        </button>
        <button className="bg-blue-600 text-white px-4 py-3 rounded-xl">
          Save Purchase
        </button>
      </div>
    </div>
  );
}