import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TopNav from '../components/TopNav'
import styles from './PushNotificationsPage.module.css'

export default function PushNotificationsPage() {
    const location = useLocation()
    const [selectedChat, setSelectedChat] = useState(null)
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState({})

    // High Risk Residents for the sidebar
    const highRiskResidents = [
        { id: 'res-3', name: "Advait Rao", worker: "Krushna Rasal", village: "Central Block", status: 'critical', avatar: 'AR' },
        { id: 'res-4', name: "Akansha Gupta", worker: "Sunita Kumari", village: "Malur Block", status: 'critical', avatar: 'AG' },
        { id: 'res-8', name: "Anika Verma", worker: "Priya Devi", village: "Hosur North", status: 'critical', avatar: 'AV' },
        { id: 'res-10', name: "Anita Devi", worker: "Fatima Nasser", village: "East Sector", status: 'critical', avatar: 'AD' },
        { id: 'res-15', name: "Arjun Reddy", worker: "Fatima Nasser", village: "East Sector", status: 'critical', avatar: 'AR' },
        { id: 'res-21', name: "Chitra Iyer", worker: "Krushna Rasal", village: "Central Block", status: 'critical', avatar: 'CI' },
        { id: 'res-25', name: "Gayatri Pandey", worker: "Fatima Nasser", village: "East Sector", status: 'critical', avatar: 'GP' },
        { id: 'res-27', name: "Isha Malhotra", worker: "Sunita Kumari", village: "Malur Block", status: 'critical', avatar: 'IM' }
    ]

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const resId = queryParams.get('resId')
        const resName = queryParams.get('resName')
        const workerName = queryParams.get('worker')

        if (resId && resName) {
            setSelectedChat({
                id: resId,
                name: resName,
                worker: workerName,
                avatar: resName.split(' ').map(n => n[0]).join('')
            })
        }
    }, [location.search])

    const handleSendMessage = (e) => {
        if (e) e.preventDefault()
        if (!message.trim() || !selectedChat) return

        const newMessage = {
            id: Date.now(),
            text: message,
            sender: 'admin',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setChatHistory(prev => ({
            ...prev,
            [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
        }))
        setMessage('')
    }

    const currentMessages = chatHistory[selectedChat?.id] || []

    return (
        <div className={styles.page}>
            <TopNav active="messages" />

            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2>Active Coordination</h2>
                        <span className={styles.sidebarSubtitle}>High-Risk Resident Cases</span>
                    </div>
                    <div className={styles.workerList}>
                        {highRiskResidents.map(res => (
                            <div
                                key={res.id}
                                className={`${styles.workerItem} ${selectedChat?.id === res.id ? styles.active : ''}`}
                                onClick={() => setSelectedChat(res)}
                            >
                                <div className={styles.avatar} style={{ background: '#ef4444' }}>{res.avatar}</div>
                                <div className={styles.workerDetails}>
                                    <div className={styles.workerName}>{res.name}</div>
                                    <div className={styles.workerStatus}>ASHA: {res.worker}</div>
                                </div>
                                <div className={styles.criticalDot} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.chatArea}>
                    {selectedChat ? (
                        <>
                            <div className={styles.chatHeader}>
                                <div className={styles.headerAvatar} style={{ background: '#ef4444' }}>{selectedChat.avatar}</div>
                                <div className={styles.headerInfo}>
                                    <h3>{selectedChat.name}</h3>
                                    <span>Monitoring via ASHA: {selectedChat.worker}</span>
                                </div>
                            </div>
                            <div className={styles.messagesContainer} style={currentMessages.length === 0 ? { justifyContent: 'center', alignItems: 'center' } : {}}>
                                {currentMessages.length === 0 ? (
                                    <div className={styles.emptyChat}>
                                        <p>Chat regarding health status of {selectedChat.name}</p>
                                        <span>Coordination messages with {selectedChat.worker} are encrypted.</span>
                                    </div>
                                ) : (
                                    <div className={styles.chatWindow}>
                                        {currentMessages.map(msg => (
                                            <div key={msg.id} className={`${styles.messageBubble} ${styles.received}`}>
                                                <div className={styles.messageText}>{msg.text}</div>
                                                <div className={styles.messageTime}>{msg.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <form className={styles.inputArea} onSubmit={handleSendMessage}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder={`Message ASHA regarding ${selectedChat.name}...`}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <button type="submit" className={styles.sendBtn}>
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                            <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className={styles.noSelection}>
                            <div className={styles.welcomeIllustration}>
                                <svg viewBox="0 0 24 24" width="80" height="80" fill="#e2e8f0">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.527 3.659 1.444 5.168L2.02 21.98a1 1 0 001.246 1.247l4.812-1.424A9.959 9.959 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.63 0-3.155-.429-4.476-1.183a1 1 0 00-.814-.078l-3.328.985.985-3.328a1 1 0 00-.078-.814A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                </svg>
                            </div>
                            <h2>Select a resident to begin coordination</h2>
                            <p>Send direct push notifications to ASHA workers regarding high-risk patient status.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
