"use client"; // This ensures the component is treated as a client-side component.

import { useState } from "react";
import { getUserByEmail } from "../../db/queries/select";
import {createUser} from "../../db/queries/insert"
export default function signupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if ((await getUserByEmail(email)).length >= 1) {
      setStatusMessage("Error: Email already exists");
      return;
    }

    // Encrypt the password
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setStatusMessage("Error encrypting password");
      return;
    }

    const data = await response.json();

  
    const encryptedPassword = data.encryptedPassword;

   
    try {
      const userData = {
        id: Math.floor(Math.random() * 9000), 
        email: email,
        password: encryptedPassword, 
      };

      createUser(userData)
      setStatusMessage("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      setStatusMessage("Error creating user. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-black">
        <h2 className="text-2xl font-semibold text-center">Signup</h2>
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
