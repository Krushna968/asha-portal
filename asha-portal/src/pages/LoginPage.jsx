import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import styles from './LoginPage.module.css'

export default function LoginPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError('')
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const idToken = await result.user.getIdToken(true)

            const res = await fetch('http://localhost:3001/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            })

            const data = await res.json()
            if (res.ok) {
                localStorage.setItem('asha_token', data.token)
                localStorage.setItem('asha_worker', JSON.stringify(data.worker))
                navigate('/dashboard')
            } else {
                setError(data.error || 'Server error during login')
                if (auth.currentUser) await auth.signOut()
            }
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to sign in with Google')
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()
            if (res.ok) {
                localStorage.setItem('asha_token', data.token)
                localStorage.setItem('asha_worker', JSON.stringify(data.worker))
                navigate('/dashboard')
            } else {
                setError(data.error || 'Invalid credentials')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to connect to the server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.leftPanel}>
                    <div className={styles.logoPlaceholder}>✨</div>
                    <h1 className={styles.headline}>Healthcare Delivery, Simplified.</h1>
                    <p className={styles.subtitle}>
                        “The best way to find yourself is to lose yourself in the service of others.” <br />— Mahatma Gandhi
                    </p>
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.formWrap}>
                        <h2 className={styles.formTitle}>Welcome Back</h2>
                        <p className={styles.formSub}>Sign in securely to your ASHA Portal.</p>

                        {error && <div className={styles.errorBanner}>{error}</div>}

                        <form onSubmit={handlePasswordLogin} className={styles.manualForm}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span>OR</span>
                        </div>

                        <button
                            className={styles.googleBtn}
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className={styles.gIcon} />
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
