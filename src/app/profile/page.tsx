"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles";
import Image from "next/image";

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user profile data from the new API endpoint
    fetch("/profiledata") // Make sure this is your actual profile fetching endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch profile data");
        }
        return res.json();
      })
      .then((data) => setProfileData(data))
      .catch((err) => console.error("Error fetching profile data:", err));
  }, []);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/deletesession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/profile");
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/deletesession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/login");
  };

  return (
    <div onClick={() => { if (menuOpen) setMenuOpen(false); }} style={styles.container}>
      <div style={styles.menuContainer}>
        <div style={styles.logo} onClick={() => setMenuOpen(!menuOpen)}>⚪</div>
        {menuOpen && (
          <div style={styles.dropdownMenu}>
            <button onClick={handleProfile} style={styles.menuItem}>Your Profile</button>
            <button style={styles.menuItem}>Settings</button>
            <button onClick={handleLogout} style={styles.menuItem}>Logout</button>
          </div>
        )}
      </div>
      
      <h1 style={styles.heading}>Welcome to Your Profile</h1>
      <div style={styles.profileContainer}>
        <Image 
          src={profileData?.profileImage || "/default-avatar.svg"} 
          alt="Profile Logo"
          width={100}
          height={100}
          style={styles.profileLogo}
        />
      </div>

      <div style={styles.profileInfo}>
        <p><strong>Email:</strong> {profileData?.email || "Loading..."}</p>
        <p><strong>First Name:</strong> {profileData?.firstName || "Loading..."}</p>
        <p><strong>Last Name:</strong> {profileData?.lastName || "Loading..."}</p>
        <p><strong>Phone Number:</strong> {profileData?.phoneNumber || "Loading..."}</p>
        <p><strong>Address:</strong> {profileData?.address || "Loading..."}</p>
        <p><strong>Country:</strong> {profileData?.country || "Loading..."}</p>
        <p><strong>Zip Code:</strong> {profileData?.zipCode || "Loading..."}</p>
        <p><strong>Gender:</strong> {profileData?.gender || "Loading..."}</p>
      </div>
    </div>
  );
}
