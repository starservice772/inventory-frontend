import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { searchItemByCode } from "../../api/purchaseApi";
import { saveSale, searchEmployeeByName } from "../../api/salesApi";
import toast from "react-hot-toast";
import deleteIcon from "../../assets/delete_Icon.png";
import { Search } from "lucide-react";


export default function PurchasesPage() {
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  // ✅ Separate form state (header)
  const [form, setForm] = useState({
    empId: "",
    empName: "",
    workNo: "",
    invoiceNo: "",
    invoiceDate: "",
    gstPercentage: "",
  });

  // at first page loads
  const [touched, setTouched] = useState({
    empName: false,
    workNo: false,
    invoiceNo: false,
    invoiceDate: false,
    invoiceType: false,
    gstPercentage: false,

    itemCode: false,
    itemDesc: false,
    hsnCode: false,
    rateDp: false,
    quantity: false,
  });


  // ✅ Items state (table)
  const [items, setItems] = useState([
    {
      itemCode: "",
      itemDesc: "",
      hsnCode: "",
      rateDp: "",
      quantity: "",
      // gstValue: "",
      // totalDp: "",
      totalPrice: "",
    },
  ]);

  // 🔍 Per-row item search state
  const [itemSearchResults, setItemSearchResults] = useState({}); // { rowIndex: [items] }
  const [itemSearchLoading, setItemSearchLoading] = useState({}); // { rowIndex: bool }
  const [dropdownPos, setDropdownPos] = useState(null); // { index, top, left } for portal

  // state for select employees in search
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // Don't search if an employee has already been selected
    if (selectedEmployee) return;

    if (form.empName.trim().length <= 2) {
      setEmployees([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await searchEmployeeByName(form.empName);

        if (res.success) {
          setEmployees(res.data);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        console.error(err);
        setEmployees([]);
      }
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [form.empName, selectedEmployee]);

  // ✅ Add new row
  const addRow = () => {
    setItems([
      ...items,
      {
        itemCode: "",
        itemDesc: "",
        hsnCode: "",
        rateDp: "",
        quantity: "",
        // gstValue: "",
        // totalDp: "",
        totalPrice: "",
      },
    ]);
  };

  const updateRow = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      const item = updated[index];

      const rate = parseFloat(item.rateDp);
      const qty = parseFloat(item.quantity);
      // const gstPercent = parseFloat(form.gstPercentage) / 100;

      // if (!isNaN(rate) && !isNaN(qty) && !isNaN(gstPercent)) {
      if (!isNaN(rate) && !isNaN(qty)) {
        // const gstValue = rate * gstPercent * qty;
        // const totalDp = rate + rate * gstPercent;
        // const totalDp = rate * qty;
        const totalPrice = rate * qty;

        updated[index] = {
          ...updated[index],
          // totalDp,
          // gstValue,
          totalPrice,
        };
      } else {
        updated[index] = {
          ...updated[index],
          // totalDp: "",
          // gstValue: "",
          totalPrice: "",
        };
      }

      return updated;
    });
  };


  // Delete Function for Row
  const deleteRow = (index) => {
    if (items.length === 1) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // 🔍 Search item description by item code
  const handleItemCodeSearch = async (index, e) => {
    const itemCode = items[index].itemCode?.trim();
    if (!itemCode) {
      toast.error("Please enter an item code first");
      return;
    }

    // Anchor to the <td> cell so dropdown sits directly below the Item Code input
    const td = e.currentTarget.closest("td");
    const rect = (td || e.currentTarget).getBoundingClientRect();
    setDropdownPos(null); // reset first

    setItemSearchLoading((prev) => ({ ...prev, [index]: true }));
    setItemSearchResults((prev) => ({ ...prev, [index]: [] }));

    try {
      const results = await searchItemByCode(itemCode);

      // console.log(results)

      if (!results || results.length === 0) {
        toast.error("No items found for this code");
        return;
      }

      if (results.length === 1) {
        const res = results[0]
        // console.log(res);
        // console.log("itemDescription:", JSON.stringify(res.itemDescription));
        // console.log("itemDesc:", JSON.stringify(res.itemDesc));
        // console.log("keys:", Object.keys(res));


        updateRow(index, "itemDesc", res.itemDescription || "");
        updateRow(index, "hsnCode", res.hsnCode || "");

        toast.success("Item description filled!");

        return
      } else {
        // Multiple → show portal dropdown below the search button
        setDropdownPos({
          index,
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
        setItemSearchResults((prev) => ({ ...prev, [index]: results }));
      }
    } catch (err) {
      console.error("🔴 Search error:", err);
      toast.error("Failed to fetch item details");
    } finally {
      setItemSearchLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  // ✅ User picks one from dropdown → fill both itemCode and itemDesc
  const selectItemFromSearch = (index, result) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      itemCode: result.itemCode || updated[index].itemCode,
      itemDesc:
        result.itemDescription || result.description || result.name || "",
      hsnCode: result.hsnCode || result.HSNcode || result.code || ""
    };
    setItems(updated);
    setItemSearchResults((prev) => ({ ...prev, [index]: [] }));
    setDropdownPos(null);
  };


  const validateForm = () => {
    // Mark all required fields as touched
    setTouched({
      empName: true,
      workNo: true,
      invoiceNo: true,
      invoiceDate: true,
      gstPercentage: true,

      itemCode: true,
      itemDesc: true,
      hsnCode: true,
      rateDp: true,
      quantity: true,
    });

    // Header validation
    if (
      !form.empName.trim() ||
      !form.workNo.trim() ||
      !form.invoiceNo.trim() ||
      !form.invoiceDate
      // !form.gstPercentage
    ) {
      toast.error("Please fill all required fields.");
      return false;
    }

    // Employee must be selected
    if (!selectedEmployee) {
      toast.error("Please select an engineer.");
      return false;
    }

    // Table validation
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (
        !item.itemCode ||
        !item.itemDesc ||
        !item.hsnCode ||
        !item.rateDp ||
        !item.quantity
      ) {
        toast.error(`Please complete Item Row ${i + 1}`);
        return false;
      }

      if (Number(item.rateDp) <= 0) {
        toast.error(`Rate must be greater than 0 (Row ${i + 1})`);
        return false;
      }

      if (Number(item.quantity) <= 0) {
        toast.error(`Quantity must be greater than 0 (Row ${i + 1})`);
        return false;
      }
    }

    return true;
  };

  const handleSaveSale = async () => {
    if (!validateForm()) return;
    try {
      if (!selectedEmployee) {
        toast.error("Please select an engineer");
        return;
      }

      const payload = {
        empId: selectedEmployee.empId,
        empName: selectedEmployee.empName,

        workOrderNo: form.workNo,
        invoiceNo: form.invoiceNo,
        invoiceDate: form.invoiceDate,

        items: items.map((item) => ({
          itemCode: item.itemCode,

          itemDesc: item.itemDesc,

          quantity: item.quantity,

          hsnCode: item.hsnCode,

          rate: item.rateDp,

          gst: item.gstValue,

          total: item.totalDp,

          totalPrice: item.totalPrice,
        })),
      };

      console.log("Sales Payload:", payload);

      const response = await saveSale(payload);

      if (response.success) {
        toast.success(response.message || "Sales saved Successfully");

        // Reset Header
        setForm({
          empName: "",
          workNo: "",
          invoiceNo: "",
          invoiceDate: "",
          gstPercentage: "",
        });

        // resets the touched state
        setTouched({
          empName: false,
          workNo: false,
          invoiceNo: false,
          invoiceDate: false,
          gstPercentage: false,

          itemCode: false,
          itemDesc: false,
          hsnCode: false,
          rateDp: false,
          quantity: false,
        });

        setSelectedEmployee(null);
        setEmployees([]);

        // Reset Table
        setItems([
          {
            itemCode: "",
            itemDesc: "",
            hsnCode: "",
            rateDp: "",
            quantity: "",
            gstValue: "",
            totalDp: "",
            totalPrice: "",
          },
        ]);

      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save sales");
    }
  };


  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Sales</h2>
          <p className="text-slate-500">
            Issue items to engineers and deduct stock
          </p>
        </div>

        {/* ✅ Header Inputs */}
        <div className="grid grid-cols-6 gap-3 items-end">
          {/* Engineer */}
          <div className="relative">
            <label className="text-sm font-medium">
              Engineer Name<span className="text-red-500">*</span>
            </label>
            <input
              className={`border p-2 w-full ${touched.empName && !form.empName
                ? "border-red-500"
                : "border-gray-300"
                }`}
              value={form.empName}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, empName: e.target.value }))

                if (selectedEmployee) {
                  setSelectedEmployee(null);
                }
              }}
              onBlur={() => setTouched({ ...touched, empName: true })}
            />

            {/* search box */}
            {employees.length > 0 && (
              <div className="absolute z-20 bg-white border w-full mt-1 max-h-52 overflow-auto shadow-lg">
                {employees.map((emp) => (
                  <div
                    key={emp.empId}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedEmployee(emp);

                      setForm((prev) => ({
                        ...prev,
                        empName: emp.empName,
                      }));

                      setEmployees([]);
                    }}
                  >
                    {emp.empName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Work Order No */}
          <div>
            <label className="text-sm font-medium">Work Order No.</label><span className="text-red-500">*</span>
            <input
              className={`border p-2 w-full ${touched.workNo && !form.workNo
                ? "border-red-500"
                : "border-gray-300"
                }`}
              value={form.workNo}
              onChange={(e) => setForm({ ...form, workNo: e.target.value })}
              onBlur={() => setTouched({ ...touched, workNo: true })}
            />
          </div>


          {/* Invoice No */}
          <div>
            <label className="text-sm font-medium">
              Invoice No.
              {/* {form.invoiceType === "C" ? "Challan No" : "Invoice No"} */}
              <span className="text-red-500">*</span>
            </label>
            <input
              className={`border p-2 w-full ${touched.invoiceNo && !form.invoiceNo
                ? "border-red-500"
                : "border-gray-300"
                }`}
              value={form.invoiceNo}
              onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })}
              onBlur={() => setTouched({ ...touched, invoiceNo: true })}
            />
          </div>

          {/* Invoice Date */}
          <div>
            <label className="text-sm font-medium">
              Invoice Date
              {/* {form.invoiceType === "C" ? "Challan Date" : "Invoice Date"} */}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`border p-2 w-full ${touched.invoiceDate && !form.invoiceDate
                ? "border-red-500"
                : "border-gray-300"
                }`}
              value={form.invoiceDate}
              onChange={(e) =>
                setForm({ ...form, invoiceDate: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, invoiceDate: true })}
            />
          </div>

          {/* GST % */}
          {/* <div>
            <label className="text-sm font-medium">GST (in %)</label>
            <input
              className={`border p-2 w-full ${touched.gstPercentage && !form.gstPercentage
                ? "border-red-500"
                : "border-gray-300"
                }`}
              value={form.gstPercentage}
              onChange={(e) =>
                setForm({ ...form, gstPercentage: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, gstPercentage: true })}
            />
          </div> */}
        </div>

        {/* ✅ Table */}
        <div className="overflow-x-auto border border-gray-300">
          <table className="min-w-full text-m border-collapse">
            <thead className="bg-slate-100">
              <tr>
                {[
                  "Item Code",
                  "Item Description",
                  "HSN Code",
                  "Rate",
                  "Quantity",
                  // "GST Value",
                  // "Total DP",
                  "Total Price",
                  "    ",
                ].map((head, index) => (
                  <th
                    key={head}
                    className="border border-gray-300 p-2 text-center font-semibold"
                  >
                    {head}
                    {index < 5 && <span className="text-red-500 ml-1">*</span>}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* Item Code */}
                  <td className="border border-gray-300 p-1 relative">
                    <div className="flex items-center gap-1">
                      <input
                        className={`flex-1 p-1 outline-none text-center min-w-0 ${touched.itemCode && !item.itemCode
                          ? "border border-red-500"
                          : ""
                          }`}
                        value={item.itemCode || ""}
                        onChange={(e) =>
                          updateRow(index, "itemCode", e.target.value)
                        }
                        onBlur={() =>
                          setTouched({ ...touched, itemCode: true })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleItemCodeSearch(index);
                        }}
                      />
                      {/* 🔍 Search Button */}
                      <button
                        type="button"
                        title="Search item description"
                        onClick={(e) => handleItemCodeSearch(index, e)}
                        className="flex-shrink-0 p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                      >
                        {itemSearchLoading[index] ? (
                          <span className="inline-block w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Search size={13} />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Item Description */}
                  <td className="border border-gray-300 p-1">
                    <div className="flex items-center gap-1 w-full">
                      {/* Input */}
                      <input
                        readOnly
                        className={`w-full p-1 outline-none text-left bg-gray-50 cursor-default ${touched.itemDesc && !item.itemDesc
                          ? "border border-red-500"
                          : ""
                          }`}
                        value={item.itemDesc || ""}
                        onBlur={() =>
                          setTouched({ ...touched, itemDesc: true })
                        }
                      />

                      {/* Dots */}
                      {item.itemDesc?.length > 20 && (
                        <span
                          className="cursor-pointer font-bold px-1 flex-shrink-0"
                          onMouseEnter={(e) => {
                            setTooltip({
                              visible: true,
                              text: item.itemDesc,
                              x: e.clientX,
                              y: e.clientY,
                            });
                          }}
                          onMouseMove={(e) => {
                            setTooltip((prev) => ({
                              ...prev,
                              x: e.clientX,
                              y: e.clientY,
                            }));
                          }}
                          onMouseLeave={() => {
                            setTooltip({
                              visible: false,
                              text: "",
                              x: 0,
                              y: 0,
                            });
                          }}
                        >
                          ...
                        </span>
                      )}
                    </div>
                  </td>
                  {/* HSN */}
                  <td className="border border-gray-300 p-1">
                    <input
                      readOnly
                      className={`w-full p-1 outline-none text-center ${touched.hsnCode && !item.hsnCode
                        ? "border border-red-500"
                        : ""
                        }`}
                      value={item.hsnCode || ""}
                      onChange={(e) =>
                        updateRow(index, "hsnCode", e.target.value)
                      }
                      onBlur={() => setTouched({ ...touched, hsnCode: true })}
                    />
                  </td>


                  {/* Rate */}
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      className={`w-full p-1 outline-none text-right ${touched.rateDp && !item.rateDp
                        ? "border border-red-500"
                        : ""
                        }`}
                      value={item.rateDp || ""}
                      onChange={(e) =>
                        updateRow(index, "rateDp", e.target.value)
                      }
                      onBlur={() => setTouched({ ...touched, rateDp: true })}
                    />
                  </td>

                  {/* Quantity */}
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      className={`w-full p-1 outline-none text-right ${touched.quantity && !item.quantity
                        ? "border border-red-500"
                        : ""
                        }`}
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateRow(index, "quantity", e.target.value)
                      }
                      onBlur={() => setTouched({ ...touched, quantity: true })}
                    />
                  </td>

                  {/* GST Value (auto) */}
                  {/* <td className="border border-gray-300 p-1">
                    <input
                      className="w-full p-1 outline-none text-right"
                      value={item.gstValue || 0}
                      readOnly
                    />
                  </td> */}

                  {/* Total DP */}
                  {/* <td className="border border-gray-300 p-1">
                    <input
                      className="w-full p-1 outline-none text-right"
                      value={item.totalDp || 0}
                      readOnly
                    />
                  </td> */}

                  {/* Total Price */}
                  <td className="border border-gray-300 p-1">
                    <input
                      className="w-full p-1 outline-none text-right"
                      value={item.totalPrice || 0}
                      readOnly
                    />
                  </td>
                  {/*Delete Button*/}
                  <td className="relative border border-gray-300 p-0 pr-0">
                    <input className="w-full px-2 py-1 bg-transparent outline-none invisible pointer-events-none" />

                    {/* Delete Icon */}
                    <button
                      type="button"
                      onClick={() => deleteRow(index)}
                      className="absolute inset-0 m-auto flex justify-center items-center w-8 h-8 rounded-full hover:bg-red-100 transition"
                    >
                      <img
                        src={deleteIcon}
                        alt="delete"
                        className="w-4 h-6 object-contain"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Global Tooltip */}
          {tooltip.visible && (
            <div
              className="fixed z-[99999] pointer-events-none"
              style={{
                left: tooltip.x + 15,
                top: tooltip.y + 15,
              }}
            >
              <div
                className="w-96 max-w-[32rem]
            bg-gray-300 text-black
            text-sm leading-relaxed
            p-3 rounded-lg shadow-2xl
            break-words whitespace-normal"
              >
                {tooltip.text}
              </div>
            </div>
          )}
        </div>

        {/* ✅ Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={addRow}
            className="bg-slate-800 text-white px-4 py-3 
               transition duration-300 ease-in-out 
               hover:bg-slate-700 hover:scale-105 active:scale-95"
          >
            Add
          </button>

          <button
            onClick={handleSaveSale}
            className="bg-green-600 text-white px-4 py-3 
             transition-all duration-300 
             hover:bg-green-700 hover:shadow-lg hover:-translate-y-1 
             active:scale-95"
          >
            Save
          </button>
        </div>
      </div>

      {/* 📋 Portal dropdown — premium floating search results */}
      {dropdownPos &&
        itemSearchResults[dropdownPos.index]?.length > 0 &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: dropdownPos.top,
              left:
                typeof window !== "undefined"
                  ? Math.max(
                    16 + window.scrollX,
                    Math.min(
                      dropdownPos.left,
                      window.scrollX +
                      window.innerWidth -
                      Math.min(
                        Math.max(dropdownPos.width + 180, 340),
                        420,
                        window.innerWidth - 32,
                      ) -
                      16,
                    ),
                  )
                  : dropdownPos.left,
              width: Math.max(dropdownPos.width + 180, 340),
              maxWidth: "min(420px, calc(100vw - 32px))",
              zIndex: 9999,
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.08)",
              borderRadius: "14px",
              animation: "fadeInDown 0.18s ease",
            }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              }}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-semibold">
                  Search Results
                </span>
                <span
                  style={{ background: "rgba(255,255,255,0.2)" }}
                  className="text-white text-xs font-bold px-2 py-0.5 rounded-full"
                >
                  {itemSearchResults[dropdownPos.index].length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDropdownPos(null);
                  setItemSearchResults({});
                }}
                className="text-slate-300 hover:text-white transition text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Sub-label */}
            <p className="text-xs text-slate-400 px-4 py-1.5 bg-slate-50 border-b border-slate-100">
              Click an item to auto-fill the row
            </p>

            {/* Scrollable list */}
            <div
              style={{
                maxHeight: "260px",
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#94a3b8 transparent",
              }}
            >
              {itemSearchResults[dropdownPos.index].map((res, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectItemFromSearch(dropdownPos.index, res)}
                  style={{ transition: "background 0.12s" }}
                  className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 group hover:bg-blue-50 border-b border-slate-100 last:border-0 flex items-start gap-2 sm:gap-3"
                >
                  {/* Number badge */}
                  <span
                    style={{ minWidth: 24, minHeight: 24 }}
                    className="mt-0.5 flex items-center justify-center rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 text-xs font-bold transition flex-shrink-0"
                  >
                    {i + 1}
                  </span>

                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold text-slate-800 text-sm leading-snug break-words whitespace-normal group-hover:text-blue-700 transition">
                      {res.itemDescription || res.description || res.name}
                    </span>

                    {/* For viewing Item Code */}
                    {res.itemCode && (
                      <span className="text-xs text-slate-400 mt-1 font-mono tracking-wide break-all">
                        Item code: {res.itemCode}
                      </span>
                    )}

                    {/* For viewing HSN code */}
                    {res.hsnCode && (
                      <span className="text-xs text-slate-400 mt-1 font-mono tracking-wide break-all">
                        HSN code: {res.hsnCode}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}


