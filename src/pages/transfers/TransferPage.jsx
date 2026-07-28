import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { searchItemByCode } from "../../api/purchaseApi";
import { Search, Trash2 } from "lucide-react";
import { getAuthHeaders, BASE_URL } from "../../config/apiConfig";

// const token = localStorage.getItem("token");
// const BASE_URL = "https://dev.starserviceinventory.cloud/api";

export default function TransferPage() {
  const [itemResults, setItemResults] = useState([]);
  const [itemSearchLoading, setItemSearchLoading] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  //console.log(token);

  const [form, setForm] = useState({
    empId: "",
    empName: "",
    type: "ISSUE",
  });

  const [items, setItems] = useState([
    {
      itemCode: "",
      itemDesc: "",
      hsnCode: "",
      quantity: "",
      type: "ISSUE",
    },
  ]);

  // ✅ Add new row
  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        itemCode: "",
        itemDesc: "",
        hsnCode: "",
        quantity: "",
        type: form.type,
      },
    ]);
  };

  const deleteRow = (index) => {
    if (items.length === 1) {
      toast.error("At least one row is required");
      return;
    }

    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Employee already selected, don't search again
    if (form.empId) {
      return;
    }

    if (form.empName.trim().length < 2) {
      setEmployees([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/employee/list?search=${encodeURIComponent(form.empName)}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (res.data.success) {
          setEmployees(res.data.data);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [form.empName, form.empId]);


  // const handleItemCodeSearch = async () => {
  //   if (!items.itemCode.trim()) return;

  //   setItemSearchLoading(true);

  //   try {
  //     const items = await searchItemByCode(items.itemCode);

  //     console.log(items);

  //     setItemResults(items);
  //     setShowItemDropdown(items.length > 0);
  //   } catch (err) {
  //     console.error(err);
  //     setItemResults([]);
  //     setShowItemDropdown(false);
  //   } finally {
  //     setItemSearchLoading(false);
  //   }
  // };

  const handleItemCodeSearch = async (index) => {
    const row = items[index];

    if (!row) return;

    const code = row.itemCode.trim();

    if (!code) {
      toast.error("Please enter Item Code");
      return;
    }

    setActiveRow(index);
    setItemSearchLoading(true);

    try {
      const result = await searchItemByCode(code);

      console.log("Returned value:", result);

      setItemResults(result);
      setShowItemDropdown(result.length > 0);
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
  const selectItem = (index, item) => {
    setItems((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
            ...row,
            itemCode: item.itemCode,
            itemDesc: item.itemDescription,
            hsnCode: item.hsnCode,
          }
          : row
      )
    );

    setShowItemDropdown(false);
    setItemResults([]);
    setActiveRow(null);
  };

  const handleTransfer = async () => {
    try {
      let empId = form.empId;
      let empName = form.empName;

      if (!form.empId) {
        toast.error("Please select an engineer");
        return;
      }

      const payload = {
        empId,
        empName,
        items: items.map((item) => ({
          itemCode: item.itemCode,
          itemDesc: item.itemDesc,
          quantiy: item.quantity,
          type: item.type,
        }))
      };

      // const token = localStorage.getItem("token");

      const res = await axios.post(`${BASE_URL}/stock/transfer`, payload, {
        headers: getAuthHeaders()
      });

      toast.success(res.data.message || "Transfer Successful");

      // Reset header form
      setForm({
        empId: "",
        empName: "",
        type: "ISSUE",
      });

      // Reset table
      setItems([
        {
          itemCode: "",
          itemDesc: "",
          hsnCode: "",
          quantity: "",
          type: "ISSUE",
        },
      ]);

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

      {/* Engineer Name & Issue Type (Outside Table) */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Engineer */}
        <div className="relative overflow-visible">
          <label className="block text-sm font-medium mb-2">
            Engineer Name <span className="text-red-500">*</span>
          </label>

          <input
            className="w-full h-11 border px-3"
            placeholder="Enter engineer name"
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
            <div className="absolute left-0 right-0 mt-1 bg-white border shadow-lg z-50 max-h-52 overflow-y-auto">
              {employees.map((emp) => (
                <div
                  key={emp.empId}
                  onClick={() => {
                    setForm({
                      ...form,
                      empName: emp.empName,
                      empId: emp.empId,
                    });

                    setEmployees([]);
                  }}
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                >
                  {emp.empName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Issue Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Issue Type
          </label>

          <select
            className="w-full h-11 border px-3"
            value={form.type}
            onChange={(e) => {
              const value = e.target.value;

              setForm((prev) => ({
                ...prev,
                type: value,
              }));

              setItems((prev) =>
                prev.map((item) => ({
                  ...item,
                  type: value,
                }))
              );
            }}
          >
            <option value="ISSUE">Issue</option>
            <option value="RETURN">Return</option>
            <option value="DEFECTIVE_RETURN">Defective Return</option>
          </select>
        </div>

      </div>


      {/* ================= TABLE ================= */}

      <div className="border border-gray-300">

        <table className="w-full border-collapse">

          <thead className="bg-slate-100">

            <tr>

              <th className="border text-center py-4 w-[20%]">
                Item Code <span className="text-red-500">*</span>
              </th>

              <th className="border text-center py-4 w-[25%]">
                Item Description <span className="text-red-500">*</span>
              </th>

              <th className="border text-center py-4 w-[18%]">
                HSN Code <span className="text-red-500">*</span>
              </th>

              <th className="border text-center py-4 w-[18%]">
                Issue / Return Qty <span className="text-red-500">*</span>
              </th>

              <th className="border w-20"></th>

            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (

              <tr key={index}>

                {/* Item Code */}

                <td className="border p-0 relative">

                  <input
                    className="w-full h-12 px-3 pr-10 outline-none"
                    value={item.itemCode}
                    onChange={(e) =>
                      updateItem(index, "itemCode", e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => handleItemCodeSearch(index)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                  >
                    {itemSearchLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Search size={17} />
                    )}
                  </button>

                  {/* dropdown */}
                  {showItemDropdown &&
                    activeRow === index &&
                    itemResults.length > 0 && (

                      <div className="absolute left-0 top-full mt-2 w-[400px] bg-white rounded-xl shadow-2xl border overflow-hidden z-[99999]">

                        {/* Header */}
                        <div className="flex items-center justify-between bg-slate-700 text-white px-4 py-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-base">
                              Search Results
                            </span>

                            <span className="bg-slate-500 px-2 py-0.5 rounded-full text-xs font-semibold">
                              {itemResults.length}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setShowItemDropdown(false);
                              setActiveRow(null);
                            }}
                            className="text-lg hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Subtitle */}
                        <div className="px-4 py-2 text-xs text-slate-500 border-b">
                          Click an item to auto-fill the row
                        </div>

                        {/* Items */}
                        <div className="max-h-[260px] overflow-y-auto">

                          {itemResults.map((result, idx) => (

                            <div
                              key={result.itemCode}
                              onClick={() => selectItem(activeRow, result)}
                              className="flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 border-b transition"
                            >

                              {/* Number Circle */}
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600 flex-shrink-0">
                                {idx + 1}
                              </div>

                              {/* Details */}
                              <div className="flex-1">

                                <div className="font-semibold text-[15px] text-slate-800 leading-5">
                                  {result.itemDescription}
                                </div>

                                <div className="mt-1 text-xs text-slate-500">
                                  <span className="font-medium">Item Code:</span>{" "}
                                  {result.itemCode}
                                </div>

                                <div className="text-xs text-slate-500">
                                  <span className="font-medium">HSN Code:</span>{" "}
                                  {result.hsnCode}
                                </div>

                              </div>

                            </div>

                          ))}

                        </div>

                      </div>

                    )}

                </td>

                {/* Description */}

                <td className="border p-0">

                  <input
                    readOnly
                    value={item.itemDesc}
                    className="w-full h-12 px-3 bg-white outline-none"
                  />

                </td>

                {/* HSN */}

                <td className="border p-0">

                  <input
                    readOnly
                    value={item.hsnCode}
                    className="w-full h-12 px-3 bg-white outline-none"
                  />

                </td>

                {/* Qty */}

                <td className="border p-0">

                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    className="w-full h-12 px-3 outline-none"
                  />

                </td>

                {/* Delete */}

                <td className="border text-center">

                  <button
                    type="button"
                    onClick={() => deleteRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* Buttons */}

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={addRow}
          className="bg-slate-800 hover:bg-slate-900 text-white px-7 py-3"
        >
          Add
        </button>


        <button
          onClick={handleTransfer}
          className="bg-green-600 text-white px-4 py-3 
             transition-all duration-300 
             hover:bg-green-700 hover:shadow-lg hover:-translate-y-1 
             active:scale-95"
        >
          Transfer Stock
        </button>

      </div>


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
