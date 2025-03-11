"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, startOfDay, addMinutes } from "date-fns";
import { deleteSession } from "../lib/session";

// Define the TimeSlot type
type TimeSlot = {
  time: string;
  content: string;
};

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [timeSlots, setTimeSlots] = useState<{ date: string; slots: TimeSlot[] }[]>([]); 
  
  useEffect(() => {
    fetchTimeSlotsForWeek(currentDate);
  }, [currentDate]);

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

  const fetchTimeSlotsForWeek = async (date: Date) => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 }); // Week starts on Monday
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 }); // Week ends on Sunday
    
    const slots = await fetchTimeSlots(startOfWeekDate, endOfWeekDate); 
    setTimeSlots(slots);
  };

  const fetchTimeSlots = async (start: Date, end: Date) => {
    // Simulating some mock data
    return [
      { date: '2025-03-10', slots: [{ time: "10:00 AM", content: "Driving Lesson" }] },
      { date: '2025-03-12', slots: [{ time: "12:00 PM", content: "Test Drive" }] },
      // More mock data here
    ];
  };

  const navigateToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1)); 
  };

  const navigateToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1)); // Go to the previous week
  };

  const getDaysOfWeek = (date: Date) => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });
  };

  const getFormattedDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const generateTimeSlots = () => {
    const timeSlots = [];
    let currentTime = startOfDay(new Date()); // Start at 12:00 PM (noon)
    currentTime = addMinutes(currentTime, 12 * 60); // Adjust to 12:00 PM
    
    // Generate time slots in 45-minute intervals until 8:00 PM
    while (currentTime.getHours() < 20) { // 8:00 PM
      const time = format(currentTime, "hh:mm a");
      timeSlots.push(time);
      currentTime = addMinutes(currentTime, 45);
    }
    return timeSlots;
  };

  const handleTimeSlotClick = (time: string) => {
    alert(`You clicked on the time slot: ${time}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Your Dashboard</h1>
      <p style={styles.description}>Manage your settings, view your data, and more!</p>
      
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>

      <div style={styles.calendarContainer}>
        <button onClick={navigateToPreviousWeek} style={styles.navButton}>{"<"}</button>
        
        <h2 style={styles.monthHeader}>{`Week of ${format(currentDate, "MMMM dd, yyyy")}`}</h2>
        
        <button onClick={navigateToNextWeek} style={styles.navButton}>{">"}</button>
        
        <div style={styles.calendarGrid}>
          {getDaysOfWeek(currentDate).map((day) => {
            const dayFormatted = getFormattedDate(day);
            const daySlots = timeSlots.find((slot) => slot.date === dayFormatted)?.slots || [];

            return (
              <div key={dayFormatted} style={styles.dayContainer}>
                <div style={styles.day}>{format(day, "d")}</div>
                <div style={styles.timeSlotColumn}>
                  {generateTimeSlots().map((time, index) => {
                    const slot = daySlots.find((s: TimeSlot) => s.time === time);
                    return (
                      <div 
                        key={index} 
                        style={styles.timeSlot} 
                        onClick={() => handleTimeSlotClick(time)} 
                        className="timeSlot"
                      >
                        <div style={styles.time}>{time}</div>
                        {slot ? <div style={styles.content}>{slot.content}</div> : <div style={styles.noContent}>No Event</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { CSSProperties } from "react"; // Import CSSProperties

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",  
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  heading: {
    color: "#343a40",
    fontSize: "2.5rem",
    fontWeight: "600",
    marginBottom: "15px",
  },
  description: {
    color: "#6c757d",
    fontSize: "1.1rem",
    marginBottom: "30px",
    fontWeight: "400",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "12px 25px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "50px",
    transition: "background-color 0.3s ease",
    marginBottom: "30px",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  calendarContainer: {
    marginTop: "30px",
    textAlign: "center",
    width: "100%",
    maxWidth: "1000px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
  },
  navButton: {
    fontSize: "1.8rem",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    margin: "0 15px",
    color: "#007bff",
    fontWeight: "bold",
    transition: "color 0.3s ease",
  },
  monthHeader: {
    fontSize: "2.2rem",
    fontWeight: "700",
    color: "#343a40",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "15px",
    marginTop: "20px",
  },
  dayContainer: {
    padding: "12px",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#fafafa",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100vh - 150px)", // Ensure container fits within screen
    overflow: "hidden",
  },
  day: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#343a40",
    marginBottom: "10px",
  },
  timeSlotColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flexGrow: 1,
    overflowY: "auto", // Allow scrolling if slots overflow
  },
  timeSlot: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "5px 10px",
    backgroundColor: "#f1f1f1",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer", // Indicates it's clickable
    transition: "background-color 0.3s ease",
  },
  timeSlotHover: {
    backgroundColor: "#e2e6ea", // Change on hover
  },
  time: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#333",
  },
  content: {
    fontSize: "0.9rem",
    color: "#007bff",
  },
  noContent: {
    fontSize: "0.9rem",
    color: "#dc3545",
  },
};

