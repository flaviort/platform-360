'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'

// components
import Portal from '@/components/Utils/Portal'
import usePopoverPosition from '@/components/Utils/Portal/usePopoverPosition'
import Fancybox from '@/components/Utils/Fancybox'

// img / svg
import { Ellipsis, Trash2, LoaderCircle } from 'lucide-react'

// css
import styles from './index.module.scss'

interface DeleteReportProps {
    internalDelete?: boolean
	id: string
    onComplete: () => void
}

export default function DeleteReport({
    internalDelete,
    id,
    onComplete
}: DeleteReportProps) {

    // options
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
			const fancyboxContainer = document.getElementById('confirm-delete')
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
                    optionsSub && styles.open,
                    internalDelete ? styles.internalDelete : styles.ellipsis
                )}
                data-balloon-pos='up-right'
                aria-label='Options'
                onClick={openOptionsSub}
            >
                {internalDelete ? (
                    <>
                        <span className='text-14'>Actions</span>
                        <Ellipsis />
                    </>
                ) : (
                    <Ellipsis />
                )}
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
                                                    
                                                    // Show loading state
                                                    const yesButton = fancybox.container.querySelector('.yes')
                                                    if (yesButton) {
                                                        yesButton.classList.add('loading')
                                                    }
                                                    
                                                    // Log the report we want to delete by ID
                                                    console.log('Attempting to delete report with ID:', id)
                                                    
                                                    // Try to delete associated charts, but continue even if API isn't available
                                                    try {
                                                        console.log('Checking for associated charts...')
                                                        // Attempt to get charts using the proxy endpoint
                                                        const chartsResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${id}`, {
                                                            method: 'GET',
                                                            headers: {
                                                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                                                            }
                                                        })
                                                        
                                                        // Only process if endpoint exists and returns charts
                                                        if (chartsResponse.ok) {
                                                            const charts = await chartsResponse.json()
                                                            
                                                            if (charts && charts.length > 0) {
                                                                console.log(`Found ${charts.length} charts to delete for report ${id}`)
                                                                
                                                                // Delete each chart individually
                                                                for (const chart of charts) {
                                                                    const chartId = chart.id
                                                                    console.log(`Deleting chart with ID: ${chartId}`)
                                                                    
                                                                    const deleteChartResponse = await fetch(`/api/proxy?endpoint=/api/charts/${chartId}`, {
                                                                        method: 'DELETE',
                                                                        headers: {
                                                                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                                                                        }
                                                                    })
                                                                    
                                                                    if (deleteChartResponse.ok) {
                                                                        console.log(`Successfully deleted chart: ${chartId}`)
                                                                    } else {
                                                                        console.warn(`Warning: Failed to delete chart ${chartId}`)
                                                                    }
                                                                }
                                                                
                                                                // Add a small delay to ensure database consistency
                                                                await new Promise(resolve => setTimeout(resolve, 500))
                                                            } else {
                                                                console.log('No charts found for this report')
                                                            }
                                                        } else if (chartsResponse.status === 404) {
                                                            // 404 is expected if endpoint isn't implemented yet
                                                            console.log('Chart listing endpoint not available - skipping chart deletion')
                                                        }
                                                    } catch (error) {
                                                        // Silently continue - chart deletion is optional
                                                        console.log('Could not process charts, continuing with report deletion')
                                                    }
                                                    
                                                    // Delete the report
                                                    const response = await fetch(`/api/delete-report`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            reportId: id
                                                        })
                                                    })

                                                    console.log('Delete response status:', response.status)

                                                    if (!response.ok) {
                                                        let errorMessage = 'Failed to delete report'
                                                        try {
                                                            const errorData = await response.json()
                                                            console.error('Error details:', errorData)
                                                            errorMessage = `${errorMessage}: ${JSON.stringify(errorData)}`
                                                            
                                                            // Add an alert to show the error to the user
                                                            alert(`Error deleting report: ${errorData.details || errorData.error || 'Unknown error'}`)
                                                        } catch (e) {
                                                            const errorText = await response.text()
                                                            console.error('Error text:', errorText)
                                                            errorMessage = `${errorMessage}: ${errorText}`
                                                            
                                                            // Add an alert for plain text errors
                                                            alert(`Error deleting report: ${errorText || 'Unknown error'}`)
                                                        }
                                                        throw new Error(errorMessage)
                                                    }

                                                    // Call onComplete instead of reloading the page
                                                    onComplete()
                                                    closeOptionsSub()
                                                    
                                                    // Remove data-deleting from body
                                                    document.body.removeAttribute('data-deleting')
                                                } catch (error: any) {
                                                    console.error('Error deleting report:', error)
                                                    
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
                                <a
                                    href='#confirm-delete'
                                    data-fancybox
                                    className='text-14 bold red'
                                >

                                    <Trash2 />

                                    <span>
                                        Delete
                                    </span>

                                </a>

                                <div className={styles.popup} id='confirm-delete'>

                                    <h2 className='text-45 bold red'>
                                        Are you sure?
                                    </h2>

                                    <p className='text-16'>
                                        This action will <strong className='red uppercase bold'><u>delete</u></strong> the report and all associated data. This action is irreversible. Are you sure you want to proceed?
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