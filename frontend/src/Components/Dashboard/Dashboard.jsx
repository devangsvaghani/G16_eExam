import React, { useState } from "react";
import "./Dashboard.css";
import logo from "../assets/logo.png";

const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventText, setEventText] = useState("");

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDate = (day) => {
    return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    const eventKey = formatDate(day);
    setEventText(events[eventKey] || "");
  };

  const handleEventChange = (e) => {
    setEventText(e.target.value);
  };

  const saveEvent = () => {
    const eventKey = formatDate(selectedDate);
    setEvents((prevEvents) => ({ ...prevEvents, [eventKey]: eventText }));
    setSelectedDate(null);
  };

  const removeEvent = () => {
    const eventKey = formatDate(selectedDate);
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      delete updatedEvents[eventKey];
      return updatedEvents;
    });
    setEventText("");
    setSelectedDate(null);
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const daysArray = Array.from({ length: startDayOfMonth }, () => null).concat(
      Array.from({ length: totalDays }, (_, i) => i + 1)
    );

    return daysArray.map((day, index) => {
      if (!day) return <div key={index} className="calendar-day empty" />;
      const eventKey = formatDate(day);
      return (
        <div
          key={index}
          className={`calendar-day ${day ? "active" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {events[eventKey] && <div className="event" />}
        </div>
      );
    });
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2 >
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid-day">
        <div className="calendar-day-name">Sun</div>
        <div className="calendar-day-name">Mon</div>
        <div className="calendar-day-name">Tue</div>
        <div className="calendar-day-name">Wed</div>
        <div className="calendar-day-name">Thu</div>
        <div className="calendar-day-name">Fri</div>
        <div className="calendar-day-name">Sat</div>
      </div>
      <div className="calendar-grid">
        {renderDays()}
      </div>

      {selectedDate && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Event for {selectedDate} {currentDate.toLocaleString("default", { month: "long" })}</h3>
            <textarea
              value={eventText}
              onChange={handleEventChange}
              placeholder="Enter event details"
            />
            <button onClick={saveEvent}>Save Event</button>
            <button onClick={removeEvent}>Remove Event</button>
            <button className="event-close" onClick={() => setSelectedDate(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { id: "home", label: "Home" },
    { id: "questionbank", label: "Question Bank" },
    { id: "exam", label: "Exam" },
    { id: "results", label: "Results" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-menu">
          <img src={logo} alt="" id="logo" />
          <ul className="menu">
            {items.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={activeIndex === index ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <a className="logout">Log out</a>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">Welcome, Nishank Kansara!</header>

        {/* Content Area */}
        <div className="content">
          {/* Upcoming Exams */}
          <div className="Box">
            <h2>Upcoming Exams</h2>
            <div className="card">
              <div className="exam">
                <p><strong>Exam 1</strong></p>
                <p>Professor: abc</p>
                <p>Topics: DSA, DBMS, Node</p>
                <p>Date: Jun 10, 2024</p>
              </div>
              <div className="exam">
                <p><strong>Exam 2</strong></p>
                <p>Professor: xyz</p>
                <p>Topics: OS, CN, AI</p>
                <p>Date: Jun 20, 2024</p>
              </div>
            </div>
          </div>

          {/* Calendar */}
         
           
            <Calendar />
            
          
          

          {/* Announcements */}
          <div className="Box">
            <h2>Announcements</h2>
            <div className="card">
              <div className="announcement">
                <p><strong>Exam 1</strong></p>
                <p>Topics: DSA, DBMS, Node</p>
                <p>Date: Jun 10, 2024</p>
              </div>
              <div className="announcement">
                <p><strong>Exam 2</strong></p>
                <p>Topics: OS, CN, AI</p>
                <p>Date: Jun 20, 2024</p>
              </div>
            </div>
          </div>

          {/* Past Exams */}
          <div className="Box">
            <h2>Past Exams</h2>
            <div className="card">
              <div className="past-exam">
                <p><strong>Exam 1</strong></p>
                <p>Topics: DSA, DBMS, Node</p>
                <p>Date: May 15, 2024</p>
              </div>
              <div className="past-exam">
                <p><strong>Exam 2</strong></p>
                <p>Topics: OS, CN, AI</p>
                <p>Date: May 5, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
