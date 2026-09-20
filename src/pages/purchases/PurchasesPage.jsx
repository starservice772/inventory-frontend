import { useState } from "react";
import { createPortal } from "react-dom";
import { savePurchase, searchItemByCode } from "../../api/purchaseApi";
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
    companyName: "",
    gstNo: "",
    invoiceNo: "",
    invoiceDate: "",
    invoiceType: "I", //default
    gstPercentage: "",
  });

  // at first page loads
  const [touched, setTouched] = useState({
    companyName: false,
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
      gstValue: "",
      totalDp: "",
      totalPrice: "",
    },
  ]);

  // 🔍 Per-row item search state
  const [itemSearchResults, setItemSearchResults] = useState({});
  const [itemSearchLoading, setItemSearchLoading] = useState({});
  const [dropdownPos, setDropdownPos] = useState(null);

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
        gstValue: "",
        totalDp: "",
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
      const gstPercent = parseFloat(form.gstPercentage) / 100;

      // rounds any number to exactly 2 decimal places
      const roundToTwo = (value) => {
        return Number(Number(value).toFixed(2));
      };

      if (!isNaN(rate) && !isNaN(qty) && !isNaN(gstPercent)) {
        const gstValue = roundToTwo(rate * gstPercent * qty);
        const totalDp = roundToTwo(rate + rate * gstPercent);
        const totalPrice = roundToTwo(qty * totalDp);

        updated[index] = {
          ...updated[index],
          totalDp,
          gstValue,
          totalPrice,
        };
      } else {
        updated[index] = {
          ...updated[index],
          totalDp: "",
          gstValue: "",
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
    const itemCode = items[index]?.itemCode?.trim();

    if (!itemCode) {
      toast.error("Please enter an item code first");
      return;
    }

    // Get position of the current row
    const td = e.currentTarget.closest("td");
    const rect = (td || e.currentTarget).getBoundingClientRect();

    // Close previous dropdown
    setDropdownPos(null);

    setItemSearchLoading((prev) => ({
      ...prev,
      [index]: true,
    }));

    setItemSearchResults((prev) => ({
      ...prev,
      [index]: [],
    }));

    try {
      const results = await searchItemByCode(itemCode);

      console.log("Search results:", results);

      if (!results || results.length === 0) {
        toast.error("No items found for this code");
        return;
      }

      // Store results for this particular row
      setItemSearchResults((prev) => ({
        ...prev,
        [index]: results,
      }));

      // IMPORTANT:
      // Dropdown will appear even when there is ONLY ONE result
      setDropdownPos({
        index: index,
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: 400,
      });

    } catch (err) {
      console.error("Search error:", err);

      toast.error(
        err?.response?.data?.message ||
        "Failed to fetch item details"
      );

      setItemSearchResults((prev) => ({
        ...prev,
        [index]: [],
      }));

      setDropdownPos(null);

    } finally {
      setItemSearchLoading((prev) => ({
        ...prev,
        [index]: false,
      }));
    }
  };

  // ✅ User picks one from dropdown → fill both itemCode and itemDesc
  const selectItemFromSearch = (index, result) => {
    setItems((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
            ...row,
            itemCode: result.itemCode || row.itemCode,
            itemDesc: result.itemDescription || "",
            hsnCode: result.hsnCode || "",
          }
          : row
      )
    );

    // Clear results for this row
    setItemSearchResults((prev) => ({
      ...prev,
      [index]: [],
    }));

    // Close dropdown
    setDropdownPos(null);
  };

  // ✅ Save API call
  const handleSave = async () => {
    // Mark required fields as touched
    setTouched({
      companyName: true,
      invoiceNo: true,
      invoiceDate: true,
      invoiceType: true,
      gstPercentage: true,
      itemCode: true,
      itemDesc: true,
      hsnCode: true,
      rateDp: true,
      quantity: true,
    });

    // Validate
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        ...form,

        items: items.map((item) => ({
          ...item,

          rateDp: Number(item.rateDp),
          quantity: Number(item.quantity),
          gstValue: Number(item.gstValue) || 0,
          totalDp: Number(item.totalDp) || 0,
          totalPrice: Number(item.totalPrice) || 0,
        })),
      };

      console.log("Sending Purchase Payload:", payload);

      await savePurchase(payload);

      toast.success("Purchase saved successfully!");

      // ================= RESET FORM =================

      setForm({
        companyName: "",
        gstNo: "",
        invoiceNo: "",
        invoiceDate: "",
        invoiceType: "I",
        gstPercentage: "",
      });

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

      setTouched({
        companyName: false,
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

    } catch (error) {
      console.error("Purchase save error:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error saving purchase"
      );
    }
  };

  const validateForm = () => {
    const errors = [];

    // ================= HEADER VALIDATION =================

    if (!form.companyName?.trim()) {
      errors.push("Company name");
    }

    if (!form.invoiceNo?.trim()) {
      errors.push(
        form.invoiceType === "C" ? "Challan No" : "Invoice No"
      );
    }

    if (!form.invoiceDate) {
      errors.push("Invoice Date");
    }

    if (
      form.gstPercentage === "" ||
      form.gstPercentage === null ||
      form.gstPercentage === undefined
    ) {
      errors.push("GST Percentage");
    }

    // ================= ITEM VALIDATION =================

    items.forEach((item, index) => {
      const row = index + 1;

      if (!item.itemCode?.trim()) {
        errors.push(`Item Code (Row ${row})`);
      }

      if (!item.itemDesc?.trim()) {
        errors.push(`Item Description (Row ${row})`);
      }

      if (!item.hsnCode?.trim()) {
        errors.push(`HSN Code (Row ${row})`);
      }

      if (
        item.rateDp === "" ||
        item.rateDp === null ||
        item.rateDp === undefined
      ) {
        errors.push(`Rate (Row ${row})`);
      } else if (Number(item.rateDp) <= 0) {
        errors.push(`Rate must be greater than 0 (Row ${row})`);
      }

      if (
        item.quantity === "" ||
        item.quantity === null ||
        item.quantity === undefined
      ) {
        errors.push(`Quantity (Row ${row})`);
      } else if (Number(item.quantity) <= 0) {
        errors.push(`Quantity must be greater than 0 (Row ${row})`);
      }
    });

    // ================= SHOW EXACT ERROR =================

    if (errors.length > 0) {
      console.log("Purchase validation errors:", errors);

      toast.error(
        `Please fill: ${errors[0]}${errors.length > 1 ? " and other required fields" : ""
        }`
      );

      return false;
    }

    return true;
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Purchases</h2>
          <p className="text-slate-500">
            Add purchase invoice and update office stock
          </p>
        </div>

        {/* ✅ Header Inputs */}
        <div className="grid grid-cols-6 gap-3 items-end">
          {/* Company */}
          <div>
            <label className="text-sm font-medium">
              Company<span className="text-red-500">*</span>
            </label>
            <input
              className={`border p-2 w-full ${touched.companyName && !form.companyName
                ? "border-red-500"
                : "border-gray-300"
                }`}
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, companyName: true })}
            />
          </div>

          {/* GST No */}
          <div>
            <label className="text-sm font-medium">GST No</label>
            <input
              className="border border-gray-300 p-2 w-full"
              value={form.gstNo}
              onChange={(e) => setForm({ ...form, gstNo: e.target.value })}
            />
          </div>

          {/* Invoice Type */}
          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              className={`border p-2 w-full ${touched.invoiceType && !form.invoiceType
                ? "border-red-500"
                : "border-gray-300"
                }`}
              value={form.invoiceType}
              onChange={(e) =>
                setForm({
                  ...form,
                  invoiceType: e.target.value,
                  invoiceNo: "",
                  invoiceDate: "",
                })
              }
              onBlur={() => setTouched({ ...touched, invoiceType: true })}
            >
              {/* <option value="">Select Type</option> */}
              <option value="I">Invoice</option>
              <option value="C">Challan</option>
            </select>
          </div>

          {/* Invoice No */}
          <div>
            <label className="text-sm font-medium">
              {form.invoiceType === "C" ? "Challan No" : "Invoice No"}
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
              {form.invoiceType === "C" ? "Challan Date" : "Invoice Date"}
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
          <div>
            <label className="text-sm font-medium">GST (in %)</label>
            <span className="text-red-500">*</span>
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
          </div>
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
                  "GST Value",
                  "Total DP",
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
                        className={`flex-1 p-1 outline-none min-w-0 ${touched.itemCode && !item.itemCode
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
                        className="flex-shrink-0 p-1 rounded
                        hover:bg-slate-100
                        text-slate-500
                        hover:text-slate-800
                        transition"
                      >
                        {itemSearchLoading[index] ? (
                          <span
                            className="inline-block w-3.5 h-3.5
                            border-2 border-slate-400
                            border-t-transparent
                            rounded-full animate-spin"
                          />
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
                  <td className="border border-gray-300 p-1">
                    <input
                      className="w-full p-1 outline-none text-right"
                      value={item.gstValue || 0}
                      readOnly
                    />
                  </td>

                  {/* Total DP */}
                  <td className="border border-gray-300 p-1">
                    <input
                      className="w-full p-1 outline-none text-right"
                      value={item.totalDp || 0}
                      readOnly
                    />
                  </td>

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
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-3 
           transition-all duration-300 
           hover:bg-green-700 hover:shadow-lg hover:-translate-y-1 
           active:scale-95"
          >
            Save
          </button>
        </div>
      </div>

      {/* dropdown */}
      {dropdownPos &&
        itemSearchResults[dropdownPos.index]?.length > 0 &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: "400px",
              zIndex: 999999,
            }}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          >

            {/* Header */}
            <div className="flex items-center justify-between
                      bg-slate-700 text-white
                      px-4 py-2.5"
            >
              <div className="flex items-center gap-2">

                <span className="font-semibold text-base">
                  Search Results
                </span>

                <span
                  className="bg-slate-500
                       px-2 py-0.5
                       rounded-full
                       text-xs
                       font-semibold"
                >
                  {itemSearchResults[dropdownPos.index].length}
                </span>

              </div>

              <button
                type="button"
                onClick={() => setDropdownPos(null)}
                className="text-lg
                     hover:text-red-300
                     transition"
              >
                ✕
              </button>
            </div>

            {/* Subtitle */}
            <div
              className="px-4 py-2
                   text-xs
                   text-slate-500
                   border-b"
            >
              Click an item to auto-fill the row
            </div>

            {/* Results */}
            <div className="max-h-[260px] overflow-y-auto">

              {itemSearchResults[dropdownPos.index].map(
                (result, idx) => (

                  <button
                    key={`${result.itemCode}-${idx}`}
                    type="button"
                    onClick={() =>
                      selectItemFromSearch(
                        dropdownPos.index,
                        result
                      )
                    }
                    className="w-full
                         flex
                         gap-3
                         px-4
                         py-3
                         text-left
                         cursor-pointer
                         hover:bg-slate-50
                         border-b
                         border-slate-100
                         transition"
                  >

                    {/* Number */}
                    <div
                      className="w-7 h-7
                           rounded-full
                           bg-slate-100
                           flex
                           items-center
                           justify-center
                           text-sm
                           font-semibold
                           text-slate-600
                           flex-shrink-0"
                    >
                      {idx + 1}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">

                      <div
                        className="font-semibold
                             text-[15px]
                             text-slate-800
                             leading-5"
                      >
                        {result.itemDescription}
                      </div>

                      <div
                        className="mt-1
                             text-xs
                             text-slate-500"
                      >
                        <span className="font-medium">
                          Item Code:
                        </span>{" "}
                        {result.itemCode}
                      </div>

                      <div
                        className="text-xs
                             text-slate-500"
                      >
                        <span className="font-medium">
                          HSN Code:
                        </span>{" "}
                        {result.hsnCode}
                      </div>

                    </div>

                  </button>

                )
              )}

            </div>

          </div>,
          document.body
        )}

    </>
  );
}
