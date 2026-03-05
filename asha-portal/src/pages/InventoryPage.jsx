import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './InventoryPage.module.css'

export default function InventoryPage() {
    const navigate = useNavigate()
    const [inventory, setInventory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const token = localStorage.getItem('asha_token')
                const res = await fetch('http://localhost:3001/api/admin/inventory', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    setInventory(await res.json())
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchInventory()
    }, [])

    return (
        <div className={styles.page}>
            <TopNav active="inventory" />

            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Inventory Monitoring</h1>
                        <p className={styles.subtitle}>Bird's-eye view of medical supplies and kits across villages.</p>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loader}>Tracking supplies...</div>
                ) : (
                    <div className={styles.grid}>
                        {inventory.map(item => (
                            <div key={item.name} className={styles.itemCard}>
                                <div className={styles.itemHeader}>
                                    <h3 className={styles.itemName}>{item.name}</h3>
                                    <span className={styles.totalBadge}>{item.total} {item.unit}</span>
                                </div>

                                <div className={styles.locations}>
                                    <div className={styles.locHeader}>
                                        <span>Village</span>
                                        <span>Quantity</span>
                                    </div>
                                    {item.locations.map((loc, i) => (
                                        <div key={i} className={styles.locRow}>
                                            <div className={styles.locInfo}>
                                                <span className={styles.villageName}>{loc.village}</span>
                                                <span className={styles.workerName}>({loc.worker})</span>
                                            </div>
                                            <span className={`${styles.quantity} ${loc.quantity < 5 ? styles.lowStock : ''}`}>
                                                {loc.quantity} {item.unit}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {item.total < 20 && (
                                    <div className={styles.warning}>
                                        ⚠️ Overall stock is low. Consider procurement.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
