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
import PerformanceResultPage from "../PerformanceResultPage/PerformanceResultPage.jsx";
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


const exams = [
  {
      name: "Mathematics Final Exam",
      date: "04/05/2023",
      startTime: "10:00 AM",
      duration: "02:00:00",
      startIn: "9 days 8 hours 3 minutes",
      instructor: "Dr. John Doe",
      totalMarks: 100,
      hours: "2",
      description:
          "Comprehensive final exam covering all topics in the syllabus.",
  },
  {
      name: "Physics Midterm",
      date: "04/06/2023",
      startTime: "12:00 PM",
      duration: "01:30:00",
      startIn: "7 days 6 hours 15 minutes",
      instructor: "Prof. Alice Johnson",
      totalMarks: 75,
      hours: "1.5",
      description: "Midterm covering classical mechanics and thermodynamics.",
  },
  {
      name: "Chemistry Quiz",
      date: "04/07/2023",
      startTime: "09:00 AM",
      duration: "01:00:00",
      startIn: "5 days 2 hours 40 minutes",
      instructor: "Dr. Emily Brown",
      totalMarks: 50,
      hours: "1",
      description: "Quiz on organic chemistry basics.",
  },
  {
      name: "History Exam",
      date: "04/08/2023",
      startTime: "11:00 AM",
      duration: "02:00:00",
      startIn: "8 days 11 hours 25 minutes",
      instructor: "Prof. Mark Green",
      totalMarks: 100,
      hours: "2",
      description: "Exam covering significant events from the 20th century.",
  },
  {
      name: "Biology Test",
      date: "04/09/2023",
      startTime: "08:30 AM",
      duration: "01:45:00",
      startIn: "10 days 4 hours 50 minutes",
      instructor: "Dr. Sarah Lee",
      totalMarks: 80,
      hours: "1.75",
      description: "Test on human anatomy and physiology.",
  },
  {
      name: "Geography Quiz",
      date: "04/10/2023",
      startTime: "10:15 AM",
      duration: "01:15:00",
      startIn: "6 days 9 hours 30 minutes",
      instructor: "Prof. Michael Scott",
      totalMarks: 60,
      hours: "1.25",
      description: "Quiz on world geography and map skills.",
  },
  {
      name: "Computer Science Final",
      date: "04/11/2023",
      startTime: "01:00 PM",
      duration: "02:30:00",
      startIn: "4 days 7 hours 20 minutes",
      instructor: "Dr. David Chen",
      totalMarks: 120,
      hours: "2.5",
      description: "Final exam covering algorithms and data structures.",
  },
  {
      name: "English Literature Exam",
      date: "04/12/2023",
      startTime: "02:00 PM",
      duration: "02:00:00",
      startIn: "3 days 5 hours 45 minutes",
      instructor: "Ms. Lisa White",
      totalMarks: 90,
      hours: "2",
      description: "Exam on British and American literature.",
  },
  {
      name: "Art Theory Quiz",
      date: "04/13/2023",
      startTime: "09:45 AM",
      duration: "01:00:00",
      startIn: "12 days 3 hours 10 minutes",
      instructor: "Mr. Kevin Robinson",
      totalMarks: 50,
      hours: "1",
      description: "Quiz on art movements and theories from the Renaissance.",
  },
  {
      name: "Economics Midterm",
      date: "04/14/2023",
      startTime: "11:30 AM",
      duration: "01:30:00",
      startIn: "2 days 8 hours 5 minutes",
      instructor: "Dr. Nancy Adams",
      totalMarks: 75,
      hours: "1.5",
      description: "Midterm exam covering microeconomic principles.",
  },
];

function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 700);
  const { setIsLoggedIn, validateUser, LogOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const pastExams = [
    { score: 80 },
    { score: 75 },
    { score: 90 },
    { score: 85 },
    { score: 78 },
    { score: 88 }
  ];

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
          <div style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'conic-gradient(#3F72AF 0% 53%, #e0e0e0 53%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                    <div style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: 'conic-gradient(white 0% 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
          <span>53%</span>
          </div>
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
      {activeIndex==2 && 
      <div className="upcoming-exam-comp">
      <Upcomingexam exams={exams}/>
      </div>}

      {activeIndex==3 && 
      <div className="past-exam-comp">
      <PerformanceResultPage pastExams={pastExams}/>
      </div>}
      {activeIndex==4 && <div className="student-profile-div"><StudentProfile/></div>}

      </div>
    </div>
  );
}

export default Dashboard;