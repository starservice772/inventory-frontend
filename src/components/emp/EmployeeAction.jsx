const ActionMenu = ({
  emp,
  openMenuId,
  setOpenMenuId,
  handleEdit,
  handleDelete,
  handleToggleStatus,
}) => {
  if (openMenuId !== emp.id) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50"
    >
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() =>{ 
            handleEdit(emp);
            setOpenMenuId(null);
        }}
      >
        Edit
      </button>

      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
        onClick={() => {
            handleDelete(emp);
            setOpenMenuId(null);
        }}
      >
        Delete
      </button>

      <button
        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
          emp.status === "ACTIVE" ? "text-red-500" : "text-green-600"
        }`}
        onClick={() => {
            handleToggleStatus(emp);
            setOpenMenuId(null);
        }}
      >
        {emp.status === "ACTIVE" ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
};

export default ActionMenu;