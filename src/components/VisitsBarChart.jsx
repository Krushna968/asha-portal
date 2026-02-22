import { useEffect, useRef } from 'react'
import styles from './VisitsBarChart.module.css'

const BLOCKS = [
    { label: 'BLOCK A', value: 60 },
    { label: 'BLOCK B', value: 85 },
    { label: 'BLOCK C', value: 45 },
    { label: 'BLOCK D', value: 70 },
    { label: 'BLOCK E', value: 55 },
]
const MAX = 100

export default function VisitsBarChart() {
    const barsRef = useRef(null)

    useEffect(() => {
        if (!barsRef.current) return
        const bars = barsRef.current.querySelectorAll('[data-h]')
        bars.forEach((bar, i) => {
            const h = parseFloat(bar.getAttribute('data-h'))
            const y = parseFloat(bar.getAttribute('data-y'))
            bar.setAttribute('height', 0)
            bar.setAttribute('y', y + h)
            setTimeout(() => {
                bar.style.transition = 'height .45s ease, y .45s ease'
                bar.setAttribute('height', h)
                bar.setAttribute('y', y)
            }, i * 80)
        })
    }, [])

    const BAR_W = 36, CHART_H = 140, GROUP_W = 66, PAD_L = 16

    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Visits per Area</h2>
                </div>
                <select className={styles.select}>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                </select>
            </div>
            <svg ref={barsRef} className={styles.svg} viewBox={`0 0 ${PAD_L * 2 + BLOCKS.length * GROUP_W} ${CHART_H + 28}`}>
                {/* grid */}
                {[0, 35, 70, 105, 140].map(y => (
                    <line key={y} x1={0} y1={y} x2={PAD_L * 2 + BLOCKS.length * GROUP_W} y2={y} stroke="#F0F0F5" strokeWidth="1" />
                ))}
                {BLOCKS.map(({ label, value }, i) => {
                    const h = (value / MAX) * CHART_H
                    const y = CHART_H - h
                    const x = PAD_L + i * GROUP_W + (GROUP_W - BAR_W) / 2
                    return (
                        <g key={label}>
                            <rect
                                data-h={h} data-y={y}
                                x={x} y={y} width={BAR_W} height={h}
                                rx="5" fill="var(--blue)"
                                className={styles.bar}
                            />
                            <text x={x + BAR_W / 2} y={CHART_H + 18} textAnchor="middle" className={styles.label}>
                                {label}
                            </text>
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}
