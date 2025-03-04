"use client";
import { deleteSession } from "../lib/session";
import { redirect } from "next/navigation";

export default function Dashboard() {
  
   
    const handleLogout = async (e: React.FormEvent) => {
      e.preventDefault();
  
      // Send the email and password to the API route for authentication
      const response = await fetch("api/auth", {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: "e"
      });

      redirect("/login")
      
    }
 

  return (
    <div>
      <h1 style={styles.heading}>Welcome to Your Dashboard</h1>
      <p style={styles.description}>Manage your settings, view your data, and more!</p>
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  heading: {
    color: "#333",
    fontSize: "2.5rem",
    marginBottom: "20px",
  },
  description: {
    color: "#666",
    fontSize: "1.2rem",
    marginBottom: "40px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
};

