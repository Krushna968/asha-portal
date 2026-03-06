import React, { useState, useEffect } from 'react';
import styles from './ReportViewer.module.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportViewer = ({ reportId, onClose }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('asha_token');
                const res = await fetch(`http://10.75.109.134:3001/api/admin/reports/${reportId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setReport(data);
                }
            } catch (err) {
                console.error('Error fetching report:', err);
            } finally {
                setLoading(false);
            }
        };

        if (reportId) fetchReport();
    }, [reportId]);

    const downloadAsPDF = () => {
        if (!report) return;
        const doc = new jsPDF();
        const { date, worker, content } = report;
        const dateStr = new Date(date).toLocaleDateString();
        const activities = content.activities || [];

        // Header
        doc.setTextColor(33, 150, 243); // Blue
        doc.setFontSize(20);
        doc.text('ASHA-Setu Daily Visit Report', 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(dateStr, 196, 22, { align: 'right' });

        // Worker Info
        doc.setFontSize(11);
        doc.text(`Worker: ${worker?.name || 'N/A'} (${worker?.employeeId || 'N/A'})`, 14, 32);
        doc.text(`Village: ${worker?.village || 'N/A'}`, 14, 38);

        // Activity Table
        const tableData = activities.map(act => [
            act.location || act.houseNo || 'FIELD',
            act.patientName || 'N/A',
            act.description || 'Routine Visit',
            act.time || '--:--'
        ]);

        autoTable(doc, {
            startY: 45,
            head: [['House', 'Individual Name', 'Visit Type', 'Time']],
            body: tableData,
            headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 14, right: 14 },
            didDrawPage: (data) => {
                // Footer
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(10);
                doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
            }
        });

        const finalY = (doc).lastAutoTable.finalY || 150;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Visits: ${activities.length}`, 14, finalY + 10);

        if (content.summary) {
            doc.text('Summary:', 14, finalY + 20);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(content.summary, 14, finalY + 28, { maxWidth: 180 });
        }

        doc.save(`ASHA_Report_${new Date(date).toISOString().split('T')[0]}.pdf`);
    };

    if (loading) return <div className={styles.overlay}><div className={styles.modal}>Loading report...</div></div>;
    if (!report) return <div className={styles.overlay}><div className={styles.modal}>Report not found.</div></div>;

    const { content, date, worker } = report;
    const stats = content.stats || {};
    const activities = content.activities || [];

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h1>Daily Activity Report</h1>
                        <p className={styles.subtitle}>Date: {new Date(date).toLocaleDateString()}</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.pdfContent}>
                    <div className={styles.section}>
                        <h2>Worker Information</h2>
                        <div className={styles.infoGrid}>
                            <div><strong>Name:</strong> {worker?.name || 'N/A'}</div>
                            <div><strong>Employee ID:</strong> {worker?.employeeId || 'N/A'}</div>
                            <div><strong>Village:</strong> {worker?.village || 'N/A'}</div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Daily Statistics</h2>
                        <div className={styles.statsGrid}>
                            <div className={styles.statBox}>
                                <span className={styles.statVal}>{stats.patientsVisited || 0}</span>
                                <span className={styles.statLabel}>Patients Visited</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statVal}>{stats.highRiskFollowups || 0}</span>
                                <span className={styles.statLabel}>High-Risk Followups</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statVal}>{stats.newRegistrations || 0}</span>
                                <span className={styles.statLabel}>New Registrations</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Activity Log</h2>
                        {activities.length > 0 ? (
                            <table className={styles.activityTable}>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Activity</th>
                                        <th>Patient/Location</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((act, i) => (
                                        <tr key={i}>
                                            <td>{act.time || '--:--'}</td>
                                            <td>{act.description}</td>
                                            <td>{act.patientName || act.location || 'N/A'}</td>
                                            <td><span className={styles.statusBadge}>{act.status || 'Done'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No activities recorded for this day.</p>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h2>Summary & Notes</h2>
                        <p className={styles.summaryText}>{content.summary || 'Monthly/Daily routine activities completed as planned.'}</p>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.printBtn} onClick={downloadAsPDF}>
                        <span>Download as PDF</span>
                    </button>
                    <button className={styles.printBtnAlt} onClick={() => window.print()}>Print View</button>
                </div>
            </div>
        </div>
    );
};

export default ReportViewer;
