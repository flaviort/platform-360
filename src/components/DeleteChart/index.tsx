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

interface DeleteChartProps {
	id: string
}

export default function DeleteChart({
    id
}: DeleteChartProps) {

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
			const fancyboxContainer = document.getElementById('confirm-delete-chart')
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
                    styles.ellipsis
                )}
                data-balloon-pos='up-right'
                aria-label='Chart Options'
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
                                                    
                                                    console.log('Deleting chart with ID:', id)
                                                    
                                                    // Delete the specific chart by ID
                                                    const response = await fetch(`/api/proxy?endpoint=/api/charts/${id}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                                                        }
                                                    })

                                                    console.log('Delete chart response status:', response.status)

                                                    if (!response.ok) {
                                                        let errorMessage = 'Failed to delete chart'
                                                        try {
                                                            const errorData = await response.json()
                                                            console.error('Error details:', errorData)
                                                            errorMessage = `${errorMessage}: ${JSON.stringify(errorData)}`
                                                            
                                                            alert(`Error deleting chart: ${errorData.details || errorData.error || 'Unknown error'}`)
                                                        } catch (e) {
                                                            const errorText = await response.text()
                                                            console.error('Error text:', errorText)
                                                            errorMessage = `${errorMessage}: ${errorText}`
                                                            
                                                            alert(`Error deleting chart: ${errorText || 'Unknown error'}`)
                                                        }
                                                        throw new Error(errorMessage)
                                                    }

                                                    // close the options sub
                                                    closeOptionsSub()
                                                    
                                                    // remove data-deleting from body
                                                    document.body.removeAttribute('data-deleting')

                                                    // refresh the page
                                                    setTimeout(() => {
                                                        window.location.reload()
                                                    }, 1000)

                                                } catch (error: any) {
                                                    console.error('Error deleting chart:', error)
                                                    
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
                                    href='#confirm-delete-chart'
                                    data-fancybox
                                    className='text-14 bold red'
                                >
                                    <Trash2 />
                                    <span>
                                        Delete
                                    </span>
                                </a>

                                <div className={styles.popup} id='confirm-delete-chart'>

                                    <h2 className='text-45 bold red'>
                                        Are you sure?
                                    </h2>

                                    <p className='text-16'>
                                        This action will <strong className='red uppercase bold'><u>delete</u></strong> the selected chart. This action is irreversible. Are you sure you want to proceed?
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