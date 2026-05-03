import { useState, useEffect } from "react";
import { createUser } from "../api/userService";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";

const token = localStorage.getItem("token");

let defaultCompany = "";
try {
  const payload = JSON.parse(atob(token.split(".")[1]));
  defaultCompany = payload.company || "";
} catch {}

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.username) return "Username is required";
    if (!formData.password) return "Password is required";
    if (!formData.email.includes("@")) return "Invalid email";
    if (formData.phone.length < 10) return "Invalid phone number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);

  //     const token = localStorage.getItem("token");

  //     const url = user ? `${BASE_URL}/users/update` : `${BASE_URL}/users/save`;

  //     const method = "POST";

  //     const body = user
  //       ? {
  //           id: user.uuid, // 🔥 important
  //           name: formData.name,
  //           email: formData.email,
  //           phone: formData.phone,
  //         }
  //       : formData;

  //     const res = await fetch(url, {
  //       method,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(body),
  //     });

  //     if (!res.ok) throw new Error();

  //     toast.success(user ? "User updated ✅" : "User created ✅");

  //     onSuccess && onSuccess();
  //   } catch {
  //     toast.error("Operation failed ❌");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500"
          />
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
              className="w-full border p-2 rounded mt-1"
            />
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
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="number"
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Company */}
        <div>
          <label className="text-sm text-gray-600">Company</label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
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
