import { useState, useEffect } from "react";
<<<<<<< HEAD
// import { createUser } from "../api/userService";
=======
>>>>>>> 0cef0b7b099cff8bca1cd6ad897aa2686233eae2
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const BASE_URL = "https://dev.starserviceinventory.cloud/api";

const getDefaultCompany = () => {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.company || "";
  } catch {
    return "";
  }
};

// ✅ Defined OUTSIDE — React sees this as a stable component, no remount on each keystroke
function Field({ label, name, type = "text", disabled = false, formData, errors, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={formData[name]}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border px-3 py-2 rounded-lg text-sm outline-none transition focus:ring-2 ${
          errors[name]
            ? "border-red-400 focus:ring-red-200 bg-red-50"
            : "border-gray-300 focus:ring-blue-200"
        } ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">⚠ {errors[name]}</p>
      )}
    </div>
  );
}

function UserForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    role: "ROLE_MANAGER",
    company: getDefaultCompany(),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

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

    // ── Username ───────────────────────────────────────────────────
    if (!formData.username.trim()) {
      errs.username = "Username is required.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errs.username = "Username can only contain letters, numbers, and underscores.";
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      errs.username = "Username must be between 3 and 20 characters.";
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

    // ── Password ───────────────────────────────────────────────────
    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      errs.password = "Password must include at least one uppercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
      errs.password = "Password must include at least one number.";
    } else if (!/[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(formData.password)) {
      errs.password = "Password must include at least one special character.";
    }

    // ── Company ────────────────────────────────────────────────────
    if (!formData.company.trim()) errs.company = "Company is required.";

    // ── Role ───────────────────────────────────────────────────────
    if (!formData.role) errs.role = "Role is required.";

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

      const res = await fetch(`${BASE_URL}/users/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("User created successfully 🎉");
      onSuccess && onSuccess();

      setFormData({
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        role: "ROLE_MANAGER",
        company: getDefaultCompany(),
      });
    } catch (err) {
      toast.error("Failed to create user ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        password: "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "ROLE_MANAGER",
        company: user.company || "",
      });
    }
  }, [user]);

  // Shared props passed down to every Field
  const fieldProps = { formData, errors, onChange: handleChange };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md border">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">Create User</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>

        <Field label="Full Name"     name="name"     {...fieldProps} />
        <Field label="Username"      name="username" {...fieldProps} />
        <Field label="Email Address" name="email"    type="email" {...fieldProps} />
        <Field label="Phone Number"  name="phone"    type="tel"   {...fieldProps} />
        <Field label="Company"       name="company"  disabled     {...fieldProps} />

        {/* Password — custom because of show/hide toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border px-3 py-2 pr-14 rounded-lg text-sm outline-none transition focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:ring-red-200 bg-red-50"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 font-medium"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">⚠ {errors.password}</p>
          )}
        </div>

<<<<<<< HEAD
        {/* Phone */}
        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            
            className={`w-full border p-2 rounded mt-1 
    ${errors.phone ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="text-sm text-gray-600">Company</label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled
            className={`w-full border p-2 rounded mt-1 
    ${errors.company ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.company && (
            <p className="text-red-500 text-xs">{errors.company}</p>
          )}
        </div>

        {/* Role */}
=======
        {/* Role — full width */}
>>>>>>> 0cef0b7b099cff8bca1cd6ad897aa2686233eae2
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-lg text-sm outline-none transition focus:ring-2 ${
              errors.role
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
          >
            <option value="ROLE_MANAGER">Manager</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_CRM">CRM</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">⚠ {errors.role}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium text-sm"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}

export default UserForm;
