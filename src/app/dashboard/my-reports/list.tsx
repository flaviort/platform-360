'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// components
import Avatar from '@/components/Avatar'
import MultipleAvatar from '@/components/MultipleAvatar'
import Filters, { ProductFilter } from './filters'
import Loading from '@/components/Loading'
import PopupShop360 from '@/components/NewReportPopup/shop360'
import PopupDemand360 from '@/components/NewReportPopup/demand360'
import PopupInsight360 from '@/components/NewReportPopup/insight360'
import PopupFeedback360 from '@/components/NewReportPopup/feedback360'
import DeleteReport from '@/components/DeleteReport'
import DeleteProject from '@/components/DeleteProject'
import GenerateReport from '@/components/GenerateReport'

// img / svg
import { ArrowLeft, ArrowRight, ChartColumn, Info, ShoppingCart, ChartNoAxesCombined, Search, FilePenLine, Check } from 'lucide-react'
import OtherReports from '@/assets/svg/other/reports.svg'

// css
import styles from './index.module.scss'

// utils
import { formatDate } from '@/utils/functions'
import { pages } from '@/utils/routes'

export interface ListProps {
    projects: Array<{
        project: string
        projectId: string
        reports: Array<{
            reportName: string
            id: string
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

export default function List({
    projects,
    onRefresh
}: ListProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedFilter, setSelectedFilter] = useState<ProductFilter>(null)
    const [filteredProjects, setFilteredProjects] = useState<typeof projects>([])
    const [isLoading, setIsLoading] = useState(true)
    const [resultsPerPage, setResultsPerPage] = useState(50)
    const [searchText, setSearchText] = useState('')
    const [selectedProjectForReport, setSelectedProjectForReport] = useState<string | null>(null)
    const [generateReportOpen, setGenerateReportOpen] = useState<boolean>(false)

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
        }, 1000)
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
        const groupKey = `${item.project}__${item.projectId}`
        
        if (!acc[groupKey]) {
            acc[groupKey] = {
                projectName: item.project,
                reports: [],
                projectId: item.projectId
            }
        }
        acc[groupKey].reports.push(...item.reports)
        return acc
    }, {} as Record<string, { projectName: string, reports: typeof filteredProjects[number]['reports'], projectId: string }>)

    const sortedProjectEntries = Object.entries(groupedProjects).sort((a, b) => {
        if (a[1].reports.length > 0 && b[1].reports.length === 0) return -1
        
        if (a[1].reports.length === 0 && b[1].reports.length > 0) return 1

        return a[1].projectName.localeCompare(b[1].projectName)
    })

    const totalReports = sortedProjectEntries.reduce((total, [_, group]) => 
        total + Math.max(1, group.reports.length), 0
    )

    const totalPages = Math.ceil(totalReports / resultsPerPage)

    const startIndex = (currentPage - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage

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

    const openGenerateReport = (projectId: string) => {
        setSelectedProjectForReport(projectId)
        setGenerateReportOpen(true)
    }

    const closeGenerateReport = () => {
        setGenerateReportOpen(false)
        setSelectedProjectForReport(null)
    }

    const renderPaginatedProjects = () => {
        let currentCount = 0
        const paginatedContent: JSX.Element[] = []

        for (const [projectName, group] of sortedProjectEntries) {
            const projectReports: JSX.Element[] = []
            
            if (group.reports.length === 0) {
                if (currentCount >= startIndex && currentCount < endIndex) {
                    projectReports.push(
                        <div key='no-reports' className={styles.noReportsItem}>
                            <p className='text-16 semi-bold gray-500'>
                                {searchText ? 'No reports found' : "This project doesn't contain any reports yet."}
                            </p>
                        </div>
                    )
                }
                currentCount++;
            } else {
                for (const [index, report] of group.reports.entries()) {
                    if (currentCount >= startIndex && currentCount < endIndex) {
                        const itemData = {
                            ...report,
                            project: group.projectName,
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
                    <div
                        key={projectName}
                        className={styles.listGroup}
                    >
                        <div className={styles.listGroupTitle}>
                            
                            <h2 className='text-16 bold white'>
                                {group.projectName}
                            </h2>

                            <div className={styles.projectActions}>
                                <button
                                    className={styles.button}
                                    onClick={() => openGenerateReport(group.projectId)}
                                >
                                    <ChartColumn />
                                    <span className='text-14 bold uppercase'>Generate Report</span>
                                </button>

                                <DeleteProject
                                    id={group.projectId}
                                    onComplete={refreshList}
                                />
                            </div>
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

                            <GenerateReport
                                projectId={selectedProjectForReport || ''}
                                isOpen={generateReportOpen}
                                onClose={closeGenerateReport}
                            />

                            <section className={styles.list}>
                                <div className='container container--big pt-smallest'>
                                    <div className={styles.listWrapper}>
                                        <div className={styles.listTitle}>
                                            {[
                                                {
                                                    text: 'Name'
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
                                            ].map((item, i) => (
                                                <div key={i}>
                                                    <p className='gray-400 uppercase text-12'>
                                                        <span className='bold'>
                                                            {item.text}
                                                        </span>
                                                    </p>
                                                </div>
                                            ))}

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
        id: string
        status: 'empty' | 'green'
        category: string
        createdAt: string
        product: 'Shop360' | 'Demand360' | 'Insight360' | 'Feedback360'
        goal: string
    }, 
    refreshList: () => void 
}) {
    return (
        <div className={styles.listItem}>

            <div className={styles.nameCol}>
                <Link
                    href={`${pages.dashboard.my_reports}/${item.projectId}/${item.id}`}
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

            <div className={styles.categoryCol}>
                <p className='text-16 capitalize'>
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

            <DeleteReport
                id={item.id}
                onComplete={refreshList}
            />
        </div>
    )
}