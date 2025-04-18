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
    };

    fetchProfile();
    
  }, []);
 

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

    </div>
  );
}
