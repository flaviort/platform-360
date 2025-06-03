'use client'

// libraries
import { useState, useEffect } from 'react'

// components
import Dropdown from '@/components/Form/Dropdown'
import Loading from '@/components/Loading'

// css
import styles from '../index.module.scss'

interface Retailer {
	slug: string
	name: string
}

export default function Retailers() {
	const [retailers, setRetailers] = useState<Retailer[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchRetailers = async () => {
			try {
				const response = await fetch('/api/proxy?endpoint=/api/retailers')
				const data = await response.json()
				setRetailers(data)
				//console.log(data)
			} catch (error) {
				console.error('Error fetching retailers:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchRetailers()
	}, [])

	return (
		<div className={styles.group}>

			<div className={styles.label}>
				<p className='text-16 semi-bold'>
					Retailers <span className='red'>*</span>
				</p>
			</div>

			<div className={styles.input}>
				{isLoading ? (
					<Loading className={styles.loading} />
				) : (
					<Dropdown
						defaultValue='Select up to 5...'
						limitSelected={5}
						items={retailers.map((retailer) => ({
							name: retailer.slug,
							label: retailer.name
						}))}
						searchable
						required
						alphabetical
						name='retailers'
						id='report-retailers'
					/>
				)}
			</div>
			
		</div>
	)
} 