'use client'

// libraries
import clsx from 'clsx'
import { useState } from 'react'

// components
import AIChatBox from '@/components/AIChatBox'

// svg
import { Sparkle, ChartColumn } from 'lucide-react'

// css
import styles from './index.module.scss'

export default function TopButtons({
	reportId
}: {
	reportId?: string
}) {
	
	const [aiChatOpen, setAIChatOpen] = useState(false)

	const openAIChat = () => {
		if (!reportId) {
			console.error('No report ID available')
			return
		}
		setAIChatOpen(true)
	}

	return (
		<div className={styles.topButtons}>

			<button className={clsx(styles.button, 'button button--gradient-blue')}>
				<ChartColumn />
				<span className='text-14 semi-bold'>Generate Report</span>
			</button>

			<button
				className={styles.buttonAI}
				onClick={openAIChat}
				disabled={!reportId}
			>
				<Sparkle />
				<span className='text-14 semi-bold'>Generate with AI</span>
			</button>

			<AIChatBox 
				isOpen={aiChatOpen} 
				onClose={() => setAIChatOpen(false)}
				reportId={reportId}
			/>
			
		</div>
	)
}