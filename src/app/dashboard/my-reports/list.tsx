'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// components
import Avatar from '@/components/Avatar'
import MultipleAvatar from '@/components/MultipleAvatar'
import Filters, { ProductFilter } from './filters'
import Portal from '@/components/Utils/Portal'
import usePopoverPosition from '@/components/Utils/Portal/usePopoverPosition'
import Fancybox from '@/components/Utils/Fancybox'

// img / svg
import { Ellipsis, ArrowLeft, ArrowRight, FilePenLine, Trash2, LoaderCircle, FileChartColumn, Info } from 'lucide-react'
import UxSort from '@/assets/svg/ux/sort.svg'

// css
import styles from './index.module.scss'

// utils
import { slugify, formatDate } from '@/utils/functions'
import { pages } from '@/utils/routes'

export interface ListProps {
    projects: Array<{
        id: string
        name: string
        reports: Array<{
            id: string
            name: string
            category: string
            reportType: 'Shop360' | 'Feedback360' | 'Insight360' | 'Demand360'
            createdAt: string
            goal: string
        }>
    }>
}

export default function List({
    projects
}: ListProps) {
    const [filteredProjects, setFilteredProjects] = useState<ListProps['projects']>(projects)
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 100

    const handleFilterChange = (filter: ProductFilter, search: string) => {
        setIsLoading(true)
        if (!filter && !search) {
            setFilteredProjects(projects)
            setIsLoading(false)
            return
        }

        let filtered = [...projects]

        if (filter) {
            // Filter projects that have at least one report matching the filter type
            filtered = filtered.filter(project => 
                project.reports.some(report => report.reportType === filter)
            )
            
            // For each project, only keep the reports that match the filter type
            filtered = filtered.map(project => ({
                ...project,
                reports: project.reports.filter(report => report.reportType === filter)
            }))
        }

        if (search) {
            filtered = filtered.filter(project => 
                project.name.toLowerCase().includes(search.toLowerCase()) ||
                project.reports.some(report => 
                    report.name.toLowerCase().includes(search.toLowerCase())
                )
            )
        }

        setFilteredProjects(filtered)
        setIsLoading(false)
    }

    useEffect(() => {
        const initializeProjects = async () => {
            setIsLoading(true)
            await new Promise(resolve => setTimeout(resolve, 100))
            setFilteredProjects(projects)
            setIsLoading(false)
        }

        initializeProjects()
    }, [projects])

	const groupedProjects = filteredProjects.reduce((acc, project) => {
		if (!acc[project.name]) {
			acc[project.name] = project.reports
		}
		return acc
	}, {} as Record<string, typeof filteredProjects[0]['reports']>)

    // Calculate total number of reports across all projects
    const totalReports = Object.values(groupedProjects).reduce((total, reports) => 
        total + reports.length, 0
    )

    // Calculate total pages
    const totalPages = Math.ceil(totalReports / itemsPerPage)

    // Calculate start and end index for current page
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // Function to handle pagination
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
        }
    }

    // Modify the render logic to handle pagination
    const renderPaginatedProjects = () => {
        let currentCount = 0
        const paginatedContent: JSX.Element[] = []

        for (const [projectName, reports] of Object.entries(groupedProjects)) {
            const projectReports: JSX.Element[] = []

            for (const report of reports) {
                if (currentCount >= startIndex && currentCount < endIndex) {
                    projectReports.push(
                        <ListItem
                            key={report.id}
                            item={{
                                ...report,
                                project: projectName
                            }}
                        />
                    )
                }
                currentCount++
            }

            if (projectReports.length > 0) {
                paginatedContent.push(
                    <div key={projectName} className={styles.listGroup}>
                        <div className={styles.listGroupTitle}>
                            <h2 className='text-16 bold white'>
                                {projectName}
                            </h2>
                        </div>
                        {projectReports}
                    </div>
                )
            }
        }

        return paginatedContent
    }

	return (
		<div className='pb-smaller pb-lg-smallest'>

			<Filters onFilterChange={handleFilterChange} />

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
									<p className='gray-400 uppercase text-12'>
										
										<span className='bold'>
											{item.text}
										</span>

										{/*<UxSort />*/}

									</p>
								</div>
							))}

							{/* empty div to compensate for the 3 dots */}
							<div></div>

						</div>

						{isLoading ? (
							<div className={styles.loading}>
								
								<span className='rotation purple' style={{ '--speed': '.5' } as any}>
									<LoaderCircle />
								</span>

								<p className='text-16 semi-bold gray-500'>
									Loading...
								</p>

							</div>
						) : Object.entries(groupedProjects).length === 0 ? (
							<div className={styles.noResults}>
								<p className='text-16 semi-bold gray-500'>
									No results found
								</p>
							</div>
						) : renderPaginatedProjects()}

					</div>
				</div>
			</section>

			{totalReports > itemsPerPage && (
				<section className={styles.pagination}>
					<div className='container container--big pt-smaller pt-md-smallest'>
						<div className={styles.flex}>

							<div className={styles.left}>

								<p className='text-14 gray-500'>
									Showing <span>{startIndex + 1}</span>-<span>{Math.min(endIndex, totalReports)}</span> out of <span>{totalReports}</span>
								</p>

							</div>

							<div className={styles.right}>

								<button 
									disabled={currentPage === 1}
									onClick={handlePrevPage}
								>
									<ArrowLeft />
								</button>

								<button 
									disabled={currentPage === totalPages}
									onClick={handleNextPage}
								>
									<ArrowRight />
								</button>

							</div>

						</div>
					</div>
				</section>
			)}

		</div>
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
					href={pages.dashboard.my_reports + '/' + slugify(item.project) + '/' + slugify(item.reportName)}
					className='text-16 bold blue'
				>
					{item.name}
				</Link>

				{item.goal && (
					<button
						className='blue'
						data-balloon-pos='up-left'
						data-balloon-length='xlarge'
						aria-label={item.goal}
					>
						<Info />
					</button>
				)}

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
				{/*
				<p
					className={clsx(
						styles.status,
						item.status === 'green' && styles.green,
						item.status === 'empty' && styles.empty
					)}
					aria-label={clsx(
						item.status === 'green' && 'Proccessed',
						item.status === 'empty' && 'Inactive'
					)}
                    data-balloon-pos='up'
				>
					{item.status}
				</p>
				*/}
				<p
					className={clsx(
						styles.status,
						styles.green
					)}
					aria-label='Proccessed'
                    data-balloon-pos='up'
				>
					green
				</p>
			</div>

			<div className={styles.categoryCol}>
				<p className='text-16'>
					{item.category}
				</p>
			</div>

			<div className={styles.dateCol}>
				<p className='text-16'>
					{formatDate(item.createdAt)}
				</p>
			</div>

			<div className={styles.productCol}>
				<p className='text-16'>
					{item.reportType}
				</p>
			</div>

			<div className={styles.createdByCol}>
				
				{/*
				<Avatar
					image={item.createdBy.image}
					alt={item.createdBy.name}
				/>

				<p className='text-16'>
					{item.createdBy.name}
				</p>
				*/}

				<Avatar
					image='/img/photos/avatar-01.jpg'
					alt='Flavio R.T.'
				/>

				<p className='text-16'>
					Flavio R.T.
				</p>

			</div>

			<div className={styles.accessCol}>
				{/*
				<MultipleAvatar
					avatars={item.access.map((item: any) => ({
						image: item.image,
						alt: item.name
					}))}
				/>
				*/}
				<MultipleAvatar
					avatars={[
						{
							image: "/img/photos/avatar-01.jpg",
							alt: 'Jack Erwin'
						},
						{
							image: "/img/photos/avatar-02.jpg",
							alt: 'Sandra Doe'
						},
						{
							image: "/img/photos/avatar-03.jpg",
							alt: 'Peter Pan'
						},
						{
							image: "/img/photos/avatar-01.jpg",
							alt: 'Flavio Roberto'
						}
					]}
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
									href={pages.dashboard.my_reports + '/' + slugify(item.project) + '/' + slugify(item.reportName)}
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