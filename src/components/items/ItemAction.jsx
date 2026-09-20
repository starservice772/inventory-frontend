import { MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ActionMenu = ({
  item, // this will be the item object
  handleEdit,
  handleDelete,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
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
      {/* Three Dots Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-2 hover:bg-slate-100 rounded"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 bg-white border shadow-lg w-40 z-50">
          {/* Edit */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-slate-50"
          >
            Edit
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;