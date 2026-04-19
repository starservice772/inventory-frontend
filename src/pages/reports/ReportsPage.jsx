const reports = [
  "Office Stock Report",
  "Engineer Stock Report",
  "Stock Transfer Transaction Report",
  "Purchases Report",
  "Sales Report",
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reports</h2>
        <p className="text-slate-500">Generate and export reports in Excel format</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report} className="border rounded-2xl p-5 bg-slate-50">
            <h3 className="font-semibold mb-2">{report}</h3>
            <p className="text-sm text-slate-500 mb-4">Download detailed report</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl">
              Export Excel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}