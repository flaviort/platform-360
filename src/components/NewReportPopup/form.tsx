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
}

export default function PopupForm({
	icon: Icon,
	text,
	children,
	onClose,
	onSuccess,
	onError,
	className
}: PopupFormProps) {
	const [optionsSub, setOptionsSub] = useState(false)
	const optionsSubRef = useRef<HTMLDivElement>(null)
	const popoverRef = useRef<HTMLDivElement>(null)

	const popoverStyle = usePopoverPosition(optionsSubRef, optionsSub)

	const openNewReportPopup = () => {
		setOptionsSub((prev) => !prev)
	}

	const closeNewReportPopup = () => {
		setOptionsSub(false)
		onClose?.()
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && optionsSub) {
				closeNewReportPopup()
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

			closeNewReportPopup()
		}
	  
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [optionsSub])

	useEffect(() => {
		if (optionsSub) {
			document.body.classList.add('no-scroll')
		} else {
			document.body.classList.remove('no-scroll')
		}
	}, [optionsSub])

	return (
		<>
								
			<button
				className={clsx('text-14 bold', className)}
				onClick={openNewReportPopup}
				type='button'
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
							className={styles.component}
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
									onSuccess={onSuccess}
									onError={onError}
									enableConsoleLog
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
										<Submit
											style='gradient-blue'
											text='Create Report'
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