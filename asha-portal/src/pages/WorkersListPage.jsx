import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './WorkersListPage.module.css'

export default function WorkersListPage() {
    const navigate = useNavigate()
    const [workers, setWorkers] = useState([])
    const [pendingWorkers, setPendingWorkers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showPending, setShowPending] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchWorkers()
    }, [])

    const fetchWorkers = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('asha_token')
            const res = await fetch('http://10.75.109.134:3001/api/admin/workers', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                // Split between registered (has employeeId) and pending (if any, though backend doesn't differentiate yet)
                // For this demo, we'll assume all fetched workers are registered
                setWorkers(data)

                // Mock pending for UI demonstration if needed, or leave empty
                setPendingWorkers([])
            }
        } catch (err) {
            console.error('Fetch workers error:', err)
        } finally {
            setLoading(false)
        }
    }

    const filteredWorkers = workers.filter(w =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.village.toLowerCase().includes(search.toLowerCase()) ||
        w.employeeId.toLowerCase().includes(search.toLowerCase())
    )

    const approveWorker = (worker) => {
        const newWorker = {
            ...worker,
            employeeId: `ASH-${Math.floor(1000 + Math.random() * 9000)}`,
            _count: { residents: 0 },
            status: 'Active'
        }
        setWorkers([newWorker, ...workers])
        setPendingWorkers(pendingWorkers.filter(p => p.id !== worker.id))
        alert(`${worker.name} has been approved and added to the ASHA workers list.`)
    }

    return (
        <div className={styles.page}>
            <TopNav active="workers" />

            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{showPending ? 'Pending Registrations' : 'ASHA Workers'}</h1>
                        <p className={styles.subtitle}>
                            {showPending
                                ? 'Review and approve new ASHA worker applications.'
                                : 'Manage and monitor registered healthcare personnel.'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {showPending && (
                            <button className={styles.btnView} onClick={() => setShowPending(false)}>
                                Back to Workers
                            </button>
                        )}
                        <button className={styles.btnAdd} onClick={() => setShowPending(!showPending)}>
                            {showPending ? 'Close Pending List' : 'Pending ASHA Worker Registrations'}
                            {!showPending && pendingWorkers.length > 0 && (
                                <span style={{ marginLeft: '8px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>
                                    {pendingWorkers.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {!showPending && (
                    <div className={styles.controls}>
                        <div className={styles.searchBox}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <input
                                type="text"
                                placeholder="Search by name, village, or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className={styles.tableWrap}>
                    {showPending ? (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Village</th>
                                    <th>Contact</th>
                                    <th>Requested At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingWorkers.map(w => (
                                    <tr key={w.id} className={styles.row}>
                                        <td>
                                            <div className={styles.nameCell}>
                                                <div className={styles.avatar}>{w.name[0]}</div>
                                                <span>{w.name}</span>
                                            </div>
                                        </td>
                                        <td>{w.village}</td>
                                        <td>{w.mobileNumber}</td>
                                        <td>{w.requestedAt}</td>
                                        <td>
                                            <button
                                                className={styles.btnAdd}
                                                style={{ padding: '6px 12px', fontSize: '13px' }}
                                                onClick={() => approveWorker(w)}
                                            >
                                                Approve & Add
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Worker ID</th>
                                    <th>Village</th>
                                    <th>Contact</th>
                                    <th>Residents</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWorkers.map(w => (
                                    <tr key={w.id} className={styles.row}>
                                        <td>
                                            <div className={styles.nameCell}>
                                                <div className={styles.avatar}>{w.name[0]}</div>
                                                <span>{w.name}</span>
                                            </div>
                                        </td>
                                        <td><code className={styles.idCode}>{w.employeeId}</code></td>
                                        <td>{w.village}</td>
                                        <td>{w.mobileNumber}</td>
                                        <td>{w._count?.patients || 0}</td>
                                        <td>
                                            <span className={styles.statusActive}>Active</span>
                                        </td>
                                        <td>
                                            <button
                                                className={styles.btnView}
                                                onClick={() => navigate(`/workers/${w.id}`)}
                                            >
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {((!showPending && filteredWorkers.length === 0) || (showPending && pendingWorkers.length === 0)) && (
                        <div className={styles.empty}>No {showPending ? 'pending registrations' : 'workers'} found.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
