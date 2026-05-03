import { MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UserRowActions({ user, onEdit, onDeactivate }) {
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


  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 hover:bg-slate-100 rounded"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-lg w-40 z-50">
          <button
            onClick={() => {
              onEdit(user);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-slate-50"
          >
            Edit
          </button>

          {user.status === "ACTIVE" ? (
            <button
              onClick={() => {
                onDeactivate(user.uuid);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => {
                onDeactivate(user.uuid);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50"
            >
              Activate
            </button>
          )}
        </div>
      )}
    </div>
  );
}