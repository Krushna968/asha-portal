import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './RecentTasksTable.module.css'

const STATUS_COLORS = {
    Active: { cls: 'completed', label: 'ACTIVE' },
    Inactive: { cls: 'pending', label: 'INACTIVE' },
}

export default function RecentTasksTable() {
    const navigate = useNavigate()
    const [workers, setWorkers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const token = localStorage.getItem('asha_token')
                const res = await fetch('http://10.75.109.134:3001/api/admin/workers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setWorkers(data.slice(0, 4)) // Only show top 4
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchRecent()
    }, [])
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
                        {workers.map(w => (
                            <tr key={w.id} className={styles.row} onClick={() => navigate(`/workers/${w.id}`)}>
                                <td>
                                    <div className={styles.workerCell}>
                                        <div className={styles.avatar}>{w.name[0]}</div>
                                        <div>
                                            <div className={styles.workerName}>{w.name}</div>
                                            <div className={styles.workerId}>ID: {w.employeeId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.region}>{w.village || 'N/A'}</td>
                                <td className={styles.activity}>{w._count?.tasks || 0} Open Tasks</td>
                                <td>
                                    <span className={`${styles.status} ${styles[STATUS_COLORS.Active.cls]}`}>
                                        {STATUS_COLORS.Active.label}
                                    </span>
                                </td>
                                <td className={styles.sync}>{new Date(w.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
