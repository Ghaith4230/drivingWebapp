"use client";
import React, { useState, useEffect } from "react";
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
  const [slotDetails, setSlotDetails] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

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
    setSlotDetails(content);
  };

  const handleSlotDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlotDetails(e.target.value);
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
        details: slotDetails,
      }),
    });

    if (response.ok) {
      window.location.reload();
    }
  }

  return (
      <div className="flex flex-col items-center min-h-screen bg-base-200 p-6">
        {/* Menu Container */}
        <div className="absolute top-6 left-6 flex flex-col items-center">
          <div
              className="p-3 bg-primary text-white rounded-full cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
          >
            ⚪
          </div>
          {menuOpen && (
              <div className="mt-2 w-48 bg-white shadow-xl rounded-md">
                <button className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-white">Your Profile
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-white">Settings</button>
                <button onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white">
                  Logout
                </button>
              </div>
          )}
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-black text-center mt-20">Welcome to Your Dashboard</h1>

        {/* Main Content */}
        <div className="flex w-full max-w-screen-lg mt-6 space-x-8">
          {/* Sidebar */}
          {selectedSlot && (
              <div className="w-80 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-bold text-primary">Selected Time Slot</h2>
                <p><strong>Time:</strong> {selectedSlot.time}</p>
                <p><strong>Details:</strong> {selectedSlot.content}</p>
                <input
                    type="text"
                    value={slotDetails}
                    onChange={handleSlotDetailsChange}
                    className="input input-bordered mt-4 w-full"
                    placeholder="Add details"
                />
                {/* Updated button container */}
                <div className="flex flex-col space-y-4 mt-4">
                  <button onClick={handleBooking} className="btn btn-success w-full">Book</button>
                  <button onClick={() => setSelectedSlot(null)} className="btn btn-error w-full">Close</button>
                </div>
              </div>
          )}

          {/* Calendar */}
          <div className="flex-1 bg-white p-6 shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <button
                  onClick={navigateToPreviousWeek}
                  className="btn bg-black text-white text-2xl"
              >
                {"<"}
              </button>
              <h2 className="text-xl font-semibold text-black">{`Week of ${format(currentDate, "MMMM dd, yyyy")}`}</h2>
              <button
                  onClick={navigateToNextWeek}
                  className="btn bg-black text-white text-2xl"
              >
                {">"}
              </button>
            </div>
            <div className="grid grid-cols-7 gap-4 h-[700px] overflow-hidden">
              {getDaysOfWeek(currentDate).map((day) => {
                const dayFormatted = getFormattedDate(day);
                const daySlots = timeSlots.find((slot) => slot.date === dayFormatted)?.slots || [];

                return (
                    <div key={dayFormatted} className="text-center flex flex-col justify-between h-full">
                      <div className="font-semibold">{format(day, "d")}</div>
                      <div className="flex flex-col justify-between h-full">
                        {generateTimeSlots().map((time, index) => {
                          const slot = daySlots.find((s) => s.time === time);
                          return (
                              <div
                                  key={index}
                                  className={`border rounded-lg cursor-pointer mt-2 mx-auto ${
                                      selectedSlot ? "w-20" : "w-32"
                                  } ${slot ? "bg-primary text-white" : "bg-gray-200"} p-3`}
                                  style={{height: "calc(100% / 6)"}}  // Ensures equal height for each timeslot
                                  onClick={() => handleTimeSlotClick(dayFormatted, time, slot?.content || "Available")}
                              >
                                <div className="flex flex-col justify-center items-center h-full">
                                  <div className="text-sm font-medium">{time}</div>
                                  {slot ? (
                                      <div className="text-xs mt-1">{slot.content}</div>
                                  ) : (
                                      <div className="text-green-600 text-xs mt-1">Available</div>
                                  )}
                                </div>
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
