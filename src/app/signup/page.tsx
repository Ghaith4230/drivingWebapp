"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, inviteCode, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Showcase statusMessage
        setStatusMessage(data.message || "Signup failed");
        return;
      }

      setStatusMessage("Signup successful! Redirecting…");
      // Sleep momentarily then redirect
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      console.error("Signup error:", err);
      setStatusMessage("Unexpected error. Please try again.");
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Invite Code (faculty only)
              </label>
              <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Sign Up
            </button>
          </form>

          {statusMessage && (
              <p
                  className={`mt-4 text-center ${
                      statusMessage.startsWith("Error")
                          ? "text-red-500"
                          : "text-green-600"
                  }`}
              >
                {statusMessage}
              </p>
          )}
        </div>
      </div>
  );
}
