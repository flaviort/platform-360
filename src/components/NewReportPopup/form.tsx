'use client'

// libraries
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'

// components
import Portal from '@/components/Utils/Portal'
import usePopoverPosition from '@/components/Utils/Portal/usePopoverPosition'
import Form from '@/components/Form/Form'
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
}

export default function PopupForm({
	icon: Icon,
	text,
	children,
	onClose
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
				className='text-14 bold'
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
								<Form
									className={styles.form}
									endpoint='/api/dashboard/new-report'
									onSuccess={() => console.log('sucess')}
									onError={() => console.log('error')}
									enableConsoleLog
									//hideErrors
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

								</Form>
							</motion.div>
						</motion.div>
					</Portal>
				)}
			</AnimatePresence>

		</>
	)
}