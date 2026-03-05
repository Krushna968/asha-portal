import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Sidebar.module.css'

const NAV = [
    { id: 'dashboard', label: 'Dashboard', Icon: GridIcon },
    { id: 'workers', label: 'ASHA Workers', Icon: PeopleIcon },
    { id: 'reports', label: 'Reports', Icon: ReportIcon },
    { id: 'messages', label: 'Messages', Icon: MessageIcon, badge: 4 },
    { id: 'tasks', label: 'Task Management', Icon: TaskIcon },
]

export default function Sidebar({ active = 'dashboard' }) {
    const navigate = useNavigate()

    function go(id) {
        if (id === 'dashboard') navigate('/dashboard')
        else if (id === 'workers') navigate('/workers')
    }

    return (
        <aside className={styles.sidebar}>
            {/* Brand */}
            <div className={styles.brand}>
                <div className={styles.brandLogo}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <span className={styles.brandName}>ASHA Portal</span>
            </div>

            {/* Nav */}
            <nav className={styles.nav}>
                {NAV.map(({ id, label, Icon, badge }) => (
                    <button
                        key={id}
                        className={`${styles.navItem} ${active === id ? styles.navActive : ''}`}
                        onClick={() => go(id)}
                    >
                        <Icon className={styles.navIcon} />
                        <span className={styles.navLabel}>{label}</span>
                        {badge && <span className={styles.badge}>{badge}</span>}
                    </button>
                ))}
            </nav>

            {/* Help Center */}
            <div className={styles.helpCard}>
                <div className={styles.helpTitle}>HELP CENTER</div>
                <p className={styles.helpText}>Need help with managing worker schedules?</p>
                <button className={styles.helpBtn}>Get Support</button>
            </div>
        </aside>
    )
}

// ── Icons ────────────────────────────────────────────────────────
function GridIcon({ className }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
}
function PeopleIcon({ className }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
}
function ReportIcon({ className }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
}
function MessageIcon({ className }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
}
function TaskIcon({ className }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
}
