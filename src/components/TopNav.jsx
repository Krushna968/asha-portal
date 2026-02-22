import { useNavigate } from 'react-router-dom'
import styles from './TopNav.module.css'

const NAV = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'workers', label: 'ASHA Workers', path: '/workers' },
    { id: 'reports', label: 'Reports', path: null },
    { id: 'messages', label: 'Messages', path: null, badge: 4 },
    { id: 'tasks', label: 'Task Management', path: null },
]

export default function TopNav({ active = 'dashboard' }) {
    const navigate = useNavigate()

    return (
        <header className={styles.nav}>
            <div className={styles.inner}>
                {/* Brand */}
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <img src="/logo.jpeg" alt="ASHA Setu" className={styles.logoImg} />
                    </div>
                    <span className={styles.brandText}>ASHA Setu</span>
                </div>

                {/* Nav links */}
                <nav className={styles.links}>
                    {NAV.map(({ id, label, path, badge }) => (
                        <button
                            key={id}
                            className={`${styles.link} ${active === id ? styles.active : ''}`}
                            onClick={() => path && navigate(path)}
                        >
                            {label}
                            {badge && <span className={styles.badge}>{badge}</span>}
                        </button>
                    ))}
                </nav>

                {/* Right controls */}
                <div className={styles.right}>
                    <button className={styles.iconBtn} aria-label="Notifications">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                        <span className={styles.notifDot} />
                    </button>
                    <button className={styles.iconBtn} aria-label="Settings">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                        </svg>
                    </button>
                    <div className={styles.adminWrap}>
                        <div className={styles.adminInfo}>
                            <span className={styles.adminName}>Admin User</span>
                            <span className={styles.adminRole}>District Health Officer</span>
                        </div>
                        <div className={styles.adminAvatar} onClick={() => navigate('/')}>A</div>
                    </div>
                </div>
            </div>
        </header>
    )
}
