import { useState } from "react";
import { savePurchase } from "../../api/purchaseApi";
import toast from "react-hot-toast";
import deleteIcon from "../../assets/delete_Icon.png";

export default function PurchasesPage() {
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
    const updated = [...items];

    // ✅ Step 1: update typed value
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    const item = updated[index];

    const rate = parseFloat(item.rateDp);
    const qty = parseFloat(item.quantity);
    const gstPercent = parseFloat(form.gstPercentage) / 100;

    // ✅ Step 2: calculate ONLY if valid numbers
    if (!isNaN(rate) && !isNaN(qty) && !isNaN(gstPercent)) {
      const gstValue = rate * gstPercent * qty;
      const totalDp = rate + (rate * gstPercent);
      const totalPrice = qty * totalDp;

      updated[index] = {
        ...updated[index],
        totalDp,
        gstValue,
        totalPrice,
      };
    } else {
      // reset calculated fields if incomplete input
      updated[index] = {
        ...updated[index],
        totalDp: "",
        gstValue: "",
        totalPrice: "",
      };
    }

    setItems(updated);
  };

  // Delete Function for Row
  const deleteRow = (index) => {
    if (items.length === 1) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };
  // ✅ Save API call
  const handleSave = async () => {

    // 🔴 Mark ALL required fields as touched
    setTouched({
      companyName: true,
      invoiceNo: true,
      invoiceDate: true,
      gstPercentage: true,
      itemCode: true,
      itemDesc: true,
      hsnCode: true,
      rateDp: true,
      quantity: true,
    });

    if (!validateForm()) {
      toast.error("Please fill the required fields");
      return;
    }
    try {
      const payload = {
        ...form,
        items: items.map((item) => ({
          ...item,
          rateDp: Number(item.rateDp) || 0,
          quantity: Number(item.quantity) || 0,
          gstValue: Number(item.gstValue) || 0,
          totalDp: Number(item.totalDp) || 0,
          totalPrice: Number(item.totalPrice) || 0,
        })),
      };

      console.log("Sending:", payload);

      await savePurchase(payload);

      toast.success("Purchase saved successfully!");

      // reset
      setForm({
        companyName: "",
        gstNo: "",
        invoiceNo: "",
        invoiceDate: "",
        invoiceType: "",
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

      // ✅ 🔥 MOST IMPORTANT FIX
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
      console.error(error);
      toast.error("Error saving purchase");
    }
  };

  const validateForm = () => {
    if (
      !form.companyName ||
      !form.gstNo ||
      !form.invoiceNo ||
      !form.invoiceDate ||
      !form.invoiceType ||
      !form.gstPercentage
    ) {
      return false;
    }

    for (let item of items) {
      if (
        !item.itemCode ||
        !item.itemDesc ||
        !item.hsnCode ||
        !item.rateDp ||
        !item.quantity
      ) {
        return false;
      }
    }

    return true;
  };

  return (
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
            className={`border p-2 w-full ${touched.companyName && !form.companyName ? "border-red-500" : "border-gray-300"
              }`}
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            onBlur={() =>
              setTouched({ ...touched, companyName: true })
            }
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
            onChange={(e) => setForm({ ...form, invoiceType: e.target.value, invoiceNo: "", invoiceDate: "" })}
            onBlur={() =>
              setTouched({ ...touched, invoiceType: true })
            }
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
            className={`border p-2 w-full ${touched.invoiceNo && !form.invoiceNo ? "border-red-500" : "border-gray-300"
              }`}
            value={form.invoiceNo}
            onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })}
            onBlur={() =>
              setTouched({ ...touched, invoiceNo: true })
            }
          />
        </div>

        {/* Invoice Date */}
        <div>
          <label className="text-sm font-medium">
            {form.invoiceType === "C" ? "Challan Date" : "Invoice Date"}<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className={`border p-2 w-full ${touched.invoiceDate && !form.invoiceDate ? "border-red-500" : "border-gray-300"
              }`}
            value={form.invoiceDate}
            onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
            onBlur={() =>
              setTouched({ ...touched, invoiceDate: true })
            }
          />
        </div>

        {/* GST % */}
        <div>
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
            onBlur={() =>
              setTouched({ ...touched, gstPercentage: true })
            }
          />
        </div>
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto border border-gray-300">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-slate-100 ">
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
              ].map((head) => (
                <th
                  key={head}
                  className="border border-gray-300 p-2 text-center font-semibold"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {/* Item Code */}
                <td className="border border-gray-300 p-1">
                  <input
                    className={`w-full p-1 outline-none text-center ${touched.itemCode && !item.itemCode ? "border border-red-500" : ""
                      }`}
                    value={item.itemCode || ""}
                    onChange={(e) =>
                      updateRow(index, "itemCode", e.target.value)
                    }
                    onBlur={() =>
                      setTouched({ ...touched, itemCode: true })
                    }
                  />
                </td>

                {/* Item Description */}
                <td className="border border-gray-300 p-1">
                  <input
                    className={`w-full p-1 outline-none text-left ${touched.itemDesc && !item.itemDesc ? "border border-red-500" : ""
                      }`}
                    value={item.itemDesc || ""}
                    onChange={(e) =>
                      updateRow(index, "itemDesc", e.target.value)
                    }
                    onBlur={() =>
                      setTouched({ ...touched, itemDesc: true })
                    }
                  />
                </td>

                {/* HSN */}
                <td className="border border-gray-300 p-1">
                  <input
                    className={`w-full p-1 outline-none text-center ${touched.hsnCode && !item.hsnCode ? "border border-red-500" : ""
                      }`}
                    value={item.hsnCode || ""}
                    onChange={(e) =>
                      updateRow(index, "hsnCode", e.target.value)
                    }
                    onBlur={() =>
                      setTouched({ ...touched, hsnCode: true })
                    }
                  />
                </td>

                {/* Rate */}
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className={`w-full p-1 outline-none text-right ${touched.rateDp && !item.rateDp ? "border border-red-500" : ""
                      }`}
                    value={item.rateDp || ""}
                    onChange={(e) => updateRow(index, "rateDp", e.target.value)}
                    onBlur={() =>
                      setTouched({ ...touched, rateDp: true })
                    }
                  />
                </td>

                {/* Quantity */}
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className={`w-full p-1 outline-none text-right ${touched.quantity && !item.quantity ? "border border-red-500" : ""
                      }`}
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateRow(index, "quantity", e.target.value)
                    }
                    onBlur={() =>
                      setTouched({ ...touched, quantity: true })
                    }
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
                <td className="relative border border-gray-300 p-2 pr-0">
                  <input
                    className="w-full px-2 py-1 bg-transparent outline-none"
                  />

                  {/* Delete Icon */}
                  <button
                    type="button"
                    onClick={() => deleteRow(index)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 hover:bg-red-100 p-1 rounded-full transition"
                  >
                    <img src={deleteIcon} alt="delete" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  );
}
