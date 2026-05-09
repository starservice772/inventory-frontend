import { useEffect, useState } from "react";
import {
<<<<<<< HEAD
  getEmployees,
  createEmployee,
  toggleEmployeeStatus,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
=======
    getEmployees,
    createEmployee,
    toggleEmployeeStatus,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
>>>>>>> 7cb329acc7f827033c17b481556162119887727f
} from "../../api/employeeApi";
import EmployeeModal from "../../components/emp/CreateEmployee";
import ActionMenu from "../../components/emp/EmployeeAction";
import EditEmployeeModal from "./EditEmployee";

import {addValidateForm,editValidateForm} from "./EmployeeValidate";

import toast from "react-hot-toast";

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  // const [searchValue, setSearchValue] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);
  // modal useEffect function
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    phone: "",
    employeeCode: "",
    gender: "MALE",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenCreateModal = () => {
    setForm({
      id: "",
      name: "",
      phone: "",
      employeeCode: "",
      gender: "MALE",
      role: "",
    });

    setSelectedEmployeeId(null); // reset edit mode
    setShowEditModal(false);
    setShowModal(true);
  };

  // getAllEmployees useEffect function
  // useEffect(() => {
  //     loadEmployees(page, searchValue);
  // }, [page, searchValue]);

  // Function to get all employees
  const loadEmployees = async (page, searchText = "") => {
    try {
      let res;
      if (!searchText || searchText.length < 2) {
        // 📄 Normal API
        res = await getEmployees(page);
      } else {
        // 🔍 Call SEARCH API
        res = await searchEmployees(page, searchText);
      }
      setEmployees(res.employees || []);
      setTotalPages(res.totalPages || 0); // ✅ ADD THIS
    } catch (error) {
      console.error("Error in component:", error.message);
      setEmployees([]); // fallback
      setTotalPages(0);
    }
  };

  // search employees useEffect function
  useEffect(() => {
    const delay = setTimeout(() => {
      loadEmployees(page, search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, page]);

  // Function for working of modal submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEmployee(form); // ✅ send actual data

      toast.success("Employee created successfully!!");

      // ✅ close modal
      setShowModal(false);

      // ✅ refresh list
      loadEmployees(page);

      // ✅ reset form AFTER success
      setForm({
        id: "",
        name: "",
        phone: "",
        employeeCode: "",
        gender: "MALE",
        role: "",
      });
    } catch (err) {
      toast.error("Failed to create Employee");
      console.error(err.message);
    }
  };

  // Function for changing employee status
  const handleToggleStatus = async (emp) => {
    try {
      await toggleEmployeeStatus(emp);

      const newStatus = emp.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      // ✅ Update only clicked employee
      setEmployees((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, status: newStatus } : e)),
      );

      // close dropdown
      setOpenMenuId(null);
      toast.success(
        newStatus === "ACTIVE"
          ? "Employee activated successfully"
          : "Employee deactivated successfully",
        {
          icon: newStatus === "ACTIVE" ? "✅" : "⛔",
        },
      );
    } catch (error) {
      console.error("Toggle error:", error.message);
    }
  };

  // Function for update employee details
  const handleEdit = (emp) => {
    setShowEditModal(true);
    setSelectedEmployeeId(emp.id);

    // prefill form
    setForm({
      id: emp.id,
      name: emp.name,
      phone: emp.phone,
      gender: emp.gender,
      role: emp.role,
    });
  };

  // Function for update employee details
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateEmployee(form);

      // 🔥 MUST fetch fresh data from backend
      await loadEmployees(page, search);
      setShowEditModal(false);
      toast.success("Employee updated successfully ✅");
    } catch (error) {
      console.error(error.message);
      toast.error("Update failed ❌");
    }
  };

  // Function to delete an employee
  const handleDelete = (emp) => {
    toast((t) => (
      // delete alert pop up modal
      <div>
        <p className="font-medium">
          Are you sure you want to delete <b>{emp.name}</b>?
        </p>

<<<<<<< HEAD
        <div className="flex gap-2 mt-3">
          {/* YES */}
          <button
            onClick={async () => {
              try {
                await deleteEmployee(emp.id);

                // ✅ RELOAD WITH SEARCH APPLIED
                await loadEmployees(page, search);

                toast.dismiss(t.id);
                toast.success("Employee deleted successfully 🗑️");
              } catch (err) {
                toast.error("Delete failed ❌");
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Yes
          </button>

          {/* NO */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-md border border-gray-300">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 border-b">
          {/* Search */}
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // reset to first page on search
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          {/* New User Button */}
          <button
            onClick={handleOpenCreateModal}
            className="bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600"
          >
            New Employee
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Employee Code</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Company</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {employees.map((emp) => (
                <tr key={emp.id} className="border-t hover:bg-gray-50 relative">
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.phone}</td>
                  <td className="p-3">{emp.employeeCode}</td>
                  <td className="p-3">{emp.gender}</td>
                  <td className="p-3">{emp.company}</td>
                  <td className="p-3">{emp.role}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        emp.status === "ACTIVE"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  {/* Employee Actions */}
                  <td className="relative border border-gray-300 p-2 text-center">
                    {/* Three dots button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === emp.id ? null : emp.id);
                      }}
                      className="text-xl px-2"
                    >
                      ⋮
                    </button>
                    {openMenuId === emp.id && (
                      <ActionMenu
                        emp={emp}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleToggleStatus={handleToggleStatus}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Employee Update Modal */}
          <EditEmployeeModal
            showModal={showEditModal}
            setShowModal={setShowEditModal}
            form={form}
            handleChange={handleChange}
            handleUpdate={handleUpdate}
          />
        </div>

        {/* Create Employee Modal */}
        <EmployeeModal
          key={form.id || "create"}
          showModal={showModal}
          setShowModal={setShowModal}
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />

        {/* Pagination */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="px-4 py-2 border rounded-lg bg-gray-100 
                        hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed 
                        transition"
          >
            Prev
          </button>

          {/* Page Info */}
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            Page {page + 1} / {totalPages || 1}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded-lg bg-gray-100 
                        hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed 
                        transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

=======
    // Function to get all employees
    const loadEmployees = async (page, searchText = "") => {
        try {
            let res;
            if (!searchText || searchText.length < 2) {
                // 📄 Normal API
                res = await getEmployees(page);
            } else {
                // 🔍 Call SEARCH API
                res = await searchEmployees(page, searchText);
            }
            setEmployees(res.employees || []);
            setTotalPages(res.totalPages || 0); // ✅ ADD THIS
        } catch (error) {
            console.error("Error in component:", error.message);
            setEmployees([]); // fallback
            setTotalPages(0);
        }
    };

    // search employees useEffect function
    useEffect(() => {
        const delay = setTimeout(() => {
            loadEmployees(page, search);
        }, 400);

        return () => clearTimeout(delay);
    }, [search, page]);


    // Function for working of adding employee
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔥 VALIDATION
        if (!addValidateForm(form)) return;

        try {
            await createEmployee(form); // ✅ send actual data

            toast.success("Employee created successfully!!");

            // ✅ close modal
            setShowModal(false);

            // ✅ refresh list
            loadEmployees(page);

            // ✅ reset form AFTER success
            setForm({
                id: "",
                name: "",
                phone: "",
                employeeCode: "",
                gender: "MALE",
                role: "",
            });
        } catch (err) {
            toast.error("Failed to create Employee");
            console.error(err.message);
        }
    };

    // Function for changing employee status
    const handleToggleStatus = async (emp) => {
        try {
            await toggleEmployeeStatus(emp);

            const newStatus = emp.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

            // ✅ Update only clicked employee
            setEmployees((prev) =>
                prev.map((e) => (e.id === emp.id ? { ...e, status: newStatus } : e)),
            );

            // close dropdown
            setOpenMenuId(null);
            toast.success(
                newStatus === "ACTIVE"
                    ? "Employee activated successfully"
                    : "Employee deactivated successfully",
                {
                    icon: newStatus === "ACTIVE" ? "✅" : "⛔",
                },
            );
        } catch (error) {
            console.error("Toggle error:", error.message);
        }
    };

    // Function for update employee details
    const handleEdit = (emp) => {
        setShowEditModal(true);
        setSelectedEmployeeId(emp.id);

        // prefill form
        setForm({
            id: emp.id,
            name: emp.name,
            phone: emp.phone,
            gender: emp.gender,
            role: emp.role,
        });
    };

    // Function for update employee details
    const handleUpdate = async (e) => {
        e.preventDefault();

        // 🔥 VALIDATION
        if (!editValidateForm(form)) return;

        try {
            await updateEmployee(form);

            // 🔥 MUST fetch fresh data from backend
            await loadEmployees(page, search);
            setShowEditModal(false);
            toast.success("Employee updated successfully ✅");
        } catch (error) {
            console.error(error.message);
            toast.error("Update failed ❌");
        }
    };

    // Function to delete an employee
    const handleDelete = (emp) => {
        toast((t) => (
            // delete alert pop up modal
            <div>
                <p className="font-medium">
                    Are you sure you want to delete <b>{emp.name}</b>?
                </p>

                <div className="flex gap-2 mt-3">
                    {/* YES */}
                    <button
                        onClick={async () => {
                            try {
                                await deleteEmployee(emp.id);

                                // ✅ RELOAD WITH SEARCH APPLIED
                                await loadEmployees(page, search);

                                toast.dismiss(t.id);
                                toast.success("Employee deleted successfully 🗑️");
                            } catch (err) {
                                toast.error("Delete failed ❌");
                            }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Yes
                    </button>

                    {/* NO */}
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                    >
                        No
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-300">

            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 border-b">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0); // reset to first page on search
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                {/* New User Button */}
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600">
                    New Employee
                </button>
            </div>

            {/* Table */}
            <table className="w-full text-left">

                <thead className="bg-slate-50 text-slate-600">
                    <tr>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Phone</th>
                        <th className="p-4 text-left">Employee Code</th>
                        <th className="p-4 text-left">Gender</th>
                        <th className="p-4 text-left">Company</th>
                        <th className="p-4 text-left">Designation</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{emp.name}</td>
                            <td className="p-3">{emp.phone}</td>
                            <td className="p-3">{emp.employeeCode}</td>
                            <td className="p-3">{emp.gender}</td>
                            <td className="p-3">{emp.company}</td>
                            <td className="p-3">{emp.role}</td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${emp.status === "ACTIVE"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {emp.status}
                                </span>
                            </td>
                            {/* Employee Actions */}
                            <td>

                                {/* Three dots button
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === emp.id ? null : emp.id)
                                            }}
                                            className="text-xl px-2"
                                        >
                                            ⋮
                                        </button> */}
                                {/* Employee Action Modal*/}
                                <ActionMenu
                                    emp={emp}
                                    openMenuId={openMenuId}
                                    setOpenMenuId={setOpenMenuId}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    handleToggleStatus={handleToggleStatus}
                                />

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Employee Update Modal */}
            <EditEmployeeModal
                showModal={showEditModal}
                setShowModal={setShowEditModal}
                form={form}
                handleChange={handleChange}
                handleUpdate={handleUpdate}
            />

            {/* Create Employee Modal */}
            <EmployeeModal
                key={form.id || "create"}
                showModal={showModal}
                setShowModal={setShowModal}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                onClose={() => setShowModal(false)}
            />

            {/* Pagination */}
            <div className="flex justify-end gap-3 p-4 border-t">

                <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    className="px-4 py-2 border rounded-lg bg-gray-100 
                        hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed 
                        transition"
                >
                    Prev
                </button>

                {/* Page Info */}
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {page + 1} / {totalPages || 1}
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg bg-gray-100 
                        hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed 
                        transition"
                >
                    Next
                </button>

            </div>
        </div>

    );
};

>>>>>>> 7cb329acc7f827033c17b481556162119887727f
export default EmployeePage;
