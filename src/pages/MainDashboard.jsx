import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import StatCard from '../components/StatCard'
import VisitsBarChart from '../components/VisitsBarChart'
import DonutChart from '../components/DonutChart'
import RecentTasksTable from '../components/RecentTasksTable'
import styles from './MainDashboard.module.css'

const WorkersIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
const VisitsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const RiskIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
const TasksIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>

const STATS = [
    { icon: <WorkersIcon />, label: 'Total ASHA Workers', value: '1,240', change: '+2.5%', changeType: 'up' },
    { icon: <VisitsIcon />, label: 'Total Visits Today', value: '432', change: '+12%', changeType: 'up' },
    { icon: <RiskIcon />, label: 'High-Risk Cases', value: '28', change: '+5%', changeType: 'up' },
    { icon: <TasksIcon />, label: 'Pending Tasks', value: '15', change: '-8%', changeType: 'down' },
]

export default function MainDashboard() {
    const navigate = useNavigate()

    return (
        <div className={styles.page}>
            <TopNav active="dashboard" />

            <div className={styles.content}>
                {/* Title row */}
                <div className={styles.titleRow}>
                    <div>
                        <h1 className={styles.pageTitle}>Dashboard</h1>
                        <p className={styles.pageSub}>
                            Real-time overview of rural healthcare activities ·{' '}
                            <span className={styles.dateSpan}>Oct 24, 2023</span>
                        </p>
                    </div>
                    <div className={styles.titleActions}>
                        <button className={styles.btnExport}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Export
                        </button>
                        <button className={styles.btnAddTask} onClick={() => navigate('/workers')}>
                            + Add Task
                        </button>
                    </div>
                </div>

                {/* Stat cards */}
                <div className={styles.statsGrid}>
                    {STATS.map((s, i) => <StatCard key={i} {...s} />)}
                </div>

                {/* Charts */}
                <div className={styles.chartsGrid}>
                    <VisitsBarChart />
                    <DonutChart />
                </div>

                {/* Table */}
                <RecentTasksTable />
            </div>
        </div>
    )
}
