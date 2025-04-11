"use client";

import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import styles from "./styles";
import Image from "next/image";

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  country: string;
  zipCode: string;
  gender: string;
}

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter(); 

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Profile fetch failed:", err));
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
          src={"/default-avatar.svg"} 
          alt="Profile Logo"
          width={100}
          height={100}
          style={styles.profileLogo}
        />
        {profile ? (
          <div style={{ marginTop: 20 }}>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Phone:</strong> {profile.phoneNumber}</p>
            <p><strong>Address:</strong> {profile.address}, {profile.zipCode} {profile.country}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}