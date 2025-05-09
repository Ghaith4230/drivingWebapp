"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getProfileByUserId } from "@/db/select";
import BackgroundLayout from "../components/BackgroundLayout";
import Link from "next/link";

export default function Profile() {
  const [profileData, setProfileData] = useState<any>(null);
  const router = useRouter();
  const [bookedLessons, setBookedLessons] = useState<TimeSlot[]>([]);

  type TimeSlot = {
    date: string;
    time: string;
    endTime: string;
    location: string;
    content: string;
    bookedBy: string;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("api/userId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      });

      const result = await response.json();
      const profile = await getProfileByUserId(result.message);
      setProfileData(profile);

      const lessons = await fetchBookedLessons(result.message);
      setBookedLessons(lessons);
    };

    fetchProfile();
  }, []);

  const fetchBookedLessons = async (userId: string) => {
    const response = await fetch("/api/bookedLessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  };

  const handleDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    redirect("/dashboard");
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/deletesession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    redirect("/login");
  };

  return (
      <BackgroundLayout>
        <div
            className="relative min-h-screen w-full px-6 md:px-20 lg:px-32 py-10 text-white"
            onClick={() => {}}
        >
          {/* Top Navigation Bar */}
          <div className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-10">
            <div className="flex gap-8 text-white">
              <Link href="/#our-team" className="hover:underline">
                Our Team
              </Link>
              <Link href="/#packages" className="hover:underline">
                Packages
              </Link>
              <Link href="/#news" className="hover:underline">
                News
              </Link>
            </div>

            <div className="flex gap-8 text-white">
              <button onClick={handleDashboard} className="hover:underline">
                Dashboard
              </button>
              <button className="hover:underline">
                <Link href="/#settings">Settings</Link>
              </button>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </div>
          </div>

          {/* Adjusted margin to lower the "Welcome" text */}
          <h1 className="text-3xl font-bold text-center mb-12 mt-16">Welcome to Your Profile</h1>

          {/* Adjusted margin for the profile box */}
          <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-2xl mx-auto mb-12">
            <div className="flex items-center space-x-6 mb-8">
              <Image
                  src={profileData?.profileImage || "/default-avatar.svg"}
                  alt="Profile Logo"
                  width={100}
                  height={100}
                  className="rounded-full"
              />
              <div>
                <p className="text-2xl font-semibold">
                  {profileData?.firstName || "Loading..."} {profileData?.lastName || ""}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p><strong>Email:</strong> {profileData?.email || "Loading..."}</p>
              <p><strong>Phone Number:</strong> {profileData?.phoneNumber || "Loading..."}</p>
              <p><strong>Address:</strong> {profileData?.address || "Loading..."}</p>
              <p><strong>Country:</strong> {profileData?.country || "Loading..."}</p>
              <p><strong>Zip Code:</strong> {profileData?.zipCode || "Loading..."}</p>
              <p><strong>Gender:</strong> {profileData?.gender || "Loading..."}</p>
            </div>

            {/* Back button */}
            <div className="flex justify-end mt-6">
              <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition flex items-center"
              >
                <span className="mr-2">←</span> Back
              </button>
            </div>
          </div>

          {/* Adjusted margin for booked lessons */}
          <h2 className="text-2xl font-bold text-center mt-12">Your Booked Lessons</h2>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {bookedLessons.length > 0 ? (
                bookedLessons.map((lesson, index) => (
                    <div key={index} className="bg-white text-black p-4 rounded-lg shadow-md w-64">
                      <h3 className="text-lg font-semibold mb-2">{lesson.content}</h3>
                      <p><strong>Date:</strong> {lesson.date}</p>
                      <p><strong>Time:</strong> {lesson.time} - {lesson.endTime}</p>
                      <p><strong>Location:</strong> {lesson.location}</p>
                    </div>
                ))
            ) : (
                <p className="text-center">You have no lessons booked.</p>
            )}
          </div>
        </div>
      </BackgroundLayout>
  );
}
