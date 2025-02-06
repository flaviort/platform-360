'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'
import { StaticImageData } from 'next/image'

// components
import Avatar from '@/components/Avatar'
import Filters from './filters'

// img / svg
import { Ellipsis, ArrowLeft, ArrowRight } from 'lucide-react'
import UxSort from '@/assets/svg/ux/sort.svg'

// css
import styles from './index.module.scss'
import MultipleAvatar from '@/components/MultipleAvatar'

export interface ListProps {
    projects: Array<{
        projectGroup?: string | null
        projectName: string
        status: 'empty' | 'green' | 'yellow' | 'red'
        category: string
        date: string
        time: string
        product: 'Shop360' | 'Feedback360' | 'Insight360' | 'Demand360'
        createdBy: {
            image?: string | StaticImageData
            name: string
        }
        access: Array<{
            image?: string | StaticImageData
            name: string
        }>
    }>
}

export default function List({
    projects
}: ListProps) {

	const groupedProjects = projects.reduce((acc, item) => {
		const groupKey = item.projectGroup ?? 'ungrouped'

		if (!acc[groupKey]) {
		  	acc[groupKey] = []
		}

		acc[groupKey].push(item)

		return acc
	}, {} as Record<string, typeof projects>)

	return (
		<>

			<Filters />

			<section className={styles.list}>
				<div className='container container--big pt-smallest'>
					<div className={styles.listWrapper}>

						<div className={styles.listTitle}>

							{[
								{
									text: 'Name'
								},
								{
									text: 'Status'
								},
								{
									text: 'Category'
								},
								{
									text: 'Date Created'
								},
								{
									text: 'Product'
								},
								{
									text: 'Created by'
								},
								{
									text: 'Access'
								}
							].map((item, i) => (
								<div key={i}>
									<button className='gray-400 uppercase text-12'>
										<span className='bold'>{item.text}</span> <UxSort />
									</button>
								</div>
							))}

							{/* empty div to compensate for the 3 dots */}
							<div></div>

						</div>

						{Object.entries(groupedProjects).map(([groupName, projects], groupIndex) => {
							if (groupName === 'ungrouped') {
								return projects.map((item, i) => (
									<ListItem
										key={`ungrouped-${i}`}
										item={item}
									/>
								))
							}

							return (
								<div key={`group-${groupIndex}`} className={styles.listGroup}>

									<div className={styles.listGroupTitle}>
										<h2 className='text-16 bold gray-700'>
											{groupName}
										</h2>
									</div>

									{projects.map((item, i) => (
										<ListItem
											key={i}
											item={item}
										/>
									))}
								</div>
							)
						})}

					</div>
				</div>
			</section>

			<section className={styles.pagination}>
				<div className='container container--big pt-smaller pt-md-smallest pb-smaller pb-lg-smallest'>
					<div className={styles.flex}>

						<div className={styles.left}>

							<p className='text-14 gray-500'>
								Showing <span>1</span>-<span>100</span> out of <span>200</span>
							</p>

						</div>

						<div className={styles.right}>

							<button disabled>
								<ArrowLeft />
							</button>

							<button>
								<ArrowRight />
							</button>

						</div>

					</div>
				</div>
			</section>

		</>
	)
}

interface ListItemProps {
	item: any
}

export function ListItem({
	item
}: ListItemProps) {
	return (
		<div className={styles.listItem}>

			<div className={styles.nameCol}>
				<Link href='#' className='text-16 bold blue'>
					{item.projectName}
				</Link>
			</div>

			<div className={styles.statusCol}>
				<p
					className={clsx(
						styles.status,
						item.status === 'green' && styles.green,
						item.status === 'yellow' && styles.yellow,
						item.status === 'red' && styles.red,
						item.status === 'empty' && styles.empty
					)}
					aria-label={clsx(
						item.status === 'green' && 'Approved',
						item.status === 'yellow' && 'Processing',
						item.status === 'red' && 'Rejected',
						item.status === 'empty' && 'Pending'
					)}
                    data-balloon-pos='up'
				>
					{item.status}
				</p>
			</div>

			<div className={styles.categoryCol}>
				<p className='text-16'>
					{item.category}
				</p>
			</div>

			<div className={styles.dateCol}>
				<p className='text-16'>
					{item.date}<span className={styles.at}> at </span><br />{item.time}
				</p>
			</div>

			<div className={styles.productCol}>
				<p className='text-16'>
					{item.product}
				</p>
			</div>

			<div className={styles.createdByCol}>
				
				<Avatar
					image={item.createdBy.image}
					alt={item.createdBy.name}
				/>

				<p className='text-16'>
					{item.createdBy.name}
				</p>

			</div>

			<div className={styles.accessCol}>
				<MultipleAvatar
					avatars={item.access.map((item: any) => ({
						image: item.image,
						alt: item.name
					}))}
				/>
			</div>
			
			<div className={styles.actionCol}>
				<button
					className={styles.ellipsis}
					data-balloon-pos='up'
					aria-label='Options'
				>
					<Ellipsis />
				</button>
			</div>

		</div>
	)
}