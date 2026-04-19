export default function TransferPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Stock Transfer</h2>
        <p className="text-slate-500">Transfer stock between office and engineers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input className="border rounded-xl p-3" placeholder="Engineer Name" />
        <input className="border rounded-xl p-3" placeholder="Item Code" />
        <input className="border rounded-xl p-3" placeholder="Item Description" />
        <input className="border rounded-xl p-3" placeholder="Issue / Return Qty" />
        <select className="border rounded-xl p-3">
          <option>Good Issue</option>
          <option>Good Return</option>
          <option>Defective Issue</option>
          <option>Defective Return</option>
        </select>
      </div>

      <button className="bg-purple-600 text-white px-4 py-3 rounded-xl">
        Transfer Stock
      </button>
    </div>
  );
}