import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import WorkerHero from '../components/WorkerHero'
import PersonalDetails from '../components/PersonalDetails'
import AreaMap from '../components/AreaMap'
import PerformanceChart from '../components/PerformanceChart'
import TaskList from '../components/TaskList'
import VisitHistory from '../components/VisitHistory'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
    const [addTaskTrigger, setAddTaskTrigger] = useState(false)
    const navigate = useNavigate()

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

                <WorkerHero onAddTask={() => setAddTaskTrigger(true)} />

                <div className={styles.grid}>
                    <div className={styles.colLeft}>
                        <PersonalDetails />
                        <AreaMap />
                    </div>
                    <div className={styles.colRight}>
                        <PerformanceChart />
                        <TaskList
                            addTrigger={addTaskTrigger}
                            onAddDone={() => setAddTaskTrigger(false)}
                        />
                        <VisitHistory />
                    </div>
                </div>
            </div>
        </div>
    )
}
