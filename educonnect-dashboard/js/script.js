// EduConnect School Management Dashboard JavaScript

// Global state management
const AppState = {
  currentUser: null,
  currentRole: null,
  theme: localStorage.getItem("theme") || "light",
  students: JSON.parse(localStorage.getItem("students")) || [],
  courses: JSON.parse(localStorage.getItem("courses")) || [],
  grades: JSON.parse(localStorage.getItem("grades")) || [],
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Apply saved theme
  applyTheme(AppState.theme)

  // Initialize event listeners
  setupEventListeners()

  // Load sample data if none exists
  if (AppState.students.length === 0) {
    loadSampleData()
  }

  console.log("[v0] EduConnect app initialized")
}

function setupEventListeners() {
  // Theme toggle
  const themeToggle = document.getElementById("themeToggle")
  themeToggle.addEventListener("click", toggleTheme)

  // Role selection
  const roleButtons = document.querySelectorAll(".role-btn")
  roleButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectRole(btn.dataset.role))
  })

  // Login form
  const loginForm = document.getElementById("loginForm")
  loginForm.addEventListener("submit", handleLogin)
}

function selectRole(role) {
  // Remove previous selection
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.classList.remove("selected")
  })

  // Add selection to clicked role
  const selectedBtn = document.querySelector(`[data-role="${role}"]`)
  selectedBtn.classList.add("selected")

  // Update app state
  AppState.currentRole = role

  // Enable login button
  const loginBtn = document.getElementById("loginBtn")
  loginBtn.disabled = false
  loginBtn.textContent = `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`

  console.log("[v0] Role selected:", role)
}

function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  if (!AppState.currentRole) {
    alert("Please select a role first")
    return
  }

  // Simple validation (in real app, this would be server-side)
  if (username.trim() === "" || password.trim() === "") {
    alert("Please fill in all fields")
    return
  }

  // Simulate login success
  AppState.currentUser = {
    username: username,
    role: AppState.currentRole,
    loginTime: new Date().toISOString(),
  }

  // Save to localStorage
  localStorage.setItem("currentUser", JSON.stringify(AppState.currentUser))

  // Hide login page and show dashboard
  showDashboard()

  console.log("[v0] User logged in:", AppState.currentUser)
}

function showDashboard() {
  const loginPage = document.getElementById("loginPage")
  const dashboardContainer = document.getElementById("dashboardContainer")

  loginPage.classList.add("hidden")
  dashboardContainer.classList.remove("hidden")

  // Load appropriate dashboard based on role
  loadDashboard(AppState.currentRole)
}

function loadDashboard(role) {
  const dashboardContainer = document.getElementById("dashboardContainer")

  dashboardContainer.innerHTML = `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span>🎓</span>
          EduConnect
        </div>
        <button class="sidebar-toggle" id="sidebarToggle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        ${generateNavigation(role)}
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            ${AppState.currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div class="user-info">
            <h4>${AppState.currentUser.username}</h4>
            <p>${role}</p>
          </div>
        </div>
        <button class="logout-btn" onclick="logout()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
    
    <div class="main-content" id="mainContent">
      <header class="main-header">
        <button class="mobile-menu-btn" id="mobileMenuBtn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
        <h1 id="pageTitle">Dashboard</h1>
        <div class="header-actions">
          <button class="theme-toggle" onclick="toggleTheme()">
            ${
              AppState.theme === "dark"
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
            }
          </button>
        </div>
      </header>
      
      <main class="main-body" id="mainBody">
        ${generateDashboardContent(role)}
      </main>
    </div>
  `

  // Setup dashboard event listeners
  setupDashboardEventListeners()

  console.log("[v0] Dashboard loaded for role:", role)
}

function generateNavigation(role) {
  const commonNav = `
    <div class="nav-section">
      <div class="nav-section-title">Main</div>
      <button class="nav-item active" data-page="dashboard">
        <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
        <span class="nav-item-text">Dashboard</span>
      </button>
    </div>
  `

  let roleSpecificNav = ""

  switch (role) {
    case "admin":
      roleSpecificNav = `
        <div class="nav-section">
          <div class="nav-section-title">Management</div>
          <button class="nav-item" data-page="students">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="nav-item-text">Students</span>
          </button>
          <button class="nav-item" data-page="courses">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span class="nav-item-text">Courses</span>
          </button>
          <button class="nav-item" data-page="teachers">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <path d="M20 8v6M23 11h-6"/>
            </svg>
            <span class="nav-item-text">Teachers</span>
          </button>
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Analytics</div>
          <button class="nav-item" data-page="reports">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            <span class="nav-item-text">Reports</span>
          </button>
        </div>
      `
      break

    case "teacher":
      roleSpecificNav = `
        <div class="nav-section">
          <div class="nav-section-title">Teaching</div>
          <button class="nav-item" data-page="my-classes">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span class="nav-item-text">My Classes</span>
          </button>
          <button class="nav-item" data-page="grades">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <span class="nav-item-text">Grade Book</span>
          </button>
          <button class="nav-item" data-page="students">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="nav-item-text">My Students</span>
          </button>
        </div>
      `
      break

    case "student":
      roleSpecificNav = `
        <div class="nav-section">
          <div class="nav-section-title">Academics</div>
          <button class="nav-item" data-page="courses">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span class="nav-item-text">My Courses</span>
          </button>
          <button class="nav-item" data-page="grades">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            <span class="nav-item-text">My Grades</span>
          </button>
          <button class="nav-item" data-page="profile">
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
            <span class="nav-item-text">Profile</span>
          </button>
        </div>
      `
      break
  }

  return commonNav + roleSpecificNav
}

function generateGradeDistributionChart() {
  const gradeCount = { A: 0, B: 0, C: 0, D: 0, F: 0 }

  AppState.grades.forEach((grade) => {
    const letter = grade.grade.charAt(0)
    if (gradeCount[letter] !== undefined) {
      gradeCount[letter]++
    }
  })

  const total = Object.values(gradeCount).reduce((sum, count) => sum + count, 0)
  const colors = ["var(--chart-2)", "var(--chart-1)", "var(--chart-3)", "var(--chart-4)", "var(--destructive)"]

  return `
    <div class="chart-container">
      <h3 class="chart-title">Grade Distribution</h3>
      <div class="pie-chart">
        <div class="pie-chart-visual" style="background: conic-gradient(
          ${Object.entries(gradeCount)
            .map(([letter, count], index) => {
              const percentage = total > 0 ? (count / total) * 360 : 0
              const startAngle = Object.entries(gradeCount)
                .slice(0, index)
                .reduce((sum, [, c]) => sum + (total > 0 ? (c / total) * 360 : 0), 0)
              return `${colors[index]} ${startAngle}deg ${startAngle + percentage}deg`
            })
            .join(", ")}
        )"></div>
        <div class="pie-chart-legend">
          ${Object.entries(gradeCount)
            .map(([letter, count], index) => {
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0
              return `
              <div class="legend-item">
                <div class="legend-color" style="background: ${colors[index]}"></div>
                <span class="legend-text">${letter}: ${count} (${percentage}%)</span>
              </div>
            `
            })
            .join("")}
        </div>
      </div>
    </div>
  `
}

function generatePerformanceChart() {
  const coursePerformance = AppState.courses.map((course) => {
    const courseGrades = AppState.grades.filter((grade) => grade.courseId === course.id)
    const avgScore =
      courseGrades.length > 0
        ? Math.round(courseGrades.reduce((sum, grade) => sum + grade.score, 0) / courseGrades.length)
        : 0
    return { name: course.name, score: avgScore }
  })

  return `
    <div class="chart-container">
      <h3 class="chart-title">Course Performance</h3>
      <div class="performance-chart">
        ${coursePerformance
          .map(
            (course) => `
          <div class="performance-bar" 
               style="height: ${Math.max(course.score, 10)}%; background: var(--chart-${Math.floor(Math.random() * 4) + 1})"
               data-value="${course.score}%"
               title="${course.name}: ${course.score}%">
          </div>
        `,
          )
          .join("")}
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--muted-foreground);">
        ${coursePerformance
          .map(
            (course) => `
          <span style="flex: 1; text-align: center; overflow: hidden; text-overflow: ellipsis;">${course.name.substring(0, 8)}</span>
        `,
          )
          .join("")}
      </div>
    </div>
  `
}

function generateStudentProgressChart(studentId) {
  const studentGrades = getGradesByStudentId(studentId)
  const gradesByMonth = {}

  studentGrades.forEach((grade) => {
    const month = new Date(grade.dateAdded).toLocaleDateString("en-US", { month: "short" })
    if (!gradesByMonth[month]) gradesByMonth[month] = []
    gradesByMonth[month].push(grade.score)
  })

  const monthlyAvg = Object.entries(gradesByMonth).map(([month, scores]) => ({
    month,
    avg: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
  }))

  return `
    <div class="chart-container">
      <h3 class="chart-title">Grade Progress</h3>
      <div class="progress-chart">
        ${monthlyAvg
          .map(
            (data) => `
          <div class="progress-item">
            <span class="progress-label">${data.month}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${data.avg}%; background: var(--chart-2)"></div>
            </div>
            <span class="progress-value">${data.avg}%</span>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `
}

function generateDashboardContent(role) {
  const welcomeMessage = `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Welcome back, ${AppState.currentUser.username}!</h3>
      </div>
      <div class="card-content">
        <p>You're logged in as ${role.charAt(0).toUpperCase() + role.slice(1)}. Use the navigation menu to access your tools and information.</p>
      </div>
    </div>
  `

  let statsCards = ""
  let charts = ""

  switch (role) {
    case "admin":
      statsCards = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${AppState.students.length}</div>
            <div class="stat-label">Total Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${AppState.courses.length}</div>
            <div class="stat-label">Active Courses</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${AppState.grades.length}</div>
            <div class="stat-label">Total Grades</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${Math.round(AppState.grades.reduce((sum, g) => sum + g.score, 0) / AppState.grades.length) || 0}%</div>
            <div class="stat-label">Average Score</div>
          </div>
        </div>
      `
      charts = generateGradeDistributionChart() + generatePerformanceChart()
      break

    case "teacher":
      const teacherCourses = AppState.courses.filter((course) => course.teacher.includes(AppState.currentUser.username))
      statsCards = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${teacherCourses.length || AppState.courses.length}</div>
            <div class="stat-label">My Classes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${AppState.students.length}</div>
            <div class="stat-label">Total Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${AppState.grades.length}</div>
            <div class="stat-label">Grades Given</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${Math.round(AppState.grades.reduce((sum, g) => sum + g.score, 0) / AppState.grades.length) || 0}%</div>
            <div class="stat-label">Class Average</div>
          </div>
        </div>
      `
      charts = generateGradeDistributionChart() + generatePerformanceChart()
      break

    case "student":
      const studentGrades = getGradesByStudentId(1) // Assuming student ID 1 for demo
      const avgScore =
        studentGrades.length > 0
          ? Math.round(studentGrades.reduce((sum, grade) => sum + grade.score, 0) / studentGrades.length)
          : 0
      const gpa = calculateGPA(studentGrades)

      statsCards = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${AppState.courses.length}</div>
            <div class="stat-label">Enrolled Courses</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${avgScore}%</div>
            <div class="stat-label">Average Score</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${gpa}</div>
            <div class="stat-label">Current GPA</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${studentGrades.length}</div>
            <div class="stat-label">Completed Assignments</div>
          </div>
        </div>
      `
      charts = generateStudentProgressChart(1)
      break
  }

  return `
    <div class="dashboard-grid">
      ${welcomeMessage}
      ${statsCards}
      ${charts}
    </div>
  `
}

function setupDashboardEventListeners() {
  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle")
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("mainContent")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
      mainContent.classList.toggle("expanded")
    })
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open")
    })
  }

  // Navigation items
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from all items
      navItems.forEach((nav) => nav.classList.remove("active"))
      // Add active class to clicked item
      item.classList.add("active")

      // Update page title and content
      const pageTitle = document.getElementById("pageTitle")
      const pageName = item.dataset.page
      if (pageTitle && pageName) {
        pageTitle.textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace("-", " ")
      }

      loadPageContent(pageName)

      // Close mobile menu
      sidebar.classList.remove("mobile-open")

      console.log("[v0] Navigation to:", pageName)
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      sidebar.classList.remove("mobile-open")
    }
  })
}

function loadPageContent(pageName) {
  const mainBody = document.getElementById("mainBody")

  switch (pageName) {
    case "dashboard":
      mainBody.innerHTML = generateDashboardContent(AppState.currentUser.role)
      break
    case "students":
      if (AppState.currentUser.role === "admin") {
        mainBody.innerHTML = generateStudentManagementPage()
        setupStudentManagementListeners()
      } else if (AppState.currentUser.role === "teacher") {
        mainBody.innerHTML = generateTeacherStudentsPage()
        setupTeacherStudentsListeners()
      }
      break
    case "courses":
      if (AppState.currentUser.role === "student") {
        mainBody.innerHTML = generateStudentCoursesPage()
        setupStudentCoursesListeners()
      } else {
        mainBody.innerHTML = generateCoursesPage()
      }
      break
    case "teachers":
      if (AppState.currentUser.role === "admin") {
        mainBody.innerHTML = generateTeachersPage()
      }
      break
    case "reports":
      if (AppState.currentUser.role === "admin") {
        mainBody.innerHTML = generateReportsPage()
      }
      break
    case "my-classes":
      if (AppState.currentUser.role === "teacher") {
        mainBody.innerHTML = generateTeacherClassesPage()
        setupTeacherClassesListeners()
      }
      break
    case "grades":
      if (AppState.currentUser.role === "teacher") {
        mainBody.innerHTML = generateTeacherGradesPage()
        setupTeacherGradesListeners()
      } else if (AppState.currentUser.role === "student") {
        mainBody.innerHTML = generateStudentGradesPage()
        setupStudentGradesListeners()
      }
      break
    case "profile":
      if (AppState.currentUser.role === "student") {
        mainBody.innerHTML = generateStudentProfilePage()
        setupStudentProfileListeners()
      }
      break
    default:
      mainBody.innerHTML = `<div class="page-content"><p>Page "${pageName}" is under development.</p></div>`
  }
}

function generateStudentManagementPage() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h2>Student Management</h2>
        <p>Manage student records, enrollment, and information</p>
      </div>
      
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">All Students (${AppState.students.length})</h3>
          <div class="table-actions">
            <input 
              type="text" 
              class="search-input" 
              id="studentSearch" 
              placeholder="Search students..."
            >
            <select class="search-input" id="gradeFilter" style="min-width: 120px;">
              <option value="">All Grades</option>
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
            </select>
            <button class="btn btn-primary" onclick="openAddStudentModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Student
            </button>
          </div>
        </div>
        
        <div id="studentsTableContainer">
          ${generateStudentsTable(AppState.students)}
        </div>
      </div>
    </div>
  `
}

function generateStudentsTable(students) {
  if (students.length === 0) {
    return `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <h3>No students found</h3>
        <p>Add your first student to get started</p>
      </div>
    `
  }

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Grade</th>
          <th>Enrollment Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${students
          .map(
            (student) => `
          <tr>
            <td>#${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td><span class="grade-badge grade-${student.grade.toLowerCase()}">${student.grade}</span></td>
            <td>${new Date(student.enrollmentDate).toLocaleDateString()}</td>
            <td class="table-actions-cell">
              <button class="btn btn-secondary btn-sm" onclick="openEditStudentModal(${student.id})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteStudent(${student.id})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Delete
              </button>
            </td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `
}

function setupStudentManagementListeners() {
  // Search functionality
  const searchInput = document.getElementById("studentSearch")
  const gradeFilter = document.getElementById("gradeFilter")

  if (searchInput) {
    searchInput.addEventListener("input", filterStudents)
  }

  if (gradeFilter) {
    gradeFilter.addEventListener("change", filterStudents)
  }
}

function filterStudents() {
  const searchTerm = document.getElementById("studentSearch")?.value.toLowerCase() || ""
  const gradeFilter = document.getElementById("gradeFilter")?.value || ""

  const filteredStudents = AppState.students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.id.toString().includes(searchTerm)
    const matchesGrade = !gradeFilter || student.grade === gradeFilter

    return matchesSearch && matchesGrade
  })

  const tableContainer = document.getElementById("studentsTableContainer")
  if (tableContainer) {
    tableContainer.innerHTML = generateStudentsTable(filteredStudents)
  }
}

function openAddStudentModal() {
  const modal = createStudentModal("Add New Student", null)
  document.body.appendChild(modal)
}

function openEditStudentModal(studentId) {
  const student = getStudentById(studentId)
  if (student) {
    const modal = createStudentModal("Edit Student", student)
    document.body.appendChild(modal)
  }
}

function createStudentModal(title, student = null) {
  const isEdit = student !== null
  const modalId = isEdit ? "editStudentModal" : "addStudentModal"

  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" onclick="closeModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="${modalId}Form">
          <div class="form-group">
            <label for="studentName">Full Name</label>
            <input type="text" id="studentName" name="name" required 
                   value="${student ? student.name : ""}" placeholder="Enter student's full name">
          </div>
          <div class="form-group">
            <label for="studentEmail">Email Address</label>
            <input type="email" id="studentEmail" name="email" required 
                   value="${student ? student.email : ""}" placeholder="Enter email address">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="studentGrade">Grade Level</label>
              <select id="studentGrade" name="grade" required>
                <option value="">Select Grade</option>
                <option value="9th" ${student && student.grade === "9th" ? "selected" : ""}>9th Grade</option>
                <option value="10th" ${student && student.grade === "10th" ? "selected" : ""}>10th Grade</option>
                <option value="11th" ${student && student.grade === "11th" ? "selected" : ""}>11th Grade</option>
                <option value="12th" ${student && student.grade === "12th" ? "selected" : ""}>12th Grade</option>
              </select>
            </div>
            <div class="form-group">
              <label for="enrollmentDate">Enrollment Date</label>
              <input type="date" id="enrollmentDate" name="enrollmentDate" required 
                     value="${student ? student.enrollmentDate : new Date().toISOString().split("T")[0]}">
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="${isEdit ? `updateStudent(${student.id})` : "addStudent()"}">
          ${isEdit ? "Update Student" : "Add Student"}
        </button>
      </div>
    </div>
  `

  return modal
}

function addStudent() {
  const form = document.getElementById("addStudentModalForm")
  const formData = new FormData(form)

  // Validate form
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  // Create new student
  const newStudent = {
    id: Math.max(...AppState.students.map((s) => s.id), 0) + 1,
    name: formData.get("name"),
    email: formData.get("email"),
    grade: formData.get("grade"),
    enrollmentDate: formData.get("enrollmentDate"),
  }

  // Add to state and save
  AppState.students.push(newStudent)
  saveData()

  // Refresh the table
  loadPageContent("students")
  closeModal()

  console.log("[v0] Student added:", newStudent)
}

function updateStudent(studentId) {
  const form = document.getElementById("editStudentModalForm")
  const formData = new FormData(form)

  // Validate form
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  // Find and update student
  const studentIndex = AppState.students.findIndex((s) => s.id === studentId)
  if (studentIndex !== -1) {
    AppState.students[studentIndex] = {
      ...AppState.students[studentIndex],
      name: formData.get("name"),
      email: formData.get("email"),
      grade: formData.get("grade"),
      enrollmentDate: formData.get("enrollmentDate"),
    }

    saveData()
    loadPageContent("students")
    closeModal()

    console.log("[v0] Student updated:", AppState.students[studentIndex])
  }
}

function confirmDeleteStudent(studentId) {
  const student = getStudentById(studentId)
  if (student && confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
    deleteStudent(studentId)
  }
}

function deleteStudent(studentId) {
  // Remove student from state
  AppState.students = AppState.students.filter((s) => s.id !== studentId)

  // Remove associated grades
  AppState.grades = AppState.grades.filter((g) => g.studentId !== studentId)

  saveData()
  loadPageContent("students")

  console.log("[v0] Student deleted:", studentId)
}

function closeModal() {
  const modal = document.querySelector(".modal-overlay")
  if (modal) {
    modal.remove()
  }
}

function generateCoursesPage() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h2>Course Management</h2>
        <p>Manage courses, assignments, and curriculum</p>
      </div>
      <div class="dashboard-card">
        <div class="card-content">
          <p>Course management functionality will be implemented in the next phase.</p>
        </div>
      </div>
    </div>
  `
}

function generateTeachersPage() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h2>Teacher Management</h2>
        <p>Manage teacher profiles and assignments</p>
      </div>
      <div class="dashboard-card">
        <div class="card-content">
          <p>Teacher management functionality will be implemented in the next phase.</p>
        </div>
      </div>
    </div>
  `
}

function generateReportsPage() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h2>Reports & Analytics</h2>
        <p>View comprehensive reports and analytics</p>
      </div>
      <div class="dashboard-card">
        <div class="card-content">
          <p>Reports and analytics functionality will be implemented in the next phase.</p>
        </div>
      </div>
    </div>
  `
}

function logout() {
  // Clear user data
  AppState.currentUser = null
  AppState.currentRole = null
  localStorage.removeItem("currentUser")

  // Reset form
  document.getElementById("loginForm").reset()
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.classList.remove("selected")
  })

  const loginBtn = document.getElementById("loginBtn")
  loginBtn.disabled = true
  loginBtn.textContent = "Select a role to continue"

  // Show login page
  document.getElementById("loginPage").classList.remove("hidden")
  document.getElementById("dashboardContainer").classList.add("hidden")

  console.log("[v0] User logged out")
}

function toggleTheme() {
  AppState.theme = AppState.theme === "light" ? "dark" : "light"
  applyTheme(AppState.theme)
  localStorage.setItem("theme", AppState.theme)

  console.log("[v0] Theme toggled to:", AppState.theme)
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark")
  } else {
    document.body.classList.remove("dark")
  }

  // Update theme toggle icon
  const themeToggle = document.getElementById("themeToggle")
  if (theme === "dark") {
    themeToggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `
  } else {
    themeToggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        `
  }
}

function loadSampleData() {
  // Sample students data
  AppState.students = [
    { id: 1, name: "Alice Johnson", email: "alice@school.edu", grade: "10th", enrollmentDate: "2024-09-01" },
    { id: 2, name: "Bob Smith", email: "bob@school.edu", grade: "11th", enrollmentDate: "2024-09-01" },
    { id: 3, name: "Carol Davis", email: "carol@school.edu", grade: "9th", enrollmentDate: "2024-09-01" },
    { id: 4, name: "David Wilson", email: "david@school.edu", grade: "12th", enrollmentDate: "2024-09-01" },
    { id: 5, name: "Emma Brown", email: "emma@school.edu", grade: "10th", enrollmentDate: "2024-09-01" },
  ]

  // Sample courses data
  AppState.courses = [
    { id: 1, name: "Mathematics", teacher: "Mr. Anderson", students: 25, description: "Advanced Mathematics" },
    {
      id: 2,
      name: "English Literature",
      teacher: "Ms. Thompson",
      students: 22,
      description: "Classic and Modern Literature",
    },
    { id: 3, name: "Physics", teacher: "Dr. Martinez", students: 18, description: "Applied Physics" },
    { id: 4, name: "Chemistry", teacher: "Mrs. Lee", students: 20, description: "Organic and Inorganic Chemistry" },
    { id: 5, name: "History", teacher: "Mr. Garcia", students: 24, description: "World History" },
  ]

  AppState.grades = [
    { studentId: 1, courseId: 1, grade: "A", score: 92, dateAdded: "2024-10-15" },
    { studentId: 1, courseId: 2, grade: "B+", score: 87, dateAdded: "2024-10-12" },
    { studentId: 2, courseId: 1, grade: "B", score: 84, dateAdded: "2024-10-15" },
    { studentId: 2, courseId: 3, grade: "A-", score: 89, dateAdded: "2024-10-10" },
    { studentId: 3, courseId: 2, grade: "A", score: 94, dateAdded: "2024-10-12" },
    { studentId: 3, courseId: 4, grade: "B+", score: 88, dateAdded: "2024-10-14" },
    { studentId: 4, courseId: 1, grade: "C+", score: 78, dateAdded: "2024-10-15" },
    { studentId: 4, courseId: 5, grade: "B", score: 85, dateAdded: "2024-10-13" },
    { studentId: 5, courseId: 2, grade: "A-", score: 91, dateAdded: "2024-10-12" },
    { studentId: 5, courseId: 3, grade: "B", score: 83, dateAdded: "2024-10-10" },
  ]

  // Save to localStorage
  localStorage.setItem("students", JSON.stringify(AppState.students))
  localStorage.setItem("courses", JSON.stringify(AppState.courses))
  localStorage.setItem("grades", JSON.stringify(AppState.grades))

  console.log("[v0] Sample data loaded")
}

// Utility functions for data management
function saveData() {
  localStorage.setItem("students", JSON.stringify(AppState.students))
  localStorage.setItem("courses", JSON.stringify(AppState.courses))
  localStorage.setItem("grades", JSON.stringify(AppState.grades))
}

function getStudentById(id) {
  return AppState.students.find((student) => student.id === id)
}

function getCourseById(id) {
  return AppState.courses.find((course) => course.id === id)
}

function getGradesByStudentId(studentId) {
  return AppState.grades.filter((grade) => grade.studentId === studentId)
}

function generateTeacherClassesPage() {
  // Get courses taught by current teacher (simplified - in real app would filter by teacher)
  const teacherCourses = AppState.courses

  return `
    <div class="page-content">
      <div class="page-header">
        <h2>My Classes</h2>
        <p>Manage your assigned classes and course information</p>
      </div>
      
      <div class="dashboard-grid">
        ${teacherCourses
          .map(
            (course) => `
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">${course.name}</h3>
              <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div class="card-content">
              <p><strong>Teacher:</strong> ${course.teacher}</p>
              <p><strong>Students:</strong> ${course.students}</p>
              <p><strong>Description:</strong> ${course.description}</p>
              <div style="margin-top: 1rem;">
                <button class="btn btn-primary btn-sm" onclick="viewClassGrades(${course.id})">
                  View Grades
                </button>
                <button class="btn btn-secondary btn-sm" onclick="viewClassStudents(${course.id})">
                  View Students
                </button>
              </div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `
}

function generateTeacherGradesPage() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h2>Grade Management</h2>
        <p>Manage student grades and performance tracking</p>
      </div>
      
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">Grade Book</h3>
          <div class="table-actions">
            <select class="search-input" id="courseFilter" style="min-width: 150px;">
              <option value="">All Courses</option>
              ${AppState.courses
                .map(
                  (course) => `
                <option value="${course.id}">${course.name}</option>
              `,
                )
                .join("")}
            </select>
            <input 
              type="text" 
              class="search-input" 
              id="gradeSearch" 
              placeholder="Search students..."
            >
            <button class="btn btn-primary" onclick="openAddGradeModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Grade
            </button>
          </div>
        </div>
        
        <div id="gradesTableContainer">
          ${generateGradesTable(AppState.grades)}
        </div>
      </div>
      
      <div class="dashboard-grid" style="margin-top: 2rem;">
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">Grade Distribution</h3>
          </div>
          <div class="card-content">
            ${generateGradeDistributionChart()}
          </div>
        </div>
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">Class Performance</h3>
          </div>
          <div class="card-content">
            ${generatePerformanceChart()}
          </div>
        </div>
      </div>
    </div>
  `
}

function generateTeacherStudentsPage() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h2>My Students</h2>
        <p>View and manage students in your classes</p>
      </div>
      
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">Students in My Classes</h3>
          <div class="table-actions">
            <select class="search-input" id="studentCourseFilter" style="min-width: 150px;">
              <option value="">All Courses</option>
              ${AppState.courses
                .map(
                  (course) => `
                <option value="${course.id}">${course.name}</option>
              `,
                )
                .join("")}
            </select>
            <input 
              type="text" 
              class="search-input" 
              id="teacherStudentSearch" 
              placeholder="Search students..."
            >
          </div>
        </div>
        
        <div id="teacherStudentsTableContainer">
          ${generateTeacherStudentsTable(AppState.students)}
        </div>
      </div>
    </div>
  `
}

function generateGradesTable(grades) {
  if (grades.length === 0) {
    return `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <h3>No grades recorded</h3>
        <p>Start adding grades for your students</p>
      </div>
    `
  }

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Course</th>
          <th>Grade</th>
          <th>Score</th>
          <th>Date Added</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${grades
          .map((grade) => {
            const student = getStudentById(grade.studentId)
            const course = getCourseById(grade.courseId)
            return `
            <tr>
              <td>${student ? student.name : "Unknown Student"}</td>
              <td>${course ? course.name : "Unknown Course"}</td>
              <td><span class="grade-badge ${getGradeClass(grade.grade)}">${grade.grade}</span></td>
              <td>${grade.score}%</td>
              <td>${grade.dateAdded ? new Date(grade.dateAdded).toLocaleDateString() : "N/A"}</td>
              <td class="table-actions-cell">
                <button class="btn btn-secondary btn-sm" onclick="openEditGradeModal(${grade.studentId}, ${grade.courseId})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteGrade(${grade.studentId}, ${grade.courseId})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          `
          })
          .join("")}
      </tbody>
    </table>
  `
}

function generateTeacherStudentsTable(students) {
  if (students.length === 0) {
    return `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        <h3>No students found</h3>
        <p>No students are currently enrolled in your classes</p>
      </div>
    `
  }

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Email</th>
          <th>Grade Level</th>
          <th>Average Score</th>
          <th>Total Grades</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${students
          .map((student) => {
            const studentGrades = getGradesByStudentId(student.id)
            const avgScore =
              studentGrades.length > 0
                ? Math.round(studentGrades.reduce((sum, grade) => sum + grade.score, 0) / studentGrades.length)
                : 0
            return `
            <tr>
              <td>${student.name}</td>
              <td>${student.email}</td>
              <td><span class="grade-badge grade-${student.grade.toLowerCase()}">${student.grade}</span></td>
              <td>${avgScore}%</td>
              <td>${studentGrades.length}</td>
              <td class="table-actions-cell">
                <button class="btn btn-primary btn-sm" onclick="viewStudentGrades(${student.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Grades
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openQuickGradeModal(${student.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Add Grade
                </button>
              </td>
            </tr>
          `
          })
          .join("")}
      </tbody>
    </table>
  `
}

function setupTeacherClassesListeners() {
  // Classes page specific listeners
  console.log("[v0] Teacher classes listeners setup")
}

function setupTeacherGradesListeners() {
  // Grade search functionality
  const gradeSearch = document.getElementById("gradeSearch")
  const courseFilter = document.getElementById("courseFilter")

  if (gradeSearch) {
    gradeSearch.addEventListener("input", filterGrades)
  }

  if (courseFilter) {
    courseFilter.addEventListener("change", filterGrades)
  }
}

function setupTeacherStudentsListeners() {
  // Student search functionality
  const studentSearch = document.getElementById("teacherStudentSearch")
  const courseFilter = document.getElementById("studentCourseFilter")

  if (studentSearch) {
    studentSearch.addEventListener("input", filterTeacherStudents)
  }

  if (courseFilter) {
    courseFilter.addEventListener("change", filterTeacherStudents)
  }
}

function filterGrades() {
  const searchTerm = document.getElementById("gradeSearch")?.value.toLowerCase() || ""
  const courseFilter = document.getElementById("courseFilter")?.value || ""

  const filteredGrades = AppState.grades.filter((grade) => {
    const student = getStudentById(grade.studentId)
    const course = getCourseById(grade.courseId)

    const matchesSearch =
      (student && student.name.toLowerCase().includes(searchTerm)) ||
      (course && course.name.toLowerCase().includes(searchTerm)) ||
      grade.grade.toLowerCase().includes(searchTerm)
    const matchesCourse = !courseFilter || grade.courseId.toString() === courseFilter

    return matchesSearch && matchesCourse
  })

  const tableContainer = document.getElementById("gradesTableContainer")
  if (tableContainer) {
    tableContainer.innerHTML = generateGradesTable(filteredGrades)
  }
}

function filterTeacherStudents() {
  const searchTerm = document.getElementById("teacherStudentSearch")?.value.toLowerCase() || ""
  const courseFilter = document.getElementById("studentCourseFilter")?.value || ""

  const filteredStudents = AppState.students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm) || student.email.toLowerCase().includes(searchTerm)

    // For simplicity, showing all students. In real app, would filter by course enrollment
    return matchesSearch
  })

  const tableContainer = document.getElementById("teacherStudentsTableContainer")
  if (tableContainer) {
    tableContainer.innerHTML = generateTeacherStudentsTable(filteredStudents)
  }
}

function viewClassGrades(courseId) {
  // Navigate to grades page with course filter
  loadPageContent("grades")
  setTimeout(() => {
    const courseFilter = document.getElementById("courseFilter")
    if (courseFilter) {
      courseFilter.value = courseId
      filterGrades()
    }
  }, 100)
}

function viewClassStudents(courseId) {
  // Navigate to students page with course filter
  loadPageContent("students")
  setTimeout(() => {
    const courseFilter = document.getElementById("studentCourseFilter")
    if (courseFilter) {
      courseFilter.value = courseId
      filterTeacherStudents()
    }
  }, 100)
}

function viewStudentGrades(studentId) {
  const student = getStudentById(studentId)
  const studentGrades = getGradesByStudentId(studentId)

  if (!student) return

  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${student.name} - Grade History</h3>
        <button class="modal-close" onclick="closeModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        ${
          studentGrades.length > 0
            ? `
          <table class="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Grade</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${studentGrades
                .map((grade) => {
                  const course = getCourseById(grade.courseId)
                  return `
                  <tr>
                    <td>${course ? course.name : "Unknown Course"}</td>
                    <td><span class="grade-badge ${getGradeClass(grade.grade)}">${grade.grade}</span></td>
                    <td>${grade.score}%</td>
                    <td>${grade.dateAdded ? new Date(grade.dateAdded).toLocaleDateString() : "N/A"}</td>
                  </tr>
                `
                })
                .join("")}
            </tbody>
          </table>
        `
            : "<p>No grades recorded for this student.</p>"
        }
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        <button class="btn btn-primary" onclick="closeModal(); openQuickGradeModal(${studentId})">Add Grade</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)
}

function openAddGradeModal() {
  const modal = createGradeModal("Add New Grade", null)
  document.body.appendChild(modal)
}

function openEditGradeModal(studentId, courseId) {
  const grade = AppState.grades.find((g) => g.studentId === studentId && g.courseId === courseId)
  if (grade) {
    const modal = createGradeModal("Edit Grade", grade)
    document.body.appendChild(modal)
  }
}

function openQuickGradeModal(studentId) {
  const student = getStudentById(studentId)
  if (!student) return

  const modal = createGradeModal(`Add Grade for ${student.name}`, null, studentId)
  document.body.appendChild(modal)
}

function createGradeModal(title, grade = null, preselectedStudentId = null) {
  const isEdit = grade !== null
  const modalId = isEdit ? "editGradeModal" : "addGradeModal"

  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" onclick="closeModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="${modalId}Form">
          <div class="form-row">
            <div class="form-group">
              <label for="gradeStudent">Student</label>
              <select id="gradeStudent" name="studentId" required ${preselectedStudentId ? "disabled" : ""}>
                <option value="">Select Student</option>
                ${AppState.students
                  .map(
                    (student) => `
                  <option value="${student.id}" ${
                    (grade && grade.studentId === student.id) ||
                    (preselectedStudentId && preselectedStudentId === student.id)
                      ? "selected"
                      : ""
                  }>${student.name}</option>
                `,
                  )
                  .join("")}
              </select>
              ${preselectedStudentId ? `<input type="hidden" name="studentId" value="${preselectedStudentId}">` : ""}
            </div>
            <div class="form-group">
              <label for="gradeCourse">Course</label>
              <select id="gradeCourse" name="courseId" required>
                <option value="">Select Course</option>
                ${AppState.courses
                  .map(
                    (course) => `
                  <option value="${course.id}" ${grade && grade.courseId === course.id ? "selected" : ""}>${course.name}</option>
                `,
                  )
                  .join("")}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="gradeScore">Score (%)</label>
              <input type="number" id="gradeScore" name="score" required min="0" max="100" 
                     value="${grade ? grade.score : ""}" placeholder="Enter score (0-100)">
            </div>
            <div class="form-group">
              <label for="gradeLetter">Letter Grade</label>
              <select id="gradeLetter" name="grade" required>
                <option value="">Select Grade</option>
                <option value="A+" ${grade && grade.grade === "A+" ? "selected" : ""}>A+ (97-100)</option>
                <option value="A" ${grade && grade.grade === "A" ? "selected" : ""}>A (93-96)</option>
                <option value="A-" ${grade && grade.grade === "A-" ? "selected" : ""}>A- (90-92)</option>
                <option value="B+" ${grade && grade.grade === "B+" ? "selected" : ""}>B+ (87-89)</option>
                <option value="B" ${grade && grade.grade === "B" ? "selected" : ""}>B (83-86)</option>
                <option value="B-" ${grade && grade.grade === "B-" ? "selected" : ""}>B- (80-82)</option>
                <option value="C+" ${grade && grade.grade === "C+" ? "selected" : ""}>C+ (77-79)</option>
                <option value="C" ${grade && grade.grade === "C" ? "selected" : ""}>C (73-76)</option>
                <option value="C-" ${grade && grade.grade === "C-" ? "selected" : ""}>C- (70-72)</option>
                <option value="D+" ${grade && grade.grade === "D+" ? "selected" : ""}>D+ (67-69)</option>
                <option value="D" ${grade && grade.grade === "D" ? "selected" : ""}>D (63-66)</option>
                <option value="D-" ${grade && grade.grade === "D-" ? "selected" : ""}>D- (60-62)</option>
                <option value="F" ${grade && grade.grade === "F" ? "selected" : ""}>F (0-59)</option>
            </select>
        </div>
        <div class="form-group">
            <label for="editGradeComments">Comments (Optional)</label>
            <textarea id="editGradeComments" placeholder="Additional comments about this grade...">${grade ? grade.comments || "" : ""}</textarea>
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal('editGradeModal')">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Grade</button>
        </div>
    `

  document.getElementById("editGradeModal").style.display = "block"
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
  if (currentUser) {
    showDashboard(currentUser.role)
  } else {
    showLogin()
  }

  // Initialize theme
  initializeTheme()
})

// Utility function to format dates
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Utility function to calculate GPA
function calculateGPA(grades) {
  if (!grades || grades.length === 0) return 0

  const gradePoints = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
  }

  const totalPoints = grades.reduce((sum, grade) => {
    return sum + (gradePoints[grade.grade] || 0)
  }, 0)

  return (totalPoints / grades.length).toFixed(2)
}

function generateStudentCoursesPage() {
  return `
        <div class="page-content">
            <div class="page-header">
                <h2>My Courses</h2>
                <p>View your enrolled courses and course details</p>
            </div>
            <div class="dashboard-grid">
                ${AppState.courses
                  .map(
                    (course) => `
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title">${course.name}</h3>
                            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                            </svg>
                        </div>
                        <div class="card-content">
                            <p><strong>Teacher:</strong> ${course.teacher}</p>
                            <p><strong>Description:</strong> ${course.description}</p>
                            <p><strong>Students Enrolled:</strong> ${course.students}</p>
                            <button class="btn btn-primary btn-sm" onclick="viewCourseDetails(${course.id})">View Details</button>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
}

function generateStudentGradesPage() {
  const studentId = 1 // Assuming student ID is 1 for now
  const studentGrades = getGradesByStudentId(studentId)

  return `
        <div class="page-content">
            <div class="page-header">
                <h2>My Grades</h2>
                <p>View your grades and academic performance</p>
            </div>
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Grade</th>
                            <th>Score</th>
                            <th>Date Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentGrades
                          .map((grade) => {
                            const course = getCourseById(grade.courseId)
                            return `
                                <tr>
                                    <td>${course ? course.name : "Unknown Course"}</td>
                                    <td><span class="grade-badge ${getGradeClass(grade.grade)}">${grade.grade}</span></td>
                                    <td>${grade.score}%</td>
                                    <td>${formatDate(grade.dateAdded)}</td>
                                </tr>
                            `
                          })
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `
}

function generateStudentProfilePage() {
  const studentId = 1 // Assuming student ID is 1 for now
  const student = getStudentById(studentId)
  const studentGrades = getGradesByStudentId(studentId)
  const gpa = calculateGPA(studentGrades)

  return `
        <div class="page-content">
            <div class="page-header">
                <h2>My Profile</h2>
                <p>View and manage your profile information</p>
            </div>
            <div class="profile-container">
                <div class="profile-card">
                    <h3>Personal Information</h3>
                    <p><strong>Name:</strong> ${student ? student.name : "N/A"}</p>
                    <p><strong>Email:</strong> ${student ? student.email : "N/A"}</p>
                    <p><strong>Grade Level:</strong> ${student ? student.grade : "N/A"}</p>
                    <p><strong>Enrollment Date:</strong> ${student ? formatDate(student.enrollmentDate) : "N/A"}</p>
                </div>
                <div class="profile-card">
                    <h3>Academic Performance</h3>
                    <p><strong>GPA:</strong> ${gpa}</p>
                    <p><strong>Total Courses:</strong> ${AppState.courses.length}</p>
                    <p><strong>Total Grades:</strong> ${studentGrades.length}</p>
                </div>
            </div>
        </div>
    `
}

function setupStudentCoursesListeners() {
  // Student courses page specific listeners
  console.log("[v0] Student courses listeners setup")
}

function setupStudentGradesListeners() {
  // Student grades page specific listeners
  console.log("[v0] Student grades listeners setup")
}

function setupStudentProfileListeners() {
  // Student profile page specific listeners
  console.log("[v0] Student profile listeners setup")
}

function getGradeClass(grade) {
  if (grade.startsWith("A")) return "grade-a"
  if (grade.startsWith("B")) return "grade-b"
  if (grade.startsWith("C")) return "grade-c"
  if (grade.startsWith("D")) return "grade-d"
  return "grade-f"
}

function showLogin() {
  document.getElementById("loginPage").classList.remove("hidden")
  document.getElementById("dashboardContainer").classList.add("hidden")
}

function initializeTheme() {
  const theme = localStorage.getItem("theme") || "light"
  applyTheme(theme)
}
