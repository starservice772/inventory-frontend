import { MoreHorizontal, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { forgotPassword } from "../../api/forgotPassApi";
import ForgotPasswordForm from "./userForgotPass";
import toast from "react-hot-toast";

export default function UserRowActions({ user, onEdit, onDeactivate, onToggleStatus }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // FORGOT PASSWORD USE STATE
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    id: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

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


  const handlePasswordReset = async () => {
    if (!passwordForm.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (!passwordForm.confirmPassword.trim()) {
      toast.error("Confirm Password is required");
      return;
    }

    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = {
        id: passwordForm.id,
        username: passwordForm.username,
        password: passwordForm.password,
      };

      const res = await forgotPassword(payload);

      toast.success(res.message || "Password changed successfully");

      setShowPasswordModal(false);

      setPasswordForm({
        id: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to change password"
      );
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 hover:bg-slate-100 rounded"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border shadow-lg w-40 z-50">
          <button
            onClick={() => {
              if (user.status !== "ACTIVE") return;
              onEdit(user);
              setOpen(false);
            }}
            disabled={user.status !== "ACTIVE"}
            title={user.status !== "ACTIVE" ? "Cannot edit an inactive user" : ""}
            className={`w-full text-left px-4 py-2 transition ${user.status !== "ACTIVE"
              ? "text-gray-400 cursor-not-allowed bg-gray-50"
              : "hover:bg-slate-50 text-gray-700"
              }`}
          >
            Edit
          </button>

          {/* Forgot Pass Btn */}
          <button
            className="w-full text-left px-4 py-2 transition hover:bg-slate-50 text-gray-700"
            onClick={() => {
              setSelectedUser(user);     // current user
              setShowForgotPassword(true);
            }}
          >
            Forgot Password
          </button>

          {user.status === "ACTIVE" ? (
            <button
              onClick={() => {
                onToggleStatus(user);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => {
                onToggleStatus(user);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50"
            >
              Activate
            </button>
          )}
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Forgot Password
        </h2>

        <button
          onClick={() => setShowForgotPassword(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-100 hover:text-red-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        <ForgotPasswordForm
          user={selectedUser}
          onSuccess={() => setShowForgotPassword(false)}
        />
      </div>

    </div>
  </div>
)}
    </div>
  );
}
