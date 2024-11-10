import React,{useState} from 'react';
import './Dashboard.css';
import logo from '../assets/logo.png';

function Dashboard() {

  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { id: 'home', label: 'Home' },
    { id: 'questionbank', label: 'Question Bank' },
    { id: 'exam', label: 'Exam' },
    { id: 'results', label: 'Results' },
    { id: 'profile', label: 'Profile' },
  ];


  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-menu">
        <img src={logo} alt="" id='logo'/>
         <ul className='menu'>
            {items.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={activeIndex === index ? 'active' : ''}
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
        <header className="top-bar">
          Welcome, Nishank Kansara!
        </header>

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
          <div className="card">
            <h2>Select Date</h2>
            <input type="date" className="date-picker" />
          </div>
          
          <div className="Box">
            {/* Announcements */}
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
          <div className="Box">
            {/* Past Exams */}
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
