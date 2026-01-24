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
  };
  return (
    <div className="App">
      <div className="header-section">
        <h2 className="motto">FIDE ET LABORE</h2>
        <h1 className="university-title">ST. JOSEPH'S UNIVERSITY</h1>
        <p className="portal-subtitle">CIA Portal Access</p>
      </div>

      <div className="login-card">
        <h2 className="card-title">Welcome Back</h2>
        <p className="card-subtitle">Please sign in to continue</p>

        <div className="tabs">
          <button
            className={`tab ${userType === 'student' ? 'active' : ''}`}
            onClick={() => setUserType('student')}
          >
            Student
          </button>
          <button
            className={`tab ${userType === 'teacher' ? 'active' : ''}`}
            onClick={() => setUserType('teacher')}
          >
            Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={userType === 'student' ? 'Reg No' : 'Teacher ID'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          <button type="submit" className="login-btn" onClick={() => setActiveSection('sectionA')}>
            Show Section A
          </button>
        </form>
        <p className="new-user-link">{userType === 'student' ? 'New Student' : 'New Teacher'}</p>
      </div>

      <p className="back-link">Back to Home</p>
    {activeSection === 'sectionA' && (
      <div id="sectionA">
        <h2>Section A Content</h2>
        <p>This content is visible.</p>
      </div>
    )}
    </div>
  );
}
export default App;