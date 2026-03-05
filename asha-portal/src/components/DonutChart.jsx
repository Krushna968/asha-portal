import styles from './DonutChart.module.css'

const SEGMENTS = [
    { label: 'Prenatal Care', pct: 45, color: '#003399' },
    { label: 'Immunization', pct: 30, color: '#0055ff' },
    { label: 'Hygiene', pct: 15, color: '#3399ff' },
    { label: 'Other', pct: 10, color: '#99ccff' },
]

// Build SVG arc paths for donut chart (unchanged logic)
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
    // Increased dimensions for bigger circle
    const cx = 110, cy = 110, r = 85, sw = 30
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
                    <svg viewBox="0 0 220 220" className={styles.svg}>
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
                                style={{ transition: `stroke-dasharray .8s ease ${i * 0.12}s` }}
                            />
                        ))}
                        {/* centre text */}
                        <g className={styles.centreGroup}>
                            <text x={cx} y={cy - 8} textAnchor="middle" className={styles.centreVal}>{total}</text>
                            <text x={cx} y={cy + 14} textAnchor="middle" className={styles.centreLabel}>TOTAL REPORTS</text>
                        </g>
                    </svg>
                </div>
                <div className={styles.legend}>
                    {SEGMENTS.map(({ label, pct, color }) => (
                        <div key={label} className={styles.legendItem}>
                            <span className={styles.dot} style={{ background: color }} />
                            <span className={styles.legendLabel} style={{ color: color }}>{label}</span>
                            <span className={styles.legendPct}>{pct}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
