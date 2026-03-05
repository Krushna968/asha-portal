import styles from './StatCard.module.css'

export default function StatCard({ icon, label, value, change, changeType }) {
    const positive = changeType === 'up'
    return (
        <div className={styles.card}>
            <div className={styles.topRow}>
                <div className={`${styles.iconWrap} ${styles['icon_' + changeType]}`}>{icon}</div>
                <span className={`${styles.change} ${positive ? styles.changeUp : styles.changeDown}`}>
                    {positive ? '↑' : '↘'} {change}
                </span>
            </div>
            <div className={styles.label}>{label}</div>
            <div className={styles.value}>{value}</div>
        </div>
    )
}
