import { MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ActionMenu = ({ emp,
  openMenuId,
  setOpenMenuId,
  handleEdit,
  handleDelete,
  handleToggleStatus
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 hover:bg-slate-100 rounded"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 bg-white border shadow-lg w-40 z-50">
          <button
            onClick={() => {
              handleEdit(emp);
              setOpenMenuId(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${emp.status === "ACTIVE" ? "text-red-500" : "text-green-600"
              }`}
            onClick={() => {
              handleToggleStatus(emp);
              setOpen(false);
            }}
          >
            {emp.status === "ACTIVE" ? "Deactivate" : "Activate"}
          </button>
        </div>

      )}
    </div>
  )
}

export default ActionMenu;
