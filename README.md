# TaskFlow - Full-Stack Task Management System

![TaskFlow Banner](./screenshots/banner.png)

TaskFlow is a full-stack task management application designed to help users organize their life and work efficiently. Built with modern technologies, it features secure authentication, real-time task tracking, and AI-powered productivity insights.

### 🔗 Live Deployments
- **Frontend:** [https://task-flow-rare.vercel.app/](https://task-flow-rare.vercel.app/)
- **Backend API:** [https://taskflow-production-a883.up.railway.app/](https://taskflow-production-a883.up.railway.app/)

> ✅ **AI Feature Status:** Fully Implemented (Weekly Summaries & Insights)

## 🚀 Features

### Core Features
- **🔐 Secure Authentication**: JWT-based Signup and Login with protected routes.
- **📝 Task CRUD**: Create, Read, Update, and Delete tasks with ease.
- **📊 Smart Dashboard**:
    - Filter by **Category** (Work, Personal, Urgent), **Priority** (High, Medium, Low), and **Status**.
    - Sort by **Deadline** or **Priority**.
    - Real-time search functionality.
- **⏱️ Task Details**: View comprehensive task info with a countdown timer for deadlines.
- **🤖 AI Insights**: Weekly productivity summary and actionable advice powered by Google Gemini AI.

### Bonus Features
- **📋 Kanban Board**: Drag-and-drop interface for visual task management.
- **🌙 Dark Mode**: Fully responsive dark theme support.
- **📱 Responsive Design**: Optimized for Mobile, Tablet, and Desktop.
- **✅ Subtasks**: Break down tasks into manageable subtasks with progress tracking.
- **📅 Calendar View**: Visualize tasks on a monthly calendar.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS, Shadcn/UI
- **State Management**: Redux Toolkit
- **Drag & Drop**: @dnd-kit (Core, Sortable, Utilities)
- **Notifications**: Sonner (Toast)
- **Markdown**: React Markdown (for AI summaries)
- **Date Handling**: Date-fns
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: PostgreSQL (Production) / SQLite (Testing)
- **ORM**: SQLAlchemy (Async)
- **Auth**: Python-Jose (JWT)
- **AI Integration**: Google Gemini API
- **Documentation**: Swagger UI (Auto-generated)

---

## 📂 Project Structure

```
├── backend/
│   ├── routers/         # API Endpoints (Auth, Tasks, AI)
│   ├── services/        # Business Logic & CRUD
│   ├── models.py        # Database Models
│   ├── schemas.py       # Pydantic Schemas
│   └── main.py          # App Entry Point
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router Pages
│   │   ├── components/  # Reusable UI Components
│   │   ├── hooks/       # Custom React Hooks
│   │   ├── store/       # Redux State Management
│   │   └── lib/         # Utilities (API, Utils)
│   └── public/          # Static Assets
└── README.md
```

---

## 📸 Screenshots

### Landing Page
Experience the stunning first impression with our modern, gradient-rich landing page.

<table>
  <tr>
    <td width="50%">
      <img src="./screenshots/landing-page.png" alt="Landing Page Hero" />
      <p align="center"><b>Hero Section</b></p>
    </td>
    <td width="50%">
      <img src="./screenshots/landing-page-features.png" alt="Features Section" />
      <p align="center"><b>AI-Powered Features</b></p>
    </td>
  </tr>
</table>

### Dashboard & Task Management
Powerful task organization with multiple views and smart filtering.

<table>
  <tr>
    <td width="50%">
      <img src="./screenshots/dashboard-page.png" alt="Dashboard Light Mode" />
      <p align="center"><b>Dashboard - Light Mode</b></p>
    </td>
    <td width="50%">
      <img src="./screenshots/dashboard-dark-mode.png" alt="Dashboard Dark Mode" />
      <p align="center"><b>Dashboard - Dark Mode</b></p>
    </td>
  </tr>
</table>

### Kanban Board
Visualize your workflow with drag-and-drop Kanban boards.

<table>
  <tr>
    <td width="50%">
      <img src="./screenshots/kanban-board-light.png" alt="Kanban Board Light" />
      <p align="center"><b>Kanban - Light Mode</b></p>
    </td>
    <td width="50%">
      <img src="./screenshots/kanban-board-dark.png" alt="Kanban Board Dark" />
      <p align="center"><b>Kanban - Dark Mode</b></p>
    </td>
  </tr>
</table>

### Calendar View
Track deadlines effectively with the monthly calendar view.

<p align="center">
  <img src="./screenshots/calendar-page.png" alt="Calendar View" width="800" />
</p>
<p align="center"><b>Calendar View</b></p>

### Task Details & Subtasks
Comprehensive task management with countdown timers and subtask tracking.

<table>
  <tr>
    <td width="50%">
      <img src="./screenshots/task-details-page.png" alt="Task Details" />
      <p align="center"><b>Task Details with Timer</b></p>
    </td>
    <td width="50%">
      <img src="./screenshots/subtasks-section.png" alt="Subtasks" />
      <p align="center"><b>Subtask Management</b></p>
    </td>
  </tr>
</table>

### AI-Powered Insights
Get intelligent weekly summaries and actionable productivity advice.

<p align="center">
  <img src="./screenshots/ai-summary-page.png" alt="AI Productivity Insights" width="650" />
</p>
<p align="center"><b>AI Productivity Summary powered by Google Gemini</b></p>

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (Optional for local dev, defaults to SQLite for tests)

### 1. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment
# Create a .env file with:
DATABASE_URL=postgresql+psycopg://user:pass@localhost/taskflow
SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.5-flash

# Run Server
uvicorn main:app --reload
```
*Server will start at `http://localhost:8000`*
*API Documentation available at `http://localhost:8000/docs`*

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure Environment
# Create a .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:8000

# Run Development Server
npm run dev
```
*App will start at `http://localhost:3000`*

---

## 🧪 Testing

The project includes a robust test suite for the backend.

```bash
cd backend
pytest
```
*Note: Tests are configured to use an in-memory SQLite database to ensure isolation and speed.*

---

## 📦 Deployment

### Frontend (Vercel)
1. Push code to GitHub.
2. Import project into Vercel.
3. Add Environment Variable: `NEXT_PUBLIC_API_URL` (Your deployed backend URL).
4. Deploy!

### Backend (Render / Railway)
1. Push code to GitHub.
2. Create a new Web Service on Render/Railway.
3. Add Environment Variables:
    - `DATABASE_URL` (Connection string to your hosted PostgreSQL)
    - `SECRET_KEY`
    - `GEMINI_API_KEY`
4. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Deploy!

---

## 📄 License
MIT

