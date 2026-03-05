import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './WorkersListPage.module.css'

export default function WorkersListPage() {
    const navigate = useNavigate()
    const [workers, setWorkers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const token = localStorage.getItem('asha_token')
                if (!token) {
                    navigate('/')
                    return
                }

                const res = await fetch('http://localhost:3001/api/admin/workers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    setWorkers(data)
                } else {
                    setError('Failed to fetch workers')
                }
            } catch (err) {
                console.error(err)
                setError('Network error connecting to backend')
            } finally {
                setLoading(false)
            }
        }

        fetchWorkers()
    }, [navigate])

    const filteredWorkers = workers.filter(w =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.village.toLowerCase().includes(search.toLowerCase()) ||
        w.employeeId.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className={styles.page}>
            <TopNav active="workers" />

            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>ASHA Workers</h1>
                        <p className={styles.subtitle}>Manage and monitor registered healthcare personnel.</p>
                    </div>
                    <button className={styles.btnAdd} onClick={() => navigate('/register-worker')}>
                        + Register New Worker
                    </button>
                </div>

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

                {loading ? (
                    <div className={styles.loader}>Loading workers...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Worker ID</th>
                                    <th>Village</th>
                                    <th>Contact</th>
                                    <th>Patients</th>
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
                        {filteredWorkers.length === 0 && (
                            <div className={styles.empty}>No workers found matching your search.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
