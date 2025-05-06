'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'

// components
import Loading from '@/components/Loading'
import Portal from '@/components/Utils/Portal'

// svg
import { LoaderCircle, Check, X } from 'lucide-react'

// css
import styles from './index.module.scss'

export default function GenerateReport({
    isOpen = false,
    projectId,
    onClose
}: {
    projectId?: string
    isOpen: boolean
    onClose?: () => void
}) {

    const [reports, setReports] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(false)

    // Fetch all reports for the current project
	useEffect(() => {
		if (!projectId) return

		const fetchReports = async () => {
			setIsLoading(true)
			try {
				// Get all reports for the user
				const reportsResponse = await fetch('/api/proxy?endpoint=/api/reports/me')
				
				if (!reportsResponse.ok) {
					console.error('Failed to fetch reports:', reportsResponse.status)
					return
				}
				
				const allReports = await reportsResponse.json()
				
				// Filter reports to only those in this project
				const projectReports = allReports.filter((r: any) => r.project_id === projectId)
				
				// For each report, fetch its charts
				const reportsWithCharts = await Promise.all(projectReports.map(async (report: any) => {
					try {
						const chartsResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${report.id}`)
						
						if (!chartsResponse.ok) {
							console.error(`Failed to fetch charts for report ${report.id}:`, chartsResponse.status)
							return { ...report, charts: [] }
						}
						
						const charts = await chartsResponse.json()
						return { ...report, charts }
					} catch (error) {
						console.error(`Error fetching charts for report ${report.id}:`, error)
						return { ...report, charts: [] }
					}
				}))
				
				setReports(reportsWithCharts)
			} catch (error) {
				console.error('Error fetching reports:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchReports()
	}, [projectId])

    const closeGenerateReport = () => {
        if (onClose) {
            onClose()
        }
        setTimeout(() => {
            document.body.classList.remove('no-scroll')
        }, 100)
    }

    // add body class when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                document.body.classList.add('no-scroll')
            }, 300)
        }
        
        return () => {
            document.body.classList.remove('no-scroll')
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <Portal>
                    <motion.div
                        className={styles.component}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >

                        <div
                            className={styles.closeBg}
                            onClick={closeGenerateReport}
                        ></div>

                        <div className={styles.wrapper}>

							<div className={styles.topPart}>
                                        
								<h2 className='text-45 bold blue'>
									Select reports
								</h2>

								<p className='text-16'>
									Select the reports you would like to include.
								</p>

								<button
									className={styles.close}
									onClick={closeGenerateReport}
								>
									<X />
								</button>

							</div>

                            <div className={styles.list}>
                                {isLoading ? (
                                    <Loading
                                        noContainer
                                        simple
                                    />
                                ) : reports.length > 0 ? (
                                    reports.map((report) => (
                                        <div
                                            key={report.id}
                                            className={clsx(
                                                styles.report,
                                                report.charts && report.charts.length > 0 ? (
                                                    report.charts.map((chart: any) => (
                                                        chart.results && Array.isArray(chart.results) && chart.results.length > 0 ? null : styles.disabled
                                                    ))
                                                ) : null
                                            )}
                                        >
        
                                            <input
                                                type='hidden'
                                                id={report.id}
                                                className={styles.reportId}
                                            />

                                            <p className='bold'>
                                                {report.name}
                                            </p>

                                            <div className={styles.charts}>
                                                {report.charts && report.charts.length > 0 ? (
                                                    report.charts.map((chart: any) => (
                                                        // Check if chart has valid results
                                                        chart.results && Array.isArray(chart.results) && chart.results.length > 0 ? (
                                                            <div key={chart.id} className={styles.chart}>
                                                                <label htmlFor={chart.id} className={styles.checkbox}>
                                                            
                                                                    <input 
                                                                        type='checkbox' 
                                                                        id={chart.id}
                                                                    />
                                                                    
                                                                    <span className={styles.icon}>
                                                                        <Check />
                                                                    </span>

                                                                    <p className='text-16'>
                                                                        {chart.title || 'Untitled Chart'}
                                                                    </p>
                                                                    
                                                                </label>
                                                            </div>
                                                        ) : null
                                                    ))
                                                ) : (
                                                    <p className='text-14 red'>
                                                        No charts available for this report
                                                    </p>
                                                )}
                                                
                                                {report.charts && report.charts.length > 0 && 
                                                    !report.charts.some((chart: any) => 
                                                        chart.results && Array.isArray(chart.results) && chart.results.length > 0
                                                    ) && (
                                                        <p className='text-14'>
                                                            All charts for this report have no data
                                                        </p>
                                                    )
                                                }
                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <p className='text-16 red'>
                                        No reports available for this project
                                    </p>
                                )}
                            </div>

                            <div className={styles.buttons}>

                                <button
                                    className={clsx('button button--hollow text-16', styles.cancel)}
                                    onClick={closeGenerateReport}
                                >
                                    Cancel
                                </button>

                                <button
                                    className='button button--gradient-blue text-16 proceed'
                                    data-close
                                >
                                    <span className='button__text'>
                                        Proceed
                                    </span>

                                    <span className='button__loading'>
                                        <span className='rotation' style={{ '--speed': '.5' } as any}>
                                            <LoaderCircle />
                                        </span>
                                    </span>
                                </button>

                            </div>

                        </div>

                    </motion.div>
                </Portal>
            )}
        </AnimatePresence>
    )
}