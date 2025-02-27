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
	const [response, setResponse] = useState<any>(null)
	const [isLoading, setIsLoading] = useState(false)

	const testApiCall = async () => {
		try {
			setIsLoading(true)
			const query = "What are the three maximum prices for athletic shoes on Kohl in 2023?"
			const response = await fetch(
				`https://dcx3uf4aq3.us-east-1.awsapprunner.com/v2/products/continue_user_chat?user_id=1234&user_input=${encodeURIComponent(query)}`,
				{
					headers: {
						'Content-Type': 'application/json',
					}
				}
			)

			const rawData = await response.text()
			console.log('Raw data:', rawData)
			
			const data = eval(`(${rawData})`)
			console.log('Evaluated data:', data)
			
			const formattedResponse = {
				message: String(data.message || data['message']),
				data: Array.isArray(data.data || data['data']) ? (data.data || data['data']) : []
			}
			console.log('Setting response to:', formattedResponse)
			
			setResponse({...formattedResponse})
		} catch (error) {
			console.error('Error fetching data:', error)
			setResponse({ message: "Error processing response", data: [] })
		} finally {
			setIsLoading(false)
		}
	}

	const openAIChat = () => {
		testApiCall() // Test the API call when opening the chat
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
										{isLoading ? (
											<div className={styles.loading}>
												<p>Loading...</p>
											</div>
										) : response ? (
											<div className={styles.response} style={{ padding: '20px' }}>
												<div className={styles.message} style={{ marginBottom: '16px', color: '#333' }}>
													{response.message}
												</div>
												{response.data && (
													<div className={styles.data} style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
														<pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
															{JSON.stringify(response.data, null, 2)}
														</pre>
													</div>
												)}
											</div>
										) : (
											<div style={{ padding: '20px', color: '#666' }}>
												No response yet
											</div>
										)}
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