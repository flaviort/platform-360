'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'

// components
import Loading from '@/components/Loading'
import TitlePart from '@/components/TitlePart'
import ChartBox from '@/components/ChartBox'
import ProjectDetails from './projectDetails'
import TopButtons from './topButtons'

// temp
import ProsAndCons from '@/components/Reports/NonCharts/ProsAndCons'

// css
import styles from './index.module.scss'

// utils
import { formatChartData } from '@/utils/chartUtils'

interface Report {
	id: string
	name: string
	product_type: string
	category_id: string
	status: boolean
	goal: string
	created_by_id: string
	project_id: string
	created_at: string
	product_settings?: {
		category: string[], // this represents the sub-category
		retailers?: string[]
		brands?: string[]
		genders?: string[]
		type_store?: string[]
		include_images?: boolean
		start_date: string
		end_date: string
		audience_size?: number
		age?: number
		location?: string
		regions?: string[]
		min_price?: number
		max_price?: number
		questions?: string[]
	}
}

interface Project {
	id: string
	name: string
	project_goal: string
	created_at: string
}

interface Category {
	id: string
	name: string
}

export default function DashboardMyReports() {
	const params = useParams()
	const router = useRouter()
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isHidden, setIsHidden] = useState(false)
	const [project, setProject] = useState<Project | null>(null)
	const [report, setReport] = useState<Report | null>(null)
	const [category, setCategory] = useState<Category | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [reports, setReports] = useState<Report[]>([])
	const [charts, setCharts] = useState<any[]>([])
	const [reportDetails, setReportDetails] = useState({
		subCategory: '',
		retailers: '',
		audienceSize: '',
		brands: '',
		genders: '',
		timePeriod: '',
		type: '',
		age: '',
		includeImages: '',
		location: '',
		regions: '',
		priceRange: '',
		questions: '',
		uploadedFiles: ''
	})

	// parse the slug to get projectId and reportId
	const slug = Array.isArray(params.slug) ? params.slug : []
	const projectSlug = slug[0] || '' // This is the project ID
	const reportSlug = slug[1] || '' // This is the report ID

	useEffect(() => {
		console.log('charts: ', charts)
		console.log('report: ', report)
	}, [charts, report])

	// Function to fetch charts for a specific report
	const fetchCharts = async (reportId: string) => {
		try {
			//console.log(`Fetching charts for report ID: ${reportId}`)
			const chartsResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${reportId}`)
			
			if (!chartsResponse.ok) {
				console.error(`Failed to fetch charts: ${chartsResponse.status}`)
				return []
			}
			
			const chartsData = await chartsResponse.json()
			//console.table('Charts data:', chartsData)
			return chartsData
		} catch (error) {
			console.error('Error fetching charts:', error)
			return []
		}
	}

	// Function to refresh charts data when a new chart is added
	const refreshCharts = async () => {
		if (report?.id) {
			try {
				const updatedCharts = await fetchCharts(report.id)
				setCharts(updatedCharts)
			} catch (error) {
				console.error('Error refreshing charts:', error)
			}
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			setError(null)

			try {
				//console.log(`Finding project with slug: ${projectSlug}`)
				
				// Fetch all projects first
				const projectsResponse = await fetch('/api/proxy?endpoint=/api/projects/me')
				
				if (!projectsResponse.ok) {
					if (projectsResponse.status === 401) {
						router.push('/account/login')
						return
					}
					throw new Error(`Failed to fetch projects: ${projectsResponse.status}`)
				}
				
				const projects: Project[] = await projectsResponse.json()
				//console.log('All projects:', projects)
				
				// Find the project by ID directly instead of slugified name
				const foundProject = projects.find(p => p.id === projectSlug)
				
				if (!foundProject) {
					console.error(`Project not found with ID: ${projectSlug}. Available projects:`, 
						projects.map(p => ({ id: p.id, name: p.name }))
					)
					notFound() // Trigger the 404 page for invalid project
				}
				
				//console.log('Found project:', foundProject)
				setProject(foundProject)
				
				// Also try to get all reports to see what's available
				const allReportsResponse = await fetch('/api/proxy?endpoint=/api/reports/me')
				let projectReports: Report[] = []
				
				if (allReportsResponse.ok) {
					const allReports: Report[] = await allReportsResponse.json()
					//console.log('All available reports:', allReports)
					
					// Filter reports for this project
					projectReports = allReports.filter((r: Report) => r.project_id === foundProject.id)
					//console.log('Reports that match this project:', projectReports)
					
					// Set the reports state
					setReports(projectReports)
				} else {
					console.error('Failed to fetch reports from /api/reports/me:', allReportsResponse.status)
					throw new Error('Failed to fetch reports')
				}
				
				// Note: We'll skip the problematic project-specific endpoint since it's not returning the correct data
				// Just log for debugging purposes
				/*
				const reportsUrl = `/api/proxy?endpoint=/api/projects/${foundProject.id}/reports`
				console.log('Fetching reports URL for reference (known issue):', reportsUrl)
				const reportsResponse = await fetch(reportsUrl)
				console.log('Project-specific reports endpoint response status:', reportsResponse.status)
				const responseText = await reportsResponse.text()
				console.log('Project-specific reports endpoint response text:', responseText)
				*/
				
				// if we have a reportSlug, try to find the corresponding report
				if (reportSlug) {
					// If there are no reports but a report slug is provided, show 404
					if (projectReports.length === 0) {
						console.error(`No reports found for project with ID: ${foundProject.id}, but report slug was provided: ${reportSlug}`)
						notFound()
					}
					
					// find the report by matching the report ID directly
					const foundReport = projectReports.find(r => r.id === reportSlug)
					
					if (!foundReport) {
						console.error(`Report not found with ID: ${reportSlug}. Available reports:`, 
							projectReports.map(r => ({ id: r.id, name: r.name }))
						)
						notFound()
					}
					
					//console.log('Found report:', foundReport)
					setReport(foundReport)
					
					// Always fetch charts, regardless of where we get the report details from
					const reportCharts = await fetchCharts(foundReport.id)
					setCharts(reportCharts)
					
					// Extract report details directly from product_settings
					if (foundReport.product_settings) {
						const productSettings = foundReport.product_settings

						const details = {
							subCategory: Array.isArray(productSettings.category) ? 
							productSettings.category
								.map(r => r.replace(/-/g, ' '))
								.map(r => r.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
								.join(', ') : '',
							retailers: Array.isArray(productSettings.retailers) ? 
								productSettings.retailers
									.map(r => r.replace(/-/g, ' '))
									.map(r => r.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
									.join(', ') : '',
							audienceSize: productSettings.audience_size ? productSettings.audience_size.toString() : '',
							brands: Array.isArray(productSettings.brands) ? 
								productSettings.brands
									.map(b => b.replace(/-/g, ' '))
									.map(b => b.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
									.join(', ') : '',
							genders: Array.isArray(productSettings.genders) ? 
								productSettings.genders.join(', ') : '',
							timePeriod: productSettings.start_date && productSettings.end_date ? 
								`${formatDate(new Date(productSettings.start_date))} - ${formatDate(new Date(productSettings.end_date))}` : '',
							type: Array.isArray(productSettings.type_store) && productSettings.type_store.length > 0 ? 
								productSettings.type_store[0] : '',
							age: productSettings.age ? productSettings.age.toString() : '',
							includeImages: productSettings.include_images ? 'Yes' : 'No',
							location: productSettings.location || '',
							regions: Array.isArray(productSettings.regions) ? productSettings.regions.join(', ') : '',
							priceRange: (productSettings.min_price && productSettings.max_price) ? 
								`$${productSettings.min_price} - $${productSettings.max_price}` : '',
							questions: Array.isArray(productSettings.questions) ? 
								productSettings.questions.join(', ') : '',
							uploadedFiles: ''  // No data source for this yet
						}
						//console.log('Report details from product_settings:', details)
						setReportDetails(details)
					} else {
						// Fallback to chart extraction if product_settings is not available
						// Extract report details from chart query data as fallback
						const extractedDetails = extractReportDetailsFromCharts(reportCharts)
						console.log('Extracted report details from charts (fallback):', extractedDetails)
						setReportDetails(extractedDetails)
					}
					
					// fetch categories to get the category name
					const categoriesResponse = await fetch('/api/proxy?endpoint=/api/categories')
					
					if (!categoriesResponse.ok) {
						throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`)
					}
					
					const categories: Category[] = await categoriesResponse.json()
					
					// find the category by matching the category_id
					const foundCategory = categories.find(c => c.id === foundReport.category_id)
					
					if (foundCategory) {
						setCategory(foundCategory)
					} else {
						console.warn(`Category not found: ID=${foundReport.category_id}`)
					}
				}
			} catch (error) {
				console.error('Error fetching data:', error)
				setError('Failed to load data. Please try again later.')
			} finally {
				setIsLoading(false)
			}
		}
		
		if (projectSlug) {
			fetchData()
		} else {
			notFound()
		}
	}, [projectSlug, reportSlug, router])

	// Function to extract report details from chart data
	const extractReportDetailsFromCharts = (charts: any[]): typeof reportDetails => {
		// Default values - include all fields to match state structure
		const details = {
			subCategory: '',
			retailers: '',
			audienceSize: '',
			brands: '',
			genders: '',
			timePeriod: '',
			type: '',
			age: '',
			includeImages: '',
			location: '',
			regions: '',
			priceRange: '',
			questions: '',
			uploadedFiles: ''
		}
		
		if (!charts || charts.length === 0) {
			return details
		}
		
		// Try to find a chart with query data
		// Most likely to be in the first chart or in a chart that has query data
		const chartWithQuery = charts.find(chart => chart.query) || charts[0]
		
		if (chartWithQuery && chartWithQuery.query) {
			const query = chartWithQuery.query
			
			// Extract retailers (companies in the API)
			if (query.companies && Array.isArray(query.companies) && query.companies.length > 0) {
				details.retailers = query.companies
					.map((company: string) => company.replace(/-/g, ' '))
					.map((company: string) => company.split(' ').map((word: string) => 
						word.charAt(0).toUpperCase() + word.slice(1)
					).join(' '))
					.join(', ')
			}
			
			// Extract brands
			if (query.brands && Array.isArray(query.brands) && query.brands.length > 0) {
				details.brands = query.brands
					.map((brand: string) => brand.replace(/-/g, ' '))
					.map((brand: string) => brand.split(' ').map((word: string) => 
						word.charAt(0).toUpperCase() + word.slice(1)
					).join(' '))
					.join(', ')
			}
			
			// Extract genders (sex in the API)
			if (query.sex && Array.isArray(query.sex) && query.sex.length > 0) {
				details.genders = query.sex.join(', ')
			}
			
			// Extract time period from range
			if (query.range && query.range.start_date && query.range.end_date) {
				const startDate = new Date(query.range.start_date)
				const endDate = new Date(query.range.end_date)
				
				details.timePeriod = `${formatDate(startDate)} - ${formatDate(endDate)}`
			}
		}
		
		return details
	}

	const handleToggleCollapse = () => {
		setIsCollapsed(prev => !prev)
		
		if (!isHidden) {
			setIsHidden(true)
		} else {
			setTimeout(() => {
				setIsHidden(false)
			}, 300)
		}
	}

	const getProductSummary = () => {
		const base = {
			name: report?.name || '--',
			goal: report?.goal || '--',
			category: category?.name || '--',
			subCategory: reportDetails.subCategory || '--',
		}
		
		switch (report?.product_type?.toLowerCase()) {
			case 'shop360':
				return {
					...base,
					retailers: reportDetails.retailers ? [reportDetails.retailers] : [],
					brands: reportDetails.brands ? [reportDetails.brands] : [],
					genders: reportDetails.genders ? [reportDetails.genders] : [],
					type: reportDetails.type || '--',
					includeImages: reportDetails.includeImages === 'Yes',
					timePeriod: reportDetails.timePeriod || '--'
				}
				
			case 'demand360':
				return {
					...base,
					timePeriod: reportDetails.timePeriod || '--',
					location: reportDetails.location || '--',
					regions: reportDetails.regions ? [reportDetails.regions] : []
				}
				
			case 'insight360':
				return {
					...base,
					brands: reportDetails.brands ? [reportDetails.brands] : [],
					genders: reportDetails.genders ? [reportDetails.genders] : []
				}
				
			case 'feedback360':
				return {
					...base,
					audienceSize: reportDetails?.audienceSize || '--',
					genders: reportDetails.genders ? [reportDetails.genders] : [],
					age: reportDetails.age || '--',
					location: reportDetails.location || '--',
					regions: reportDetails.regions ? [reportDetails.regions] : [],
					retailers: reportDetails.retailers ? [reportDetails.retailers] : [],
					questions: reportDetails.questions ? [reportDetails.questions] : [],
					priceRange: reportDetails.priceRange || '--',
					uploadedFiles: reportDetails.uploadedFiles ? [reportDetails.uploadedFiles] : []
				}
				
			default:
				return {
					...base
				}
		}
	}

	// Helper function to extract chart-specific properties
	const getChartSummary = () => {
		const summary = getProductSummary()
		return {
			subCategory: 'subCategory' in summary ? summary.subCategory : undefined,
			retailers: 'retailers' in summary ? summary.retailers : [],
			brands: 'brands' in summary ? summary.brands : [],
			genders: 'genders' in summary ? summary.genders : [],
			age: 'age' in summary ? summary.age : undefined,
			type: 'type' in summary ? summary.type : undefined,
			includeImages: 'includeImages' in summary ? summary.includeImages : undefined,
			timePeriod: 'timePeriod' in summary ? summary.timePeriod : undefined,
			location: 'location' in summary ? summary.location : undefined,
			regions: 'regions' in summary ? summary.regions : [],
			priceRange: 'priceRange' in summary ? summary.priceRange : undefined
		}
	}

	if (isLoading) {
		return <Loading />
	}

	if (error) {
		return (
			<main className={styles.page}>
				<div className='container container--big pt-smallest'>
					<div className='flex items-center justify-center'>
						<p className='text-16 semi-bold red'>
							{error}
						</p>
					</div>
				</div>
			</main>
		)
	}

	return (
		<main className={styles.page}>

			<TitlePart title={project?.name || 'Project Name'} />

			<section className={styles.topNavigation}>
				<div className='container container--big'>
					<div className={styles.wrapper}>
						<ul>
							{reports.map((reportItem) => (
								<li key={reportItem.id}>
									<button 
										className={clsx(
											report?.id === reportItem.id ? styles.active : '', 
											'text-16 gray-400 semi-bold'
										)}
										onClick={() => router.push(`/dashboard/my-reports/${projectSlug}/${reportItem.id}`)}
									>
										{reportItem.name}
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className={clsx(
				styles.middleContent,
				isCollapsed && styles.collapsed,
				isHidden && styles.hidden
			)}>
				<div className='container container--big'>
					<div className={styles.contentWrapper}>

						<ProjectDetails
							id={report?.id || ''}
							product={
								report?.product_type?.toLowerCase() === 'shop360' ? 'shop360' :
								report?.product_type?.toLowerCase() === 'demand360' ? 'demand360' :
								report?.product_type?.toLowerCase() === 'feedback360' ? 'feedback360' :
								report?.product_type?.toLowerCase() === 'insight360' ? 'insight360' : 
								'shop360'
							}
							summary={getProductSummary()}
							onToggleCollapse={handleToggleCollapse}
							isCollapsed={isCollapsed}
						/>

						<div className={clsx(styles.chartsArea, 'relative')}>
							
							<div className={clsx(styles.bg, 'bg-gray-200')}></div>
							
							<div className='relative z2'>
								
								<TopButtons
									projectId={project?.id || ''}
									reportId={report?.id || ''}
									howManyCharts={charts.length}
									onChartAdded={refreshCharts}
								/>
								
								<div className={styles.allCharts}>
									{charts.length > 0 ? (() => {
										// Filter out charts with empty results
										const chartsWithData = charts.filter(chart => 
											chart.results && Array.isArray(chart.results) && chart.results.length > 0
										)
										
										// If no charts have data, show the no charts message
										if (chartsWithData.length === 0) {
											return (
												<div className={styles.noCharts}>
													
													<h2 className='text-30 semi-bold blue'>
														Unfortunately, there is no data for this report.
													</h2>

													<p className='text-16'>
														Try generate a new report with different filters or time period.
													</p>

												</div>
											)
										}
										
										// Organize charts by size (half vs full)
										const halfCharts = chartsWithData.filter(chart => 
											chart.preferences?.box_size !== 'full'
										)
										
										const fullCharts = chartsWithData.filter(chart => 
											chart.preferences?.box_size === 'full'
										)
										
										// Prepare the final order of charts
										const finalCharts = []
										
										// Special case: if we have exactly 1 half chart and 1 full chart, show full first
										if (halfCharts.length === 1 && fullCharts.length === 1) {
											finalCharts.push(fullCharts[0])
											finalCharts.push(halfCharts[0])
										} else {
											// Original logic for other cases
											// Process half charts (in pairs when possible)
											for (let i = 0; i < halfCharts.length; i += 2) {
												if (i + 1 < halfCharts.length) {
													// We have a pair
													finalCharts.push(halfCharts[i])
													finalCharts.push(halfCharts[i + 1])
												} else {
													// Last unpaired half chart
													finalCharts.push(halfCharts[i])
												}
											}
											
											// Add all full charts after the half charts
											finalCharts.push(...fullCharts)
										}
										
										// Render the charts in the organized order
										return finalCharts.map((chart) => {
											const { chartData, chartType } = formatChartData(chart)
											
											return (
												<ChartBox
													key={chart.id}
													id={chart.id}
													boxSize={chart.preferences?.box_size || 'half'}
													title={chart.title || 'Chart Title'}
													description={chart.description || ''}
													AIGenerated={chart.chat_generated || false}
													chart={chartData}
													chartType={chartType}
													reportSummary={getChartSummary()}
													switchToPercentage={chartType === 'colors' ? true : false}
												/>
											)
										})
									})() : (
										<div className={styles.noCharts}>

											<h2 className='text-30 semi-bold blue'>
												This report doesn't contain any charts.
											</h2>

											<p className='text-16'>
												You can either generate new charts using the "Generate with AI" button, or you can create a new report on the previous page.
											</p>
											
										</div>
									)}
								</div>

							</div>

						</div>

					</div>
				</div>
			</section>

		</main>
	)
}

// Add this helper function at the appropriate scope
const formatDate = (date: Date) => {
	return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}