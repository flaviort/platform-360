'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'

// components
import Portal from '@/components/Utils/Portal'
import usePopoverPosition from '@/components/Utils/Portal/usePopoverPosition'
import Fancybox from '@/components/Utils/Fancybox'

// img / svg
import { Ellipsis, Trash2, LoaderCircle, ChartColumn } from 'lucide-react'

// css
import styles from './index.module.scss'

interface DeleteProjectProps {
	id: string
    onComplete: () => void
    showMoreOptions?: boolean
    onGenerateReport?: (projectId: string) => void
}

// create a separate component for project options
export default function DeleteProject({ 
    id, 
    onComplete,
    showMoreOptions,
    onGenerateReport
}: DeleteProjectProps) {
    const [optionsSub, setOptionsSub] = useState(false)
    const optionsSubRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)
    
    const popoverStyle = usePopoverPosition(optionsSubRef, optionsSub)
    
    const openOptionsSub = () => {
        setOptionsSub((prev) => !prev)
    }
    
    const closeOptionsSub = () => {
        setOptionsSub(false)
    }
    
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && optionsSub) {
                closeOptionsSub()
            }
        }
        
        function handleClickOutside(e: MouseEvent) {
            if (!optionsSub) return
            
            const target = e.target as Node
            
            // if clicked inside toggle / buttons
            if (optionsSubRef.current?.contains(target)) {
                return
            }
            
            // if click inside the popover itself
            if (popoverRef.current?.contains(target)) {
                return
            }
            
            // if clicks inside the fancybox
            const fancyboxContainer = document.getElementById('confirm-delete-project')
            if (fancyboxContainer && fancyboxContainer.contains(target)) {
                return
            }
            
            closeOptionsSub()
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [optionsSub])
    
    return (
        <div className={styles.component} ref={optionsSubRef}>
            <button
                className={clsx(
                    styles.button,
                    optionsSub && styles.open
                )}
                data-balloon-pos='up-right'
                aria-label='Project Options'
                onClick={openOptionsSub}
            >
                <Ellipsis />
            </button>
            
            {optionsSub && (
                <Portal>
                    <div
                        ref={popoverRef}
                        className={clsx(
                            styles.optionsSub,
                            optionsSub && styles.open
                        )}
                        style={popoverStyle}
                    >
                        <div className={styles.subWrapper}>
                            <Fancybox
                                options={{
                                    on: {
                                        done: (fancybox: any) => {
                                            const no = fancybox.container.querySelector('.no')
                                            const yes = fancybox.container.querySelector('.yes')
                                            
                                            no?.addEventListener('click', () => (
                                                // console.log('no'),
                                                setTimeout(() => {
                                                    closeOptionsSub()    
                                                }, 300)
                                            ))
                                            
                                            yes?.addEventListener('click', async () => {
                                                try {
                                                    // Add data-deleting to body
                                                    document.body.setAttribute('data-deleting', 'true')
                                                    
                                                    // Show loading state on button
                                                    const yesButton = fancybox.container.querySelector('.yes')
                                                    if (yesButton) {
                                                        yesButton.classList.add('loading')
                                                    }
                                                    
                                                    // Log the project we want to delete
                                                    //console.log('Project to delete - ID:', id)
                                                    
                                                    // First, fetch all reports for this project
                                                    //console.log('Fetching all reports to find project reports...')

                                                    const reportsResponse = await fetch('/api/proxy?endpoint=/api/reports/me', {
                                                        headers: {
                                                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                                                        }
                                                    })
                                                    
                                                    if (!reportsResponse.ok) {
                                                        throw new Error('Failed to fetch reports')
                                                    }
                                                    
                                                    const allReports = await reportsResponse.json()
                                                    
                                                    // Find all reports that belong to this project by ID
                                                    const projectReports = allReports.filter((report: any) => 
                                                        report.project_id === id
                                                    )
                                                    
                                                    //console.log('Found project reports:', projectReports.length)
                                                    
                                                    // Process all reports in this project
                                                    // First, gather all charts from all reports
                                                    const getAllChartsPromises = projectReports.map(async (report: any) => {
                                                        //console.log('Processing report ID:', report.id)
                                                        
                                                        try {
                                                            //console.log('Checking for associated charts for report ID:', report.id)
                                                            
                                                            const chartsResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${report.id}`, {
                                                                method: 'GET',
                                                                headers: {
                                                                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                                                                }
                                                            })
                                                            
                                                            if (chartsResponse.ok) {
                                                                const charts = await chartsResponse.json()
                                                                
                                                                if (charts && charts.length > 0) {
                                                                    //console.log(`Found ${charts.length} charts to delete for report ${report.id}`)
                                                                    return { report, charts }
                                                                } else {
                                                                    //console.log(`No charts found for report ${report.id}`)
                                                                    return { report, charts: [] }
                                                                }
                                                            } else if (chartsResponse.status === 404) {
                                                                //console.log('Chart listing endpoint not available for this report - continuing')
                                                                return { report, charts: [] }
                                                            } else {
                                                                console.warn(`Could not fetch charts for report ${report.id}: ${chartsResponse.status} ${chartsResponse.statusText}`)
                                                                return { report, charts: [] }
                                                            }
                                                        } catch (chartError: any) {
                                                            console.warn(`Error handling charts for report ${report.id}:`, chartError.message || chartError)
                                                            return { report, charts: [] }
                                                        }
                                                    })
                                                    
                                                    // Wait for all chart listings to be fetched
                                                    const reportChartsList = await Promise.all(getAllChartsPromises)
                                                    
                                                    // Prepare all chart deletion promises
                                                    const allChartDeletionPromises: Promise<any>[] = []
                                                    
                                                    // Gather all chart deletion promises
                                                    reportChartsList.forEach(({ report, charts }) => {
                                                        if (charts.length > 0) {
                                                            const chartDeletionPromises = charts.map((chart: any) => {
                                                                const chartId = chart.id
                                                                //console.log(`Queueing deletion for chart with ID: ${chartId}`)
                                                                
                                                                return fetch(`/api/proxy?endpoint=/api/charts/${chartId}`, {
                                                                    method: 'DELETE',
                                                                    headers: {
                                                                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                                                                    }
                                                                }).then(response => {
                                                                    if (response.ok) {
                                                                        //console.log(`Successfully deleted chart: ${chartId}`)
                                                                        return { chartId, success: true }
                                                                    } else {
                                                                        console.warn(`Warning: Failed to delete chart ${chartId}`)
                                                                        return { chartId, success: false }
                                                                    }
                                                                })
                                                            })
                                                            
                                                            allChartDeletionPromises.push(...chartDeletionPromises)
                                                        }
                                                    })
                                                    
                                                    // Execute all chart deletions in parallel
                                                    if (allChartDeletionPromises.length > 0) {
                                                        //console.log(`Deleting ${allChartDeletionPromises.length} charts in parallel`)
                                                        const chartResults = await Promise.all(allChartDeletionPromises)
                                                        const successCount = chartResults.filter(r => r.success).length
                                                        //console.log(`Successfully deleted ${successCount} out of ${allChartDeletionPromises.length} charts`)
                                                    } else {
                                                        //console.log('No charts to delete')
                                                    }
                                                    
                                                    // Add a small delay to ensure database consistency after chart deletion
                                                    await new Promise(resolve => setTimeout(resolve, 500))
                                                    
                                                    // Now delete all reports in parallel
                                                    const reportDeletionPromises = projectReports.map((report: any) => {
                                                        const reportId = report.id
                                                        //console.log(`Queueing deletion for report ID: ${reportId}`)
                                                        
                                                        return fetch(`/api/delete-report`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                reportId: reportId
                                                            })
                                                        }).then(async response => {
                                                            if (response.ok) {
                                                                //console.log(`Successfully deleted report: ${reportId}`)
                                                                return { reportId, success: true }
                                                            } else {
                                                                console.warn(`Warning: Failed to delete report ${reportId}`)
                                                                //console.log('Response status:', response.status)
                                                                
                                                                try {
                                                                    const errorData = await response.json()
                                                                    console.error('Error deleting report:', errorData)
                                                                } catch (e) {
                                                                    const errorText = await response.text()
                                                                    console.error('Error text:', errorText)
                                                                }
                                                                
                                                                return { reportId, success: false }
                                                            }
                                                        })
                                                    })
                                                    
                                                    // Execute all report deletions in parallel
                                                    if (reportDeletionPromises.length > 0) {
                                                        //console.log(`Deleting ${reportDeletionPromises.length} reports in parallel`)
                                                        const reportResults = await Promise.all(reportDeletionPromises)
                                                        const successCount = reportResults.filter(r => r.success).length
                                                        //console.log(`Successfully deleted ${successCount} out of ${reportDeletionPromises.length} reports`)
                                                    } else {
                                                        //console.log('No reports to delete')
                                                    }
                                                    
                                                    // Now delete the project
                                                    //console.log('Sending delete request for project ID:', id)

                                                    const response = await fetch(`/api/delete-project`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            projectId: id
                                                        })
                                                    })
                                                    
                                                    //console.log('Delete project response status:', response.status)
                                                    
                                                    if (!response.ok) {
                                                        let errorMessage = 'Failed to delete project'
                                                        try {
                                                            const errorData = await response.json()
                                                            console.error('Error details:', errorData)
                                                            errorMessage = `${errorMessage}: ${JSON.stringify(errorData)}`
                                                            
                                                            // Add an alert to show the error to the user
                                                            alert(`Error deleting project: ${errorData.details || errorData.error || 'Unknown error'}`)
                                                        } catch (e) {
                                                            const errorText = await response.text()
                                                            console.error('Error text:', errorText)
                                                            errorMessage = `${errorMessage}: ${errorText}`
                                                            
                                                            // Add an alert for plain text errors
                                                            alert(`Error deleting project: ${errorText || 'Unknown error'}`)
                                                        }
                                                        throw new Error(errorMessage)
                                                    }
                                                    
                                                    // Call onComplete instead of reloading the page
                                                    onComplete()
                                                    closeOptionsSub()
                                                    
                                                    // Remove data-deleting from body
                                                    document.body.removeAttribute('data-deleting')
                                                } catch (error: any) {
                                                    console.error('Error deleting project:', error)
                                                    
                                                    // Show error message to user
                                                    alert(`Error during deletion: ${error.message || 'Unknown error'}`)
                                                    
                                                    // Remove loading state if present
                                                    const yesButton = fancybox.container.querySelector('.yes')
                                                    if (yesButton) {
                                                        yesButton.classList.remove('loading')
                                                    }

                                                    // Remove data-deleting from body
                                                    document.body.removeAttribute('data-deleting')

                                                    setTimeout(() => {
                                                        closeOptionsSub()    
                                                    }, 300)
                                                }
                                            })
                                        }
                                    }
                                }}
                            >

                                {showMoreOptions && (
                                    <button
                                        className='text-14 bold gray-600'
                                        onClick={() => {
                                            if (onGenerateReport) {
                                                onGenerateReport(id)
                                                closeOptionsSub()
                                            }
                                        }}
                                    >

                                        <ChartColumn />

                                        <span>
                                            Generate Report
                                        </span>

                                    </button>
                                )}

                                <a
                                    href='#confirm-delete-project'
                                    data-fancybox
                                    className='text-14 bold red'
                                >

                                    <Trash2 />

                                    <span>
                                        Delete Project
                                    </span>

                                </a>
                                
                                <div className={styles.popup} id='confirm-delete-project'>

                                    <h2 className='text-45 bold red'>
                                        Are you sure?
                                    </h2>
                                    
                                    <p className='text-16'>
                                        This action will <strong className='red uppercase bold'><u>delete</u></strong> the project and all reports associated with it. This action is irreversible. Are you sure you want to proceed?
                                    </p>
                                    
                                    <div className={styles.buttons}>
                                        <button
                                            className='button button--gradient-blue text-16 no'
                                            data-fancybox-close
                                        >
                                            No
                                        </button>
                                        
                                        <button
                                            className={clsx(
                                                styles.confirm,
                                                'button button--hollow text-16 yes'
                                            )}
                                            data-fancybox-close
                                        >
                                            <span className='button__text'>
                                                Yes
                                            </span>
                                            
                                            <span className='button__loading'>
                                                <span className='rotation' style={{ '--speed': '.5' } as any}>
                                                    <LoaderCircle />
                                                </span>
                                            </span>
                                            
                                        </button>
                                    </div>
                                </div>
                            </Fancybox>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    )
}