import { useState } from 'react'
import styles from './TaskList.module.css'

const INITIAL_TASKS = [
    { id: 1, name: 'Newborn Immunization Drive', priority: 'HIGH', due: 'Oct 24, 2023', status: 'pending' },
    { id: 2, name: 'Monthly Data Entry', priority: 'MED', due: 'Oct 28, 2023', status: 'not-started' },
    { id: 3, name: 'Prenatal Checkup – Block B', priority: 'HIGH', due: 'Oct 22, 2023', status: 'completed' },
]

const PRIORITY_CLASS = { HIGH: styles.high, MED: styles.med, LOW: styles.low }
const STATUS_CLASS = { pending: styles.pending, 'not-started': styles.notStarted, completed: styles.completed }
const STATUS_LABEL = { pending: '● Pending', 'not-started': '○ Not Started', completed: '✓ Completed' }

export default function TaskList({ addTrigger, onAddDone }) {
    const [tasks, setTasks] = useState(INITIAL_TASKS)

    // effect: when parent triggers add task
    if (addTrigger) {
        const name = window.prompt('Enter new task name:')
        onAddDone()
        if (name) {
            const due = new Date()
            due.setDate(due.getDate() + 7)
            const dueFmt = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            setTasks(prev => [...prev, { id: Date.now(), name, priority: 'MED', due: dueFmt, status: 'not-started' }])
        }
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    <h2 className={styles.title}>Current Task List</h2>
                </div>
            </div>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Task Name</th><th>Priority</th><th>Due Date</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id}>
                                <td className={styles.taskName}>{task.name}</td>
                                <td><span className={`${styles.priority} ${PRIORITY_CLASS[task.priority]}`}>{task.priority}</span></td>
                                <td className={styles.date}>{task.due}</td>
                                <td><span className={`${styles.status} ${STATUS_CLASS[task.status]}`}>{STATUS_LABEL[task.status]}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
