import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './TasksPage.module.css'

export default function TasksPage() {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [workers, setWorkers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        workerId: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('asha_token')
            const [tasksRes, workersRes] = await Promise.all([
                fetch('http://10.75.109.134:3001/api/admin/tasks', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://10.75.109.134:3001/api/admin/workers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ])

            if (tasksRes.ok && workersRes.ok) {
                setTasks(await tasksRes.json())
                setWorkers(await workersRes.json())
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTask = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('asha_token')
            const res = await fetch('http://10.75.109.134:3001/api/admin/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTask)
            })

            if (res.ok) {
                setShowModal(false)
                setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '', workerId: '' })
                fetchData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const columns = {
        'PENDING': tasks.filter(t => t.status === 'PENDING'),
        'IN_PROGRESS': tasks.filter(t => t.status === 'IN_PROGRESS'),
        'COMPLETED': tasks.filter(t => t.status === 'COMPLETED')
    }

    return (
        <div className={styles.page}>
            <TopNav active="tasks" />

            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Global Task Board</h1>
                        <p className={styles.subtitle}>Coordinate health campaigns and worker assignments.</p>
                    </div>
                    <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
                        + Create New Task
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loader}>Loading tasks...</div>
                ) : (
                    <div className={styles.board}>
                        {Object.entries(columns).map(([status, list]) => (
                            <div key={status} className={styles.column}>
                                <div className={styles.columnHeader}>
                                    <h3 className={styles.columnTitle}>{status.replace('_', ' ')}</h3>
                                    <span className={styles.count}>{list.length}</span>
                                </div>
                                <div className={styles.taskList}>
                                    {list.map(task => (
                                        <div key={task.id} className={styles.taskCard}>
                                            <div className={`${styles.priority} ${styles['priority' + task.priority]}`}>
                                                {task.priority}
                                            </div>
                                            <h4 className={styles.taskTitle}>{task.title}</h4>
                                            <p className={styles.taskDesc}>{task.description}</p>
                                            <div className={styles.taskMeta}>
                                                <div className={styles.worker}>
                                                    👤 {task.worker?.name}
                                                </div>
                                                <div className={styles.date}>
                                                    📅 {new Date(task.dueDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Create New Task</h2>
                            <button onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleCreateTask} className={styles.form}>
                            <div className={styles.field}>
                                <label>Title</label>
                                <input
                                    required
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="e.g. Weekly Polio Vaccination Drive"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Details about the task..."
                                />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Priority</label>
                                    <select
                                        value={newTask.priority}
                                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Assign to ASHA Worker</label>
                                <select
                                    required
                                    value={newTask.workerId}
                                    onChange={e => setNewTask({ ...newTask, workerId: e.target.value })}
                                >
                                    <option value="">Select Worker</option>
                                    {workers.map(w => (
                                        <option key={w.id} value={w.id}>{w.name} ({w.village})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className={styles.btnSubmit}>Assign Task</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
