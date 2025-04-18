export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif", // Ensure a fallback font
    backgroundColor: "#f8f9fa", // Background color for the whole container
    position: "relative",
    padding: "20px", // Padding to ensure elements are not at the edges
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
    border: "2px solid #0056b3", // Border for better visibility
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
    borderRadius: "5px", // Ensure rounded corners on menu items
    transition: "background-color 0.3s ease", // Smooth hover effect
  },
  menuItemHover: {
    backgroundColor: "#f0f0f0",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "60px",
    color: "#333", // Ensure text color is visible on background
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
    borderRadius: "5px", // Rounded corners for logout button
  },

  mainContent: {
    display: "flex",
    width: "90%",
    maxWidth: "1200px",
    marginTop: "20px", // Spacing between header and content
  },
  sidebar: {
    width: "300px",
    padding: "20px",
    background: "#fff",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    marginRight: "20px",
    borderRadius: "5px", // Rounded corners for the sidebar
  },
  textField: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px", // Rounded corners for input fields
    border: "1px solid #ddd", // Light border color
    fontSize: "16px", // Increased font size for readability
  },
  calendarContainer: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "10px", // Rounded corners for the calendar container
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
    color: "#333", // Ensure the text is readable
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "10px",
  },
  dayContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
  },
  day: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333", // Ensuring proper color for the day text
  },
  timeSlotColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  timeSlot: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px", // Ensure rounded corners for time slots
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f0f0f0", // Light background for time slots
    transition: "background-color 0.3s ease", // Smooth hover effect
  },
  timeSlotSelected: {
    backgroundColor: "#007bff", // Blue background for selected slot
    color: "#fff", // White text for selected time slot
  },
  time: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#333", // Ensure visibility for the time text
  },
  content: {
    fontSize: "0.9rem",
    color: "#333", // Text color for content
  },
  noContent: {
    fontSize: "0.9rem",
    color: "#28a745", // Green for available time slots
  },
  bookButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "2px solid #1e7e34",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px", // Rounded corners for the book button
    fontWeight: "bold",
    transition: "background-color 0.3s ease", // Smooth hover effect
  },
  closeButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "2px solid #bd2130",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px", // Rounded corners for the close button
    fontWeight: "bold",
    transition: "background-color 0.3s ease", // Smooth hover effect
  },
  navButton: {
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#007bff",
    background: "transparent",
    border: "2px solid #007bff",
    padding: "5px 10px",
    borderRadius: "5px", // Rounded corners for navigation buttons
    fontWeight: "bold",
    transition: "background-color 0.3s ease", // Smooth hover effect
  },
};