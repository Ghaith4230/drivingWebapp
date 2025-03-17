"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, startOfDay, addMinutes } from "date-fns";

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
  const [slotDetails, setSlotDetails] = useState<string>(""); // New state to hold slot details

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

  return (
    <div style={styles.container}>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
      <h1 style={styles.heading}>Welcome to Your Dashboard</h1>

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
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
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
