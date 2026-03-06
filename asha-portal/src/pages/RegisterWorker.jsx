import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './RegisterWorker.module.css'

export default function RegisterWorker() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        mobileNumber: '',
        village: '',
        email: ''
    })

    // Check auth
    useEffect(() => {
        const stored = localStorage.getItem('asha_worker')
        if (!stored) {
            navigate('/')
        }
    }, [navigate])

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        if (formData.mobileNumber.length < 10) {
            setError('Mobile number must be at least 10 digits.')
            setLoading(false)
            return
        }

        try {
            const token = localStorage.getItem('asha_token')

            const res = await fetch('http://10.75.109.134:3001/api/admin/workers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess('ASHA Worker registered successfully! They can now log in to the Mobile App.')
                setFormData({ name: '', employeeId: '', mobileNumber: '', village: '', email: '' })
            } else {
                setError(data.error || 'Failed to register worker. Please check the fields and try again.')
            }
        } catch (err) {
            console.error(err)
            setError('A network error occurred connecting to the backend.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <TopNav active="register" />

            <div className={styles.content}>
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h1 className={styles.title}>Register New ASHA Worker</h1>
                        <p className={styles.subtitle}>
                            Fill out the worker's details to grant them access to the mobile application.
                        </p>
                    </div>

                    {error && <div className={styles.errorBanner}>{error}</div>}
                    {success && <div className={styles.successBanner}>{success}</div>}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Sita Devi"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Special ID (Employee ID) *</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    placeholder="e.g. ASHA-401"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Mobile Number *</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    placeholder="e.g. 9876543210"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    required
                                />
                                <span className={styles.hint}>Without +91. Used for mobile app OTP login.</span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Assigned Village / Area *</label>
                            <input
                                type="text"
                                name="village"
                                placeholder="e.g. Rampur"
                                value={formData.village}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email Address (Optional)</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Admin web portal access only"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.btnSecondary}
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.btnPrimary}
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register Worker'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
