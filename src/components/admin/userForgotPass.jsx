import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword } from "../../api/forgotPassApi";
import { Eye, EyeOff } from "lucide-react";

function PasswordField({
    label,
    name,
    show,
    toggleShow,
    type = "password",
    formData,
    errors,
    onChange,
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
                {label}
            </label>

            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={formData[name]}
                    onChange={onChange}
                    className={`w-full border px-3 py-2 pr-10 rounded-lg text-sm outline-none transition focus:ring-2 ${errors[name]
                            ? "border-red-400 focus:ring-red-200 bg-red-50"
                            : "border-gray-300 focus:ring-blue-200"
                        }`}
                />

                <button
                    type="button"
                    onClick={toggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {errors[name] && (
                <p className="text-red-500 text-xs mt-1">
                    ⚠ {errors[name]}
                </p>
            )}
        </div>
    );
}

export default function ForgotPasswordForm({ user, onSuccess }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                password: "",
                confirmPassword: "",
            });

            setErrors({});
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validate = () => {
        const err = {};

        if (!formData.password.trim()) {
            err.password = "Password is required.";
        } else if (formData.password.length < 6) {
            err.password = "Password must be at least 6 characters.";
        }

        if (!formData.confirmPassword.trim()) {
            err.confirmPassword = "Confirm password is required.";
        } else if (formData.password !== formData.confirmPassword) {
            err.confirmPassword = "Passwords do not match.";
        }

        return err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validate();

        if (Object.keys(validation).length) {
            setErrors(validation);
            return;
        }

        try {
            setLoading(true);

            const res = await forgotPassword({
                id: user.uuid,
                username: user.username,
                password: formData.password,
            });

            toast.success(res.message || "Password changed successfully");

            onSuccess && onSuccess();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Password change failed"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md border">

            {/* <h2 className="text-xl font-semibold mb-5 text-gray-800">
        Forgot Password
      </h2> */}

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >

                {/* Username */}

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Username
                    </label>

                    <input
                        value={formData.username}
                        readOnly
                        className="w-full border border-gray-300 bg-gray-100 px-3 py-2 rounded-lg text-sm"
                    />
                </div>

                <PasswordField
                    label="Password"
                    name="password"
                    show={showPassword}
                    toggleShow={() => setShowPassword((prev) => !prev)}
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                />

                <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    show={showConfirmPassword}
                    toggleShow={() => setShowConfirmPassword((prev) => !prev)}
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium text-sm"
                >
                    {loading ? "Saving..." : "Save"}
                </button>

            </form>

        </div>
    );
}