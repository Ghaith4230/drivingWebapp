"use client"; // This ensures the component is treated as a client-side component

import { useState } from "react";
import { redirect } from "next/navigation";
import { getProfileByUserId, getUserByEmail } from "@/db/select";

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
      const user = await getUserByEmail(email);

      if (await getProfileByUserId(user.id) == null) {
        redirect("/info");
      } else {
        redirect("dashboard");
      }
    } else {
      setStatusMessage(result.message); // Display the error message from the server
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-black">
        <h2 className="text-2xl font-semibold text-center text-black">Login</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Set email state
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Set password state
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        {/* Display the status message */}
        <div className="mt-4 text-center text-sm">
          <a
            href="#"
            className="text-blue-600 hover:underline"
            onClick={() => redirect('/resPas')}
          >
            Forgot password?
          </a>
        </div>
        <div className="mt-4 text-center text-sm">
          <a
            href="#"
            className="text-blue-600 hover:underline"
            onClick={() => redirect('/signup')}
          >
            Create account
          </a>
        </div>
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
