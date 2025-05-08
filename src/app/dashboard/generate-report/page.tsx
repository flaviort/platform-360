'use client'

// libraries
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { notFound } from 'next/navigation'

// components
import LazyLoad from '@/components/LazyLoad'

// css
import styles from './index.module.scss'

function GenerateReportContent() {
	const searchParams = useSearchParams()
	
	useEffect(() => {
		const data = searchParams.get('data')

		if (!data) {
			notFound()
			return
		}

		try {
			const parsedData = JSON.parse(decodeURIComponent(data))
			console.log('Report Generation Data:', parsedData)
		} catch (error) {
			console.error('Error parsing report data:', error)
			notFound()
		}
	}, [searchParams])

	return (
		<div className={styles.component}>
			<div className='container'>
				<div className={styles.pages}>

					<div className={styles.page}>
						<h1>
							Generate Report
						</h1>
					</div>

					<div className={styles.page}>
						
					</div>

				</div>
			</div>
		</div>
	)
}

export default function GenerateReport() {
	return (
		<LazyLoad>
			<GenerateReportContent />
		</LazyLoad>
	)
}