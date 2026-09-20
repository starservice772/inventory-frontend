import { useState } from "react";
import { getStockByItemCode } from "../../api/stockSearchApi";

import { Search } from "lucide-react";
import toast from "react-hot-toast";

export default function StockSearchPage() {
  const [itemCode, setItemCode] = useState("");

  const [loading, setLoading] = useState(false);

  const [stockData, setStockData] = useState(null);

  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!itemCode.trim()) {
      toast.error("Please enter item code")
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getStockByItemCode(itemCode);

      if (response.success) {
        setStockData(response.data);
        toast.success("Item fetched successfully")
      } else {
        setStockData(null);
        setError(response.message);
      }
    } catch (err) {
      setStockData(null);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">Stock Search</h2>
        <p className="text-slate-500">
          Search stock by item code
        </p>
      </div>

      {/* <div className="bg-white rounded-2xl border shadow-sm p-5"> */}
        <div className="relative w-full">

          <input
            className="w-full border rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Item Code..."
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search size={20} />
            )}
          </button>

        </div>
      {/* </div> */}

      {error && (
        <div className="border border-red-200 bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}

      {stockData && (
        <div className="bg-white border shadow-sm p-5">

          <div className="mb-5">
            <h3 className="text-xl font-semibold text-slate-800">
              {stockData.itemDescription}
            </h3>

            <p className="text-slate-500 mt-1">
              Item Code :
              <span className="font-semibold ml-2">
                {stockData.itemCode}
              </span>
            </p>
          </div>

          <div className="overflow-hidden border">

            <table className="min-w-full">

              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-slate-700">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-left font-semibold text-slate-700">
                    Engineer
                  </th>
                </tr>
              </thead>

              <tbody>

                {stockData.locations.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      {row.location}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {row.quantity}
                    </td>

                    <td className="px-6 py-4">
                      {row.engineerName}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}