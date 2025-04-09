'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// components
import Avatar from '@/components/Avatar'
import MultipleAvatar from '@/components/MultipleAvatar'
import Filters, { ProductFilter } from './filters'
import Portal from '@/components/Utils/Portal'
import usePopoverPosition from '@/components/Utils/Portal/usePopoverPosition'
import Fancybox from '@/components/Utils/Fancybox'
import Loading from '@/components/Loading'
import PopupShop360 from '@/components/NewReportPopup/shop360'
import PopupDemand360 from '@/components/NewReportPopup/demand360'
import PopupInsight360 from '@/components/NewReportPopup/insight360'
import PopupFeedback360 from '@/components/NewReportPopup/feedback360'

// img / svg
import { Ellipsis, ArrowLeft, ArrowRight, Trash2, LoaderCircle, FileChartColumn, Info, ShoppingCart, ChartNoAxesCombined, Search, FilePenLine } from 'lucide-react'
import OtherReports from '@/assets/svg/other/reports.svg'

// css
import styles from './index.module.scss'

// utils
import { slugify, formatDate } from '@/utils/functions'
import { pages } from '@/utils/routes'

export interface ListProps {
    projects: Array<{
        project: string
        projectId: string
        reports: Array<{
            reportName: string
            status: 'empty' | 'green'
            category: string
            createdAt: string
            product: 'Shop360' | 'Demand360' | 'Insight360' | 'Feedback360'
			createdBy: {
				image?: string
				name: string
			}
			access: Array<{
				image?: string
				name: string
			}>
			goal: string
		}>
	}>
    onRefresh?: () => void
}

// Create a separate component for the project header with delete functionality
function ProjectHeader({ 
    projectName, 
    projectId, 
    refreshList 
}: { 
    projectName: string; 
    projectId: string; 
    refreshList: () => void;
}) {
    const [projectOptionsSub, setProjectOptionsSub] = useState(false)
    const projectOptionsSubRef = useRef<HTMLDivElement>(null)
    const projectPopoverRef = useRef<HTMLDivElement>(null)
    
    const projectPopoverStyle = usePopoverPosition(projectOptionsSubRef, projectOptionsSub)
    
    const openProjectOptionsSub = () => {
        setProjectOptionsSub(prev => !prev)
    }
    
    const closeProjectOptionsSub = () => {
        setProjectOptionsSub(false)
    }
    
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && projectOptionsSub) {
                closeProjectOptionsSub()
            }
        }
        
        function handleClickOutside(e: MouseEvent) {
            if (!projectOptionsSub) return
            
            const target = e.target as Node
            
            // if clicked inside toggle / buttons
            if (projectOptionsSubRef.current?.contains(target)) {
                return
            }
            
            // if click inside the popover itself
            if (projectPopoverRef.current?.contains(target)) {
                return
            }
            
            // if clicks inside the fancybox
            const fancyboxContainer = document.getElementById('confirm-delete-project')
            if (fancyboxContainer && fancyboxContainer.contains(target)) {
                return
            }
            
            closeProjectOptionsSub()
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [projectOptionsSub])
    
    return (
        <div className={styles.listGroupTitle}>
            <h2 className='text-16 bold white'>
                {projectName}
            </h2>
            
            <div className={styles.projectActions} ref={projectOptionsSubRef}>
                <button
                    className={clsx(
                        styles.ellipsis,
                        projectOptionsSub && styles.open
                    )}
                    data-balloon-pos='up-right'
                    aria-label='Project Options'
                    onClick={openProjectOptionsSub}
                >
                    <Ellipsis />
                </button>
                
                {projectOptionsSub && (
                    <Portal>
                        <div
                            ref={projectPopoverRef}
                            className={clsx(
                                styles.optionsSub,
                                projectOptionsSub && styles.open
                            )}
                            style={projectPopoverStyle}
                        >
                            <div className={styles.subWrapper}>
                                <Fancybox
                                    options={{
                                        on: {
                                            done: (fancybox: any) => {
                                                const no = fancybox.container.querySelector('.no')
                                                const yes = fancybox.container.querySelector('.yes')
                                                
                                                no?.addEventListener('click', () => (
                                                    // console.log('no'),
                                                    setTimeout(() => {
                                                        closeProjectOptionsSub()    
                                                    }, 300)
                                                ))
                                                
                                                yes?.addEventListener('click', async () => {
                                                    try {
                                                        // Log the project we want to delete
                                                        // console.log('Project to delete:', projectName)
                                                        // console.log('Project ID:', projectId)
                                                        
                                                        // First, fetch all reports for this project
                                                        // console.log('Fetching all reports to find project reports...')
                                                        const reportsResponse = await fetch('/api/proxy?endpoint=/api/reports/me', {
                                                            headers: {
                                                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                                                            }
                                                        })
                                                        
                                                        if (!reportsResponse.ok) {
                                                            throw new Error('Failed to fetch reports')
                                                        }
                                                        
                                                        const allReports = await reportsResponse.json()
                                                        // console.log('All reports fetched, looking for matches...')
                                                        
                                                        // Find all reports that belong to this project
                                                        const projectReports = allReports.filter((report: any) => 
                                                            report.project_id === projectId
                                                        )
                                                        
                                                        // console.log('Found project reports:', projectReports.length)
                                                        
                                                        // Delete all reports in this project
                                                        for (const report of projectReports) {
                                                            // console.log('Deleting report:', report.name, report.id)
                                                            const deleteResponse = await fetch(`/api/delete-report`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                body: JSON.stringify({
                                                                    reportId: report.id
                                                                })
                                                            })
                                                            
                                                            if (!deleteResponse.ok) {
                                                                console.warn(`Warning: Failed to delete report ${report.id}`)
                                                            }
                                                        }
                                                        
                                                        // Now delete the project
                                                        // console.log('Sending delete request for project ID:', projectId)
                                                        const response = await fetch(`/api/delete-project`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                projectId: projectId
                                                            })
                                                        })

                                                        // console.log('Delete project response status:', response.status)

                                                        if (!response.ok) {
                                                            let errorMessage = 'Failed to delete project'
                                                            try {
                                                                const errorData = await response.json()
                                                                console.error('Error details:', errorData)
                                                                errorMessage = `${errorMessage}: ${JSON.stringify(errorData)}`
                                                            } catch (e) {
                                                                const errorText = await response.text()
                                                                console.error('Error text:', errorText)
                                                                errorMessage = `${errorMessage}: ${errorText}`
                                                            }
                                                            throw new Error(errorMessage)
                                                        }

                                                        // Call refreshList instead of reloading the page
                                                        refreshList()
                                                        closeProjectOptionsSub()
                                                    } catch (error) {
                                                        console.error('Error deleting project:', error)
                                                        setTimeout(() => {
                                                            closeProjectOptionsSub()    
                                                        }, 300)
                                                    }
                                                })
                                            }
                                        }
                                    }}
                                >
                                    <a
                                        href='#confirm-delete-project'
                                        data-fancybox
                                        className='text-14 bold red'
                                    >

                                        <Trash2 />

                                        <span>
                                            Delete Project
                                        </span>

                                    </a>

                                    <div className={styles.popup} id='confirm-delete-project'>

                                        <h2 className='text-45 bold'>
                                            Are you sure?
                                        </h2>

                                        <p className='text-16'>
                                            This will delete the project and all its reports. This action cannot be undone.
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

// Create a separate component for project options
function ProjectOptions({ 
    projectName, 
    projectId, 
    refreshList 
}: { 
    projectName: string; 
    projectId: string; 
    refreshList: () => void;
}) {
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
            const fancyboxContainer = document.getElementById('confirm-delete-project')
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
        <div className={styles.projectActions} ref={optionsSubRef}>
            <button
                className={clsx(
                    styles.ellipsis,
                    optionsSub && styles.open
                )}
                data-balloon-pos='up-right'
                aria-label='Project Options'
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
                            <Fancybox
                                options={{
                                    on: {
                                        done: (fancybox: any) => {
                                            const no = fancybox.container.querySelector('.no')
                                            const yes = fancybox.container.querySelector('.yes')
                                            
                                            no?.addEventListener('click', () => (
                                                // console.log('no'),
                                                setTimeout(() => {
                                                    closeOptionsSub()    
                                                }, 300)
                                            ))
                                            
                                            yes?.addEventListener('click', async () => {
                                                try {
                                                    // Log the project we want to delete
                                                    // console.log('Project to delete:', projectName)
                                                    // console.log('Project ID:', projectId)
                                                    
                                                    // First, fetch all reports for this project
                                                    // console.log('Fetching all reports to find project reports...')
                                                    const reportsResponse = await fetch('/api/proxy?endpoint=/api/reports/me', {
                                                        headers: {
                                                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                                                        }
                                                    })
                                                    
                                                    if (!reportsResponse.ok) {
                                                        throw new Error('Failed to fetch reports')
                                                    }
                                                    
                                                    const allReports = await reportsResponse.json()
                                                    // console.log('All reports fetched, looking for matches...')
                                                    
                                                    // Find all reports that belong to this project
                                                    const projectReports = allReports.filter((report: any) => 
                                                        report.project_id === projectId
                                                    )
                                                    
                                                    // console.log('Found project reports:', projectReports.length)
                                                    
                                                    // Delete all reports in this project
                                                    for (const report of projectReports) {
                                                        // console.log('Deleting report:', report.name, report.id)
                                                        const deleteResponse = await fetch(`/api/delete-report`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                reportId: report.id
                                                            })
                                                        })
                                                        
                                                        if (!deleteResponse.ok) {
                                                            console.warn(`Warning: Failed to delete report ${report.id}`)
                                                        }
                                                    }
                                                    
                                                    // Now delete the project
                                                    // console.log('Sending delete request for project ID:', projectId)
                                                    const response = await fetch(`/api/delete-project`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            projectId: projectId
                                                        })
                                                    })
                                                    
                                                    // console.log('Delete project response status:', response.status)
                                                    
                                                    if (!response.ok) {
                                                        let errorMessage = 'Failed to delete project'
                                                        try {
                                                            const errorData = await response.json()
                                                            console.error('Error details:', errorData)
                                                            errorMessage = `${errorMessage}: ${JSON.stringify(errorData)}`
                                                        } catch (e) {
                                                            const errorText = await response.text()
                                                            console.error('Error text:', errorText)
                                                            errorMessage = `${errorMessage}: ${errorText}`
                                                        }
                                                        throw new Error(errorMessage)
                                                    }
                                                    
                                                    // Call refreshList instead of reloading the page
                                                    refreshList()
                                                    closeOptionsSub()
                                                } catch (error) {
                                                    console.error('Error deleting project:', error)
                                                    setTimeout(() => {
                                                        closeOptionsSub()    
                                                    }, 300)
                                                }
                                            })
                                        }
                                    }
                                }}
                            >
                                <a
                                    href='#confirm-delete-project'
                                    data-fancybox
                                    className='text-14 bold red'
                                >
                                    <Trash2 />
                                    <span>
                                        Delete Project
                                    </span>
                                </a>
                                
                                <div className={styles.popup} id='confirm-delete-project'>
                                    <h2 className='text-45 bold'>
                                        Are you sure?
                                    </h2>
                                    
                                    <p className='text-16'>
                                        This will delete the project and all its reports. This action cannot be undone.
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
    )
}

export default function List({
    projects,
    onRefresh
}: ListProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedFilter, setSelectedFilter] = useState<ProductFilter>(null)
    const [filteredProjects, setFilteredProjects] = useState<typeof projects>([])
    const [isLoading, setIsLoading] = useState(true)
    const [resultsPerPage, setResultsPerPage] = useState(10)
    const [searchText, setSearchText] = useState('')

    const router = useRouter()

    useEffect(() => {
        if (projects) {
            initializeProjects()
        }
    }, [projects])
    
    const initializeProjects = () => {
        setIsLoading(true)
        setFilteredProjects(projects)
        setTimeout(() => {
            setIsLoading(false)
        }, 300)
    }

    const refreshList = () => {
        if (onRefresh) {
            setIsLoading(true)
            onRefresh()
        }
    }

    const handleFilterChange = (filter: ProductFilter, search: string) => {
        setSelectedFilter(filter)
        setSearchText(search)
        
        let filtered = [...projects]
        
        if (filter) {
            // Keep projects even if they have no reports matching the filter
            filtered = filtered.map(project => ({
                ...project,
                reports: project.reports.filter(report => report.product === filter)
            }))
        }
        
        if (search) {
            // Keep projects even if they have no reports matching the search
            filtered = filtered.map(project => ({
                ...project,
                reports: project.reports.filter(report => 
                    report.reportName.toLowerCase().includes(search.toLowerCase())
                )
            }))
        }
        
        setFilteredProjects(filtered)
        setCurrentPage(1)
    }

    const groupedProjects = filteredProjects.reduce((acc, item) => {
        const groupKey = item.project
        if (!acc[groupKey]) {
          	acc[groupKey] = {
				reports: [],
				projectId: item.projectId
			}
		}
		acc[groupKey].reports.push(...item.reports)
		return acc
	}, {} as Record<string, { reports: typeof filteredProjects[number]['reports'], projectId: string }>)

	// Sort projects to show those with reports first and empty projects at the end
	const sortedProjectEntries = Object.entries(groupedProjects).sort((a, b) => {
		// If a has reports and b doesn't, a comes first
		if (a[1].reports.length > 0 && b[1].reports.length === 0) return -1
		// If b has reports and a doesn't, b comes first
		if (a[1].reports.length === 0 && b[1].reports.length > 0) return 1
		// Otherwise maintain alphabetical order
		return a[0].localeCompare(b[0])
	})

	// calculate total number of reports across all projects
    const totalReports = sortedProjectEntries.reduce((total, [_, group]) => 
        total + Math.max(1, group.reports.length), 0 // Count at least 1 for empty projects
    )

    // calculate total pages
    const totalPages = Math.ceil(totalReports / resultsPerPage)

    // calculate start and end index for current page
    const startIndex = (currentPage - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage

    // handle pagination
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

    // modify the render logic to handle pagination
    const renderPaginatedProjects = () => {
        let currentCount = 0
        const paginatedContent: JSX.Element[] = []

        for (const [projectName, group] of sortedProjectEntries) {
            const projectReports: JSX.Element[] = []
            
            // Check if project has reports
            if (group.reports.length === 0) {
                // Only show empty project message if it's in the current page range
                if (currentCount >= startIndex && currentCount < endIndex) {
                    projectReports.push(
                        <div key="no-reports" className={styles.noReportsItem}>
                            <p className="text-16 semi-bold gray-500">
                                This project doesn't contain any reports yet.
                            </p>
                        </div>
                    )
                }
                currentCount++; // Count empty projects for pagination
            } else {
                for (const [index, report] of group.reports.entries()) {
                    if (currentCount >= startIndex && currentCount < endIndex) {
                        const itemData = {
                            ...report,
                            project: projectName,
                            projectId: group.projectId
                        }
                        
                        projectReports.push(
                            <ListItem
                                key={index}
                                item={itemData}
                                refreshList={refreshList}
                            />
                        )
                    }
                    currentCount++
                }
            }

            if (projectReports.length > 0) {
                paginatedContent.push(
                    <div key={projectName} className={styles.listGroup}>
                        <div className={styles.listGroupTitle}>
                            <h2 className='text-16 bold white'>
                                {projectName}
                            </h2>
                            
                            <ProjectOptions 
                                projectName={projectName}
                                projectId={group.projectId}
                                refreshList={refreshList}
                            />
                        </div>

                        {projectReports}
                    </div>
                )
            }
        }

        return paginatedContent
    }

	return (
		<div className='pb-small pb-md-smaller'>
			{isLoading ? (
				<Loading />
			) : (
				<>
					{Object.entries(groupedProjects).length === 0 ? (
						<section className={styles.list}>
							<div className='container container--big pt-smallest'>
								<div className={styles.noResults}>

									<div className={styles.image}>
										<OtherReports />
									</div>

									<p className={styles.text}>

										<span className='blue bold text-25'>
											Oopz, looks like you haven't created any reports yet.
										</span>

										<span className='text-16 medium gray-500'>
											To create your first report click on one of the buttons below.
										</span>

									</p>

									<div className={styles.buttons}>
										
										<PopupShop360
											icon={ShoppingCart}
											text='Shop360'
											className={clsx(styles.button, 'button button--gradient-blue white')}
										/>

										<PopupDemand360
											icon={ChartNoAxesCombined}
											text='Demand360'
											className={clsx(styles.button, 'button button--gradient-blue white')}
										/>

										<PopupInsight360
											icon={Search}
											text='Insight360'
											className={clsx(styles.button, 'button button--gradient-blue white')}
										/>

										<PopupFeedback360
											icon={FilePenLine}
											text='Feedback360'
											className={clsx(styles.button, 'button button--gradient-blue white')}
										/>

									</div>

								</div>
							</div>
						</section>
					) : (
						<>

							<Filters  onFilterChange={handleFilterChange}  />

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

										{renderPaginatedProjects()}

									</div>
								</div>
							</section>

							{totalReports > resultsPerPage && (
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
						</>
					)}
				</>
			)}
		</div>
	)
}

export function ListItem({
	item,
	refreshList
}: {
	item: {
		project: string
		projectId: string
		reportName: string
		status: 'empty' | 'green'
		category: string
		createdAt: string
		product: 'Shop360' | 'Demand360' | 'Insight360' | 'Feedback360'
		createdBy: {
			image?: string
			name: string
		}
		access: Array<{
			image?: string
			name: string
		}>
		goal: string
	}, 
	refreshList: () => void 
}) {

	// options
	const [optionsSub, setOptionsSub] = useState(false)
	const optionsSubRef = useRef<HTMLDivElement>(null)
	const popoverRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

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
					href={`${pages.dashboard.my_reports}/${slugify(item.project)}/${slugify(item.reportName)}`}
					className='text-16 bold blue'
				>
					{item.reportName}
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
					aria-label='Generate Report'
				>
					<FileChartColumn />
				</button>
			</div>

			<div className={styles.statusCol}>
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
					{item.product}
				</p>
			</div>

			<div className={styles.createdByCol}>
				
				<Avatar
					image={item.createdBy.image}
					alt={item.createdBy.name}
					letter={item.createdBy.name.charAt(0).toUpperCase()}
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
								<Fancybox
									options={{
										on: {
											done: (fancybox: any) => {

												const no = fancybox.container.querySelector('.no')
												const yes = fancybox.container.querySelector('.yes')

												no?.addEventListener('click', () => (
													// console.log('no'),
													setTimeout(() => {
														closeOptionsSub()	
													}, 300)
												))

												yes?.addEventListener('click', async () => {
													try {
														// Log the report item we want to delete
														// console.log('Report to delete:', item.reportName);
														
														// First, fetch all reports to get their IDs
														// console.log('Fetching all reports to find ID...');
														const reportsResponse = await fetch('/api/proxy?endpoint=/api/reports/me', {
															headers: {
																'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
															}
														});
														
														if (!reportsResponse.ok) {
															throw new Error('Failed to fetch reports');
														}
														
														const allReports = await reportsResponse.json();
														// console.log('All reports fetched, looking for match...');
														
														// Find the report that matches by name
														const matchingReport = allReports.find((report: any) => 
															report.name === item.reportName
														);
														
														if (!matchingReport || !matchingReport.id) {
															console.error('Could not find matching report by name:', item.reportName);
															console.log('Available reports:', allReports);
															throw new Error('Could not find report ID');
														}
														
														const reportId = matchingReport.id;
														// console.log('Found report ID:', reportId);
														
														// Now delete the report
														// console.log('Sending delete request for report ID:', reportId);
														const response = await fetch(`/api/delete-report`, {
															method: 'POST',
															headers: {
																'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
																'Content-Type': 'application/json'
															},
															body: JSON.stringify({
																reportId: reportId
															})
														});

														// console.log('Delete response status:', response.status);

														if (!response.ok) {
															let errorMessage = 'Failed to delete report'
															try {
																const errorData = await response.json();
																console.error('Error details:', errorData);
																errorMessage = `${errorMessage}: ${JSON.stringify(errorData)}`;
															} catch (e) {
																const errorText = await response.text();
																console.error('Error text:', errorText);
																errorMessage = `${errorMessage}: ${errorText}`;
															}
															throw new Error(errorMessage);
														}

														// Call refreshList instead of reloading the page
														refreshList();
														closeOptionsSub();
													} catch (error) {
														console.error('Error deleting report:', error);
														setTimeout(() => {
															closeOptionsSub();	
														}, 300);
													}
												});
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