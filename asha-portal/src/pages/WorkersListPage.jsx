import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './WorkersListPage.module.css'

export default function WorkersListPage() {
    const navigate = useNavigate()
    const [workers, setWorkers] = useState([
        {
            id: 'krushna-rasal',
            name: 'Krushna Rasal',
            employeeId: 'ASH-1001',
            village: 'Central Block',
            mobileNumber: '9876543210',
            _count: { residents: 45 },
            status: 'Active'
        },
        {
            id: 'sunita-kumari',
            name: 'Sunita Kumari',
            employeeId: 'ASH-2091',
            village: 'Malur Block',
            mobileNumber: '9823456781',
            _count: { residents: 32 },
            status: 'Active'
        },
        {
            id: 'priya-devi',
            name: 'Priya Devi',
            employeeId: 'ASH-4402',
            village: 'Hosur North',
            mobileNumber: '8812345678',
            _count: { residents: 12 },
            status: 'Active'
        },
        {
            id: 'rekha-murthy',
            name: 'Rekha Murthy',
            employeeId: 'ASH-3310',
            village: 'Block C South',
            mobileNumber: '7733445566',
            _count: { residents: 28 },
            status: 'Active'
        },
        {
            id: 'fatima-nasser',
            name: 'Fatima Nasser',
            employeeId: 'ASH-1209',
            village: 'East Sector',
            mobileNumber: '9011223344',
            _count: { residents: 20 },
            status: 'Active'
        }
    ])
    const [pendingWorkers, setPendingWorkers] = useState([
        {
            id: 'p-1',
            name: 'Anjali Sharma',
            village: 'West Sector',
            mobileNumber: '9122334455',
            requestedAt: '1 day ago'
        },
        {
            id: 'p-2',
            name: 'Kavita Patel',
            village: 'Malur South',
            mobileNumber: '9233445566',
            requestedAt: '3 hours ago'
        }
    ])
    const [loading, setLoading] = useState(false)
    const [showPending, setShowPending] = useState(false)
    const [search, setSearch] = useState('')

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
                                        <td>{w._count?.residents || 0}</td>
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
