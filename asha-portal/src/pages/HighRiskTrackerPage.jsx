import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './HighRiskTrackerPage.module.css'

const API_BASE_URL = 'http://localhost:3001/api/admin';

export default function HighRiskTrackerPage() {
    const navigate = useNavigate()
    const [cases, setCases] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [approving, setApproving] = useState(null)

    useEffect(() => {
        const fetchHighRisk = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem('asha_token');
                const response = await fetch(`${API_BASE_URL}/high-risk`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch cases');

                const data = await response.json();
                setCases(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Could not connect to the processing server. Please ensure the backend is running.');
            } finally {
                setLoading(false)
            }
        }

        fetchHighRisk()
    }, [])

    const handleApprove = async (patientId, riskScore, riskLevel, indicators, workerId) => {
        setApproving(patientId);
        try {
            const token = localStorage.getItem('asha_token');
            const response = await fetch(`${API_BASE_URL}/risk-alerts/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    patientId,
                    riskScore,
                    riskLevel,
                    indicators,
                    workerId
                })
            });

            if (response.ok) {
                // Update local state to reflect approval
                setCases(prev => prev.map(c =>
                    c.id === patientId ? { ...c, isApproved: true } : c
                ));
            } else {
                alert('Failed to send alert to ASHA worker.');
            }
        } catch (err) {
            console.error('Approval error:', err);
        } finally {
            setApproving(null);
        }
    };

    const toggleVisitStatus = (patientId) => {
        setCases(prev => prev.map(c =>
            c.id === patientId ? { ...c, visited: !c.visited } : c
        ));
    };

    const getRiskClass = (level) => {
        switch (level) {
            case 'CRITICAL': return styles.riskCritical;
            case 'HIGH': return styles.riskHigh;
            default: return styles.riskMonitoring;
        }
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
                        <h1 className={styles.title}>AI-Assisted High-Risk Tracker</h1>
                        <p className={styles.subtitle}>Analyzing real-time indicators for immediate medical intervention.</p>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loaderContainer}>
                        <div className={styles.pulseScanner}></div>
                        <div className={styles.loaderText}>Processing patient data with AI...</div>
                    </div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <div className={styles.grid}>
                        {cases.map(item => (
                            <div key={item.id} className={`${styles.card} ${item.isApproved ? styles.cardApproved : ''}`}>
                                <div className={`${styles.riskBadge} ${getRiskClass(item.riskLevel)}`}>
                                    {item.riskLevel}: {item.riskScore} PTS
                                </div>
                                <h3 className={styles.patientName}>{item.name}</h3>
                                <p className={styles.patientInfo}>
                                    {item.category} • {item.age} years • {item.worker?.village}
                                </p>

                                <div className={styles.indicators}>
                                    {item.indicators?.map((ind, i) => (
                                        <span key={i} className={styles.indicatorTag}>• {ind}</span>
                                    ))}
                                </div>

                                <div className={styles.statsRow}>
                                    <div className={styles.stat}>
                                        <span className={styles.statLabel}>Last BP</span>
                                        <span className={styles.statValue}>{item.visitHistory?.[0]?.bloodPressure || '120/80'}</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statLabel}>Hb</span>
                                        <span className={styles.statValue}>{item.visitHistory?.[0]?.hbLevel ? `${item.visitHistory[0].hbLevel} g/dL` : '11.5 g/dL'}</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statLabel}>Sugar</span>
                                        <span className={styles.statValue}>{item.visitHistory?.[0]?.bloodSugar || 90} mg</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statLabel}>Temp</span>
                                        <span className={styles.statValue}>{item.visitHistory?.[0]?.temperature || 98.4}°F</span>
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
                                        className={`${styles.btnStatus} ${item.visited ? styles.btnVisited : styles.btnPending}`}
                                        onClick={() => toggleVisitStatus(item.id)}
                                    >
                                        {item.visited ? 'Visited' : 'Visit Pending'}
                                    </button>

                                    {item.isApproved ? (
                                        <div className={styles.approvedLabel}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                            Alert Sent
                                        </div>
                                    ) : (
                                        <button
                                            className={styles.btnNotify}
                                            onClick={() => handleApprove(item.id, item.riskScore, item.riskLevel, item.indicators, item.workerId)}
                                            disabled={approving === item.id}
                                        >
                                            {approving === item.id ? 'Sending...' : 'Approve & Notify'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {cases.length === 0 && (
                            <div className={styles.empty}>No high-risk cases currently flagged for review.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
