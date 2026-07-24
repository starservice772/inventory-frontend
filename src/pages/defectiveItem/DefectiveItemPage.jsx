import { useEffect, useRef, useState } from "react";
import { getDefectiveItems } from "../../api/defectiveApi";
import DescriptionTooltip from "../../components/items/DescriptionToolTip";

export default function DefectiveItemPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const observerRef = useRef(null);
  const hasLoaded = useRef(false);

  const loadItems = async (pageNumber, searchText = search) => {
    if (loading) return;
    if (totalPages !== 0 && pageNumber >= totalPages) return;

    try {
      setLoading(true);

      const res = await getDefectiveItems(
        pageNumber,
        30,
        searchText
      );

      if (pageNumber === 0) {
        setItems(res.items);
      } else {
        setItems((prev) => {
          const merged = [...prev, ...res.items];

          return merged.filter(
            (item, index, self) =>
              index ===
              self.findIndex((i) => i.uuid === item.uuid)
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

  useEffect(() => {
    if (hasLoaded.current) return;

    hasLoaded.current = true;

    loadItems(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          !loading &&
          page + 1 < totalPages
        ) {
          loadItems(page + 1);
        }
      },
      {
        threshold: 1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [page, totalPages, loading]);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-300">

      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b">

        <input
          type="text"
          placeholder="Search Defective Items..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />

      </div>

      {/* Table */}
      <table className="w-full text-left">

        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4">Item Code</th>
            <th className="p-4">Description</th>
            <th className="p-4">HSN Code</th>
            <th className="p-4 text-center">Defective Qty</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.uuid}
              className="border-t hover:bg-red-50"
            >
              <td className="p-3">
                {item.itemCode}
              </td>

              <td className="p-3 max-w-md">
                <DescriptionTooltip
                  text={item.itemDesc}
                  maxLength={35}
                />
              </td>

              <td className="p-3">
                {item.hsnCode}
              </td>

              <td className="p-3 text-center">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                  {item.quantity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* Infinite Scroll Loader */}
      <div
        ref={observerRef}
        className="py-6 text-center"
      >
        {loading && (
          <div className="flex justify-center items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading...
          </div>
        )}

        {!loading &&
          totalPages > 0 &&
          page + 1 >= totalPages && (
            <p className="text-gray-400 text-sm">
              All defective items loaded
            </p>
          )}
      </div>

    </div>
  );
}