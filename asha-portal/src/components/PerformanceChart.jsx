import { useEffect, useRef } from 'react'
import styles from './PerformanceChart.module.css'

const BARS = [
    { month: 'JAN', visits: 70, target: 50 },
    { month: 'FEB', visits: 110, target: 80 },
    { month: 'MAR', visits: 90, target: 70 },
    { month: 'APR', visits: 140, target: 100 },
    { month: 'MAY', visits: 120, target: 80 },
    { month: 'JUN', visits: 150, target: null },
]

const MAX_VAL = 160
const CHART_H = 160
const toY = v => CHART_H - (v / MAX_VAL) * CHART_H

export default function PerformanceChart() {
    const svgRef = useRef(null)

    useEffect(() => {
        if (!svgRef.current) return
        const bars = svgRef.current.querySelectorAll('[data-animated]')
        bars.forEach((bar, i) => {
            const finalY = parseFloat(bar.getAttribute('data-y'))
            const finalH = parseFloat(bar.getAttribute('data-h'))
            bar.setAttribute('y', finalY + finalH)
            bar.setAttribute('height', 0)
            setTimeout(() => {
                bar.style.transition = `y .45s ease, height .45s ease`
                bar.setAttribute('y', finalY)
                bar.setAttribute('height', finalH)
            }, i * 60)
        })
    }, [])

    // bar width / spacing
    const barW = 28, gap = 12, groupW = 60
    const getX = (groupIdx, offset) => 20 + groupIdx * groupW + offset

    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <div className={styles.header}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                    </svg>
                    <h2 className={styles.title}>Performance Trend <span className={styles.light}>(Visits vs Targets)</span></h2>
                </div>
                <span className={styles.period}>Last 6 Months</span>
            </div>

            <svg ref={svgRef} className={styles.svg} viewBox="0 0 380 185" xmlns="http://www.w3.org/2000/svg">
                {/* grid lines */}
                {[0, 40, 80, 120, 160].map(y => (
                    <line key={y} x1="0" y1={y} x2="380" y2={y} stroke="#F0F0F5" strokeWidth="1" />
                ))}
                {BARS.map(({ month, visits, target }, i) => {
                    const vY = toY(visits), vH = CHART_H - vY
                    const tY = target ? toY(target) : 0, tH = target ? CHART_H - tY : 0
                    const xV = getX(i, 0), xT = getX(i, barW + gap)
                    return (
                        <g key={month}>
                            <rect
                                data-animated data-y={vY} data-h={vH}
                                x={xV} y={vY + vH} width={barW} height={0}
                                rx="4" className={styles.barVisit}
                            />
                            {target && (
                                <rect
                                    data-animated data-y={tY} data-h={tH}
                                    x={xT} y={tY + tH} width={barW} height={0}
                                    rx="4" className={styles.barTarget}
                                />
                            )}
                            <text x={xV + barW / 2 + (target ? barW / 2 + gap / 2 : 0)} y="178" className={styles.label} textAnchor="middle">
                                {month}
                            </text>
                        </g>
                    )
                })}
            </svg>

            <div className={styles.legend}>
                <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotVisit}`} />Actual Visits</span>
                <span className={styles.legendItem}><span className={`${styles.dot} ${styles.dotTarget}`} />Targets</span>
            </div>
        </div>
    )
}
