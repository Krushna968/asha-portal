<h1 align="center">ASHA Portal — Web Dashboard</h1>

<p align="center">
  <b>A comprehensive Web Portal for managing and monitoring ASHA workers' activities.</b><br/>
  Empowering healthcare administration with real-time insights and task management.
</p>

<p align="center">
  <a href="https://asha-portal.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-ASHA%20Portal-blue?style=for-the-badge&logo=vercel" alt="Live Demo"/>
  </a>
   
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react"/>
   
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite"/>
</p>

---

## About the Project

**ASHA Portal** is the administrative web dashboard corresponding to the **ASHA Setu** mobile application. It is designed for supervisors, Medical Officers, and healthcare administrators to monitor, manage, and assist ASHA (Accredited Social Health Activist) workers in their daily rural healthcare operations.

The portal provides real-time tracking of household visits, medicine inventory, emergency alerts, and task completion, bringing digital efficiency to grassroots healthcare management.

---

## Live Demo

| Environment | URL |
|-------------|-----|
| Production  | [https://asha-portal.vercel.app](https://asha-portal.vercel.app) |

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Interactive Dashboard** | High-level overview of daily stats, active workers, and pending tasks. |
| **Worker Tracking** | View detailed profiles, visit history, and performance metrics of individual ASHA workers. |
| **Geospatial Mapping** | Visualise worker active areas and health event clusters using the interactive Area Map. |
| **Task Management** | Assign, track, and review follow-ups and priority household visits. |
| **Inventory Oversight** | Monitor medicine stock levels across different PHCs and worker kits. |
| **Emergency Alerts** | Receive and manage SOS signals and urgent medical requests directly from the field. |

---

## Project Structure

```text
asha-portal/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components (StatCard, TaskList, AreaMap, etc.)
│   ├── App.jsx              # Main application root and routing setup
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles and CSS variables
│   └── App.css              # App-level styling
├── index.html               # Main HTML template
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite bundler configuration
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Core Framework** | React 19 / Vite |
| **Routing** | React Router DOM |
| **Styling** | Vanilla CSS (CSS Modules) |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn or pnpm

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Krushna968/asha-portal.git
   cd asha-portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`.*

### Build for Production

```bash
# Generate optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## Contributing

```text
1. Fork the repo
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request
```

---

## License

Educational and social-good project. All rights reserved © 2026 ASHA Portal / Krushna968.

---

<p align="center">Made with love to support India's primary healthcare infrastructure.</p>
