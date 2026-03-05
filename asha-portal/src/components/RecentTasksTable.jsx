import { useNavigate } from 'react-router-dom'
import styles from './RecentTasksTable.module.css'

const TASKS = [
    { initials: 'SK', name: 'Sunita Kumari', id: '#ASH-2091', region: 'Malur Block', activity: 'Prenatal Checkup', status: 'completed', sync: '2 mins ago' },
    { initials: 'PD', name: 'Priya Devi', id: '#ASH-4402', region: 'Hosur North', activity: 'Emergency Alert', status: 'high-risk', sync: '15 mins ago' },
    { initials: 'RM', name: 'Rekha Murthy', id: '#ASH-3310', region: 'Block C South', activity: 'Immunization Drive', status: 'pending', sync: '1 hr ago' },
    { initials: 'FN', name: 'Fatima Nasser', id: '#ASH-1209', region: 'East Sector', activity: 'Monthly Data Entry', status: 'completed', sync: '3 hrs ago' },
]

const STATUS = {
    completed: { cls: 'completed', label: 'COMPLETED' },
    'high-risk': { cls: 'highRisk', label: 'HIGH-RISK' },
    pending: { cls: 'pending', label: 'PENDING' },
}

export default function RecentTasksTable() {
    const navigate = useNavigate()
    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Recent Task Status</h2>
                <button className={styles.viewAll} onClick={() => navigate('/workers')}>View All Tasks</button>
            </div>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ASHA Worker</th><th>Region</th><th>Activity</th><th>Status</th><th>Last Sync</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TASKS.map(t => (
                            <tr key={t.id} className={styles.row} onClick={() => navigate('/workers')}>
                                <td>
                                    <div className={styles.workerCell}>
                                        <div className={styles.avatar}>{t.initials}</div>
                                        <div>
                                            <div className={styles.workerName}>{t.name}</div>
                                            <div className={styles.workerId}>ID: {t.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.region}>{t.region}</td>
                                <td className={styles.activity}>{t.activity}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[STATUS[t.status].cls]}`}>
                                        {STATUS[t.status].label}
                                    </span>
                                </td>
                                <td className={styles.sync}>{t.sync}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
