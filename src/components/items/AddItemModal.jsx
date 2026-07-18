import { X } from "lucide-react";

export default function AddItemModal({
    showModal,
    setShowModal,
    form,
    handleChange,
    handleSubmit,
}) {
    if (!showModal) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        // onClick={() => setShowModal(false)}
        >
            {/* Modal Card */}
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                >
                    <X size={28} />
                </button>
                {/* Header */}
                <div className="p-6 border-b">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Add Item
                    </h2>
                </div>


                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5"
                >
                    {/* Item Code */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Item Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="itemCode"
                            value={form.itemCode}
                            onChange={handleChange}
                            placeholder="Enter item code"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-600"
                            required
                        />
                    </div>

                    {/* HSN Code */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            HSN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="hsnCode"
                            value={form.hsnCode}
                            onChange={handleChange}
                            placeholder="Enter HSN code"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-600"
                            required
                        />
                    </div>

                    {/* Item Description */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Item Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="itemDescription"
                            rows={5}
                            value={form.itemDescription}
                            onChange={handleChange}
                            placeholder="Enter item description"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-600"
                            required
                        />
                    </div>

                    {/* Submit Buttons */}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg
                       text-lg font-medium hover:bg-blue-700
                       transition-all duration-300"
                    >
                        Save Item
                    </button>
                </form>
            </div>
        </div>

    );
}