import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "Administration",
    company: "Godrej",
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-slate-500 mb-6">Login to Star Service Inventory</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full border rounded-xl p-3"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Administration</option>
            <option>Company User</option>
          </select>

          <select
            className="w-full border rounded-xl p-3"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          >
            <option>Godrej</option>
            <option>AO Smith</option>
          </select>

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            className="w-full border rounded-xl p-3"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}