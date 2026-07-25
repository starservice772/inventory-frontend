import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { searchItemByCode } from "../../api/purchaseApi";
import { Search } from "lucide-react";

const token = localStorage.getItem("token");
const BASE_URL = "https://dev.starserviceinventory.cloud/api";

export default function TransferPage() {
  const [itemResults, setItemResults] = useState([]);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [itemSearchLoading, setItemSearchLoading] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  //console.log(token);

  const [form, setForm] = useState({
    empId: "",
    empName: "",
    itemCode: "",
    itemDesc: "",
    hsnCode: "",
    quantity: "",
    type: "ISSUE",
  });

  const [employees, setEmployees] = useState([]);

  // Search employee while typing
  useEffect(() => {
    if (form.empName.trim().length < 2) {
      setEmployees([]);
      return;
    }

    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/employee/list?search=${form.empName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success) {
          setEmployees(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(fetchEmployees, 300);

    return () => clearTimeout(timer);
  }, [form.empName]);

  const handleItemCodeSearch = async () => {
    if (!form.itemCode.trim()) return;

    setItemSearchLoading(true);

    try {
      const items = await searchItemByCode(form.itemCode);

      console.log(items);

      setItemResults(items);
      setShowItemDropdown(items.length > 0);
    } catch (err) {
      console.error(err);
      setItemResults([]);
      setShowItemDropdown(false);
    } finally {
      setItemSearchLoading(false);
    }
  };

  //   const handleItemCodeSearch = async () => {
  //   try {
  //     const res = await searchItemByCode(form.itemCode);

  //     console.log("API:", res);
  // console.log("Returned value:", JSON.stringify(res, null, 2));

  //     setItemResults(res.data || []);
  //   } catch (err) {
  //     console.error(err);
  //     setItemResults([]);
  //   }
  // };
  const selectItem = (item) => {
    setForm((prev) => ({
      ...prev,
      itemCode: item.itemCode,
      itemDesc: item.itemDescription,
    }));

    setShowItemDropdown(false);
    setItemResults([]);
  };

  const handleTransfer = async () => {
    try {
      let empId = form.empId;
      let empName = form.empName;

      // If user typed the name manually, fetch employee id
      if (!empId && empName.trim()) {
        const empRes = await axios.get(
          `${BASE_URL}/employee/list?search=${encodeURIComponent(empName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (
          empRes.data.success &&
          empRes.data.data &&
          empRes.data.data.length > 0
        ) {
          const employee = empRes.data.data.find(
            (e) => e.empName.toLowerCase() === empName.toLowerCase(),
          );

          if (!employee) {
            toast.error("Employee not found");
            return;
          }

          empId = employee.empId;
          empName = employee.empName;
        } else {
          toast.error("Employee not found");
          return;
        }
      }

      const payload = {
        empId,
        empName,
        items: [
          {
            itemCode: form.itemCode,
            itemDesc: form.itemDesc,
            quantiy: form.quantity,
            type: form.type,
          },
        ],
      };

      const token = localStorage.getItem("token");

      const res = await axios.post(`${BASE_URL}/stock/transfer`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Transfer Successful");

      setForm({
        empId: "",
        empName: "",
        itemCode: "",
        itemDesc: "",
        hsnCode: "",
        quantity: "",
        type: "ISSUE",
      });

      setEmployees([]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Transfer Failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Stock Transfer</h2>
        <p className="text-slate-500">
          Transfer stock between office and engineers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        {/* Employee Search */}
        <div className="relative">
          <label className="block mb-1 text-sm font-semibold text-slate-700 mb-1">
            Engineer Name
          </label>
          <input
            className="border p-3 w-full"
            placeholder="Engineer Name"
            value={form.empName}
            onChange={(e) =>
              setForm({
                ...form,
                empName: e.target.value,
                empId: "",
              })
            }
          />

          {employees.length > 0 && (
            <div className="absolute z-20 bg-white border w-full mt-1 max-h-52 overflow-auto shadow-lg">
              {employees.map((emp) => (
                <div
                  key={emp.empId}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setForm({
                      ...form,
                      empId: emp.empId,
                      empName: emp.empName,
                    });
                    setEmployees([]);
                  }}
                >
                  {emp.empName}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full overflow-visible">
          <label className="block mb-1 text-sm font-semibold text-slate-700 mb-1">
            Item Code
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Item Code"
              className="w-full border p-3 pr-10"
              value={form.itemCode}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  itemCode: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleItemCodeSearch();
                }
              }}
            />


            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleItemCodeSearch();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-500 hover:text-blue-600"
            >
              {itemSearchLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Search size={18} />
              )}
            </button>
          </div>

          {/* dropdown code */}
          {/* <div className="text-red-500 text-sm">
            showItemDropdown : {String(showItemDropdown)}
            <br />
            Total Results : {itemResults.length}
          </div> */}
          {showItemDropdown && (
            <div
              className="absolute left-0 top-full mt-2 w-[400px]
              bg-white rounded-xl overflow-hidden border border-slate-200
              shadow-[0_10px_30px_rgba(0,0,0,0.12),0_2px_10px_rgba(0,0,0,0.08)]
              z-[9999]"
            >
              {/* Header */}
              <div className="bg-slate-800 flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">
                    Search Results
                  </span>

                  <span className="bg-slate-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {itemResults.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowItemDropdown(false)}
                  className="text-slate-300 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Subtitle */}
              <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-400">
                Click an item to auto-fill the row
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto">
                {itemResults.map((item, index) => (
                  <button
                    key={item.itemCode}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        itemCode: item.itemCode,
                        itemDesc: item.itemDescription,
                        hsnCode: item.hsnCode,
                      }));

                      setShowItemDropdown(false);
                    }}
                    className="w-full text-left flex gap-3 px-4 py-4 border-b last:border-b-0
          hover:bg-blue-50 transition"
                  >
                    {/* Number Badge */}
                    <div
                      className="flex items-center justify-center
            w-8 h-8 rounded-full
            bg-slate-100 text-slate-500
            font-semibold text-sm flex-shrink-0"
                    >
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 break-words">
                        {item.itemDescription}
                      </div>

                      <div className="text-xs text-slate-400 font-mono mt-1 break-all">
                        Item code: {item.itemCode}
                      </div>

                      <div className="text-xs text-slate-400 font-mono mt-1 break-all">
                        HSN code: {item.hsnCode}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block mb-1 text-sm font-semibold text-slate-700 mb-1">
            Item Description
          </label>
          <input
            readOnly
            className="border p-3 pr-12 w-full"
            placeholder="Item Description"
            value={form.itemDesc}
            onChange={(e) =>
              setForm({
                ...form,
                itemDesc: e.target.value,
              })
            }
          />

          {form.itemDesc?.length > 20 && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer font-bold text-gray-500"
              onMouseEnter={(e) =>
                setTooltip({
                  visible: true,
                  text: form.itemDesc,
                  x: e.clientX,
                  y: e.clientY,
                })
              }
              onMouseMove={(e) =>
                setTooltip((prev) => ({
                  ...prev,
                  x: e.clientX,
                  y: e.clientY,
                }))
              }
              onMouseLeave={() =>
                setTooltip({
                  visible: false,
                  text: "",
                  x: 0,
                  y: 0,
                })
              }
            >
              ...
            </span>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700 mb-1">
            HSN Code
          </label>
          <input
            className="border p-3"
            placeholder="HSN Code"
            value={form.hsnCode}
            onChange={(e) =>
              setForm({
                ...form,
                hsnCode: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700 mb-1">
            Issue / Return Qty
          </label>
          <input
            type="number"
            className="border p-3"
            placeholder="Issue / Return Qty"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Transfer Type
          </label>
          <select
            className="border p-3"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
          >
            <option value="ISSUE">Issue</option>
            <option value="RETURN">Return</option>
            <option value="DEFECTIVE_RETURN">Defective Return</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleTransfer}
        className="bg-purple-600 text-white px-4 py-3
             transition-all duration-300 ease-in-out
             hover:bg-purple-700 hover:opacity-90 hover:shadow-lg
             active:scale-95"
      >
        Transfer Stock
      </button>

      {tooltip.visible &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: tooltip.y + 15,
              left: tooltip.x + 15,
              background: "#ebf5ff",
              color: "#000000",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              maxWidth: "300px",
              zIndex: 999999,
              whiteSpace: "normal",
              pointerEvents: "none",
            }}
          >
            {tooltip.text}
          </div>,
          document.body,
        )}
    </div>
  );
}
