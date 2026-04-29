import { useState } from "react";
import { savePurchase } from "../../api/purchaseApi";
import toast from "react-hot-toast";

export default function PurchasesPage() {
  // ✅ Separate form state (header)
  const [form, setForm] = useState({
    companyName: "",
    gstNo: "",
    invoiceNo: "",
    invoiceDate: "",
    invoiceType: "Select Type", //default
    gstPercentage: "",
  });

  // ✅ Items state (table)
  const [items, setItems] = useState([
    { itemCode: "", itemDesc: "", hsnCode: "", rateDp: "", quantity: "", gstValue: "", totalDp: "", totalPrice: "" },
  ]);

  // ✅ Add new row
  const addRow = () => {
    setItems([
      ...items,
      { itemCode: "", itemDesc: "", hsnCode: "", rateDp: "", quantity: "", gstValue: "", totalDp: "", totalPrice: "" },
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
      const gstValue = rate * gstPercent;
      const totalDp = rate + gstValue;
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

  // ✅ Save API call
  const handleSave = async () => {
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
        companyName: "", gstNo: "",
        invoiceNo: "",
        invoiceDate: "",
        invoiceType: "",
        gstPercentage: "",
      });
      setItems([
        { itemCode: "", itemDesc: "", hsnCode: "", rateDp: "", quantity: "", gstValue: "", totalDp: "", totalPrice: "" },
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Error saving purchase");
    }
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
          <label className="text-sm font-medium">Company</label>
          <input
            className="border border-gray-300 p-2 w-full"
            value={form.companyName}
            onChange={(e) =>
              setForm({ ...form, companyName: e.target.value })
            }
          />
        </div>

        {/* GST No */}
        <div>
          <label className="text-sm font-medium">GST No</label>
          <input
            className="border border-gray-300 p-2 w-full"
            value={form.gstNo}
            onChange={(e) =>
              setForm({ ...form, gstNo: e.target.value })
            }
          />
        </div>

        {/* Invoice Type */}
        <div>
          <label className="text-sm font-medium">Type</label>
          <select
            className="border border-gray-300 p-2 w-full"
            value={form.invoiceType}
            onChange={(e) =>
              setForm({ ...form, invoiceType: e.target.value })
            }
          >
            <option value="">Select Type</option>
            <option value="I">Invoice</option>
            <option value="C">Challan</option>
          </select>
        </div>

        {/* Invoice No */}
        <div>
          <label className="text-sm font-medium">Invoice No</label>
          <input
            className="border border-gray-300 p-2 w-full"
            value={form.invoiceNo}
            onChange={(e) =>
              setForm({ ...form, invoiceNo: e.target.value })
            }
          />
        </div>

        {/* Invoice Date */}
        <div>
          <label className="text-sm font-medium">Invoice Date</label>
          <input
            type="date"
            className="border border-gray-300 p-2 w-full"
            value={form.invoiceDate}
            onChange={(e) =>
              setForm({ ...form, invoiceDate: e.target.value })
            }
          />
        </div>

        {/* GST % */}
        <div>
          <label className="text-sm font-medium">GST (in %)</label>
          <input
            className="border border-gray-300 p-2 w-full"
            value={form.gstPercentage}
            onChange={(e) =>
              setForm({ ...form, gstPercentage: e.target.value })
            }
          />
        </div>

        

      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto border border-gray-300">
        <table className="min-w-full text-sm border-collapse">
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
              ].map((head) => (
                <th key={head} className="border border-gray-300 p-2 text-left font-semibold">
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
                    className="w-full p-1 outline-none"
                    value={item.itemCode || ""}
                    onChange={(e) =>
                      updateRow(index, "itemCode", e.target.value)
                    }
                  />
                </td>

                {/* Item Description */}
                <td className="border border-gray-300 p-1">
                  <input
                    className="w-full p-1 outline-none"
                    value={item.itemDesc || ""}
                    onChange={(e) =>
                      updateRow(index, "itemDesc", e.target.value)
                    }
                  />
                </td>

                {/* HSN */}
                <td className="border border-gray-300 p-1">
                  <input
                    className="w-full p-1 outline-none"
                    value={item.hsnCode || ""}
                    onChange={(e) =>
                      updateRow(index, "hsnCode", e.target.value)
                    }
                  />
                </td>

                {/* Rate */}
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className="w-full p-1 outline-none"
                    value={item.rateDp || ""}
                    onChange={(e) =>
                      updateRow(index, "rateDp", e.target.value)
                    }
                  />
                </td>

                {/* Quantity */}
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className="w-full p-1 outline-none"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateRow(index, "quantity", e.target.value)
                    }
                  />
                </td>

                {/* GST Value (auto) */}
                <td className="border border-gray-300 p-1">
                  <input
                    className="w-full p-1 outline-none"
                    value={item.gstValue || 0}
                    readOnly
                  />
                </td>

                {/* Total DP */}
                <td className="border border-gray-300 p-1">
                  <input
                    className="w-full p-1 outline-none"
                    value={item.totalDp || 0}
                    readOnly
                  />
                </td>

                {/* Total Price */}
                <td className="border border-gray-300 p-1">
                  <input
                    className="w-full p-1 outline-none"
                    value={item.totalPrice || 0}
                    readOnly
                  />
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Buttons */}
      <div className="flex gap-3">
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
