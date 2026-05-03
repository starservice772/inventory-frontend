import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const BASE_URL = "https://dev.starserviceinventory.cloud/api";

function EditUserForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  if (!user) return null; // 🔐 safety

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md border">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <label className="text-sm text-gray-600">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm text-gray-600">Email</label>
        <input
          name="email" value={formData.email} onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {/* Phone */}
        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            name="phone" value={formData.phone} onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

      <button disabled={loading} className="md:col-span-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
    </div>
  );
}

export default EditUserForm;
