'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'

// components
import Portal from '@/components/Utils/Portal'
import usePopoverPosition from '@/components/Utils/Portal/usePopoverPosition'
import FormReport from '@/components/Form/FormReport'
import Submit from '@/components/Form/Submit'

// svg
import { X, ChevronRight } from 'lucide-react'

// css
import styles from './index.module.scss'

interface PopupFormProps {
	icon: React.ComponentType<any>
	text: string
	children: React.ReactNode
	onClose?: () => void
	onSuccess?: (data: any) => void
	onError?: (error: any) => void
	className?: string
	loadingMessages: string | string[]
	disabled?: boolean
}

export default function PopupForm({
	icon: Icon,
	text,
	children,
	onClose,
	onSuccess,
	onError,
	className,
	loadingMessages = 'Processing...',
	disabled
}: PopupFormProps) {
	const [optionsSub, setOptionsSub] = useState(false)
	const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
	const [isMessageVisible, setIsMessageVisible] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const optionsSubRef = useRef<HTMLDivElement>(null)
	const popoverRef = useRef<HTMLDivElement>(null)
	const messageArray = Array.isArray(loadingMessages) ? loadingMessages : [loadingMessages]

	const popoverStyle = usePopoverPosition(optionsSubRef, optionsSub)

	// rotating through multiple loading messages when form is submitting
	useEffect(() => {
		if (!isSubmitting || !Array.isArray(loadingMessages) || loadingMessages.length <= 1) return

		const fadeOutTimeout = setTimeout(() => {
			setIsMessageVisible(false)
		}, 3700)

		const changeMessageTimeout = setTimeout(() => {
			setCurrentMessageIndex(prevIndex => 
				prevIndex === messageArray.length - 1 ? 0 : prevIndex + 1
			)
			setIsMessageVisible(true)
		}, 4000)

		return () => {
			clearTimeout(fadeOutTimeout)
			clearTimeout(changeMessageTimeout)
		}
	}, [currentMessageIndex, loadingMessages, isSubmitting])

	// listen for form submission events
	useEffect(() => {
		const handleFormSubmitStart = () => {
			setIsSubmitting(true)
			setCurrentMessageIndex(0)
			setIsMessageVisible(true)
		}

		const handleFormSubmitEnd = () => {
			setIsSubmitting(false)
		}

		document.addEventListener('formSending', handleFormSubmitStart)
		document.addEventListener('formSent', handleFormSubmitEnd)
		document.addEventListener('formError', handleFormSubmitEnd)

		return () => {
			document.removeEventListener('formSending', handleFormSubmitStart)
			document.removeEventListener('formSent', handleFormSubmitEnd)
			document.removeEventListener('formError', handleFormSubmitEnd)
		}
	}, [])

	const openNewReportPopup = () => {
		setOptionsSub((prev) => !prev)
	}

	const closeNewReportPopup = () => {
		setOptionsSub(false)
		onClose?.()
	}

	useEffect(() => {
		if (optionsSub) {
			document.body.classList.add('no-scroll')
		} else {
			document.body.classList.remove('no-scroll')
		}
	}, [optionsSub])

	// wrapped success handler to reset state
	const wrappedOnSuccess = (data: any) => {
		onSuccess?.(data)
	}

	// wrapped error handler to reset state
	const wrappedOnError = (error: any) => {
		onError?.(error)
	}

	return (
		<>
								
			<button
				className={clsx('text-14 bold', className)}
				onClick={openNewReportPopup}
				type='button'
				disabled={disabled}
			>

				<Icon />

				<span>
					{text}
				</span>

			</button>

			<AnimatePresence>
				{optionsSub && (
					<Portal>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: .3,
								ease: 'easeInOut' 
							}}
							ref={popoverRef}
							className={clsx(
								styles.component,
								isSubmitting && styles.submitting
							)}
						>

							<div
								className={styles.bg}
								onClick={closeNewReportPopup}
							/>

							<motion.div
								initial={{ transform: 'translateX(100%)' }}
								animate={{ transform: 'none' }}
								exit={{ transform: 'translateX(100%)' }}
								transition={{
									duration: .3,
									ease: 'easeInOut' 
								}}
								className={styles.wrapper}
								style={popoverStyle}
							>
								<FormReport
									className={styles.form}
									onSuccess={wrappedOnSuccess}
									onError={wrappedOnError}
									//enableConsoleLog
								>

									<div className={styles.top}>

										<div className={styles.left}>

											<p className='text-25 bold'>
												New Report
											</p>

											<ChevronRight />

											<p className='text-25 bold purple'>
												{text}
											</p>
											
										</div>

										<button
											className={styles.close}
											onClick={closeNewReportPopup}
											type='button'
										>
											<X />
										</button>

									</div>

									<div className={styles.middle}>
										{children}
									</div>

									<div className={styles.bottom}>

										{isSubmitting ? (
											<div 
												className={clsx(
													styles.loadingMessages, 
													'text-16 purple',
													isMessageVisible ? styles.fadeIn : styles.fadeOut
												)}
											>
												{messageArray[currentMessageIndex]}
											</div>
										) : (
											<div className={styles.loadingMessages}></div>
										)}

										<Submit
											style='gradient-blue'
											text='Run Analysis'
											className={styles.submit}
										/>

									</div>
								</FormReport>
							</motion.div>
						</motion.div>
					</Portal>
				)}
			</AnimatePresence>

		</>
	)
}