import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Modern font
    backgroundColor: '#f4f6f9', // Soft light background color
    color: '#000', // Black text color
    position: 'relative',
    padding: '20px',
  },
  menuContainer: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  logo: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    border: '2px solid #0056b3',
  },

  dropdownMenu: {
    position: 'absolute',
    top: '60px',
    left: '0',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    width: '150px',
    zIndex: 1000,
  },

  menuItem: {
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    fontSize: '14px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },

  // CSS for hover effect dynamically applied
  menuItemHover: {
    backgroundColor: '#f0f0f0',
  },

  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginTop: '60px',
    color: '#333',
  },

  logoutButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
  },

  mainContent: {
    display: 'flex',
    width: '90%',
    maxWidth: '1200px',
    marginTop: '20px',
  },

  sidebar: {
    width: '300px',
    padding: '20px',
    background: '#fff',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    marginRight: '20px',
    borderRadius: '5px',
  },

  textField: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },

  calendarContainer: {
    flex: 1,
    background: '#fff',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },

  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '15px',
  },

  monthHeader: {
    fontSize: '2rem',
    fontWeight: '600', // Slightly lighter weight for a modern look
    color: '#444', // Darker shade for better readability
    textAlign: 'center',
    marginBottom: '20px', // Add some spacing below for better separation
  },
  
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '15px', // Increased gap for more spacing between days
    borderRadius: '15px', // Rounded grid for a smoother appearance
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Add soft shadow to the grid
    padding: '20px',
  },
  
  dayContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '10px', // Rounded corners
    backgroundColor: '#fff', // Background color to contrast with grid
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for elevation
    transition: 'background-color 0.3s ease', // Smooth transition for hover effect
  },
  
  day: {
    fontSize: '1.4rem',
    fontWeight: '500',
    color: '#333', // Dark text for good readability
    textTransform: 'uppercase', // Make day labels stand out
  },
  
  timeSlotColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    justifyContent: 'center',
  },
  
  timeSlot: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '10px', // More rounded corners
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#fafafa', // Light background for time slots
    transition: 'background-color 0.3s ease, transform 0.2s ease', // Smooth transition on hover
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow effect
  },
  
  timeSlotSelected: {
    backgroundColor: '#007bff', // Bright blue for selection
    color: '#fff',
    transform: 'scale(1.05)', // Slightly scale up when selected for visual emphasis
  },
  
  time: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '0.5px', // Letter spacing for a more refined appearance
  },  

  content: {
    fontSize: '0.9rem',
    color: '#333',
  },

  noContent: {
    fontSize: '0.9rem',
    color: '#28a745',
  },

  bookButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: '2px solid #1e7e34',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },

  closeButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: '2px solid #bd2130',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },

  navButton: {
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#007bff',
    background: 'transparent',
    border: '2px solid #007bff',
    padding: '5px 10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },

  feedbackSection: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  textarea: {
    width: '100%',
    height: '150px',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  },

  textareaFocus: {
    borderColor: '#007bff',
  },

  feedbackButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },

  feedbackButtonHover: {
    backgroundColor: '#0056b3',
  },
};

export default styles;
