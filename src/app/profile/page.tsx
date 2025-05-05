"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles";
import Image from "next/image";
import { getProfileByUserId } from "@/db/select";
import { set } from "date-fns";
import { get } from "http";

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
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
    completed: boolean;
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

      console.log(result.message); 

      const profile = await getProfileByUserId(result.message)

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
    return await response.json(); // expecting: { lessons: [...] }
  };

 

  const handleDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    redirect("/dashboard");
  };

  const handleLogout = async (e: React.FormEvent) => {
     e.preventDefault();
        const response = await fetch("/api/deletesession", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        redirect("/login");
   
  };

  return (
    <div onClick={() => { if (menuOpen) setMenuOpen(false); }} style={styles.container}>
      <div style={styles.menuContainer}>
        <div style={styles.logo} onClick={() => setMenuOpen(!menuOpen)}>⚪</div>
        {menuOpen && (
          <div style={styles.dropdownMenu}>
            <button onClick={handleDashboard} style={styles.menuItem}>Dashboard</button>
            <button style={styles.menuItem}>Settings</button>
            <button onClick={handleLogout} style={styles.menuItem}>Logout</button>
          </div>
        )}
      </div>
      
      <h1 style={styles.heading}>Welcome to Your Profile</h1>
    

      <div style={styles.profileInfo}>
  <div style={styles.profileImageWrapper}>
    <Image 
      src={profileData?.profileImage || "/default-avatar.svg"} 
      alt="Profile Logo"
      width={100}
      height={100}
      style={styles.profileLogo}
    />
  </div>

  <div style={styles.nameRow}>
    <p style={styles.name}><strong>{profileData?.firstName || "Loading..."}</strong></p>
    <p style={styles.name}><strong>{profileData?.lastName || "Loading..."}</strong></p>
  </div>

  <p><strong>Email:</strong> {profileData?.email || "Loading..."}</p>
  <p><strong>Phone Number:</strong> {profileData?.phoneNumber || "Loading..."}</p>
  <p><strong>Address:</strong> {profileData?.address || "Loading..."}</p>
  <p><strong>Country:</strong> {profileData?.country || "Loading..."}</p>
  <p><strong>Zip Code:</strong> {profileData?.zipCode || "Loading..."}</p>
  <p><strong>Gender:</strong> {profileData?.gender || "Loading..."}</p>
</div>

<h2 style={{ marginTop: "40px", fontSize: "1.5rem" }}>Your Booked Lessons</h2>
<div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
  {bookedLessons.length > 0 ? (
    bookedLessons.map((lesson, index) => (
      <div key={index} style={{
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        width: "250px"
      }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>{lesson.content}</h3>
        <p><strong>Date:</strong> {lesson.date}</p>
        <p><strong>Time:</strong> {lesson.time} - {lesson.endTime}</p>
        <p><strong>Location:</strong> {lesson.location}</p>
      </div>
    ))
  ) : (
    <p>You have no lessons booked.</p>
  )}
</div>

    </div>
    
  );
}
