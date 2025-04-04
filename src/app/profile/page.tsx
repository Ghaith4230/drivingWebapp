"use client";

import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import styles from "./styles";
import Image from "next/image";



export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter(); 
  
  useEffect(() => {
    // Fetch user profile data (Modify this API to your backend)
    fetch("/api/user") // ✅ Adjust API endpoint if necessary
      .then((res) => res.json())
      .then((data) => setProfileImage(data.profileImage)); 
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
      </div>
    </div>
  );
}
