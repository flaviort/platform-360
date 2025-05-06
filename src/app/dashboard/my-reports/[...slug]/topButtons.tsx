'use client'

// libraries
import clsx from 'clsx'
import { useState } from 'react'

// components
import AIChatBox from '@/components/AIChatBox'
import GenerateReport from '@/components/GenerateReport'

// svg
import { Sparkle, ChartColumn } from 'lucide-react'

// css
import styles from './index.module.scss'

export default function TopButtons({
	projectId,
	reportId,
	howManyCharts
}: {
	projectId?: string,
	reportId?: string,
	howManyCharts: number
}) {
	
	const [aiChatOpen, setAIChatOpen] = useState(false)

	const openAIChat = () => {
		if (!reportId) {
			console.error('No report ID available')
			return
		}
		setAIChatOpen(true)
	}

	const [generateReportOpen, setGenerateReportOpen] = useState<boolean>(false)

	const openGenerateReport = () => {
		setGenerateReportOpen(true)
	}

	const closeGenerateReport = () => {
		setGenerateReportOpen(false)
	}

	return (
		<div className={styles.topButtons}>

			{howManyCharts != 0 && (
				<>
					<button
						className={clsx(styles.button, 'button button--gradient-blue')}
						onClick={openGenerateReport}
					>
						<ChartColumn />
						<span className='text-14 semi-bold'>Generate Report</span>
					</button>

					<GenerateReport
						projectId={projectId}
						isOpen={generateReportOpen}
						onClose={closeGenerateReport}
					/>

				</>
			)}

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