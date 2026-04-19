const results = [
  { location: "Office", qty: 16, owner: "-" },
  { location: "Engineer", qty: 4, owner: "Suvendu Naskar" },
  { location: "Engineer", qty: 5, owner: "Argha Kundu" },
];

export default function StockSearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Stock Search</h2>
        <p className="text-slate-500">Search stock by item code or description</p>
      </div>

      <div className="flex gap-3">
        <input className="border rounded-xl p-3 w-full" placeholder="Enter item code or item description" />
        <button className="bg-blue-600 text-white px-5 rounded-xl">Search</button>
      </div>

      <div className="overflow-x-auto border rounded-2xl">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Location</th>
              <th className="text-left p-3">Quantity</th>
              <th className="text-left p-3">Engineer</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{r.location}</td>
                <td className="p-3">{r.qty}</td>
                <td className="p-3">{r.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}