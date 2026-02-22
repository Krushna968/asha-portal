import styles from './DonutChart.module.css'

const SEGMENTS = [
    { label: 'Prenatal Care', pct: 45, color: '#1E3BB7' },
    { label: 'Immunization', pct: 30, color: '#6B8EEF' },
    { label: 'Hygiene', pct: 15, color: '#C7D2F8' },
    { label: 'Other', pct: 10, color: '#E8EAF6' },
]

// Build SVG arc paths for donut chart
function buildArcs(segments, cx, cy, r, strokeW) {
    const circumference = 2 * Math.PI * r
    let offset = 0
    return segments.map(seg => {
        const dash = (seg.pct / 100) * circumference
        const gap = circumference - dash
        const arc = { color: seg.color, dash, gap, offset }
        offset += dash
        return arc
    })
}

export default function DonutChart({ total = 432 }) {
    const cx = 90, cy = 90, r = 65, sw = 22
    const arcs = buildArcs(SEGMENTS, cx, cy, r, sw)
    const circumference = 2 * Math.PI * r

    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Health Issues Breakdown</h2>
                <button className={styles.moreBtn} aria-label="More options">···</button>
            </div>
            <div className={styles.body}>
                <div className={styles.chartWrap}>
                    <svg viewBox="0 0 180 180" className={styles.svg}>
                        {arcs.map((arc, i) => (
                            <circle
                                key={i}
                                cx={cx} cy={cy} r={r}
                                fill="none"
                                stroke={arc.color}
                                strokeWidth={sw}
                                strokeDasharray={`${arc.dash} ${arc.gap}`}
                                strokeDashoffset={-arc.offset + circumference / 4}
                                className={styles.arc}
                                style={{ transition: `stroke-dasharray .6s ease ${i * 0.1}s` }}
                            />
                        ))}
                        {/* centre text */}
                        <text x={cx} y={cy - 6} textAnchor="middle" className={styles.centreVal}>{total}</text>
                        <text x={cx} y={cy + 12} textAnchor="middle" className={styles.centreLabel}>TOTAL REPORTS</text>
                    </svg>
                </div>
                <div className={styles.legend}>
                    {SEGMENTS.map(({ label, pct, color }) => (
                        <div key={label} className={styles.legendItem}>
                            <span className={styles.dot} style={{ background: color }} />
                            <span className={styles.legendLabel}>{label}</span>
                            <span className={styles.legendPct}>{pct}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
