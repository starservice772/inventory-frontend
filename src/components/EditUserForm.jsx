import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const BASE_URL = "https://dev.starserviceinventory.cloud/api";

// ✅ Defined OUTSIDE — stable component reference, no remount on keystroke
function Field({ label, name, type = "text", formData, errors, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={formData[name]}
        onChange={onChange}
        className={`w-full border px-3 py-2 rounded-lg text-sm outline-none transition focus:ring-2 ${
          errors[name]
            ? "border-red-400 focus:ring-red-200 bg-red-50"
            : "border-gray-300 focus:ring-blue-200"
        }`}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">⚠ {errors[name]}</p>
      )}
    </div>
  );
}

function EditUserForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setErrors({});
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};

    // ── Name ───────────────────────────────────────────────────────
    if (!formData.name.trim()) {
      errs.name = "Full name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      errs.name = "Name must contain letters only (no numbers or symbols).";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    // ── Email ──────────────────────────────────────────────────────
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Enter a valid email address (e.g. user@example.com).";
    }

    // ── Phone ──────────────────────────────────────────────────────
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errs.phone = "Phone number must be exactly 10 digits.";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/users/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.uuid,
          ...formData,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("User updated ✅");
      onSuccess && onSuccess();
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const fieldProps = { formData, errors, onChange: handleChange };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md border">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">Edit User</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>

        <Field label="Full Name"     name="name"  {...fieldProps} />
        <Field label="Email Address" name="email" type="email" {...fieldProps} />

        {/* Phone — full width */}
        <div className="md:col-span-2">
          <Field label="Phone Number" name="phone" type="tel" {...fieldProps} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium text-sm"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditUserForm;
