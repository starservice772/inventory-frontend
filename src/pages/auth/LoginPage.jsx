import { useState } from "react";
import { useNavigate } from "react-router-dom";
import comlogo from "../../assets/comlogo3.png";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import loginUser from "../../api/loginApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    company: "GODREJ",
  });

  const loginValidate = (form) => {
    let newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = true;
    }

    if (!form.password.trim()) {
      newErrors.password = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
      return false;
    }

    return true;
  }

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginValidate(form)) return;

    try {
      const data = await loginUser(form);
      // 🔴 BLOCK INACTIVE USER (extra safety)
      // if (data.status && data.status !== "ACTIVE") {
      //   toast.error("Your account is deactivated");
      //   return;
      // }

      const expiryTime = Date.now() + 12 * 60 * 60 * 1000; // 12 hours

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("expiry", expiryTime.toString()); // ✅ store expiry

      navigate("/dashboard");

    } catch (err) {
      console.error(err.message);
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={comlogo}
            alt="Logo"
            className="h-20 w-auto"
          />
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">
            Login to Star Service Inventory
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Company selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-blue-500 transition duration-200"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}>

              <option value="GODREJ">Godrej</option>
              <option value="AOSMITH">AO Smith</option>
            </select>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className={`w-full px-4 py-2 rounded-lg border mt-1
              focus:outline-none focus:ring-2 transition duration-200
              ${errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              value={form.username}
              onChange={(e) => {
                setForm({ ...form, username: e.target.value })
                setErrors((prev) => ({
                  ...prev,
                  username: false,
                }));
              }}
            />
          </div>

          {/* Passwor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 rounded-lg border
                focus:outline-none focus:ring-2 transition duration-200
                ${errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value })
                  setErrors((prev) => ({
                    ...prev,
                    password: false,
                  }));
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 
              text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex justify-end text-sm">
            {/* <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-blue-600" />
              Remember me
            </label> */}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold 
            hover:bg-blue-700 shadow-md hover:shadow-lg transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}