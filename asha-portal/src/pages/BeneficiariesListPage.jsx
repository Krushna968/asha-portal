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
            setLoading(true)
            const names = [
                "Aarav Sharma", "Aditi Patel", "Advait Rao", "Akansha Gupta", "Amit Mishra",
                "Amrita Singh", "Ananya Jha", "Anika Verma", "Aniruddh Kulkarni", "Anita Devi",
                "Anjali Deshmukh", "Ankit Joshi", "Anshul Saxena", "Archana Nair", "Arjun Reddy",
                "Arpita Bose", "Aryan Khan", "Asha Rani", "Avni Kapoor", "Bhavya Jain",
                "Chitra Iyer", "Deepak Kumar", "Divya Chauhan", "Eshaan Thakur", "Gayatri Pandey",
                "Harsh Vardhan", "Isha Malhotra", "Ishaan Bhatt", "Jiya Sethi", "Kabir Das",
                "Kanishka Goyal", "Kartik Aryan", "Kavita Krishnan", "Khushi Shah", "Kunal Roy",
                "Lakshmi Bai", "Manisha Koirala", "Meera Bai", "Mohan Lal", "Nandini Murthy",
                "Naveen Polishetty", "Neha Dhupia", "Nikhil Gupta", "Pallavi Sharda", "Pooja Hegde",
                "Pratik Gandhi", "Rahul Dravid", "Rajesh Bose", "Rohan Vinayak", "Sanjay Dutt",
                "Sarita Devi", "Tanmay Joshi", "Urvashi Rautela", "Vihaan Malhotra", "Yash Mehra"
            ];

            const workers = [
                { name: "Krushna Rasal", village: "Central Block" },
                { name: "Sunita Kumari", village: "Malur Block" },
                { name: "Priya Devi", village: "Hosur North" },
                { name: "Rekha Murthy", village: "Block C South" },
                { name: "Fatima Nasser", village: "East Sector" }
            ];

            const intensities = ["HIGH", "MODERATE", "LOW"];
            const categories = ["ANC", "PNC", "INFANT", "GENERAL"];

            const dummyResidents = names.map((name, i) => {
                const worker = workers[i % workers.length];
                return {
                    id: `res-${i + 1}`,
                    name,
                    category: categories[Math.floor(Math.random() * categories.length)],
                    intensity: intensities[Math.floor(Math.random() * intensities.length)],
                    age: Math.floor(Math.random() * 60) + 1,
                    worker: {
                        name: worker.name,
                        village: worker.village
                    },
                    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000).toISOString()
                };
            });

            setTimeout(() => {
                setBeneficiaries(dummyResidents)
                setLoading(false)
            }, 500)
        }

        fetchBeneficiaries()
    }, [navigate])

    const filtered = beneficiaries.filter(b => {
        const query = search.toLowerCase()
        const matchesSearch =
            (b.name || "").toLowerCase().includes(query) ||
            (b.worker?.village || "").toLowerCase().includes(query) ||
            (b.worker?.name || "").toLowerCase().includes(query)

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
                        <h1 className={styles.title}>Resident Directory</h1>
                        <p className={styles.subtitle}>Track health records for all residents across the district.</p>
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
                                    <th>Resident Name</th>
                                    <th>Category</th>
                                    <th>Risk Intensity</th>
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
                                        <td>
                                            <span className={`${styles.tag} ${styles['tag' + b.intensity]}`}>
                                                {b.intensity}
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
