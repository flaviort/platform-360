'use client'

// libraries
import { useState } from 'react'

// components
import AIChatBox from '@/components/AIChatBox'

// svg
import { Sparkle, ChartColumn } from 'lucide-react'

// css
import styles from './index.module.scss'

export default function TopButtons() {
	const [aiChatOpen, setAIChatOpen] = useState(false)

	const openAIChat = () => {
		setAIChatOpen(true)
	}

	return (
		<div className={styles.topButtons}>
			<button className={styles.button}>
				<ChartColumn />
				<span className='text-14 semi-bold'>Generate Report</span>
			</button>

			<button
				className={styles.buttonAI}
				onClick={openAIChat}
			>
				<Sparkle />
				<span className='text-14 semi-bold'>Generate with AI</span>
			</button>

			<AIChatBox 
				isOpen={aiChatOpen} 
				onClose={() => setAIChatOpen(false)} 
			/>
			
		</div>
	)
}