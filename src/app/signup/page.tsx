"use client"; // This ensures the component is treated as a client-side component.

import { useState } from "react";
import { getUserByEmail } from "../../db/select";
import { redirect } from "next/navigation";

export default function signupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((await getUserByEmail(email)) !== null) {
      setStatusMessage("Error: Email already exists");
      return;
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, text: "verify email" }),
    });

    if (!response.ok) {
      setStatusMessage("Error encrypting password");
      return;
    }

    try {
      setStatusMessage("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      setStatusMessage("Error creating user. Please try again.");
    }
    redirect('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-black">
        <h2 className="text-2xl font-semibold text-center text-black">Signup</h2>
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
            Signup
          </button>
        </form>

        {/* Display the status message */}
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
