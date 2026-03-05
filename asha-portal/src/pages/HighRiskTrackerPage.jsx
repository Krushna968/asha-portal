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
            setLoading(true)

            // Filtered set of High Risk Residents
            const highRiskData = [
                {
                    id: 'res-3',
                    name: "Advait Rao",
                    category: "ANC",
                    age: 24,
                    worker: { name: "Krushna Rasal", village: "Central Block", mobileNumber: "9876543210" },
                    visitHistory: [{ bloodPressure: "150/95", weight: 62 }]
                },
                {
                    id: 'res-4',
                    name: "Akansha Gupta",
                    category: "PNC",
                    age: 28,
                    worker: { name: "Sunita Kumari", village: "Malur Block", mobileNumber: "9823456781" },
                    visitHistory: [{ bloodPressure: "138/88", weight: 58 }]
                },
                {
                    id: 'res-8',
                    name: "Anika Verma",
                    category: "ANC",
                    age: 31,
                    worker: { name: "Priya Devi", village: "Hosur North", mobileNumber: "8812345678" },
                    visitHistory: [{ bloodPressure: "145/92", weight: 65 }]
                },
                {
                    id: 'res-10',
                    name: "Anita Devi",
                    category: "ANC",
                    age: 35,
                    worker: { name: "Fatima Nasser", village: "East Sector", mobileNumber: "9011223344" },
                    visitHistory: [{ bloodPressure: "155/100", weight: 70 }]
                },
                {
                    id: 'res-15',
                    name: "Arjun Reddy",
                    category: "GENERAL",
                    age: 42,
                    worker: { name: "Fatima Nasser", village: "East Sector", mobileNumber: "9011223344" },
                    visitHistory: [{ bloodPressure: "160/105", weight: 82 }]
                },
                {
                    id: 'res-21',
                    name: "Chitra Iyer",
                    category: "ANC",
                    age: 26,
                    worker: { name: "Krushna Rasal", village: "Central Block", mobileNumber: "9876543210" },
                    visitHistory: [{ bloodPressure: "142/90", weight: 61 }]
                },
                {
                    id: 'res-25',
                    name: "Gayatri Pandey",
                    category: "PNC",
                    age: 29,
                    worker: { name: "Fatima Nasser", village: "East Sector", mobileNumber: "9011223344" },
                    visitHistory: [{ bloodPressure: "135/85", weight: 56 }]
                },
                {
                    id: 'res-27',
                    name: "Isha Malhotra",
                    category: "ANC",
                    age: 23,
                    worker: { name: "Sunita Kumari", village: "Malur Block", mobileNumber: "9823456781" },
                    visitHistory: [{ bloodPressure: "148/96", weight: 63 }]
                }
            ];

            setTimeout(() => {
                setCases(highRiskData)
                setLoading(false)
            }, 500)
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
                                        <button
                                            className={styles.btnNotify}
                                            onClick={() => navigate(`/messages?resId=${item.id}&resName=${encodeURIComponent(item.name)}&worker=${encodeURIComponent(item.worker?.name)}`)}
                                        >
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
