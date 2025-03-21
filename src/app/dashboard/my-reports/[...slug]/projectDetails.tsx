'use client'

// libraries
import clsx from 'clsx'
import Image from 'next/image'

// components
import MultipleAvatar from '@/components/MultipleAvatar'

// img
import demand360 from '@/assets/img/logos-no-margin/demand-360.png'
import feedback360 from '@/assets/img/logos-no-margin/feedback-360.png'
import insight360 from '@/assets/img/logos-no-margin/insight-360.png'
import shop360 from '@/assets/img/logos-no-margin/shop-360.png'

// svg
import { Ellipsis, ChevronsRight, ChevronsLeft } from 'lucide-react'

// css
import styles from './index.module.scss'

interface ProjectDetailsProps {
	product: 'shop360' | 'demand360' | 'feedback360' | 'insight360'
	members: Array<{
		image: string
		name: string
	}>
	summary: {
		name: string
		category: string
		retailers: string
		brands: string
		genders: string
		timePeriod: string
		type: string
		goal: string
	}
	onToggleCollapse: () => void
	isCollapsed: boolean
}

export default function ProjectDetails({
	product,
	members,
	summary,
	onToggleCollapse,
	isCollapsed
}: ProjectDetailsProps) {

	return (
		<div className={styles.detailsArea}>
			<div className='relative z2'>

				<div className={styles.actions}>

					<button
						className={clsx(styles.collapse, {
							[styles.active]: isCollapsed
						})}
						type='button'
						onClick={onToggleCollapse}
					>
						{isCollapsed ? <ChevronsLeft /> : <ChevronsRight />}
					</button>

					<button
						className={styles.button}
						type='button'
					>
						<span className='text-14'>Actions</span>
						<Ellipsis />
					</button>

				</div>

				<div className={styles.detailsWrapper}>
					<div className={styles.details}>

						<div className={styles.item}>

							<p className='uppercase semi-bold gray-400 text-14'>
								Product
							</p>

							<div className={styles.logo}>
								<Image
									src={product === 'shop360' ? shop360 : product === 'demand360' ? demand360 : product === 'feedback360' ? feedback360 : insight360}
									alt={product === 'shop360' ? 'Shop360' : product === 'demand360' ? 'Demand360' : product === 'feedback360' ? 'Feedback360' : 'Insight360'}
									width={product === 'shop360' ? 311 : product === 'demand360' ? 363 : product === 'feedback360' ? 417 : 351}
									height={product === 'shop360' ? 57 : product === 'demand360' ? 45 : product === 'feedback360' ? 49 : 57}
								/>
							</div>

						</div>

						<div className={styles.item}>

							<p className='uppercase semi-bold gray-400 text-14'>
								Members
							</p>

							<MultipleAvatar
								showAriaLabel
								avatars={members.map((item: any) => ({
									image: item.image,
									alt: item.name
								}))}
							/>

						</div>

						<div className={styles.item}>

							<p className='uppercase semi-bold gray-400 text-14'>
								Report Summary
							</p>

							<div className={styles.table}>

								<p className='text-14 gray-700 bold'>
									Name:
								</p>

								<div className={clsx(styles.content, 'text-14 gray-500')}>
									<p>
										{summary.name}
									</p>
								</div>

								<p className='text-14 gray-700 bold'>
									Category:
								</p>

								<div className={clsx(styles.content, 'text-14 gray-500')}>
									<p>
										{summary.category}
									</p>
								</div>

								<p className='text-14 gray-700 bold'>
									Retailers:
								</p>

								<div className={clsx(styles.content, 'text-14 gray-500')}>
									<p>
										{summary.retailers}
									</p>
								</div>

								<p className='text-14 gray-700 bold'>
									Brands:
								</p>

								<div className={clsx(styles.content, 'text-14 gray-500')}>
									<p>
										{summary.brands}
									</p>
								</div>

								<p className='text-14 gray-700 bold'>
									Genders:
								</p>

								<div className={clsx(styles.content, 'text-14 gray-500')}>
									<p>
										{summary.genders}
									</p>
								</div>

								<p className='text-14 gray-700 bold'>
									Time Period:
								</p>

								<div className={clsx(styles.content, 'text-14 gray-500')}>
									<p>
										{summary.timePeriod}
									</p>
								</div>

								<p className='text-14 gray-700 bold'>
									Type:
								</p>

								<div className={clsx(styles.content, 'text-14 gray-500')}>
									<p>
										{summary.type}
									</p>
								</div>

							</div>

							<div className={styles.goal}>

								<p className='text-14 gray-700 bold'>
									Goal:
								</p>

								<p className='text-14 gray-500'>
									{summary.goal}
								</p>
								
							</div>

						</div>

					</div>
				</div>

			</div>
		</div>
	)
}