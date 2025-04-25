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

// css
import styles from './index.module.scss'

// utils
import { slugify } from '@/utils/functions'

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
	const projectSlug = slug[0] || '' // This is now a project ID, not a slug
	const reportSlug = slug[1] || '' // This is the report ID

	// Function to fetch charts for a specific report
	const fetchCharts = async (reportId: string) => {
		try {
			console.log(`Fetching charts for report ID: ${reportId}`)
			const chartsResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${reportId}`)
			
			if (!chartsResponse.ok) {
				console.error(`Failed to fetch charts: ${chartsResponse.status}`)
				return []
			}
			
			const chartsData = await chartsResponse.json()
			console.log('Charts data:', chartsData)
			return chartsData
		} catch (error) {
			console.error('Error fetching charts:', error)
			return []
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			setError(null)

			try {
				console.log(`Finding project with slug: ${projectSlug}`)
				
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
				console.log('All projects:', projects)
				
				// Find the project by ID directly instead of slugified name
				const foundProject = projects.find(p => p.id === projectSlug)
				
				if (!foundProject) {
					console.error(`Project not found with ID: ${projectSlug}. Available projects:`, 
						projects.map(p => ({ id: p.id, name: p.name }))
					)
					notFound() // Trigger the 404 page for invalid project
				}
				
				console.log('Found project:', foundProject)
				setProject(foundProject)
				
				// Also try to get all reports to see what's available
				const allReportsResponse = await fetch('/api/proxy?endpoint=/api/reports/me')
				let projectReports: Report[] = []
				
				if (allReportsResponse.ok) {
					const allReports: Report[] = await allReportsResponse.json()
					console.log('All available reports:', allReports)
					
					// Filter reports for this project
					projectReports = allReports.filter((r: Report) => r.project_id === foundProject.id)
					console.log('Reports that match this project:', projectReports)
					
					// Set the reports state
					setReports(projectReports)
				} else {
					console.error('Failed to fetch reports from /api/reports/me:', allReportsResponse.status)
					throw new Error('Failed to fetch reports')
				}
				
				// Note: We'll skip the problematic project-specific endpoint since it's not returning the correct data
				// Just log for debugging purposes
				const reportsUrl = `/api/proxy?endpoint=/api/projects/${foundProject.id}/reports`
				console.log('Fetching reports URL for reference (known issue):', reportsUrl)
				const reportsResponse = await fetch(reportsUrl)
				console.log('Project-specific reports endpoint response status:', reportsResponse.status)
				const responseText = await reportsResponse.text()
				console.log('Project-specific reports endpoint response text:', responseText)
				
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
					
					console.log('Found report:', foundReport)
					setReport(foundReport)
					
					// Always fetch charts, regardless of where we get the report details from
					const reportCharts = await fetchCharts(foundReport.id)
					setCharts(reportCharts)
					
					// Extract report details directly from product_settings
					if (foundReport.product_settings) {
						const productSettings = foundReport.product_settings
						const details = {
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
						console.log('Report details from product_settings:', details)
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
				
				// Format dates as MM/DD/YYYY
				const formatDate = (date: Date) => {
					return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
				}
				
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
			goal: report?.goal || '--'
		}
		
		switch (report?.product_type?.toLowerCase()) {
			case 'shop360':
				return {
					...base,
					category: category?.name || '--',
					retailers: reportDetails.retailers || '--',
					brands: reportDetails.brands || '--',
					genders: reportDetails.genders || '--',
					type: reportDetails.type || '--',
					includeImages: reportDetails.includeImages === 'Yes',
					timePeriod: reportDetails.timePeriod || '--'
				}
				
			case 'demand360':
				return {
					...base,
					category: category?.name || '--',
					timePeriod: reportDetails.timePeriod || '--',
					location: reportDetails.location || '--',
					regions: reportDetails.regions || '--'
				}
				
			case 'insight360':
				return {
					...base,
					category: category?.name || '--',
					brands: reportDetails.brands || '--',
					genders: reportDetails.genders || '--'
				}
				
			case 'feedback360':
				return {
					...base,
					audienceSize: reportDetails?.audienceSize || '--',
					genders: reportDetails.genders || '--',
					age: reportDetails.age || '--',
					location: reportDetails.location || '--',
					regions: reportDetails.regions || '--',
					retailers: reportDetails.retailers || '--',
					category: category?.name || '--',
					questions: reportDetails.questions ? [reportDetails.questions] : [],
					priceRange: reportDetails.priceRange || '--',
					uploadedFiles: reportDetails.uploadedFiles ? [reportDetails.uploadedFiles] : []
				}
				
			default:
				return {
					...base,
					category: category?.name || '--'
				}
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
								
								<TopButtons reportId={report?.id} />
								
								<div className={styles.allCharts}>
									{charts.length > 0 ? (
										charts.map((chart) => {
											// Process chart data based on chart type
											let chartData = {}
											const chartType = chart.preferences?.chart_type || 'vertical'
											
											// Define type for chart result items
											interface ChartResultItem {
												product_name?: string
												price?: number
												image?: string
												[key: string]: any // Allow for additional properties
											}
											
											// Log the raw chart data for debugging
											console.log('Processing chart:', chart.id, 'Type:', chartType, 'Results:', chart.results)
											
											// Format results based on chart type
											if (chartType === 'vertical') {
												chartData = {
													vertical: Array.isArray(chart.results) ? 
														chart.results.map((item: ChartResultItem) => ({
															label: item.product_name || 'Unknown',
															value: typeof item.price === 'number' ? item.price : 0
														})) : []
												}
											} else if (chartType === 'colors') {
												chartData = {
													colors: Array.isArray(chart.results) ? 
														chart.results.map((item: ChartResultItem) => ({
															color: item.color || 'Unknown',
															count: typeof item.count === 'number' ? item.count : 0
														})) : []
												}
											} else if (chartType === 'horizontal') {
												chartData = {
													horizontal: Array.isArray(chart.results) ? 
														chart.results.map((item: ChartResultItem) => ({
															name: item.product_name || 'Unknown',
															value: typeof item.price === 'number' ? item.price : 0,
															color: '#3691E1' // Default color
														})) : []
												}
											} else if (chartType === 'productPrice') {
												chartData = {
													productPrice: Array.isArray(chart.results) ? 
														chart.results.map((item: ChartResultItem) => ({
															name: item.product_name || 'Unknown',
															price: typeof item.price === 'number' ? 
																`$${item.price.toFixed(2)}` : '$0.00',
															image: item.image || ''
														})) : []
												}
											} else {
												// Default to vertical chart if type is unknown
												chartData = {
													vertical: Array.isArray(chart.results) ? 
														chart.results.map((item: ChartResultItem) => ({
															label: item.product_name || 'Unknown',
															value: typeof item.price === 'number' ? item.price : 0
														})) : []
												}
											}
											
											return (
												<ChartBox
													key={chart.id}
													boxSize={chart.preferences?.box_size || 'half'}
													title={chart.title || 'Chart Title'}
													description={chart.description || 'Chart Description'}
													AIGenerated={chart.chat_generated || false}
													chart={chartData}
												/>
											)
										})
									) : (
										<>
											
											<p className='text-16 semi-bold red'>
												Insufficient data to generate charts.
											</p>

											{/* Display default charts if no API charts are available */}
											{/*
											<ChartBox
												boxSize={pricePointAnalysis.length > 10 ? 'full' : 'half'}
												title='Price Point Analysis'
												description='Pricing Distribution'
												chart={{
													vertical: pricePointAnalysis
												}}
											/>

											<ChartBox
												boxSize={averagePriceDistributionByBrand.length > 10 ? 'full' : 'half'}
												title='Average Price Distribution by Brand'
												description='Pricing Distribution'
												chart={{
													vertical: averagePriceDistributionByBrand
												}}
											/>
											
											<ChartBox
												boxSize='half'
												title='Number of SKUs associated with each retailer'
												description='Minim dolor in amet nulla laboris enim dolore consequatt...'
												AIGenerated={true}
												chart={{
													horizontal: numberOfSkus
												}}
											/>

											<ChartBox
												boxSize='half'
												title='Statistic'
												description='Minim dolor in amet nulla laboris enim dolore consequatt.'
												chart={{
													positiveNegative: positiveNegative
												}}
											/>

											<ChartBox
												boxSize='half'
												title='Top Products'
												description='Priced at $35 or less'
												chart={{
													productPrice: productPrice
												}}
											/>
											*/}
										</>
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