export const styles: { [key: string]: React.CSSProperties } = {

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