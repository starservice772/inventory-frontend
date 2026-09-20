import ReturnDefectiveModal from "../../components/defective/ReturnDefectiveModal";
import { useEffect, useRef, useState } from "react";
import {
  getDefectiveItems,
  transferDefectiveToCompany,
} from "../../api/defectiveApi";
import DescriptionTooltip from "../../components/items/DescriptionToolTip";
import toast from "react-hot-toast";

export default function DefectiveItemPage() {
  const [items, setItems] = useState([]);

  const [selectedItems, setSelectedItems] = useState({});

  const [returnDate, setReturnDate] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const observerRef = useRef(null);
  const hasLoaded = useRef(false);

  const loadItems = async (pageNumber, searchText = search) => {
    if (loading) return;
    if (totalPages !== 0 && pageNumber >= totalPages) return;

    try {
      setLoading(true);

      const res = await getDefectiveItems(pageNumber, 30, searchText);

      if (pageNumber === 0) {
        setItems(res.items);
        const mapped = {};

        res.items.forEach((item) => {
          mapped[item.uuid] = {
            checked: false,
            qty: "",
            fullQty: false,
          };
        });

        setSelectedItems(mapped);
      } else {
        setItems((prev) => {
          const merged = [...prev, ...res.items];

          return merged.filter(
            (item, index, self) =>
              index === self.findIndex((i) => i.uuid === item.uuid),
          );
        });
      }

      setPage(pageNumber);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;

    setSearch(value);
    setPage(0);
    setTotalPages(0);

    if (value.trim() === "") {
      loadItems(0, "");
      return;
    }

    if (value.trim().length >= 3) {
      loadItems(0, value);
    }
  };

  const refreshItems = () => {
    setPage(0);
    setTotalPages(0);
    loadItems(0, search);
  };

  useEffect(() => {
    if (hasLoaded.current) return;

    hasLoaded.current = true;

    loadItems(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && !loading && page + 1 < totalPages) {
          loadItems(page + 1);
        }
      },
      {
        threshold: 1,
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [page, totalPages, loading]);

  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };

  const handleReturn = async () => {
    if (!returnDate) {
      toast.error("Please select return date.");
      return;
    }

    const payload = {
      date: formatDate(returnDate),
      items: [],
    };

    for (const item of items) {
      const selected = selectedItems[item.uuid];

      if (!selected?.checked) continue;

      if (!selected.qty) {
        toast.error(`Enter return quantity for ${item.itemCode}`);
        return;
      }

      if (Number(selected.qty) <= 0) {
        toast.error(`Invalid quantity for ${item.itemCode}`);
        return;
      }

      if (Number(selected.qty) > Number(item.quantity)) {
        toast.error(
          `Return quantity cannot exceed defective quantity for ${item.itemCode}`,
        );
        return;
      }

      payload.items.push({
        itemCode: item.itemCode,
        itemDesc: item.itemDesc,
        quantity: selected.qty.toString(),
      });
    }

    if (payload.items.length === 0) {
      toast.error("Please select at least one item.");
      return;
    }

    try {
      await transferDefectiveToCompany(payload);

      toast.success("Stock returned successfully.");

      setReturnDate("");

      refreshItems();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to return stock.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-300">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b">
        {/* <input
          type="text"
          placeholder="Search Defective Items..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-gray-400"
        /> */}

        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />
        <button
          onClick={handleReturn}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Return To Company
        </button>

        {/* <button
          onClick={() => setShowTransferModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium"
        >
          Return To Company
        </button>

        <ReturnCompanyModal
          open={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onSuccess={refreshItems}
        /> */}
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="p-4 text-center w-16">Select</th>

            <th className="p-4">Item Code</th>

            <th className="p-4">Description</th>

            <th className="p-4">HSN Code</th>

            <th className="p-4 text-center">Defective Qty</th>

            <th className="p-4 text-center">Return Qty</th>

            <th className="p-4 text-center">Full Qty</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.uuid} className="border-t hover:bg-red-50">
              {/* Checkbox */}
              <td className="p-4 text-center">
                <input
                  type="checkbox"
                  checked={selectedItems[item.uuid]?.checked || false}
                  onChange={(e) =>
                    setSelectedItems((prev) => ({
                      ...prev,
                      [item.uuid]: {
                        ...prev[item.uuid],
                        checked: e.target.checked,
                      },
                    }))
                  }
                />
              </td>

              {/* Item Code */}
              <td className="p-4 font-medium">{item.itemCode}</td>

              {/* Description */}
              <td className="p-4 max-w-md">
                <DescriptionTooltip text={item.itemDesc} maxLength={40} />
              </td>

              {/* HSN */}
              <td className="p-4">{item.hsnCode}</td>

              {/* Defective Qty */}
              <td className="p-4 text-center">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                  {item.quantity}
                </span>
              </td>

              {/* Return Qty */}
              <td className="p-4 text-center">
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  placeholder="Qty"
                  value={selectedItems[item.uuid]?.qty || ""}
                  readOnly={selectedItems[item.uuid]?.fullQty || false}
                  onChange={(e) =>
                    setSelectedItems((prev) => ({
                      ...prev,
                      [item.uuid]: {
                        ...prev[item.uuid],
                        qty: e.target.value,
                      },
                    }))
                  }
                  className={`w-24 border rounded-lg px-3 py-2 text-center ${
                    selectedItems[item.uuid]?.fullQty
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />
              </td>
              <td className="p-4 text-center">
                <input
                  type="checkbox"
                  checked={selectedItems[item.uuid]?.fullQty || false}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    setSelectedItems((prev) => ({
                      ...prev,
                      [item.uuid]: {
                        ...prev[item.uuid],
                        fullQty: checked,
                        qty: checked ? item.quantity.toString() : "",
                      },
                    }));
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Infinite Scroll Loader */}
      <div ref={observerRef} className="py-6 text-center">
        {loading && (
          <div className="flex justify-center items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading...
          </div>
        )}

        {!loading && totalPages > 0 && page + 1 >= totalPages && (
          <p className="text-gray-400 text-sm">All defective items loaded</p>
        )}
      </div>

      <ReturnDefectiveModal
        open={showReturnModal}
        item={selectedItems}
        onClose={() => {
          setShowReturnModal(false);
          setSelectedItems(null);
        }}
        onSuccess={refreshItems}
      />
    </div>
  );
}
