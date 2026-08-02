import { useState } from "react";
import { transferDefectiveToCompany } from "../../api/defectiveApi";
import toast from "react-hot-toast";

export default function ReturnDefectiveModal({
  open,
  item,
  onClose,
  onSuccess,
}) {
  const [qty, setQty] = useState("");

  if (!open || !item) return null;

  const handleReturn = async () => {
    const payload = {
      items: [],
    };

    for (const item of items) {
      const selected = selectedItems[item.uuid];

      if (selected?.checked) {
        if (!selected.qty) {
          toast.error(`Enter quantity for ${item.itemCode}`);

          return;
        }

        if (Number(selected.qty) > Number(item.quantity)) {
          toast.error(`Quantity exceeds stock for ${item.itemCode}`);

          return;
        }

        payload.items.push({
          itemCode: item.itemCode,

          itemDesc: item.itemDesc,

          quantity: selected.qty,
        });
      }
    }

    if (payload.items.length === 0) {
      toast.error("Please select at least one item");

      return;
    }

    try {
      await transferDefectiveToCompany(payload);

      toast.success("Stock returned successfully");

      refreshItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[600px]">
        <div className="border-b p-5 flex justify-between">
          <h2 className="text-2xl font-bold">Return Defective Stock</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="font-semibold">Item Code</label>

            <input
              value={item.itemCode}
              readOnly
              className="border rounded-lg w-full p-3 mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold">Description</label>

            <textarea
              readOnly
              value={item.itemDesc}
              className="border rounded-lg w-full p-3 mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold">Available Defective Qty</label>

            <input
              readOnly
              value={item.quantity}
              className="border rounded-lg w-full p-3 mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold">Return Quantity</label>

            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border rounded-lg w-full p-3 mt-1"
            />
          </div>

          <button
            onClick={handleReturn}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Return To Company
          </button>
        </div>
      </div>
    </div>
  );
}
