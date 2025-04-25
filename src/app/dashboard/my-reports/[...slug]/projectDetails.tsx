'use client'

// libraries
import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// components
import MultipleAvatar from '@/components/MultipleAvatar'
import DeleteReport from '@/components/DeleteReport'

// img
import demand360 from '@/assets/img/logos-no-margin/demand-360.png'
import feedback360 from '@/assets/img/logos-no-margin/feedback-360.png'
import insight360 from '@/assets/img/logos-no-margin/insight-360.png'
import shop360 from '@/assets/img/logos-no-margin/shop-360.png'

// svg
import { ChevronsRight, ChevronsLeft } from 'lucide-react'

// css
import styles from './index.module.scss'

interface ProjectDetailsProps {
	id: string
	product: 'shop360' | 'demand360' | 'feedback360' | 'insight360'
	members?: Array<{
		image: string
		name: string
	}>
	summary: {
		name: string
		audienceSize?: string
		category: string
		retailers?: string
		brands?: string
		genders?: string
		age?: string
		type?: string
		includeImages?: boolean
		timePeriod?: string
		location?: string
		regions?: string
		priceRange?: string
		questions?: string[]
		uploadedFiles?: string[]
		goal: string
	}
	onToggleCollapse: () => void
	isCollapsed: boolean
}

export default function ProjectDetails({
	id,
	product,
	members,
	summary,
	onToggleCollapse,
	isCollapsed
}: ProjectDetailsProps) {

	const router = useRouter()

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

					<DeleteReport
						id={id}
						onComplete={() => {
							router.push('/dashboard/my-reports')
						}}
						internalDelete
					/>

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

						{members && (
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
						)}

						<div className={styles.item}>

							<p className='uppercase semi-bold gray-400 text-14'>
								Report Summary
							</p>

							<div className={styles.table}>

								{summary?.name && (
									<>
										<p className='text-14 gray-700 bold'>
											Name:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.name}
											</p>
										</div>
									</>
								)}

								{summary?.audienceSize && (
									<>
										<p className='text-14 gray-700 bold'>
											Audience Size:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.audienceSize}
											</p>
										</div>
									</>
								)}

								{summary?.category && (
									<>
										<p className='text-14 gray-700 bold'>
											Category:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.category}
											</p>
										</div>
									</>
								)}

								{summary?.retailers && (
									<>
										<p className='text-14 gray-700 bold'>
											Retailers:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.retailers}
											</p>
										</div>
									</>
								)}

								{summary?.brands && (
									<>
										<p className='text-14 gray-700 bold'>
											Brands:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.brands}
											</p>
										</div>
									</>
								)}

								{summary?.genders && (
									<>
										<p className='text-14 gray-700 bold'>
											Genders:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.genders}
											</p>
										</div>
									</>
								)}

								{summary?.age && (
									<>
										<p className='text-14 gray-700 bold'>
											Age:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.age}
											</p>
										</div>
									</>
								)}

								{summary?.type && (
									<>
										<p className='text-14 gray-700 bold'>
											Type:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.type}
											</p>
										</div>
									</>
								)}

								{(product === 'shop360' && summary?.includeImages !== undefined) && (
									<>
										<p className='text-14 gray-700 bold'>
											Include Images:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.includeImages ? 'Yes' : 'No'}
											</p>
										</div>
									</>
								)}

								{summary?.timePeriod && (
									<>
										<p className='text-14 gray-700 bold'>
											Time Period:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.timePeriod}
											</p>
										</div>
									</>
								)}

								{summary?.location && (
									<>
										<p className='text-14 gray-700 bold'>
											Location:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.location}
											</p>
										</div>
									</>
								)}

								{summary?.regions && (
									<>
										<p className='text-14 gray-700 bold'>
											Regions:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.regions}
											</p>
										</div>
									</>
								)}

								{summary?.priceRange && (
									<>
										<p className='text-14 gray-700 bold'>
											Price Range:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											<p>
												{summary.priceRange}
											</p>
										</div>
									</>
								)}

								{summary?.questions && (
									<>
										<p className='text-14 gray-700 bold'>
											Questions:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											{summary.questions.map((question: string) => (
												<p key={question} className={styles.question}>
													{question}
												</p>
											))}
										</div>
									</>
								)}

								{summary?.uploadedFiles && (
									<>
										<p className='text-14 gray-700 bold'>
											Uploaded Files:
										</p>

										<div className={clsx(styles.content, 'text-14 gray-500')}>
											{summary.uploadedFiles.map((file: string) => (
												<p key={file} className={styles.file}>
													{file}
												</p>
											))}
										</div>
										
									</>
								)}

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