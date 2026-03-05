import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './HighRiskTrackerPage.module.css'

export default function HighRiskTrackerPage() {
    const navigate = useNavigate()
    const [cases, setCases] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchHighRisk = async () => {
            try {
                const token = localStorage.getItem('asha_token')
                if (!token) {
                    navigate('/')
                    return
                }

                const res = await fetch('http://localhost:3001/api/admin/high-risk', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    setCases(data)
                } else {
                    setError('Failed to fetch high risk cases')
                }
            } catch (err) {
                console.error(err)
                setError('Network error connecting to backend')
            } finally {
                setLoading(false)
            }
        }

        fetchHighRisk()
    }, [navigate])

    const getRiskLevel = (item) => {
        const latestVisit = item.visitHistory?.[0]
        if (!latestVisit) return { label: 'PENDING CHECK', class: styles.riskPending }

        // Example logic for risk highlighting
        if (latestVisit.bloodPressure && latestVisit.bloodPressure.includes('/')) {
            const [sys] = latestVisit.bloodPressure.split('/').map(Number)
            if (sys > 140) return { label: 'CRITICAL: HIGH BP', class: styles.riskCritical }
        }

        return { label: 'MONITORING', class: styles.riskHigh }
    }

    return (
        <div className={styles.page}>
            <TopNav active="high-risk" />

            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.alertIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    </div>
                    <div>
                        <h1 className={styles.title}>High-Risk Tracker</h1>
                        <p className={styles.subtitle}>Immediate attention required for these ANC/PNC cases.</p>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loader}>Analyzing patient data...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <div className={styles.grid}>
                        {cases.map(item => {
                            const risk = getRiskLevel(item)
                            return (
                                <div key={item.id} className={styles.card}>
                                    <div className={`${styles.riskBadge} ${risk.class}`}>
                                        {risk.label}
                                    </div>
                                    <h3 className={styles.patientName}>{item.name}</h3>
                                    <p className={styles.patientInfo}>
                                        {item.category} • {item.age} years • {item.worker?.village}
                                    </p>

                                    <div className={styles.statsRow}>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>Last BP</span>
                                            <span className={styles.statValue}>{item.visitHistory?.[0]?.bloodPressure || 'N/A'}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>Last Weight</span>
                                            <span className={styles.statValue}>{item.visitHistory?.[0]?.weight ? `${item.visitHistory[0].weight}kg` : 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className={styles.workerInfo}>
                                        <div className={styles.workerAvatar}>ASHA</div>
                                        <div>
                                            <div className={styles.workerName}>{item.worker?.name}</div>
                                            <div className={styles.workerContact}>{item.worker?.mobileNumber}</div>
                                        </div>
                                    </div>

                                    <div className={styles.actions}>
                                        <button
                                            className={styles.btnAction}
                                            onClick={() => navigate(`/beneficiaries/${item.id}`)}
                                        >
                                            View Full History
                                        </button>
                                        <button className={styles.btnNotify}>
                                            Notify Worker
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                        {cases.length === 0 && (
                            <div className={styles.empty}>No high-risk cases currently flagged in the system.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
