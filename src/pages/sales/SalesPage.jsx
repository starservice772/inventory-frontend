export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sales</h2>
        <p className="text-slate-500">Issue items to engineers and deduct stock</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input className="border rounded-xl p-3" placeholder="Engineer Name" />
        <input className="border rounded-xl p-3" placeholder="Work Order No." />
        <input className="border rounded-xl p-3" placeholder="Invoice/Bill No." />
        <input type="date" className="border rounded-xl p-3" />
      </div>

      <div className="border rounded-2xl p-4 bg-slate-50">
        <p className="text-slate-600">Add dynamic sales item table here exactly like Purchases.</p>
      </div>

      <button className="bg-green-600 text-white px-4 py-3 rounded-xl">
        Save Sales
      </button>
    </div>
  );
}
