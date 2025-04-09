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

// data
import {
	pricePointAnalysis,
	averagePriceDistributionByBrand,
	numberOfSkus,
	topColors,
	positiveNegative,
	productPrice,
	access
} from './chart-data'

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

	// parse the slug to get projectName and reportName
	const slug = Array.isArray(params.slug) ? params.slug : []
	const projectSlug = slug[0] || ''
	const reportSlug = slug[1] || ''

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
				
				// Find the project by matching the slug with the slugified project name
				const foundProject = projects.find(p => slugify(p.name) === projectSlug)
				
				if (!foundProject) {
					console.error(`Project not found with slug: ${projectSlug}. Available projects:`, 
						projects.map(p => ({ id: p.id, name: p.name, slug: slugify(p.name) }))
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
					
					// find the report by matching the slug with the slugified report name
					const foundReport = projectReports.find(r => slugify(r.name) === reportSlug)
					
					if (!foundReport) {
						console.error(`Report not found with slug: ${reportSlug}. Available reports:`, 
							projectReports.map(r => ({ id: r.id, name: r.name, slug: slugify(r.name) }))
						)
						notFound()
					}
					
					console.log('Found report:', foundReport)
					setReport(foundReport)
					
					// Fetch charts for this report
					const reportCharts = await fetchCharts(foundReport.id)
					setCharts(reportCharts)
					
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
										onClick={() => router.push(`/dashboard/my-reports/${projectSlug}/${slugify(reportItem.name)}`)}
									>
										{reportItem.name}
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			{/*
			<div className='test-div'>
				<div className="container container--big">

					<h2 className="text-20 bold">
						Test Chart Endpoints
					</h2>
					
					<div className="flex flex-col space-y-4 mt-4">
						<button 
							className="button button--solid text-16"
							onClick={async () => {
								try {
									if (!report) {
										alert("No report selected")
										return
									}
									
									// Get the test div to show results
									const resultsDiv = document.querySelector('.test-endpoint-results')
									if (resultsDiv) {
										resultsDiv.innerHTML = '<p>Loading chart data...</p>'
									}
									
									// Fetch charts for the current report
									console.log(`Fetching charts for report ID: ${report.id}`)
									const chartsResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${report.id}`)
									
									const responseText = await chartsResponse.text()
									console.log('Raw response:', responseText)
									
									// Display results
									if (resultsDiv) {
										resultsDiv.innerHTML = `
											<div class="mt-4">
												<h3 class="text-18 bold mb-2">Charts for Report: ${report.name}</h3>
												<p class="mb-2">Report ID: ${report.id}</p>
												<p class="mb-2">Status: ${chartsResponse.status === 200 ? 'Success' : `Error: ${chartsResponse.status}`}</p>
												<pre class="bg-gray-200 p-4 rounded overflow-auto max-h-60 mb-4">${responseText}</pre>
											</div>
										`
									}
									
									// Update charts in the UI if successful
									if (chartsResponse.ok) {
										try {
											const chartsData = JSON.parse(responseText)
											console.log('Charts data:', chartsData)
											setCharts(chartsData)
										} catch (e) {
											console.error('Error parsing charts JSON:', e)
										}
									}
								} catch (error) {
									console.error('Error fetching chart data:', error)
									const resultsDiv = document.querySelector('.test-endpoint-results')
									if (resultsDiv) {
										resultsDiv.innerHTML = `<p class="text-16 semi-bold red">Error fetching chart data: ${error instanceof Error ? error.message : String(error)}</p>`
									}
								}
							}}
						>
							Get Charts for Current Report
						</button>
					</div>
					
					<div className="test-endpoint-results mt-4 p-4 border border-gray-200 rounded">
						<p className="text-gray-500">Click the button above to fetch charts for the current report</p>
					</div>

				</div>
			</div>
			*/}

			<section className={clsx(
				styles.middleContent,
				isCollapsed && styles.collapsed,
				isHidden && styles.hidden
			)}>
				<div className='container container--big'>
					<div className={styles.contentWrapper}>

						<ProjectDetails
							product={
								report?.product_type?.toLowerCase() === 'shop360' ? 'shop360' :
								report?.product_type?.toLowerCase() === 'demand360' ? 'demand360' :
								report?.product_type?.toLowerCase() === 'feedback360' ? 'feedback360' :
								report?.product_type?.toLowerCase() === 'insight360' ? 'insight360' : 
								'shop360'
							}
							members={access}
							summary={{
								name: report?.name || 'Report name',
								category: category?.name || 'Category',
								retailers: 'Wallmart, Costco, Target',
								brands: 'Nike, Adidas, New Balance, Puma, Fila',
								genders: "Men's",
								timePeriod: '01/01/2023 - 12/31/2023',
								type: 'Instore',
								goal: report?.goal || 'No goal specified'
							}}
							onToggleCollapse={handleToggleCollapse}
							isCollapsed={isCollapsed}
						/>

						<div className={clsx(styles.chartsArea, 'relative')}>
							
							<div className={clsx(styles.bg, 'bg-gray-200')}></div>
							
							<div className='relative z2'>
								
								<TopButtons />
								
								<div className={styles.allCharts}>
									{charts.length > 0 ? (
										charts.map((chart) => (
											<ChartBox
												key={chart.id}
												boxSize={chart.preferences?.boxSize || 'half'}
												title={chart.title || 'Chart Title'}
												description={chart.description || 'Chart Description'}
												AIGenerated={chart.chat_generated || false}
												chart={{
													vertical: chart.results?.vertical || [],
													horizontal: chart.results?.horizontal || [],
													positiveNegative: chart.results?.positiveNegative || null,
													productPrice: chart.results?.productPrice || null
												}}
											/>
										))
									) : (
										<>
											{/* Display default charts if no API charts are available */}
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
										</>
									)}
									
									{/*
									<div className="w-full mt-8 p-4 bg-white rounded-lg shadow">
										<h3 className="text-18 bold mb-4">Test Chart API</h3>
										<button 
											className="button button--gradient-blue text-16"
											onClick={async () => {
												try {
													if (!report) {
														console.error("No report selected")
														return
													}
													
													// Test the chart endpoint
													console.log(`Testing chart API for report ID: ${report.id}`)
													const chartsResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${report.id}`)
													
													const responseText = await chartsResponse.text()
													console.log('Raw response:', responseText)
													
													if (chartsResponse.ok) {
														try {
															const chartsData = JSON.parse(responseText)
															console.log('Charts data:', chartsData)
															setCharts(chartsData)
														} catch (e) {
															console.error('Error parsing charts JSON:', e)
														}
													} else {
														console.error(`Failed to fetch charts: ${chartsResponse.status}`)
													}
												} catch (error) {
													console.error('Error testing chart API:', error)
												}
											}}
										>
											Refresh Charts
										</button>
									</div>
									*/}
									
								</div>

							</div>

						</div>

					</div>
				</div>
			</section>

		</main>
	)
}