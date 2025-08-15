"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles";
import Image from "next/image";



export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [bookedLessons, setBookedLessons] = useState<TimeSlot[]>([]); 


type Profile = {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    country: string;
    zipCode: string;
    gender: string;
    profileImage: string;
  };
};

  type TimeSlot = {
    date: string;
    time: string;
    endTime: string;
    location: string;
    content: string;
    bookedBy: string;
  };
  
useEffect(() => {
    // Define the async function inside useEffect
    const fetchProfile = async () => {
      try {
        // First fetch call to get userId
        const response = await fetch('/api/userId', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // Assuming you're sending an empty object as the body
        });

        const result = await response.json();

        // Second fetch call to get user profile data by userId
        const response1 = await fetch('/api/getProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: result.message }) // Corrected body structure
        });

        const data = await response1.json();
       
       

        setProfileData(data);

       

        // Fetch booked lessons and update state
        const lessons = await fetchBookedLessons(result.message);
        setBookedLessons(lessons);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile(); // Calling the function inside useEffect
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
        console.log("Logout response:", response);
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
      src={ "/default-avatar.svg"} 
      alt="Profile Logo"
      width={100}
      height={100}
      style={styles.profileLogo}
    />
  </div>

  <div style={styles.nameRow}>
    <p style={styles.name}><strong>{profileData?.profile.firstName || "Loading..."}</strong></p>
    <p style={styles.name}><strong>{profileData?.profile.lastName || "Loading..."}</strong></p>
  </div>

  <p><strong>Email:</strong> {profileData?.profile.email || "Loading..."}</p>
  <p><strong>Phone Number:</strong> {profileData?.profile.phoneNumber || "Loading..."}</p>
  <p><strong>Address:</strong> {profileData?.profile.address || "Loading..."}</p>
  <p><strong>Country:</strong> {profileData?.profile.country || "Loading..."}</p>
  <p><strong>Zip Code:</strong> {profileData?.profile.zipCode || "Loading..."}</p>
  <p><strong>Gender:</strong> {profileData?.profile.gender || "Loading..."}</p>
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
