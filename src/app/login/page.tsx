"use client";
import { useState } from "react";
import { redirect } from "next/navigation";

import Image from "next/image";
import Link from "next/link"; // Import Link for navigation

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
      redirect("/dashboard");      // Redirect to the profile page after successful login
    } else {
      setStatusMessage(result.message); // Display the error message from the server
    }
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
            <Link href="#our-team" className="hover:underline">
              Our Team
            </Link>
            <Link href="#packages" className="hover:underline">
              Packages
            </Link>
            <Link href="#news" className="hover:underline">
              News
            </Link>
          </div>

          {/* Right Side - Sign In Button */}
          <div className="flex">
            <Link
                href="/login"
                className="bg-transparent border-2 border-white text-white py-2 px-6 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Login Box */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white rounded-lg shadow-md text-black bg-opacity-90">
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
            <Link href="/resPas" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link href="/signup" className="text-blue-600 hover:underline">
              Create account
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            {statusMessage && (
                <p
                    className={`font-medium ${
                        statusMessage.includes("Error") ? "text-red-500" : "text-green-500"
                    }`}
                >
                  {statusMessage}
                </p>
            )}
          </div>
        </div>
      </div>
  );
}
