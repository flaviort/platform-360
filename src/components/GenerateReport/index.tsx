'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import { useRouter } from 'next/navigation'

// components
import Loading from '@/components/Loading'
import Portal from '@/components/Utils/Portal'

// utils
import { formatDate } from '@/utils/functions'

// svg
import { LoaderCircle, Check, X } from 'lucide-react'

// css
import styles from './index.module.scss'

interface SelectedChart {
    id: string
    reportId: string
}

export default function GenerateReport({
    isOpen = false,
    projectId,
    onClose
}: {
    projectId?: string
    isOpen: boolean
    onClose?: () => void
}) {

    const router = useRouter()
    const [reports, setReports] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState<Record<string, string>>({})
    const [selectedCharts, setSelectedCharts] = useState<SelectedChart[]>([])
    const [projectData, setProjectData] = useState<{name: string, goal: string} | null>(null)

    // Fetch project data
    useEffect(() => {
        if (!projectId) return

        const fetchProjectData = async () => {
            try {
                // Try fetching from /api/projects/me first
                const response = await fetch('/api/proxy?endpoint=/api/projects/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                if (!response.ok) {
                    console.error('Failed to fetch projects:', response.status)
                    return
                }
                
                const projects = await response.json()
                const project = projects.find((p: any) => p.id === projectId)
                
                if (project) {
                    setProjectData({
                        name: project.name,
                        goal: project.goal
                    })
                }
            } catch (error) {
                console.error('Error fetching project:', error)
            }
        }

        fetchProjectData()
    }, [projectId])

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/proxy?endpoint=/api/categories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    console.error('Failed to fetch categories:', response.status)
                    return
                }
                const categoriesData = await response.json()
                // Create a map of category_id to category name
                const categoryMap = categoriesData.reduce((acc: Record<string, string>, category: any) => {
                    acc[category.id] = category.name
                    return acc
                }, {})
                setCategories(categoryMap)
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }

        fetchCategories()
    }, [])

    // Fetch all reports for the current project
    useEffect(() => {
        if (!projectId) return

        const fetchReports = async () => {
            setIsLoading(true)

            try {
                // Get all reports for the user
                const reportsResponse = await fetch('/api/proxy?endpoint=/api/reports/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
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
                        const chartsResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${report.id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        
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

    const handleChartSelection = (chart: any, report: any, isSelected: boolean) => {
        if (isSelected) {
            setSelectedCharts(prev => [...prev, {
                id: chart.id,
                reportId: report.id
            }])
        } else {
            setSelectedCharts(prev => prev.filter(c => c.id !== chart.id))
        }
    }

    const handleProceed = () => {
        if (selectedCharts.length === 0) return

        // Group charts by report
        const reportsMap = selectedCharts.reduce((acc: Record<string, string[]>, chart) => {
            if (!acc[chart.reportId]) {
                acc[chart.reportId] = []
            }
            acc[chart.reportId].push(chart.id)
            return acc
        }, {})

        // Prepare the data to be passed to the generate-report page
        const reportData = {
            project_id: projectId,
            reports: Object.entries(reportsMap).map(([report_id, chart_ids]) => ({
                report_id,
                chart_ids
            }))
        }

        // Navigate to the generate-report page with the data
        router.push(`/dashboard/generate-report?data=${encodeURIComponent(JSON.stringify(reportData))}`)
    }

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

                                            <p className='bold blue'>
                                                {report.name}
                                            </p>

                                            <div className={styles.tags}>
                                                <p className='text-14 capitalize'>
                                                    {report.product_type || '--'}
                                                </p>

                                                <p className='text-14 capitalize'>
                                                    {report.category_id ? categories[report.category_id] || '--' : '--'}
                                                </p>

                                                <p className='text-14'>
                                                    {report.created_at ? formatDate(report.created_at) : '--'}
                                                </p>
                                            </div>

                                            <div className={styles.charts}>
                                                {report.charts && report.charts.length > 0 ? (
                                                    report.charts.map((chart: any) => (
                                                        // check if chart has valid results
                                                        chart.results && Array.isArray(chart.results) && chart.results.length > 0 ? (
                                                            <div key={chart.id} className={styles.chart}>
                                                                <label htmlFor={chart.id} className={styles.checkbox}>
                                                            
                                                                    <input 
                                                                        type='checkbox' 
                                                                        id={chart.id}
                                                                        onChange={(e) => handleChartSelection(chart, report, e.target.checked)}
                                                                        checked={selectedCharts.some(c => c.id === chart.id)}
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
                                    className={clsx(
                                        'button button--gradient-blue text-16 proceed',
                                        selectedCharts.length === 0 && styles.disabled
                                    )}
                                    onClick={handleProceed}
                                    disabled={selectedCharts.length === 0}
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