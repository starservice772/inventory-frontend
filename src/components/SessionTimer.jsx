import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SessionTimer() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const expiry = localStorage.getItem("expiry");

            if (!expiry) return;

            const remaining = expiry - Date.now();

            if (remaining <= 0) {
                // 🔴 Auto logout
                localStorage.clear();
                navigate("/login");
                return;
            }
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-lg">
            ⏳ <span className="text-red-500 font-semibold">{timeLeft}</span>
        </div>
    );
}