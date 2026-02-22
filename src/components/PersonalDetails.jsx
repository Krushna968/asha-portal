import styles from './PersonalDetails.module.css'

const details = [
    { key: 'Age', val: '34 years', link: false },
    { key: 'Contact', val: '+91 98765 43210', link: 'tel:+919876543210' },
    { key: 'Qualification', val: 'Higher Secondary', link: false },
    { key: 'Village Block', val: 'Green Valley Sector 4', link: false },
    { key: 'Population Covered', val: '1,250 residents', link: false },
]

export default function PersonalDetails() {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <h2 className={styles.title}>Personal Details</h2>
            </div>
            <div className={styles.list}>
                {details.map(({ key, val, link }) => (
                    <div key={key} className={styles.row}>
                        <span className={styles.key}>{key}</span>
                        {link
                            ? <a href={link} className={`${styles.val} ${styles.link}`}>{val}</a>
                            : <span className={styles.val}>{val}</span>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}
