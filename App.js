import { useState } from 'react';
import './App.css';

function App() {
  const [userType, setUserType] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ userType, username, password });
    setActiveSection(userType === 'student' ? 'Student' : 'Teacher');
  };
  return (
    <div className="App">
      {/* Show login card only when no section is active */}
      {!activeSection && (
        <div className="login-card">
          <center>
            <h2 className="motto">FIDE ET LABORE</h2>
            <h1 className="university-title">ST. JOSEPH'S UNIVERSITY</h1>
            <p className="portal-subtitle">CIA Portal Access</p>
          </center>
          <h2 className="card-title">Welcome Back</h2>
          <p className="card-subtitle">Please sign in to continue</p>

          <div className="tabs">
            <button
              className={`tab ${userType === 'student' ? 'active' : ''}`}
              onClick={() => {
                setUserType('student');
                if (activeSection) setActiveSection('A');
              }}
            >
              Student
            </button>
            <button
              className={`tab ${userType === 'teacher' ? 'active' : ''}`}
              onClick={() => {
                setUserType('teacher');
                if (activeSection) setActiveSection('B');
              }}
            >
              Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              required
              type="text"
              placeholder={userType === 'student' ? 'Reg No' : 'Teacher ID'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />

            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />

            <button
              type="submit"
              className="login-btn"
            >
              <p>{userType === 'student' ? 'Student Login' : 'Teacher Login'}</p>
            </button>
          </form>
          <p className="new-user-link">{userType === 'student' ? 'New Student' : 'New Teacher'}</p>
        </div>
      )}

      {!activeSection && <p className="back-link">Back to Home</p>}
    {/* Only one section visible at a time. Sections A/B map to student/teacher. */}
    {activeSection === 'Student' && (
      <div id="student-section" className="student-section">
        <h2>Student Dashboard</h2>
        <p>Welcome, {username || 'student'}.</p>
        <button className='student-logout' onClick={() => setActiveSection('')}>Logout</button>
      </div>
    )}
    {activeSection === 'Teacher' && (
      <div id="teacher-section" className="teacher-section">
        <h2>Teacher Dashboard</h2>
        <p>Welcome, {username || 'teacher'}.</p>
        <button className='teacher-logout' onClick={() => setActiveSection('')}>Logout</button>
      </div>
    )}
    </div>
  );
}
export default App;
