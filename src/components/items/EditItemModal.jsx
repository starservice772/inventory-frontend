import { X } from "lucide-react";

export default function EditItemModal({
    showModal,
    setShowModal,
    form,
    handleChange,
    handleUpdate,
}) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative">
                {/* Close Button */}
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                >
                    <X size={28} />
                </button>

                {/* Header */}
                <div className="p-6 border-b">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Edit Item
                    </h2>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleUpdate}
                    className="p-6 space-y-5"
                >
                    {/* Item Code (Read Only) */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Item Code
                        </label>
                        <input
                            name="itemCode"
                            value={form.itemCode}
                            readOnly
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    {/* Item Description (Editable) */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Item Description
                        </label>
                        <input
                            name="itemDescription"
                            value={form.itemDescription}
                            onChange={handleChange}
                            placeholder="Enter item description"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg
                       text-lg font-medium hover:bg-blue-700
                       transition-all duration-300"
                    >
                        Update Item
                    </button>
                </form>
            </div>
        </div>
    );
}