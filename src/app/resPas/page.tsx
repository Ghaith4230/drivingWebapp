"use client";
import { useState } from "react";

export default function ChangePasswordPage() {
    const [email, setEmail] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [showResetFields, setShowResetFields] = useState(false);
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Prevents page reload on form submit

        const response = await fetch("/api/resetEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            setStatusMessage("Error sending reset password email");
            return;
        }

        setStatusMessage("Reset password email sent successfully!");
        setShowResetFields(true);  // Show reset password form after successful email sent
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();  // Prevents page reload on form submit

        const response = await fetch("/api/resetPas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newPassword, token }),
        });

        if (!response.ok) {
            setStatusMessage("Error resetting password");
            return;
        }

        setStatusMessage("Password reset successfully!");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-black">
                <h2 className="text-2xl font-semibold text-center">Reset Password</h2>

                {/* Email Form */}
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    >
                        Send Reset Email
                    </button>
                </form>

                {/* Reset Password Form */}
                {showResetFields && (
                    <form className="mt-4" onSubmit={handleResetPassword}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Token</label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">New Password</label>
                            <input
                                type="password"
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                {/* Status Message */}
                <div className="mt-4 text-center text-sm">
                    {statusMessage && (
                        <p
                            className={`font-medium ${statusMessage.includes("Error") ? "text-red-500" : "text-green-500"}`}
                        >
                            {statusMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
