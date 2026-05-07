const EmployeeModal = ({
  showModal,
  setShowModal,
  form,
  handleChange,
  handleSubmit,
  errors = {},
  showPassword,
  setShowPassword
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* MODAL CONTAINER */}
      <div className="w-full max-w-3xl bg-gray-100 rounded-2xl shadow-2xl p-6 relative border">

        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold mb-6">Create Employee</h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-700">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-700">Phone No.</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
            />
          </div>

          {/* Employee Code */}
          <div>
            <label className="text-sm text-gray-700">Employee Code</label>
            <input
              name="employeeCode"
              value={form.employeeCode}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-700">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1 bg-gray-200"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          {/* Role */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Designation</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
            />
              
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-medium 
            hover:bg-blue-700 transition-all duration-300"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;