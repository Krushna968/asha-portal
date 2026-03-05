import styles from './AreaMap.module.css'

export default function AreaMap() {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
                </svg>
                <h2 className={styles.title}>Assigned Area</h2>
            </div>
            <div className={styles.mapWrap}>
                <iframe
                    title="Sector 4 Area Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=73.84,18.50,73.92,18.56&layer=mapnik&marker=18.53,73.88"
                    className={styles.iframe}
                    loading="lazy"
                />
                <div className={styles.label}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    Sector 4 Boundaries
                </div>
            </div>
        </div>
    )
}
