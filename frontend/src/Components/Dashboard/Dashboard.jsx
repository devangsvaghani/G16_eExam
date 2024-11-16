import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import { useAuth } from "../../context/auth.jsx";
import { useNavigate } from "react-router-dom";
import StudentProfile from "../Profile/StudentProf.jsx";
import QuestionBank from "../Questions/QuestionBank.jsx";
import Upcomingexam from "../Exam/Upcomingexam.jsx"
import Pastexam from "../Exam/Pastexam.jsx";
import Profile from "../Profile/Profile.jsx";
const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventText, setEventText] = useState("");
  const { setIsLoggedIn, validateUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.localStorage.getItem("token") === null) {
      validateUser();
      navigate("/");
    }
  }, []);

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

function Dashboard( {exams,results}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 700);
  const { setIsLoggedIn, validateUser, LogOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.localStorage.getItem("token") === null) {
      validateUser();
      navigate("/");
    }
  }, []);

  const items = [
    { id: "home", label: "Home" },
    { id: "questionbank", label: "Question Bank" },
    { id: "exam", label: "Exam" },
    { id: "results", label: "Results" },
    { id: "profile", label: "Profile" },
  ];

  const handleopenprofile = () => {
    navigate('/profile');
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 700);
      if (window.innerWidth >= 700) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard">
    {isMobileView && (
        <button className="togglebtn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      {(isSidebarOpen) && (
        <aside className="sidebar">
          <div className="sidebar-menu">
            <img src={logo} alt="Logo" id="logo" />
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
          <p className="logout" onClick={() => {LogOut()}}> Log out</p>
        </aside>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <span className="welcome-text">Welcome, Nishank Kansara!</span>
          <img src={user} alt="User profile" className="profile-image" 
            onClick={handleopenprofile}
          />
        </header>


        {/* Content Area */}
        {activeIndex==0 && <div className="content">
          {/* Upcoming Exams */}
          <div className="firstcol">
            <div className="upcomingexambox">
              <h2>Upcoming Exams</h2>
              <div className="card">
                <div className="exam">
                  <p><strong>Exam 1</strong></p>
                  <p>Professor: abc</p>
                  <p>Topics: DSA, DBMS, Node</p>
                  <p>Date: Jun 10, 2024</p>
                </div>
                <div className="exam">
                  <p><strong>Exam 1</strong></p>
                  <p>Professor: abc</p>
                  <p>Topics: DSA, DBMS, Node</p>
                  <p>Date: Jun 10, 2024</p>
                </div>
                <div className="exam">
                  <p><strong>Exam 1</strong></p>
                  <p>Professor: abc</p>
                  <p>Topics: DSA, DBMS, Node</p>
                  <p>Date: Jun 10, 2024</p>
                </div>
                <div className="exam">
                  <p><strong>Exam 1</strong></p>
                  <p>Professor: abc</p>
                  <p>Topics: DSA, DBMS, Node</p>
                  <p>Date: Jun 10, 2024</p>
                </div>
                <div className="exam">
                  <p><strong>Exam 1</strong></p>
                  <p>Professor: abc</p>
                  <p>Topics: DSA, DBMS, Node</p>
                  <p>Date: Jun 10, 2024</p>
                </div>
              </div>
            </div>
            <div className="practicequestions">
              <h1>Practice Questions</h1>
            </div>
          </div>

          {/* Calendar */}
         
          <div className="secondcol">
            <Calendar />
          <div className="percentageBox">
            <div className="progress-circle">
              <span>53%</span>
            </div>
            <div className="title">Overall Performance</div>
          </div>
        </div>

          <div className="thirdcol">
          <div className="anonouncementsBox">
            <h2>Announcements</h2>
            <div className="card">
              <div className="exam">
                <p><strong>Exam 1</strong></p>
                <p>Topics: DSA, DBMS, Node</p>
                <p>Date: Jun 10, 2024</p>
              </div>
              <div className="exam">
                <p><strong>Exam 2</strong></p>
                <p>Topics: OS, CN, AI</p>
                <p>Date: Jun 20, 2024</p>
              </div>
              <div className="exam">
                <p><strong>Exam 2</strong></p>
                <p>Topics: OS, CN, AI</p>
                <p>Date: Jun 20, 2024</p>
              </div>
              <div className="exam">
                <p><strong>Exam 2</strong></p>
                <p>Topics: OS, CN, AI</p>
                <p>Date: Jun 20, 2024</p>
              </div>
            </div>
          </div>
          <div className="pastexambox">
            <h2>Past Exams</h2>
            <div className="card">
              <div className="exam">
                <p><strong>Exam 1</strong></p>
                <p>Topics: DSA, DBMS, Node</p>
                <p>Date: May 15, 2024</p>
              </div>
              <div className="exam">
                <p><strong>Exam 1</strong></p>
                <p>Topics: DSA, DBMS, Node</p>
                <p>Date: May 15, 2024</p>
              </div>
              <div className="exam">
                <p><strong>Exam 1</strong></p>
                <p>Topics: DSA, DBMS, Node</p>
                <p>Date: May 15, 2024</p>
              </div>
              <div className="exam">
                <p><strong>Exam 2</strong></p>
                <p>Topics: OS, CN, AI</p>
                <p>Date: May 5, 2024</p>
              </div>
            </div>
          </div>
        </div>          

        </div>
}
      {activeIndex==1 && <QuestionBank/>
      }
      {activeIndex==2 && <div className="upcoming-exam-comp"><Upcomingexam exams={exams}/></div>}

      {activeIndex==3 && <div className="past-exam-comp"><Pastexam results={results}/></div>}
      {activeIndex==4 && <div className="student-profile-div"><StudentProfile/></div>}

      </div>
    </div>
  );
}

export default Dashboard;