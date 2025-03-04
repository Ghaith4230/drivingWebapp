"use client"; // This ensures the component is treated as a client-side component

import { useState } from "react";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); // State for the status message


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the email and password to the API route for authentication
    const response = await fetch("api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      setStatusMessage("Login successful!");
      redirect("/dashboard"); // Redirect to dashboard
    } else {
      setStatusMessage(result.message); // Display the error message from the server
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-black">
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Set email state
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Set password state
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Display the status message */}
        <div className="mt-4 text-center text-sm">
          {statusMessage && (
            <p className={`font-medium ${statusMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {statusMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
