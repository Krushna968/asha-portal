import styles from './DailyReports.module.css'
import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function DailyReports({ workerId, workerName }) {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('asha_token')
                const res = await fetch(`http://10.75.109.134:3001/api/admin/workers/${workerId}/reports`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setReports(data)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (workerId) fetchReports()
    }, [workerId])

    const downloadPDF = (report) => {
        const doc = jsPDF()
        const data = report.content

        // Header
        doc.setFontSize(20)
        doc.setTextColor(44, 62, 80)
        doc.text('ASHA-Setu Activity Report', 105, 20, { align: 'center' })

        doc.setFontSize(12)
        doc.setTextColor(110, 110, 110)
        doc.text(`Worker Name: ${workerName}`, 14, 35)
        doc.text(`Date of Submission: ${new Date(report.date).toLocaleDateString()}`, 14, 42)
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 49)

        doc.setLineWidth(0.5)
        doc.line(14, 52, 196, 52)

        // Summary Stats
        doc.setFontSize(14)
        doc.setTextColor(44, 62, 80)
        doc.text('Summary', 14, 62)

        doc.setFontSize(11)
        doc.text(`Total Tasks Assigned: ${data.total || 0}`, 20, 72)
        doc.text(`Tasks Completed: ${data.completed || 0}`, 20, 79)
        doc.text(`Pending Tasks: ${data.pending || 0}`, 20, 86)

        // Table
        if (data.completedTasks && data.completedTasks.length > 0) {
            const tableRows = data.completedTasks.map(t => [
                t.title,
                t.patient,
                t.time
            ])

            doc.autoTable({
                startY: 95,
                head: [['Task Title', 'Patient / Target', 'Completion Time']],
                body: tableRows,
                headStyles: { fillColor: [52, 152, 219] },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                margin: { top: 95 }
            })
        } else {
            doc.text('No completed tasks recorded for this day.', 14, 100)
        }

        doc.save(`Report_${workerName}_${new Date(report.date).toISOString().split('T')[0]}.pdf`)
    }

    if (loading) return <div className={styles.loading}>Loading reports...</div>

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                </svg>
                <h2 className={styles.title}>Daily Activity Reports</h2>
            </div>

            <div className={styles.list}>
                {reports.length === 0 ? (
                    <div className={styles.empty}>No reports submitted yet.</div>
                ) : (
                    reports.map((r, i) => (
                        <div key={r.id} className={styles.item}>
                            <div className={styles.info}>
                                <div className={styles.date}>{new Date(r.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                <div className={styles.stats}>
                                    <span className={styles.stat}>{r.content.completed} Tasks Done</span>
                                    <span className={styles.statDot}>•</span>
                                    <span className={styles.stat}>{r.content.pending} Pending</span>
                                </div>
                            </div>
                            <button className={styles.downloadBtn} onClick={() => downloadPDF(r)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                PDF
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
