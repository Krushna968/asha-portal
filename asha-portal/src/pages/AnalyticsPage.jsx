import { useState, useEffect } from 'react'
import TopNav from '../components/TopNav'
import styles from './AnalyticsPage.module.css'

export default function AnalyticsPage() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://10.75.109.134:3001/api/admin/analytics', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('asha_token')}` }
        })
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className={styles.loader}>Generating visual reports...</div>
    if (!data) return <div className={styles.error}>No data available for the district.</div>

    return (
        <div className={styles.page}>
            <TopNav active="reports" />

            <div className={styles.content}>
                <h1 className={styles.title}>District Health Analytics</h1>

                <div className={styles.statsGrid}>
                    <div className={styles.card}>
                        <span className={styles.cardLabel}>TOTAL WORKERS</span>
                        <div className={styles.cardValue}>{data.totals.workers}</div>
                        <div className={styles.cardTrend}>+2 this month</div>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.cardLabel}>BENEFICIARIES</span>
                        <div className={styles.cardValue}>{data.totals.patients}</div>
                        <div className={styles.cardTrend}>85% coverage</div>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.cardLabel}>COMPLETED TASKS</span>
                        <div className={styles.cardValue}>{data.taskStats.COMPLETED || 0}</div>
                        <div className={styles.cardTrend}>92% efficiency</div>
                    </div>
                </div>

                <div className={styles.chartSection}>
                    <div className={styles.chartCard}>
                        <h3>Beneficiary Category Breakdown</h3>
                        <div className={styles.barChart}>
                            {Object.entries(data.categories).map(([cat, count]) => {
                                const height = (count / data.totals.patients) * 200
                                return (
                                    <div key={cat} className={styles.barColumn}>
                                        <div
                                            className={styles.bar}
                                            style={{ height: `${Math.max(height, 20)}px` }}
                                            data-label={cat}
                                        >
                                            <span>{count}</span>
                                        </div>
                                        <span className={styles.barLabel}>{cat}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <h3>Task Completion Rate</h3>
                        <div className={styles.donutPlaceholder}>
                            <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                <path className={styles.circleBg}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path className={styles.circle}
                                    strokeDasharray={`${(data.taskStats.COMPLETED / data.totals.tasks) * 100 || 0}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <text x="18" y="20.35" className={styles.percentage}>
                                    {Math.round((data.taskStats.COMPLETED / data.totals.tasks) * 100) || 0}%
                                </text>
                            </svg>
                            <p>Tasks completed on time</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
