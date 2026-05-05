import { useState, useEffect } from "react";
import { createUser } from "../api/userService";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";

const token = localStorage.getItem("token");

let defaultCompany = "";
try {
  const payload = JSON.parse(atob(token.split(".")[1]));
  defaultCompany = payload.company || "";
} catch { }

function UserForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    role: "ROLE_MANAGER",
    company: defaultCompany, // 🔥 here ,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let errors = {};

    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.name) errors.name = "Name is required";

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      errors.email = "Invalid email";
    }

    if (!formData.phone) {
      errors.phone = "Phone is required";
    } else if (formData.phone.length < 10) {
      errors.phone = "Invalid phone number";
    }

    if (!formData.company) errors.company = "Company is required";
    if (!formData.role) errors.role = "Role is required";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // clear errors if valid

    try {
      setLoading(true);

      const BASE_URL = "https://dev.starserviceinventory.cloud/api";
      const token = localStorage.getItem("token"); // ✅ ADD THIS
      const res = await fetch(`${BASE_URL}/users/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // ✅ safe usage
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("User created successfully 🎉");

      onSuccess && onSuccess(); // 🔥 trigger parent refresh

      setFormData({
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        role: "ROLE_MANAGER",
        company: "",
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
        password: "", // don’t prefill password
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "ROLE_MANAGER",
        company: user.company || "",
      });
    }
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md border">
      <h2 className="text-xl font-semibold mb-4">Create User</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Username */}
        <div>
          <label className="text-sm text-gray-600">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full border p-2 rounded mt-1 
            ${errors.username ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border p-2 rounded mt-1 
              ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-xs text-blue-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border p-2 rounded mt-1 
    ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="number"
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
            className={`w-full border p-2 rounded mt-1 
    ${errors.company ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.company && (
            <p className="text-red-500 text-xs">{errors.company}</p>
          )}
        </div>

        {/* Role */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="ROLE_MANAGER">Manager</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_CRM">CRM</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}

export default UserForm;
