const EmployeeModal = ({
  showModal,
  setShowModal,
  form,
  handleChange,
  handleSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg animate-slideDown">

        <h2 className="text-lg font-semibold mb-4">Add Employee</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            name="employeeCode"
            placeholder="Employee Code"
            value={form.employeeCode}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
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
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
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
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;