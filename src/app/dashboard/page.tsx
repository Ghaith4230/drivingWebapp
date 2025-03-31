"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { format, startOfWeek, addDays, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, startOfDay, addMinutes} from "date-fns";

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
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [availabilityForm, setAvailabilityForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
  });

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


  return (
    <div onClick={() => {if (menuOpen) setMenuOpen(!menuOpen)}} style={styles.container}>
       <div style={styles.menuContainer}>
        <div style={styles.logo} onClick={() => setMenuOpen(!menuOpen)}>⚪</div>
        {menuOpen && (
          <div style={styles.dropdownMenu}>
            <button style={styles.menuItem}>Your Profile</button>
            <button style={styles.menuItem}>Settings</button>
            <button onClick={handleLogout} style={styles.menuItem}>Logout</button>
          </div>
        )}
      </div>

      <h1 style={styles.heading}>Welcome to Your Dashboard</h1>

      <button
        onClick={() => setAvailabilityOpen(true)}
        style={{ ...styles.bookButton, marginBottom: "20px"}}
        >
        Manage Availability
      </button>

      <button
          style={styles.closeButton}
          onClick={async () => {
            const confirmClear = confirm("Are you sure you want to delete all your slots?");
            if (!confirmClear) return;

            const response = await fetch("/api/clearSlots", {
              method: "POST",
            });

            if (!response.ok) {
              alert("Failed to clear slots");
              return;
            }

            window.location.reload();
          }}
      >
        Clear Calendar
      </button>

      <div style={styles.mainContent}>
        {selectedSlot && (
          <div style={styles.sidebar}>
            <h2>Selected Time Slot</h2>
            <p>
              <strong>Time:</strong> {selectedSlot.time}
            </p>
            <p>
              <strong>Details:</strong> {selectedSlot.content}
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
          </div>
        )}

        {availabilityOpen && (
            <div style={styles.sidebar}>
              <h2>Manage Availability</h2>

              <input
                type="text"
                placeholder="Title"
                value={availabilityForm.title}
                onChange={(e) => setAvailabilityForm({... availabilityForm, title: e.target.value })}
                style={styles.textField}
                />

              <input
                  type="date"
                  value={availabilityForm.date}
                  onChange={(e) =>
                      setAvailabilityForm({ ...availabilityForm, date: e.target.value })
                  }
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

              <button
                  style={styles.bookButton}
                  onClick={handleAvailabilitySubmit}
              >
                Submit
              </button>
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
    </div>
  );
}

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
  menuItemHover: {
    backgroundColor: "#f0f0f0",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "60px",
  },
  logoutButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "5px",
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
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    marginRight: "20px",
  },
  textField: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
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
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "10px",
  },
  timeSlot: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f0f0f0",
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
  closeButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "2px solid #bd2130",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",  
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
};
