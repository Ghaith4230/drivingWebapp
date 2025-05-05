"use client";
import { useState } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation

export default function ChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [showResetFields, setShowResetFields] = useState(false);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submit

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
    setShowResetFields(true); // Show reset password form after successful email sent
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submit

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
    redirect('/login')
  };

  return (
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
              src="/car.jpeg"
              alt="Background Image"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
          />
          {/* Background blur effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
        </div>

        {/* Top Section */}
        <div className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-10">
          {/* Left Side - Navigation Links */}
          <div className="flex gap-8 text-white">
            <Link href="#our-team" className="hover:underline">Our Team</Link>
            <Link href="#packages" className="hover:underline">Packages</Link>
            <Link href="#news" className="hover:underline">News</Link>
          </div>

          {/* Right Side - Sign In Button */}
          <div className="flex">
            <Link href="/login" className="bg-transparent border-2 border-white text-white py-2 px-6 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition duration-300">
              Sign In
            </Link>
          </div>
        </div>

        {/* Reset Password Box */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white rounded-lg shadow-md text-black bg-opacity-90">
          <h2 className="text-2xl font-semibold text-center text-black">Reset Password</h2>

          {/* Email Form */}
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Email</label>
              <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
            >
              Send Reset Email
            </button>
          </form>

          {/* Reset Password Form */}
          {showResetFields && (
              <form className="mt-4" onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black">Token</label>
                  <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black">New Password</label>
                  <input
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
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
