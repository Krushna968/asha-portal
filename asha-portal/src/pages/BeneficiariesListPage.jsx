import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './BeneficiariesListPage.module.css'

export default function BeneficiariesListPage() {
    const navigate = useNavigate()
    const [beneficiaries, setBeneficiaries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('ALL')

    useEffect(() => {
        const fetchBeneficiaries = async () => {
            try {
                const token = localStorage.getItem('asha_token')
                if (!token) {
                    navigate('/')
                    return
                }

                const res = await fetch('http://localhost:3001/api/admin/beneficiaries', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    setBeneficiaries(data)
                } else {
                    setError('Failed to fetch beneficiaries')
                }
            } catch (err) {
                console.error(err)
                setError('Network error connecting to backend')
            } finally {
                setLoading(false)
            }
        }

        fetchBeneficiaries()
    }, [navigate])

    const filtered = beneficiaries.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.address.toLowerCase().includes(search.toLowerCase()) ||
            b.worker?.name.toLowerCase().includes(search.toLowerCase())

        const matchesCategory = filterCategory === 'ALL' || b.category === filterCategory

        return matchesSearch && matchesCategory
    })

    const categories = ['ALL', 'ANC', 'PNC', 'INFANT', 'GENERAL']

    return (
        <div className={styles.page}>
            <TopNav active="beneficiaries" />

            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Beneficiary Directory</h1>
                        <p className={styles.subtitle}>Track health records for all patients across the district.</p>
                    </div>
                </div>

                <div className={styles.controls}>
                    <div className={styles.searchBox}>
                        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            placeholder="Search by name, worker, or address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className={styles.filters}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.filterBtn} ${filterCategory === cat ? styles.activeFilter : ''}`}
                                onClick={() => setFilterCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loader}>Loading beneficiaries...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Category</th>
                                    <th>Age</th>
                                    <th>Village</th>
                                    <th>Assigned ASHA</th>
                                    <th>Last Updated</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(b => (
                                    <tr key={b.id} className={styles.row}>
                                        <td>
                                            <div className={styles.nameCell}>
                                                <div className={styles.avatar}>{b.name[0]}</div>
                                                <span>{b.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.tag} ${styles['tag' + b.category]}`}>
                                                {b.category}
                                            </span>
                                        </td>
                                        <td>{b.age} yrs</td>
                                        <td>{b.worker?.village || 'Unknown'}</td>
                                        <td>{b.worker?.name || 'Unassigned'}</td>
                                        <td>{new Date(b.updatedAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className={styles.btnView}
                                                onClick={() => navigate(`/beneficiaries/${b.id}`)}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className={styles.empty}>No beneficiaries found matching your criteria.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
