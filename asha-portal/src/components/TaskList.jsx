import { useState, useEffect } from 'react'
import styles from './TaskList.module.css'

const PRIORITY_CLASS = { HIGH: styles.high, MEDIUM: styles.med, LOW: styles.low }
const STATUS_CLASS = { PENDING: styles.pending, IN_PROGRESS: styles.notStarted, COMPLETED: styles.completed }
const STATUS_LABEL = { PENDING: '○ Pending', IN_PROGRESS: '● In Progress', COMPLETED: '✓ Completed' }

export default function TaskList({ addTrigger, onAddDone }) {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch real tasks from backend
    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('asha_token')
            if (!token) return
            try {
                const res = await fetch('http://localhost:3000/api/tasks', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json()
                if (res.ok) {
                    setTasks(data)
                }
            } catch (err) {
                console.error('Failed to fetch tasks', err)
            } finally {
                setLoading(false)
            }
        }
        fetchTasks()
    }, [])

    // effect: when parent triggers add task
    if (addTrigger && !loading) {
        const title = window.prompt('Enter new task name:')
        onAddDone() // important to reset trigger state

        if (title) {
            const due = new Date();
            due.setDate(due.getDate() + 7);
            const token = localStorage.getItem('asha_token')

            fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, dueDate: due.toISOString() })
            })
                .then(res => res.json())
                .then(newTask => {
                    if (newTask.id) {
                        setTasks(prev => [...prev, newTask])
                    } else {
                        alert("Failed to create task on the server.")
                    }
                })
                .catch(err => console.error("Error creating task:", err))
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Date missing'
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
                        {loading && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading tasks securely...</td></tr>}
                        {!loading && tasks.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No pending tasks!</td></tr>}

                        {!loading && tasks.map(task => (
                            <tr key={task.id}>
                                <td className={styles.taskName}>{task.title}</td>
                                <td><span className={`${styles.priority} ${PRIORITY_CLASS[task.priority] || styles.med}`}>{task.priority}</span></td>
                                <td className={styles.date}>{formatDate(task.dueDate)}</td>
                                <td><span className={`${styles.status} ${STATUS_CLASS[task.status] || styles.pending}`}>{STATUS_LABEL[task.status] || task.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
