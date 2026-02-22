import styles from './WorkerHero.module.css'

export default function WorkerHero({ onAddTask }) {
    return (
        <div className={styles.card}>
            <div className={styles.left}>
                <div className={styles.photoWrap}>
                    <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="Anjali Sharma"
                        className={styles.photo}
                        onError={e => { e.target.style.display = 'none'; e.target.parentElement.classList.add('fallback') }}
                    />
                    <span className={styles.onlineDot} />
                </div>
                <div className={styles.info}>
                    <div className={styles.nameRow}>
                        <h1 className={styles.name}>Anjali Sharma</h1>
                        <span className={styles.roleTag}>Senior Activist</span>
                    </div>
                    <div className={styles.meta}>
                        <span>ID: ASHA-2024-0892</span>
                        <span className={styles.sep}>·</span>
                        <span>Joined Jan 2021</span>
                        <span className={styles.sep}>·</span>
                        <span>Supervisor: Dr. Rajesh Kumar</span>
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <button className={styles.btnOutline}>
                    <DownloadIcon /> Download Report
                </button>
                <button className={styles.btnOutline}>
                    <MailIcon /> Send Message
                </button>
                <button className={styles.btnPrimary} onClick={onAddTask}>
                    <PlusIcon /> Add Task
                </button>
            </div>
        </div>
    )
}

const DownloadIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)
const MailIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
)
const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
