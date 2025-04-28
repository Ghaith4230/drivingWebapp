"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval } from "date-fns";
import ChatPage from "../components/ui/chatbox";

type TimeSlot = {
  date: string;
  time: string;   // StartTime
  endTime: string;
  location: string;
  content: string;
  bookedBy: string;
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
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [availabilityForm, setAvailabilityForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    bookedBy: "",
  });
  const [role, setRole] = useState<"student" | "faculty" | null>(null);

  useEffect(() => {
    fetch("/api/loggedInUser")
        .then((r) => r.json())
        .then((data) => setRole(data.role))
        .catch(() => setRole(null));
    fetchTimeSlotsForWeek(currentDate);
  }, [currentDate]);

  const handleProfile = async (e: React.FormEvent) => {
    redirect("/profile");
  }

  // =============== LOGOUT HANDLER ===============
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/deletesession", { method: "POST" });
    redirect("/login");
  };

  // =============== FETCH TIME SLOTS ===============
  const fetchTimeSlotsForWeek = async (date: Date) => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });
    const slots = await fetchTimeSlots(startOfWeekDate, endOfWeekDate);
    setTimeSlots(slots);
  };

  const fetchTimeSlots = async (start: Date, end: Date) => {
    const response = await fetch("/api/fetchSlots", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current: getDaysOfWeek(currentDate).map((day) => format(day, "yyyy-MM-dd")),
      }),
    });
    const array = await response.json();
    return array;
  };

  // =============== NAVIGATION ===============
  const navigateToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const navigateToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  // =============== HELPERS ===============
  const getDaysOfWeek = (date: Date) => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });
  };

  const getFormattedDate = (date: Date) => format(date, "yyyy-MM-dd");

  // =============== SLOT HANDLERS ===============
  const handleTimeSlotClick = (slot: TimeSlot) => {
    console.log("Clicked slot: " + slot);
    setCurrentDay({ date: slot.date, time: slot.time });
    setSelectedSlot(slot);
    setSlotDetails(slot.content);
  };

  const handleSlotDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlotDetails(e.target.value);
  };

  // =============== BOOKING HANDLER ===============
  async function handleBooking(): Promise<void> {
    if (!selectedSlot) {
      console.error("No timeslot selected.");
      return;
    }

    
    const handleProfile: (e: React.FormEvent) => Promise<never> = async (e) => {
  e.preventDefault();
  redirect("/profile");
};

    console.log("Booking slot:", JSON.stringify(selectedSlot));

    const response = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedSlot.date,
        time: selectedSlot.time,
        details: slotDetails,
      }),
    });

    if (response.ok) {
      // Clear selection after booking to avoid stale state
      setSelectedSlot(null);
      setCurrentDay(null);
      window.location.reload();
    }
  }

  async function handleUnbookSlot(): Promise<void> {
    if (!selectedSlot) {
      console.error("No timeslot selected for unbooking.");
      return;
    }

    try {
      const response = await fetch("/api/unbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedSlot.date,
          time: selectedSlot.time,
        }),
      });

      if (response.ok) {
        setSelectedSlot(null);
        // Optionally update local state instead of reloading.
        window.location.reload();
      } else {
        console.error("Failed to unbook the timeslot.");
      }
    } catch (error) {
      console.error("Error unbooking the slot:", error);
    }
  }

  // =============== AVAILABILITY HANDLER ===============
  const handleAvailabilitySubmit = async () => {
    try {
      const response = await fetch("/api/manageAvailability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: availabilityForm.startTime,
          endTime: availabilityForm.endTime,
          title: availabilityForm.title,
          date: availabilityForm.date,
          location: availabilityForm.location,
          description: availabilityForm.description,
          bookedBy: availabilityForm.bookedBy,
        }),
      });

      if (!response.ok) throw new Error("Failed to update availability");

      setAvailabilityOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Availability update error:", error);
      alert("Something went wrong while updating your availability.");
    }
  };

  // =============== JSX ===============
  return (
      <div onClick={() => menuOpen && setMenuOpen(false)} style={styles.container}>
        {/* MENU + LOGOUT */}
        <div style={styles.menuContainer}>
          <div
              style={styles.logo}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          >⚪⚪</div>
          {menuOpen && (
              <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                <button style={styles.menuItem} onClick={() => redirect("/profile")}>
                  Your Profile
                </button>
                <button style={styles.menuItem} onClick={handleLogout}>
                  Logout
                </button>
              </div>
          )}
        </div>

        <h1 style={styles.heading}>Welcome to Your Dashboard</h1>

        {/* FACULTY CONTROLS */}
        {role === "faculty" && (
            <div style={{ marginBottom: 20 }}>
              <button
                  onClick={() => {
                    setAvailabilityOpen(true);
                    setSelectedSlot(null);
                  }}
                  style={{ ...styles.bookButton, marginRight: 10 }}
              >
                Manage Availability
              </button>
              <button
                  style={styles.closeButton}
                  onClick={async () => {
                    if (!confirm("Delete all your slots?")) return;
                    await fetch("/api/clearSlots", { method: "POST" });
                    window.location.reload();
                  }}
              >
                Clear Calendar
              </button>
            </div>
        )}

        <div style={styles.mainContent}>
          {/* =========== SIDEBAR FOR SELECTED SLOT =========== */}
          {selectedSlot && !availabilityOpen && (
              <div style={styles.sidebar}>
                <h2>Selected Time Slot</h2>
                <p><strong>Date:</strong>     {selectedSlot.date}</p>
                <p><strong>Start:</strong>    {selectedSlot.time}</p>
                <p><strong>End:</strong>      {selectedSlot.endTime}</p>
                <p><strong>Location:</strong> {selectedSlot.location}</p>
                <p><strong>Details:</strong>  {selectedSlot.content}</p>
                {selectedSlot.bookedBy && (
                    <p><strong>Booked By:</strong> User #{selectedSlot.bookedBy}</p>
                )}

                {/* Only students can book/unbook */}
                {role === "student" && (
                    selectedSlot.bookedBy ? (
                        <button style={styles.bookButton} onClick={handleUnbookSlot}>
                          Unbook
                        </button>
                    ) : (
                        <button style={styles.bookButton} onClick={handleBooking}>
                          Book
                        </button>
                    )
                )}

                <button style={styles.closeButton} onClick={() => setSelectedSlot(null)}>
                  Close
                </button>
              </div>
          )}

          {/* =========== AVAILABILITY FORM (Faculty Only) =========== */}
          {role === "faculty" && availabilityOpen && !selectedSlot && (
              <div style={styles.sidebar}>
                <h2>Manage Availability</h2>

                <input
                    type="text"
                    placeholder="Title"
                    value={availabilityForm.title}
                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, title: e.target.value })}
                    style={styles.textField}
                />
                <input
                    type="date"
                    value={availabilityForm.date}
                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, date: e.target.value })}
                    style={styles.textField}
                />
                <input
                    type="time"
                    placeholder="Start Time"
                    value={availabilityForm.startTime}
                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, startTime: e.target.value })}
                    style={styles.textField}
                />
                <input
                    type="time"
                    placeholder="End Time"
                    value={availabilityForm.endTime}
                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, endTime: e.target.value })}
                    style={styles.textField}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={availabilityForm.location}
                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, location: e.target.value })}
                    style={styles.textField}
                />
                <textarea
                    placeholder="Description (max 150 chars)"
                    maxLength={150}
                    value={availabilityForm.description}
                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, description: e.target.value })}
                    style={{ ...styles.textField, height: "60px", resize: "none" }}
                />

                <button style={styles.bookButton} onClick={handleAvailabilitySubmit}>
                  Submit
                </button>
                <button style={styles.closeButton} onClick={() => setAvailabilityOpen(false)}>
                  Cancel
                </button>
              </div>
          )}

          {/* =========== CALENDAR GRID =========== */}
          <div style={styles.calendarContainer}>
            <div style={styles.headerRow}>
              <button onClick={navigateToPreviousWeek} style={styles.navButton}>{"<"}</button>
              <h2 style={styles.monthHeader}>
                Week of {format(currentDate, "MMMM dd, yyyy")}
              </h2>
              <button onClick={navigateToNextWeek} style={styles.navButton}>{">"}</button>
            </div>
            <div style={styles.calendarGrid}>
              {getDaysOfWeek(currentDate).map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const slots = timeSlots.find((d) => d.date === dayKey)?.slots || [];
                return (
                    <div key={dayKey} style={styles.dayContainer}>
                      <div style={styles.day}>{format(day, "d")}</div>
                      <div style={styles.timeSlotColumn}>
                        {slots.length === 0 ? (
                            <div style={{ fontSize: 14, color: "#999" }}>No slots</div>
                        ) : (
                            slots.map((slot, i) => (
                                <div
                                    key={i}
                                    style={{
                                      ...styles.timeSlot,
                                      backgroundColor: slot.bookedBy ? "#ffcccc" : "#ccffcc",
                                    }}
                                    onClick={() => handleTimeSlotClick(slot)}
                                >
                                  <div style={styles.time}>{slot.time}</div>
                                  <div style={styles.content}>{slot.content}</div>
                                </div>
                            ))
                        )}
                      </div>
                    </div>
                );
              })}
            </div>
          </div>

          <ChatPage />
        </div>
      </div>
  );
}

// ================== STYLES ======================
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial",
    backgroundColor: "#f8f9fa",
    position: "relative",
  },
  menuContainer: {
    position: "absolute",
    top: "10px",
    left: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    border: "2px solid #0056b3",
  },
  dropdownMenu: {
    position: "absolute",
    top: "60px",
    left: "0",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    width: "150px",
    zIndex: 1000,
  },
  menuItem: {
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#fff",
    border: "none",
    cursor: "pointer",
    width: "100%",
    fontSize: "14px",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "60px",
  },
  mainContent: {
    display: "flex",
    width: "90%",
    maxWidth: "1200px",
  },
  sidebar: {
    width: "300px",
    padding: "20px",
    background: "#fff",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    marginRight: "20px",
  },
  textField: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  closeButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "2px solid #bd2130",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "2px solid #1e7e34",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  calendarContainer: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "10px",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "15px",
  },
  monthHeader: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  navButton: {
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#007bff",
    background: "transparent",
    border: "2px solid #007bff",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "10px",
  },
  dayContainer: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
  },
  day: {
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  timeSlotColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  timeSlot: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f0f0f0",
  },
  time: {
    fontWeight: "bold",
  },
  content: {
    marginTop: "5px",
  },
};