import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p className={styles.copy}>© 2026 ASHA Setu. All worker data is strictly confidential.</p>
            <div className={styles.links}>
                <a href="#">Privacy Policy</a>
                <a href="#">Support Center</a>
            </div>
        </footer>
    )
}
