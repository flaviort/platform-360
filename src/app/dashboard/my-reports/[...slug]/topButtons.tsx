'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'

// components
import Portal from '@/components/Utils/Portal'

// svg
import { Sparkle, ChartColumn, X, SendHorizontal } from 'lucide-react'

// css
import styles from './index.module.scss'

export default function TopButtons() {

	const [aiChat, setAIChat] = useState(false)

	const openAIChat = () => {
		setAIChat((prev) => !prev)
	}

	const closeAIChat = () => {
		setAIChat(false)
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && aiChat) {
				closeAIChat()
			}
		}
	  
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [aiChat])

	useEffect(() => {
        if (aiChat) {
            document.body.classList.add('no-scroll')
        } else {
            document.body.classList.remove('no-scroll')
        }
    }, [aiChat])

	return (
		<div className={styles.topButtons}>

			<button className={styles.button}>
				<ChartColumn />
				<span className='text-14 semi-bold'>Add Charts</span>
			</button>

			<button
				className={styles.buttonAI}
				onClick={openAIChat}
			>
				<Sparkle />
				<span className='text-14 semi-bold'>Generate with AI</span>
			</button>

			<AnimatePresence>
				{aiChat && (
					<Portal>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: .3,
								ease: 'easeInOut' 
							}}
							className={styles.aiChat}
						>
							<div
								className={styles.bg}
								onClick={closeAIChat}
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
							>

								<div className={styles.topWrapper}>

									<div className={styles.top}>

										<button
											className={styles.close}
											onClick={closeAIChat}
											type='button'
										>
											<X />
										</button>

									</div>

									<div className={styles.middle}>
										<p>
											Hello AI
										</p>
									</div>

								</div>

								<div className={styles.bottom}>
									<div className={styles.inputWrapper}>

										<input
											type='text'
											placeholder='Type here...'
											className={clsx(styles.input, 'text-16')}
										/>

										<button className={styles.send}>
											<SendHorizontal />
										</button>

									</div>
								</div>

							</motion.div>

						</motion.div>
					</Portal>
				)}
			</AnimatePresence>

		</div>
	)
}