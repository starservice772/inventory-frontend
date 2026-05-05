const EditEmployeeModal = ({
    showModal,
    setShowModal,
    form,
    handleChange,
    handleUpdate,
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg animate-slideDown">

                <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>

                <form onSubmit={handleUpdate} className="space-y-3">

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>

                    <input
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                        readOnly
                    />

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                        >
                            Update
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditEmployeeModal;