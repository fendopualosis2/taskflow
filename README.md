# TaskFlow ⚡

> **Plan better. Focus deeper. Get things done.**
> Premium Task Management & Productivity SaaS Application — JNTU SDC Project.

TaskFlow is a modern, high-performance productivity web app built with React 18, Vite, Tailwind CSS, Framer Motion, and Recharts. Designed with a vibrant dark-mode-first aesthetic inspired by Linear, Raycast, and modern SaaS dashboards.

---

## ✨ Features

- **Interactive Landing Page**: Modern hero section with floating ambient particles, gradient text, live interactive mockup preview, and smooth scroll navigation.
- **Productivity Dashboard**: Real-time stats (Total, Completed, In Progress, Overdue), circular Productivity Score calculation, Today's Focus view, and Quick Add.
- **Full Task Lifecycle Management**:
  - Task creation with title, description, priority (Low, Medium, High, Urgent), status (To Do, In Progress, Done), due date, project, and category.
  - Quick Add bar (inline `Enter` key creation).
  - Animated SVG checkbox completion with strike-through and productivity score recalculation.
  - Real-time auto-saving task details panel with timeline activity tracking.
- **Projects & Workspaces**: Project progress rings, completion bars, filtered task lists, and project creation with custom colors.
- **Categories**: Organize tasks across 9 functional categories (Development, Design, Documentation, Research, Meeting, Planning, Testing, Review, Other) with dedicated visual progress tracking.
- **Smart Views**:
  - **Today View**: Dedicated daily focus tracking, completed today counter, progress bar, and overdue alerts.
  - **Upcoming View**: Structured planning grouped by Today, Tomorrow, This Week, Next Week, and Later.
  - **Completed View**: History of finished tasks with completion timestamps and reopen capability.
- **Analytics & Visualizations**:
  - 14-day completion trend area chart.
  - Weekly productivity bar chart.
  - Priority distribution donut chart.
  - Project progress completion meters.
  - Daily productivity streak tracker.
- **Focus Mode**: Deep work Pomodoro timer with 25-minute, 50-minute, and custom minute presets, ambient breathing glow, and task association.
- **Global Command Palette (`Ctrl + K` / `/`)**: Fast keyboard-driven navigation, quick task creation, and instant theme toggling.
- **Keyboard Shortcuts**:
  - `Ctrl + K`: Command Palette
  - `N`: Quick New Task
  - `/`: Global Search
  - `Esc`: Close Modals
- **Dark / Light Theme**: Dark mode default (`#080B14`), clean light mode, and system preference auto-detection.
- **Data Persistence**: Offline-first `localStorage` persistence with realistic seed data out of the box.

---

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS v3, PostCSS, Autoprefixer
- **Animations**: Framer Motion v11
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Date Utilities**: date-fns
- **Routing**: React Router v6

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm or yarn

### Installation

1. Clone or extract the repository:
   ```bash
   cd taskflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your GitHub repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**!

`vercel.json` is already included to handle client-side routing rewrites out of the box.

---

## 📄 License

MIT License. Developed for JNTU Software Development Course (SDC).
