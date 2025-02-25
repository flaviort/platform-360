'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'
import { StaticImageData } from 'next/image'
import { useState, useEffect, useRef } from 'react'

// components
import Avatar from '@/components/Avatar'
import MultipleAvatar from '@/components/MultipleAvatar'
import Filters from './filters'
import Portal from '@/components/Utils/Portal'
import usePopoverPosition from '@/components/Utils/Portal/usePopoverPosition'
import Fancybox from '@/components/Utils/Fancybox'

// img / svg
import { Ellipsis, ArrowLeft, ArrowRight, FilePenLine, Trash2, LoaderCircle, FileChartColumn } from 'lucide-react'
import UxSort from '@/assets/svg/ux/sort.svg'

// css
import styles from './index.module.scss'
import { slugify } from '@/utils/functions'
import { pages } from '@/utils/routes'

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
									text: 'PDF'
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
										<h2 className='text-16 bold white'>
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

	// options
	const [optionsSub, setOptionsSub] = useState(false)
	const optionsSubRef = useRef<HTMLDivElement>(null)
	const popoverRef = useRef<HTMLDivElement>(null)

	const popoverStyle = usePopoverPosition(optionsSubRef, optionsSub)

	const openOptionsSub = () => {
		setOptionsSub((prev) => !prev)
	}

	const closeOptionsSub = () => {
		setOptionsSub(false)
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && optionsSub) {
				closeOptionsSub()
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (!optionsSub) return
	  
			const target = e.target as Node

			// if clicked inside toggle / buttons
			if (optionsSubRef.current?.contains(target)) {
				return
			}
			
			// if click inside the popover itself
			if (popoverRef.current?.contains(target)) {
				return
			}

			// if clicks inside the fancybox
			const fancyboxContainer = document.getElementById('confirm-delete')
			if (fancyboxContainer && fancyboxContainer.contains(target)) {
				return
			}

			closeOptionsSub()
		}
	  
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [optionsSub])

	return (
		<div className={styles.listItem}>

			<div className={styles.nameCol}>
				<Link
					href={pages.dashboard.my_reports + '/' + slugify(item.projectGroup) + '/' + slugify(item.projectName)}
					className='text-16 bold blue'
				>
					{item.projectName}
				</Link>
			</div>

			<div className={styles.pdfCol}>
				<button
					data-balloon-pos='up'
					aria-label='Download PDF Report'
				>
					<FileChartColumn />
				</button>
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
			
			<div className={styles.actionCol} ref={optionsSubRef}>
				
				<button
					className={clsx(
						styles.ellipsis,
						optionsSub && styles.open
					)}
					data-balloon-pos='up-right'
					aria-label='Options'
					onClick={openOptionsSub}
				>
					<Ellipsis />
				</button>

				{optionsSub && (
    				<Portal>
						<div
							ref={popoverRef}
							className={clsx(
								styles.optionsSub,
								optionsSub && styles.open
							)}
							style={popoverStyle}
						>
							<div className={styles.subWrapper}>

								<Link
									href={pages.dashboard.my_reports + '/' + slugify(item.projectGroup) + '/' + slugify(item.projectName)}
									className='text-14 bold'
									onClick={closeOptionsSub}
								>

									<FilePenLine />

									<span>
										Edit
									</span>

								</Link>

								<Fancybox
									options={{
										on: {
											done: (fancybox: any) => {

												const no = fancybox.container.querySelector('.no')
												const yes = fancybox.container.querySelector('.yes')

												no?.addEventListener('click', () => (
													console.log('no'),
													setTimeout(() => {
														closeOptionsSub()	
													}, 300)
												))

												yes?.addEventListener('click', () => (
													console.log('yes'),
													setTimeout(() => {
														closeOptionsSub()	
													}, 300)
												))
											}
										}
									}}
								>
									<a
										href='#confirm-delete'
										data-fancybox
										className='text-14 bold red'
									>

										<Trash2 />

										<span>
											Delete
										</span>

									</a>

									<div className={styles.popup} id='confirm-delete'>

										<h2 className='text-45 bold'>
											Are you sure?
										</h2>

										<p className='text-16'>
											This is a destructive action and cannot be undone.
										</p>

										<div className={styles.buttons}>

											<button
												className='button button--gradient-blue text-16 no'
												data-fancybox-close
											>
												No
											</button>

											<button
												className={clsx(
													styles.confirm,
													'button button--hollow text-16 yes'
												)}
												data-fancybox-close
											>
												
												<span className='button__text'>
													Yes
												</span>

												<span className='button__loading'>
													<span className='rotation' style={{ '--speed': '.5' } as any}>
														<LoaderCircle />
													</span>
												</span>

											</button>

										</div>

									</div>

								</Fancybox>

							</div>
						</div>
					</Portal>
				)}

			</div>

		</div>
	)
}