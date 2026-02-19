import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost/cia-api';

function App() {
  const [userType, setUserType] = useState('student'); // 'student' or 'teacher'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeDashboard, setActiveDashboard] = useState(null); // null, 'student', or 'teacher'
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Student Dashboard Data (migrated to state so UI can interactively change)
  const [studentData, setStudentData] = useState({
    name: 'Isaac Johan',
    regNo: '232BCAA65',
    email: 'isaac.johan@sjuniv.edu',
    semester: 'Sem 6 2026',
    cgpa: 6.85,
    totalCredits: 5,
    earnedCredits: 3,
    attendance: 95,
  });

  const [courses, setCourses] = useState([
    { id: 1, code: 'CS301', name: 'Data Structures', instructor: 'Dr. Denzil', credits: 3, gpa: 4.0, grade: 'A+' },
    { id: 2, code: 'CS302', name: 'Web Development', instructor: 'Prof. Selwyn', credits: 3, gpa: 3.9, grade: 'A' },
    { id: 3, code: 'MATH201', name: 'Calculus II', instructor: 'Dr.Anand', credits: 4, gpa: 3.8, grade: 'A' },
    { id: 4, code: 'ENG101', name: 'Technical Writing', instructor: 'Prof.Prasad', credits: 3, gpa: 3.7, grade: 'A-' },
  ]);

  const [assessments, setAssessments] = useState([
    { id: 1, course: 'Data Structures', type: 'CIA 1', score: 45, total: 50, date: 'Jan 15, 2026' },
    { id: 2, course: 'Data Structures', type: 'CIA 2', score: 48, total: 50, date: 'Jan 29, 2026' },
    { id: 3, course: 'Web Development', type: 'CIA 1', score: 42, total: 50, date: 'Jan 20, 2026' },
    { id: 4, course: 'Calculus II', type: 'CIA 1', score: 46, total: 50, date: 'Jan 18, 2026' },
    { id: 5, course: 'Technical Writing', type: 'Assignment', score: 38, total: 40, date: 'Jan 25, 2026' },
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Spring Exam Schedule Released', date: 'Jan 30, 2026', priority: 'high' },
    { id: 2, title: 'Library Extended Hours Available', date: 'Jan 28, 2026', priority: 'normal' },
    { id: 3, title: 'Scholarship Application Deadline', date: 'Jan 25, 2026', priority: 'high' },
  ]);

  // UI state for selected student nav and selected course/assessment
  const [selectedNav, setSelectedNav] = useState('Dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Fetch student data when dashboard becomes active
  useEffect(() => {
    if (activeDashboard === 'student' && userId) {
      fetchStudentData(userId);
      fetchCourses(userId);
      fetchAssessments(userId);
      fetchAnnouncements();
    }
  }, [activeDashboard, userId]);

  const fetchStudentData = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/student.php?action=get&studentId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setStudentData(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
    }
  };

  const fetchCourses = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/student.php?action=courses&studentId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchAssessments = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/student.php?action=assessments&studentId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setAssessments(data);
      }
    } catch (err) {
      console.error('Error fetching assessments:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements.php?action=announcements`);
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  const handleAdminQuickLogin = (role) => {
    const pw = role === 'teacher' ? 'teacherlogin123' : 'studentlogin123';
    setUserType(role);
    setUsername('admin');
    setPassword(pw);
    setUserId(1);
    setActiveDashboard(role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType, username, password })
      });

      if (res.ok) {
        const data = await res.json();
        setUserId(data.userId);
        setActiveDashboard(userType);
      } else {
        alert('Login failed. Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Authentication error. Please check XAMPP is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setActiveDashboard(null);
    setUserId(null);
    setUsername('');
    setPassword('');
  };

  // Add connectivity check on app mount
  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const res = await fetch(`${API_BASE}/announcements.php?action=announcements`);
        if (res.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
        }
      } catch (err) {
        setConnectionStatus('offline');
        console.error('Connectivity check failed:', err);
      }
    };
    checkConnectivity();
  }, []);

  return (
    <div className="app-container">
      {/* AUTHENTICATION VIEW */}
      {!activeDashboard && (
        <div className="login-wrapper">
          <div className="login-card">
            <div className="connection-status">
              {connectionStatus === 'connected' && '✓ Connected to API'}
              {connectionStatus === 'error' && '⚠ API Error'}
              {connectionStatus === 'offline' && '✗ Offline - Check XAMPP'}
              {connectionStatus === 'checking' && '⟳ Checking connection...'}
            </div>

            <div className="brand-header">
              <h2 className="motto">FIDE ET LABORE</h2>
              <h1 className="university-title">ST. JOSEPH'S UNIVERSITY</h1>
              <div className="divider"></div>
              <p className="portal-subtitle">CIA Portal Access</p>
            </div>

            <div className="card-intro">
              <h2 className="card-title">Welcome Back</h2>
              <p className="card-subtitle">Please sign in to continue</p>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={`tab-btn ${userType === 'student' ? 'active' : ''}`}
                onClick={() => setUserType('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`tab-btn ${userType === 'teacher' ? 'active' : ''}`}
                onClick={() => setUserType('teacher')}
              >
                Teacher
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  required
                  type="text"
                  placeholder={userType === 'student' ? 'Registration Number' : 'Teacher ID'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : `Login as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
              </button>
            </form>
            
            <div className="form-footer">
              <span className="footer-link">Request Access</span>
              <button type="button" className="footer-link" onClick={() => handleAdminQuickLogin('teacher')}>Admin Login (Teacher)</button>
              <button type="button" className="footer-link" onClick={() => handleAdminQuickLogin('student')}>Admin Login (Student)</button>
              <span className="footer-link">Forgot Password?</span>
            </div>
          </div>
          <div className="back-navigation">
            <button className="text-btn">← Back to Home</button>
          </div>
        </div>
      )}

      {/* STUDENT DASHBOARD VIEW */}
      {activeDashboard === 'student' && (
        <div className="dashboard-container student-theme">
          {/* SIDEBAR NAVIGATION */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <h3>CIA Portal</h3>
            </div>
            <nav className="sidebar-nav">
              {['Dashboard','Assessments','Messages'].map((nav) => (
                <button
                  key={nav}
                  className={`nav-item ${selectedNav === nav ? 'active' : ''}`}
                  onClick={() => setSelectedNav(nav)}
                >
                  {nav}
                </button>
              ))}
            </nav>
            <button className="logout-btn sidebar-logout" onClick={handleLogout}>Sign Out</button>
          </aside>

          {/* MAIN CONTENT */}
          <div className="dashboard-main">
            {/* TOP BAR */}
            <header className="dashboard-header">
              <div className="header-left">
                <h1>Dashboard</h1>
              </div>
              <div className="header-right">
                <div className="profile-info">
                  <div className="avatar">AJ</div>
                  <div>
                    <p className="user-name">{studentData.name}</p>
                    <p className="user-id">{studentData.regNo}</p>
                  </div>
                </div>
              </div>
            </header>

            {/* DASHBOARD CONTENT */}
            <main className="dashboard-content">
              {/* WELCOME SECTION */}
              <section className="welcome-section">
                <div className="welcome-banner">
                  <div>
                    <h2>Welcome back, {studentData.name.split(' ')[0]}! </h2>
                    <p>Here's your academic performance overview for {studentData.semester}</p>
                  </div>
                </div>
              </section>

              {/* STATS GRID */}
              <section className="stats-grid">
                <div className="stat-card cgpa-card">
                  <div className="stat-content">
                    <p className="stat-label">CGPA</p>
                    <p className="stat-value">{studentData.cgpa}</p>
                    <p className="stat-detail">Excellent Performance</p>
                  </div>
                </div>

                <div className="stat-card credits-card">
                  <div className="stat-content">
                    <p className="stat-label">Credits Earned</p>
                    <p className="stat-value">{studentData.earnedCredits}/{studentData.totalCredits}</p>
                    <p className="stat-detail">100% Complete</p>
                  </div>
                </div>

                <div className="stat-card attendance-card">
                  <div className="stat-content">
                    <p className="stat-label">Attendance</p>
                    <p className="stat-value">{studentData.attendance}%</p>
                    <p className="stat-detail">Very Good</p>
                  </div>
                </div>

                <div className="stat-card gpa-card">
                  <div className="stat-content">
                    <p className="stat-label">Semester GPA</p>
                    <p className="stat-value">3.9</p>
                    <p className="stat-detail">12 Credits</p>
                  </div>
                </div>
              </section>

              {/* TWO COLUMN LAYOUT */}
              <div className="dashboard-grid">
                {/* LEFT COLUMN */}
                <div className="left-column">
                  {/* CURRENT COURSES */}
                  <section className="card courses-card">
                    <div className="card-header">
                      <h3>Current Courses</h3>
                      <button className="view-all-btn">View All →</button>
                    </div>
                      <div className="courses-list">
                        {courses.map((course) => (
                          <div
                            key={course.id}
                            className={`course-item ${selectedCourse === course.id ? 'selected' : ''}`}
                            onClick={() => setSelectedCourse(course.id)}
                          >
                            <div className="course-info">
                              <h4>{course.code}</h4>
                              <p>{course.name}</p>
                              <small>{course.instructor}</small>
                            </div>
                            <div className="course-grade">
                              <span className="grade-badge">{course.grade}</span>
                              <small>{course.gpa.toFixed(2)}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                  </section>

                  {/* RECENT ASSESSMENTS */}
                  <section className="card assessments-card">
                    <div className="card-header">
                      <h3>Recent Assessments</h3>
                      <button className="view-all-btn">View All →</button>
                    </div>
                    <div className="assessments-list">
                      {assessments.slice(0, 4).map((assessment) => (
                        <div
                          key={assessment.id}
                          className={`assessment-item ${selectedAssessment === assessment.id ? 'selected' : ''}`}
                          onClick={() => setSelectedAssessment(assessment.id)}
                        >
                          <div className="assessment-info">
                            <h4>{assessment.course}</h4>
                            <p>{assessment.type}</p>
                          </div>
                          <div className="assessment-score">
                            <span className="score-badge">{assessment.score}/{assessment.total}</span>
                            <small>{assessment.date}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* RIGHT COLUMN */}
                <div className="right-column">
                  {/* ANNOUNCEMENTS */}
                  <section className="card announcements-card">
                    <div className="card-header">
                      <h3>Announcements</h3>
                    </div>
                    <div className="announcements-list">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className={`announcement-item ${announcement.priority}`}>
                          <div className="announcement-badge">
                            {announcement.priority === 'high' ? '🔔' : 'ℹ️'}
                          </div>
                          <div className="announcement-content">
                            <h4>{announcement.title}</h4>
                            <small>{announcement.date}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* TEACHER DASHBOARD VIEW */}
      {activeDashboard === 'teacher' && (
        <div className="dashboard-container teacher-theme">
          <aside className="sidebar">
            <div className="sidebar-header">
              <h3>Faculty Portal</h3>
            </div>
            <nav className="sidebar-nav">
              {['Dashboard','Courses','Assessments','Students','Messages','Settings'].map((nav) => (
                <button
                  key={nav}
                  className={`nav-item ${selectedNav === nav ? 'active' : ''}`}
                  onClick={() => setSelectedNav(nav)}
                >
                  {nav}
                </button>
              ))}
            </nav>
            <button className="logout-btn sidebar-logout" onClick={handleLogout}>Sign Out</button>
          </aside>

          <div className="dashboard-main">
            <header className="dashboard-header">
              <div className="header-left">
                <h1>Faculty Dashboard</h1>
              </div>
              <div className="header-right">
                <div className="profile-info">
                  <div className="avatar">P</div>
                  <div>
                    <p className="user-name">Prof. {username || 'Teacher'}</p>
                    <p className="user-id">{userId ? `ID: ${userId}` : ''}</p>
                  </div>
                </div>
              </div>
            </header>

            <main className="dashboard-content">
              <section className="welcome-section">
                <div className="welcome-banner">
                  <div>
                    <h2>Welcome, Prof. {username || ''}</h2>
                    <p>Manage courses, assessments and student records.</p>
                  </div>
                </div>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-content">
                    <p className="stat-label">Courses</p>
                    <p className="stat-value">{courses.length}</p>
                    <p className="stat-detail">Active Courses</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-content">
                    <p className="stat-label">Assessments</p>
                    <p className="stat-value">{assessments.length}</p>
                    <p className="stat-detail">Total Assessments</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-content">
                    <p className="stat-label">Announcements</p>
                    <p className="stat-value">{announcements.length}</p>
                    <p className="stat-detail">Active Notices</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-content">
                    <p className="stat-label">Pending Grades</p>
                    <p className="stat-value">{assessments.filter(a => !a.score || a.score === 0).length}</p>
                    <p className="stat-detail">Needs Review</p>
                  </div>
                </div>
              </section>

              <div className="dashboard-grid">
                <div className="left-column">
                  <section className="card courses-card">
                    <div className="card-header">
                      <h3>Your Courses</h3>
                      <button className="view-all-btn">View All →</button>
                    </div>
                    <div className="courses-list">
                      {courses.map((c) => (
                        <div key={c.id} className="course-item">
                          <div className="course-info">
                            <h4>{c.code}</h4>
                            <p>{c.name}</p>
                            <small>{c.instructor}</small>
                          </div>
                          <div className="course-actions">
                            <button onClick={() => {
                              const updated = courses.map(item => item.id === c.id ? { ...item, name: item.name + ' (edited)' } : item);
                              setCourses(updated);
                            }}>Quick Edit</button>
                            <button onClick={() => setCourses(prev => prev.filter(item => item.id !== c.id))}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="card assessments-card">
                    <div className="card-header">
                      <h3>Recent Assessments</h3>
                      <button className="view-all-btn">View All →</button>
                    </div>
                    <div className="assessments-list">
                      {assessments.slice(0, 6).map((as) => (
                        <div key={as.id} className="assessment-item">
                          <div className="assessment-info">
                            <h4>{as.course}</h4>
                            <p>{as.type} — {as.date}</p>
                          </div>
                          <div className="assessment-score">
                            <input
                              type="number"
                              value={as.score}
                              onChange={(e) => setAssessments(prev => prev.map(item => item.id === as.id ? { ...item, score: Number(e.target.value) } : item))}
                              style={{width:80}}
                            />
                            <small>/ {as.total}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="right-column">
                  <section className="card announcements-card">
                    <div className="card-header">
                      <h3>Announcements</h3>
                    </div>
                    <div className="announcements-list">
                      {announcements.map((a) => (
                        <div key={a.id} className={`announcement-item ${a.priority}`}>
                          <div className="announcement-badge">{a.priority === 'high' ? '🔔' : 'ℹ️'}</div>
                          <div className="announcement-content">
                            <h4>{a.title}</h4>
                            <small>{a.date}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{padding:12}}>
                      <button onClick={() => setAnnouncements(prev => [...prev, { id: Date.now(), title: 'New Announcement', date: 'Today', priority: 'normal' }])}>Add Announcement</button>
                    </div>
                  </section>

                  <section className="card teacher-tools-card">
                    <div className="card-header"><h3>Teacher Tools</h3></div>
                    <div style={{padding:12}}>
                      <p>Edit courses, assessments and announcements in the panels below.</p>
                      {/* Reuse existing editable controls compactly */}
                      <div className="control-panel-compact">
                        <h4>Courses</h4>
                        {courses.map(c => (
                          <div key={c.id} style={{display:'flex', gap:8, marginBottom:6}}>
                            <input value={c.code} onChange={(e) => setCourses(prev => prev.map(item => item.id === c.id ? { ...item, code: e.target.value } : item))} style={{width:80}} />
                            <input value={c.name} onChange={(e) => setCourses(prev => prev.map(item => item.id === c.id ? { ...item, name: e.target.value } : item))} />
                          </div>
                        ))}
                        <button onClick={() => setCourses(prev => [...prev, { id: Date.now(), code: 'NEW101', name: 'New Course', instructor: 'TBD', credits: 3, gpa: 0, grade: 'N/A' }])}>Add Course</button>
                      </div>
                      <div style={{height:12}} />
                      <div className="control-panel-compact">
                        <h4>Assessments</h4>
                        {assessments.map(a => (
                          <div key={a.id} style={{display:'flex', gap:8, marginBottom:6}}>
                            <input value={a.course} onChange={(e) => setAssessments(prev => prev.map(item => item.id === a.id ? { ...item, course: e.target.value } : item))} style={{width:120}} />
                            <input value={a.type} onChange={(e) => setAssessments(prev => prev.map(item => item.id === a.id ? { ...item, type: e.target.value } : item))} style={{width:100}} />
                            <input value={a.score} onChange={(e) => setAssessments(prev => prev.map(item => item.id === a.id ? { ...item, score: Number(e.target.value) } : item))} style={{width:60}} />
                          </div>
                        ))}
                        <button onClick={() => setAssessments(prev => [...prev, { id: Date.now(), course: 'New Course', type: 'Quiz', score: 0, total: 10, date: 'Today' }])}>Add Assessment</button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
