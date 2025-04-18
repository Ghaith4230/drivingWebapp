"use client"
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, startOfDay, addMinutes } from "date-fns";
import styles from "./styles";

import ChatPage from "../components/ui/chatbox";

type TimeSlot = {
  time: string;
  content: string;
};

type datee = {
  date: string;
  time: string;
};

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentDay, setCurrentDay] = useState<datee | null>(null);
  const [timeSlots, setTimeSlots] = useState<{ date: string; slots: TimeSlot[] }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slotDetails, setSlotDetails] = useState<string>(""); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedBack, setFeedback] = useState <string>("");

  useEffect(() => {
    fetchTimeSlotsForWeek(currentDate);
  }, [currentDate]);

  const handleProfile = async (e: React.FormEvent) => {
    redirect("/profile");
  }

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
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });

    const slots = await fetchTimeSlots(startOfWeekDate, endOfWeekDate);
    setTimeSlots(slots);
  };

  const fetchTimeSlots = async (start: Date, end: Date) => {
    const response = await fetch("/api/fetchSlots", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current: await getDaysOfWeek(currentDate).map((day) => format(day, "yyyy-MM-dd")),
      }),
    });

    const array = await response.json();

    console.log(array);
    return array;
  };

  const navigateToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const navigateToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const getDaysOfWeek = (date: Date) => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });
  };

  const getFormattedDate = (date: Date) => format(date, "yyyy-MM-dd");

  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = startOfDay(new Date());
    currentTime = addMinutes(currentTime, 12 * 60);

    while (currentTime.getHours() < 20) {
      const time = format(currentTime, "hh:mm a");
      slots.push(time);
      currentTime = addMinutes(currentTime, 90);
    }
    return slots;
  };

  const handleTimeSlotClick = (day: string, time: string, content: string) => {
    setCurrentDay({ date: day, time: time });
    setSelectedSlot({ time, content });
    setSlotDetails(content); // Populate the text field with the selected slot content
  };

  const handleSlotDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlotDetails(e.target.value); // Update the slotDetails state when user types
  };

  async function handleBooking(): Promise<void> {
    const response = await fetch("/api/book", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      date: currentDay?.date,
      time: currentDay?.time,
      details: slotDetails, // Include the details in the booking request
      }),
    });

    

    if (response.ok) {
      window.location.reload(); // Refresh the page after successful booking
    }

    if (!response.ok) {
      return;
    }
  }

  return (
    <div onClick={() => {if (menuOpen) setMenuOpen(!menuOpen)}} style={styles.container}>
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

      <h1 style={styles.heading}>Welcome to Your Dashboard</h1>

      <div style={styles.mainContent}>
        {selectedSlot && (
          <div style={styles.sidebar}>
            <h2 style={styles.sidebarTitle}>Selected Time Slot</h2>
            <p style={styles.text}> 
              <strong style={styles.textBold}>Time:</strong> {selectedSlot.time}
            </p>
            <p style={styles.text}>
              <strong style={styles.textBold}>Details:</strong> {selectedSlot.content}
            </p>

            {/* Text field to edit details */}
            <input
              type="text"
              value={slotDetails}
              onChange={handleSlotDetailsChange}
              style={styles.textField}
              placeholder="Add details"
            />

            <button style={styles.bookButton} onClick={() => handleBooking()}>
              Book
            </button>
            <button style={styles.closeButton} onClick={() => setSelectedSlot(null)}>
              Close
            </button>

            <div style={styles.feedbackSection}>
                <h3 style={styles.feedbackTitle}>Feedback</h3>
                <textarea
                  value={feedBack} // Correctly binding the feedback value
                  style={styles.textarea}
                  onChange={(e) => setFeedback(e.target.value)} // Correct syntax for updating feedback state
                  placeholder="Write your feedback here..."
                />
                <button style={styles.feedbackButton}>
                  Submit Feedback
                </button>
              </div>
          </div>
        )}

        <div style={styles.calendarContainer}>
          <div style={styles.headerRow}>
            <button onClick={navigateToPreviousWeek} style={styles.navButton}>
              {"<"}
            </button>
            <h2 style={styles.monthHeader}>{`Week of ${format(currentDate, "MMMM dd, yyyy")}`}</h2>
            <button onClick={navigateToNextWeek} style={styles.navButton}>
              {">"}
            </button>
          </div>

          <div style={styles.calendarGrid}>
            {getDaysOfWeek(currentDate).map((day) => {
              const dayFormatted = getFormattedDate(day);
              const daySlots = timeSlots.find((slot) => slot.date === dayFormatted)?.slots || [];

              return (
                <div key={dayFormatted} style={styles.dayContainer}>
                  <div style={styles.day}>{format(day, "d")}</div>
                  <div style={styles.timeSlotColumn}>
                    {generateTimeSlots().map((time, index) => {
                      const slot = daySlots.find((s) => s.time === time);
                      return (
                        <div
                          key={index}
                          style={styles.timeSlot}
                          onClick={() => handleTimeSlotClick(dayFormatted, time, slot?.content || "Available")}
                        >
                          <div style={styles.time}>{time}</div>
                          {slot ? <div style={styles.content}>{slot.content}</div> : <div style={styles.noContent}>Available</div>}
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
      <ChatPage />
    </div>
  );
}
