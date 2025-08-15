"use client";
import { useState, useEffect, useCallback } from "react";
import { redirect } from "next/navigation";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval } from "date-fns";

type TimeSlot = {
  date: string;
  time: string;   // StartTime
  endTime: string;
  location: string;
  content: string;
  bookedBy: string;
  status: 'scheduled' | 'booked' | 'completed';
};




export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [timeSlots, setTimeSlots] = useState<{ date: string; slots: TimeSlot[] }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slotDetails, setSlotDetails] = useState<string>("");
  const [studentRole, setStudentRole] = useState<string>("");
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

  const getDaysOfWeek = useCallback((date: Date) => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });
  }, []);

const fetchTimeSlots = useCallback(async () => {
  const userResponse = await fetch('/api/userId', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const userResult = await userResponse.json();
  const userId = userResult.message;

  const response = await fetch("/api/fetchSlots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      current: getDaysOfWeek(currentDate).map((day) => format(day, "yyyy-MM-dd")),
      userId,
    }),
  });

  const array: { date: string; slots: TimeSlot[] }[] = await response.json();
  return array.map((day) => ({
    date: day.date,
    slots: day.slots.map((slot) => ({
      ...slot,
      status: slot.status,
    })),
  }));
}, [currentDate, getDaysOfWeek]);

  const fetchTimeSlotsForWeek = useCallback(async () => {
    const slots = await fetchTimeSlots();
    setTimeSlots(slots);
  }, [fetchTimeSlots]);

  useEffect(() => {
    fetchTimeSlotsForWeek();

    const fetchData = async () => {
      const userResponse = await fetch('/api/userId', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const userResult = await userResponse.json();
      const userId = userResult.message;

      const response1 = await fetch('/api/getProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response1.ok) {
        redirect('/info');
      }

      const response = await fetch('/api/userByid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      const user = data.user;

      if (user?.role) {
        setStudentRole(user.role);
      }
    };

    fetchData();
  }, [currentDate, fetchTimeSlotsForWeek]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response1 = await fetch('/api/getProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: 'exampleUserId' }),
        });

        if (!response1.ok) {
          throw new Error('Failed to fetch profile');
        }

        await response1.json();
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/deletesession", { method: "POST" });
    redirect("/login");
  };

  const getFormattedDate = (date: Date) => format(date, "yyyy-MM-dd");

  const handleTimeSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setSlotDetails(slot.content);
  };

  const handleSlotDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlotDetails(e.target.value);
  };

  async function handleBooking(): Promise<void> {
    if (!selectedSlot) {
      console.error("No timeslot selected.");
      return;
    }

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
      setSelectedSlot(null);
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
        window.location.reload();
      } else {
        console.error("Failed to unbook the timeslot.");
      }
    } catch (error) {
      console.error("Error unbooking the slot:", error);
    }
  }

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

  const navigateToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const navigateToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));

 

  
  const handleProfile = async () => {
    redirect("/profile");
  }

  // =============== JSX ===============
  return (
    <div onClick={() => {if (menuOpen) setMenuOpen(!menuOpen)}} style={styles.container}>
      <div style={styles.menuContainer}>
        <div  style={styles.logo} onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}>
            ⚪⚪</div>
        {menuOpen && (
          <div style={styles.dropdownMenu}>
           <button style={styles.menuItem} onClick={() => handleProfile()}>
            Your Profile
          </button>
            <button style={styles.menuItem}>Settings</button>
            <button onClick={handleLogout} style={styles.menuItem}>Logout</button>
          </div>
        )}
      </div>

        <h1 style={styles.heading}>Welcome to Your Dashboard</h1>

       {/* Manage Availability & Clear Calendar */}
       {studentRole === "faculty" && (
       <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setAvailabilityOpen(true)}
            style={{ ...styles.bookButton, marginRight: "10px" }}
          >
            Manage Availability
          </button>

          <button
            style={styles.closeButton}
            onClick={async () => {
              const confirmClear = confirm("Are you sure you want to delete all your slots?");
              if (!confirmClear) return;
              const response = await fetch("/api/clearSlots", { method: "POST" });
              if (!response.ok) {
                alert("Failed to clear slots");
                return;
              }
              window.location.reload();
            }}
          >
            Clear Calendar
          </button>
        </div>
      )}

        <div style={styles.mainContent}>
          {/* =========== SIDEBAR FOR SELECTED SLOT =========== */}
          {selectedSlot && (
              <div style={styles.sidebar}>
                <h2>Selected Time Slot</h2>
                <p><strong>Date:</strong> {selectedSlot.date}</p>
                <p><strong>startTime:</strong> {selectedSlot.time}</p>
                <p><strong>endTime:</strong> {selectedSlot.endTime}</p>
                <p><strong>location:</strong> {selectedSlot.location}</p>
                <p><strong>Details:</strong> {selectedSlot.content}</p>
                <input
                    type="text"
                    value={slotDetails}
                    onChange={handleSlotDetailsChange}
                    style={styles.textField}
                    placeholder="Add details"
                />

                {/* Faculty can mark timeslots as completed*/}
                {studentRole === "faculty" && selectedSlot.status !== "completed" && (
                    <button
                           style={styles.bookButton}
                            onClick={async () => {
                              await fetch("/api/completeSlot", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  date: selectedSlot.date,
                                  time: selectedSlot.time,
                                  role: studentRole,
                                }),
                              });
                              setSelectedSlot({ ...selectedSlot, status: "completed" });
                              setTimeSlots(prev =>
                                  prev.map(day =>
                                      day.date === selectedSlot.date
                                          ? {
                                            ...day,
                                            slots: day.slots.map(slot =>
                                                slot.time === selectedSlot.time
                                                    ? { ...slot, status: "completed" }
                                                    : slot
                                            ),
                                          }
                                          : day
                                  )
                              );
                            }}
                          >
                            Mark Completed
                          </button>
                        )}

                      {/* Show completed notice */}
                      {selectedSlot.status === "completed" && (
                          <p style={{ color: "#007bff", marginTop: "10px" }}>
                              ✅ This slot is completed.
                            </p>
                        )}

                {/* Faculty undo-functionality to completion */}
                {studentRole === "faculty" && selectedSlot.status === "completed" && (
                    <button
                      style={styles.bookButton}
                      onClick={async () => {
                        await fetch("/api/completeSlot", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            date: selectedSlot.date,
                            time: selectedSlot.time,
                            role: studentRole,
                          }),
                        });
                        setSelectedSlot({...selectedSlot, status: "completed" });
                        setTimeSlots(prev =>
                            prev.map(day =>
                                day.date === selectedSlot.date
                                ? {
                                    ...day,
                                  slots: day.slots.map(slot =>
                                  slot.time === selectedSlot.time
                                      ? { ...slot, status: "scheduled" }
                                      : slot
                                  ),
                                }
                                : day
                            )
                        );
                      }}
                      >
                      Undo Completed
                    </button>
                )}

                {selectedSlot.bookedBy ? (
                    selectedSlot.status !== "completed" && (
                        <button style={styles.bookButton} onClick={handleUnbookSlot}>
                          Unbook
                        </button>
                    )
                ) : (
                    selectedSlot.status !== "completed" && (
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

          {/* =========== AVAILABILITY FORM =========== */}
          {availabilityOpen && (
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
              </div>
          )}

          {/* =========== CALENDAR =========== */}
          <div style={styles.calendarContainer}>
            <div style={styles.headerRow}>
              <button onClick={navigateToPreviousWeek} style={styles.navButton}>{"<"}</button>
              <h2 style={styles.monthHeader}>{`Week of ${format(currentDate, "MMMM dd, yyyy")}`}</h2>
              <button onClick={navigateToNextWeek} style={styles.navButton}>{">"}</button>
            </div>

            <div style={styles.calendarGrid}>
              {getDaysOfWeek(currentDate).map((day) => {
                const dayFormatted = getFormattedDate(day);
                // DB data for this day
                const daySlots = timeSlots.find((slot) => slot.date === dayFormatted)?.slots || [];

                return (
                    <div key={dayFormatted} style={styles.dayContainer}>
                      <div style={styles.day}>{format(day, "d")}</div>

                      <div style={styles.timeSlotColumn}>
                        {daySlots.length === 0 ? (
                            <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "#999" }}>
                              No slots
                            </div>
                        ) : (
                            daySlots.map((slot, index) => (
                                <div
                                    key={index}
                                    style={{
                                      ...styles.timeSlot,
                                      backgroundColor:
                                          slot.status === "completed"
                                            ? "#e0e0e0"
                                            : slot.bookedBy
                                            ? "#ffcccc"
                                            : "#ccffcc", // red if booked, green if available
                                      opacity: slot.status === "completed" ? 0.6 : 1,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleTimeSlotClick(slot) }
                                    title={
                                      slot.status === "completed" ? "Completed" : ""
                                    }
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
        </div>
        {/* Optional: Add a footer or any other component here */}
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