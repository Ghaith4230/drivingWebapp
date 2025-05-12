"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, set } from "date-fns";
import ChatPage from "../components/ui/chatbox";
import { getUserById } from "@/db/select";
import {headers} from "next/headers";
import BackgroundLayout from "@/app/components/BackgroundLayout";
import {styles} from './styles';
type TimeSlot = {
  date: string;
  time: string;   // StartTime
  endTime: string;
  location: string;
  content: string;
  bookedBy: string;
  status: 'scheduled' | 'booked' | 'completed';
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

  useEffect(() => {
    fetchTimeSlotsForWeek(currentDate);

    const fetchData = async () => {
      const userResponse = await fetch('/api/userId', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({}),
      });
      const userResult = await userResponse.json();
      const userId = userResult.message;
      const user = await getUserById(parseInt(userId));

      if (user?.role) {
        setStudentRole(user.role); // ← This sets it in state
      }
    };

    fetchData();
  }, [currentDate]);


  const handleProfile = async (e: React.FormEvent) => {
    redirect("/profile");
  }

  // =============== LOGOUT HANDLER ===============
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/deletesession", {method: "POST"});
    redirect("/login");
  };

  // =============== FETCH TIME SLOTS ===============
  const fetchTimeSlotsForWeek = async (date: Date) => {
    const startOfWeekDate = startOfWeek(date, {weekStartsOn: 1});
    const endOfWeekDate = endOfWeek(date, {weekStartsOn: 1});
    const slots = await fetchTimeSlots(startOfWeekDate, endOfWeekDate);
    setTimeSlots(slots);
  };

  const fetchTimeSlots = async (start: Date, end: Date) => {

    const userResponse = await fetch('/api/userId', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({}),
    });
    const userResult = await userResponse.json();
    const userId = userResult.message;


    const response = await fetch("/api/fetchSlots", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        current: getDaysOfWeek(currentDate).map((day) => format(day, "yyyy-MM-dd")),
        userId: userId,
      }),
    });
    const array = await response.json();
    console.log("🏷️ fetchSlots response:", JSON.stringify(array, null, 2));

    /* return array;*/
    return array.map((day: any) => ({
      date: day.date,
      slots: day.slots.map((slot: any) => ({
        ...slot,
        status: slot.status,
      })),
    }));

  };

  // =============== NAVIGATION ===============
  const navigateToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const navigateToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  // =============== HELPERS ===============
  const getDaysOfWeek = (date: Date) => {
    const startOfWeekDate = startOfWeek(date, {weekStartsOn: 1});
    const endOfWeekDate = endOfWeek(date, {weekStartsOn: 1});
    return eachDayOfInterval({start: startOfWeekDate, end: endOfWeekDate});
  };

  const getFormattedDate = (date: Date) => format(date, "yyyy-MM-dd");

  // =============== SLOT HANDLERS ===============
  const handleTimeSlotClick = (slot: TimeSlot) => {
    console.log("Clicked slot: " + slot);
    setCurrentDay({date: slot.date, time: slot.time});
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
      headers: {"Content-Type": "application/json"},
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
        headers: {"Content-Type": "application/json"},
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
        headers: {"Content-Type": "application/json"},
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

  // ================== JSX ======================
  return (
      <BackgroundLayout> {/* Wrap your whole layout inside BackgroundLayout */}
        <div
            onClick={() => {
              if (menuOpen) setMenuOpen(!menuOpen);
            }}
            style={styles.container}
        >
          <div style={styles.menuContainer}>is
            <div
                style={styles.logo}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
            >
              ⚪⚪
            </div>
            {menuOpen && (
                <div style={styles.dropdownMenu}>
                  <button style={styles.menuItem} onClick={(e) => handleProfile(e)}>
                    Your Profile
                  </button>
                  <button style={styles.menuItem}>Settings</button>
                  <button onClick={handleLogout} style={styles.menuItem}>
                    Logout
                  </button>
                </div>
            )}
          </div>

          <h1 style={styles.heading}>Welcome to Your Dashboard</h1>

          {/* Manage Availability & Clear Calendar */}
          {studentRole === "faculty" && (
              <div style={{marginBottom: "20px"}}>
                <button
                    onClick={() => setAvailabilityOpen(true)}
                    style={{...styles.bookButton, marginRight: "10px"}}
                >
                  Manage Availability
                </button>

                <button
                    style={styles.closeButton}
                    onClick={async () => {
                      const confirmClear = confirm("Are you sure you want to delete all your slots?");
                      if (!confirmClear) return;
                      const response = await fetch("/api/clearSlots", {method: "POST"});
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

                  {/* Faculty can mark timeslots as completed */}
                  {studentRole === "faculty" && selectedSlot.status !== "completed" && (
                      <button
                          style={styles.bookButton}
                          onClick={async () => {
                            await fetch("/api/completeSlot", {
                              method: "POST",
                              headers: {"Content-Type": "application/json"},
                              body: JSON.stringify({
                                date: selectedSlot.date,
                                time: selectedSlot.time,
                                role: studentRole,
                              }),
                            });
                            setSelectedSlot({...selectedSlot, status: "completed"});
                            setTimeSlots((prev) =>
                                prev.map((day) =>
                                    day.date === selectedSlot.date
                                        ? {
                                          ...day,
                                          slots: day.slots.map((slot) =>
                                              slot.time === selectedSlot.time
                                                  ? {...slot, status: "completed"}
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
                      <p style={{color: "#007bff", marginTop: "10px"}}>
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
                              headers: {"Content-Type": "application/json"},
                              body: JSON.stringify({
                                date: selectedSlot.date,
                                time: selectedSlot.time,
                                role: studentRole,
                              }),
                            });
                            setSelectedSlot({...selectedSlot, status: "completed"});
                            setTimeSlots((prev) =>
                                prev.map((day) =>
                                    day.date === selectedSlot.date
                                        ? {
                                          ...day,
                                          slots: day.slots.map((slot) =>
                                              slot.time === selectedSlot.time
                                                  ? {...slot, status: "scheduled"}
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
                      onChange={(e) => setAvailabilityForm({...availabilityForm, title: e.target.value})}
                      style={styles.textField}
                  />
                  <input
                      type="date"
                      value={availabilityForm.date}
                      onChange={(e) => setAvailabilityForm({...availabilityForm, date: e.target.value})}
                      style={styles.textField}
                  />
                  <input
                      type="time"
                      placeholder="Start Time"
                      value={availabilityForm.startTime}
                      onChange={(e) => setAvailabilityForm({...availabilityForm, startTime: e.target.value})}
                      style={styles.textField}
                  />
                  <input
                      type="time"
                      placeholder="End Time"
                      value={availabilityForm.endTime}
                      onChange={(e) => setAvailabilityForm({...availabilityForm, endTime: e.target.value})}
                      style={styles.textField}
                  />
                  <input
                      type="text"
                      placeholder="Location"
                      value={availabilityForm.location}
                      onChange={(e) => setAvailabilityForm({...availabilityForm, location: e.target.value})}
                      style={styles.textField}
                  />
                  <textarea
                      placeholder="Description (max 150 chars)"
                      maxLength={150}
                      value={availabilityForm.description}
                      onChange={(e) => setAvailabilityForm({...availabilityForm, description: e.target.value})}
                      style={{...styles.textField, height: "60px", resize: "none"}}
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
                              <div style={{marginTop: "10px", fontSize: "0.9rem", color: "#999"}}>
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
                                      onClick={() => handleTimeSlotClick(slot)}
                                      title={slot.status === "completed" ? "Completed" : ""}
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
          <ChatPage/>

          {/* Optional: Add a footer or any other component here */}
        </div>
      </BackgroundLayout> // Close the BackgroundLayout here
  );
}
