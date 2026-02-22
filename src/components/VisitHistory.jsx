import styles from './VisitHistory.module.css'

const VISITS = [
    {
        id: 1,
        icon: 'home',
        time: 'YESTERDAY, 10:30 AM',
        houseId: 'HH-9021',
        title: 'Immunization Follow-up',
        desc: 'Administered second dose of Hepatitis B to newborn. Patient healthy, mother advised on next schedule.',
    },
    {
        id: 2,
        icon: 'phone',
        time: '24 OCT, 04:15 PM',
        houseId: 'HH-4512',
        title: 'Prenatal Nutrition Counseling',
        desc: 'Distribution of Iron/Folic supplements. Patient reporting mild nausea; suggested diet modifications.',
    },
]

const HomeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
)
const PhoneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 6.82 19.79 19.79 0 012 2.18 2 2 0 013.99 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
)

export default function VisitHistory() {
    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <div className={styles.header}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                    </svg>
                    <h2 className={styles.title}>Recent Visit History</h2>
                </div>
                <a href="#" className={styles.viewAll}>View All Logs</a>
            </div>

            <div className={styles.list}>
                {VISITS.map((v, i) => (
                    <div key={v.id}>
                        <div className={styles.item}>
                            <div className={`${styles.icon} ${v.icon === 'home' ? styles.iconBlue : styles.iconGrey}`}>
                                {v.icon === 'home' ? <HomeIcon /> : <PhoneIcon />}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.metaRow}>
                                    <span className={styles.time}>{v.time}</span>
                                    <span className={styles.hid}>Household ID: {v.houseId}</span>
                                </div>
                                <div className={styles.visitTitle}>{v.title}</div>
                                <div className={styles.desc}>{v.desc}</div>
                            </div>
                        </div>
                        {i < VISITS.length - 1 && <div className={styles.divider} />}
                    </div>
                ))}
            </div>
        </div>
    )
}
