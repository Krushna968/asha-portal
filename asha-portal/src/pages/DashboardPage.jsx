import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopNav from '../components/TopNav'
import WorkerHero from '../components/WorkerHero'
import PersonalDetails from '../components/PersonalDetails'
import AreaMap from '../components/AreaMap'
import PerformanceChart from '../components/PerformanceChart'
import VisitHistory from '../components/VisitHistory'
import DailyReports from '../components/DailyReports'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
    const { id } = useParams()
    const [addTaskTrigger, setAddTaskTrigger] = useState(false)
    const navigate = useNavigate()
    const [worker, setWorker] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const token = localStorage.getItem('asha_token')
                if (!token) {
                    navigate('/')
                    return
                }

                const res = await fetch(`http://10.75.109.134:3001/api/admin/workers/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    setWorker(data)
                } else {
                    navigate('/workers')
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchWorker()
    }, [id, navigate])

    if (loading) return <div className={styles.loader}>Loading worker profile...</div>
    if (!worker) return null

    return (
        <div className={styles.page}>
            <TopNav active="workers" />

            <div className={styles.content}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
                        ← Dashboard
                    </button>
                    <span className={styles.sep}>/</span>
                    <span className={styles.crumbActive}>Worker Profile</span>
                </div>

                <WorkerHero
                    worker={worker}
                    onAddTask={() => setAddTaskTrigger(true)}
                />

                <div className={styles.grid}>
                    <div className={styles.colLeft}>
                        <PersonalDetails worker={worker} />
                        <AreaMap />
                    </div>
                    <div className={styles.colRight}>
                        <PerformanceChart workerStats={worker.stats} />
                        <TaskList
                            addTrigger={addTaskTrigger}
                            onAddDone={() => setAddTaskTrigger(false)}
                            worker={worker}
                        />
                        <VisitHistory />
                        <DailyReports
                            workerId={worker.id}
                            workerName={worker.name}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
