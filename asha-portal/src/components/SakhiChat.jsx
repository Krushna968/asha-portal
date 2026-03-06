import { useState, useRef, useEffect } from 'react'
import styles from './SakhiChat.module.css'

const SUGGESTIONS = [
    { emoji: '📊', label: 'District Overview' },
    { emoji: '👩‍⚕️', label: 'All Workers Summary' },
    { emoji: '🤰', label: 'High-Risk Patients' },
    { emoji: '📋', label: 'Pending Tasks' },
    { emoji: '💊', label: 'Inventory Status' },
]

export default function SakhiChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Namaste! 🙏 I\'m **SakhiAI**, your district health intelligence assistant.\n\nAsk me about workers, patients, tasks, or any health topic. I can query your live database!' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [conversationHistory, setConversationHistory] = useState([])
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (isOpen) inputRef.current?.focus()
    }, [isOpen])

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return

        const userMsg = { role: 'user', content: text.trim() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const token = localStorage.getItem('asha_token')
            const res = await fetch('http://10.75.109.134:3001/api/sakhi/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: text.trim(),
                    conversationHistory,
                    role: 'admin',
                    workerName: 'Admin',
                })
            })

            const data = await res.json()

            const newHistory = [
                ...conversationHistory,
                { role: 'user', content: text.trim() },
                { role: 'assistant', content: data.reply || 'No response.' }
            ]
            setConversationHistory(newHistory)
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, I couldn\'t respond. 🙏' }])
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again. 📡' }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(input)
        }
    }

    const formatMessage = (text) => {
        // Simple markdown-like rendering for bold
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
    }

    return (
        <>
            <button className={`${styles.fab} ${isOpen ? styles.fabHidden : ''}`} onClick={() => setIsOpen(true)}>
                <img src="/SakhiAI.png" alt="SakhiAI" className={styles.fabIcon} />
                <span className={styles.fabLabel}>SakhiAI</span>
            </button>

            {/* Chat Panel */}
            <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.headerLogoContainer}>
                            <img src="/SakhiAI.png" alt="SakhiAI" className={styles.headerLogo} />
                        </div>
                        <div>
                            <div className={styles.headerTitle}>SakhiAI</div>
                            <div className={styles.headerSub}>{loading ? 'Thinking...' : 'District Health Intelligence'}</div>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        <button className={styles.iconBtn} onClick={() => {
                            setMessages([messages[0]])
                            setConversationHistory([])
                        }} title="Clear Chat">🗑️</button>
                        <button className={styles.iconBtn} onClick={() => setIsOpen(false)} title="Close">✕</button>
                    </div>
                </div>

                {/* Messages */}
                <div className={styles.messageArea}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                            <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                        </div>
                    ))}

                    {loading && (
                        <div className={`${styles.bubble} ${styles.botBubble}`}>
                            <div className={styles.dots}>
                                <span /><span /><span />
                            </div>
                        </div>
                    )}

                    {messages.length <= 1 && !loading && (
                        <div className={styles.suggestions}>
                            {SUGGESTIONS.map((s, i) => (
                                <button key={i} className={styles.suggestionBtn} onClick={() => sendMessage(`${s.emoji} ${s.label}`)}>
                                    {s.emoji} {s.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={styles.inputBar}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask SakhiAI anything..."
                        disabled={loading}
                        className={styles.inputField}
                    />
                    <button className={styles.sendBtn} onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}
