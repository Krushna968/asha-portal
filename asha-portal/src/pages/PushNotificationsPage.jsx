import { useState, useEffect } from 'react'
import styles from './PushNotificationsPage.module.css'
import ReportViewer from '../components/ReportViewer'

const BACKEND_URL = 'http://10.75.109.134:3001/api/admin'

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}

export default function PushNotificationsPage() {
    const [selectedMsg, setSelectedMsg] = useState(null)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [viewingReportId, setViewingReportId] = useState(null)

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('asha_token')
                const res = await fetch(`${BACKEND_URL}/messages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json()
                setMessages(data)
                if (data.length > 0 && !selectedMsg) setSelectedMsg(data[0])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchMessages()
    }, [selectedMsg])

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2>Worker Reports</h2>
                        <span className={styles.badge}>{messages.length} Field Contacts</span>
                    </div>
                    <div className={styles.msgList}>
                        {loading && (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                                Loading conversations...
                            </div>
                        )}
                        {!loading && messages.length === 0 && (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                                No reports received.
                            </div>
                        )}
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`${styles.msgItem} ${selectedMsg?.id === msg.id ? styles.active : ''}`}
                                onClick={() => setSelectedMsg(msg)}
                            >
                                <div className={styles.avatar}>{msg.workerName?.charAt(0) || 'W'}</div>
                                <div className={styles.msgInfo}>
                                    <div className={styles.msgHeader}>
                                        <span className={styles.workerName}>{msg.workerName}</span>
                                        <span className={styles.time}>{timeAgo(msg.createdAt)}</span>
                                    </div>
                                    <div className={styles.msgPreview}>
                                        <span className={styles.aiTag}>🤖 SakhiAI Forwarded Report</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={styles.chatArea}>
                    {selectedMsg ? (
                        <>
                            <div className={styles.chatHeader}>
                                <div className={styles.avatarLarge}>{selectedMsg.workerName?.charAt(0) || 'W'}</div>
                                <div className={styles.workerMeta}>
                                    <h3>{selectedMsg.workerName}</h3>
                                    <p>Worker ID: {selectedMsg.workerEmployeeId} • {selectedMsg.workerVillage}</p>
                                </div>
                            </div>
                            <div className={styles.messagesContainer}>
                                <div className={styles.messageBubble}>
                                    <div className={styles.bubbleHeader}>
                                        <span className={styles.tag}>SakhiAI Assistant</span>
                                    </div>
                                    <div className={styles.bubbleContent}>
                                        <p>{selectedMsg.content.replace('[SakhiAI Automated Forward]\n', '')}</p>

                                        {selectedMsg.reportId && (
                                            <div
                                                className={styles.reportAttachment}
                                                onClick={() => setViewingReportId(selectedMsg.reportId)}
                                                title="Click to View or Download Report"
                                            >
                                                <div className={styles.reportIcon}>
                                                    <span className={styles.pdfBox}>PDF</span>
                                                </div>
                                                <div className={styles.reportDetails}>
                                                    <span>Daily_Activity_Report.pdf</span>
                                                    <div className={styles.reportMeta}>
                                                        <span>12 KB</span>
                                                        <span>•</span>
                                                        <span>PDF Document</span>
                                                    </div>
                                                </div>
                                                <div className={styles.downloadBtn}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.bubbleFooter}>
                                        {new Date(selectedMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        <span style={{ color: '#53bdeb', fontSize: '10px' }}>✓✓</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.welcomeIcon}>
                                <svg width="250" height="250" viewBox="0 0 512 512" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="256" cy="256" r="256" fill="#f0f2f5" />
                                    <path d="M376 192H136C122.745 192 112 202.745 112 216V344C112 357.255 122.745 368 136 368H376C389.255 368 400 357.255 400 344V216C400 202.745 389.255 192 376 192Z" fill="#dfe5e7" />
                                </svg>
                            </div>
                            <h2>ASHA-Setu Admin Portal</h2>
                            <p>Select a worker from the left to view reports and communication forwarded by SakhiAI.</p>
                        </div>
                    )}
                </div>
            </div>

            {viewingReportId && (
                <ReportViewer
                    reportId={viewingReportId}
                    onClose={() => setViewingReportId(null)}
                />
            )}
        </div>
    )
}
