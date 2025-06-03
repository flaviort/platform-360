'use client'

// libraries
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'

// components
import LazyLoad from '@/components/LazyLoad'
import Loading from '@/components/Loading'
import ChartBox from '@/components/ChartBox'

// img
import dots from '@/assets/img/dots-2.png'

import demand360 from '@/assets/img/logos-no-margin/demand-360-white.png'
import feedback360 from '@/assets/img/logos-no-margin/feedback-360-white.png'
import insight360 from '@/assets/img/logos-no-margin/insight-360-white.png'
import shop360 from '@/assets/img/logos-no-margin/shop-360-white.png'

import demand360_black from '@/assets/img/logos-no-margin/demand-360.png'
import feedback360_black from '@/assets/img/logos-no-margin/feedback-360.png'
import insight360_black from '@/assets/img/logos-no-margin/insight-360.png'
import shop360_black from '@/assets/img/logos-no-margin/shop-360.png'

// svg
import Logo from '@/assets/svg/logo/logo.svg'
import { FileChartColumnIncreasing } from 'lucide-react'

// css
import styles from './index.module.scss'
import '@/assets/scss/components/print.scss'

// utils
import { formatDateForReport, vw } from '@/utils/functions'
import { formatChartData, getChartSummary } from '@/utils/chartUtils'

function GenerateReportContent() {
	const searchParams = useSearchParams()
	const [data, setData] = useState<any>(null)
	
	const [project, setProject] = useState<{
		name: string,
		project_goal: string
	} | null>(null)

	const [selectedCharts, setSelectedCharts] = useState<any[]>([])
	const [categories, setCategories] = useState<{[id: string]: string}>({})
	const [chartHeight, setChartHeight] = useState<number>(0)
	
	// Add a function to update chart height
	const updateChartHeight = () => {
		setChartHeight(vw(30))
	}

	// Add a useEffect to set up resize listener
	useEffect(() => {
		// Set initial chart height
		updateChartHeight()
		
		// Add resize listener
		window.addEventListener('resize', updateChartHeight)
		
		// Cleanup
		return () => {
			window.removeEventListener('resize', updateChartHeight)
		}
	}, [])

	useEffect(() => {
		const data = searchParams.get('data')

		if (!data) {
			notFound()
			return
		}

		try {
			const parsedData = JSON.parse(decodeURIComponent(data))
			setData(parsedData)
			//console.log(parsedData)
		} catch (error) {
			console.error('Error parsing report data:', error)
			notFound()
		}
	}, [searchParams])

	// fetch project data (title / goal)
	useEffect(() => {
		const fetchProject = async () => {
			if (!data?.project_id) return

			try {
				const response = await fetch('/api/proxy?endpoint=/api/projects/me', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})
				
				if (!response.ok) return

				const projects = await response.json()

				const project = projects.find((p: any) => p.id === data.project_id)

				if (project) {
					setProject({
						name: project.name,
						project_goal: project.project_goal
					})
				}
			} catch (error) {
				console.error('Error fetching project:', error)
			}
		}

		fetchProject()
	}, [data])

	// fetch charts for reports
	useEffect(() => {
		if (!data?.reports) return

		const fetchChartsForReports = async () => {
			const allCharts: any[] = []

			try {
				// Fetch all reports once
				const allReportsRes = await fetch('/api/proxy?endpoint=/api/reports/me')
				if (!allReportsRes.ok) {
					console.error('Failed to fetch reports')
					return
				}
				const allReports = await allReportsRes.json()

				for (const reportInfo of data.reports) {
					// Find the specific report from all reports
					const report = allReports.find((r: any) => r.id === reportInfo.report_id)
					if (!report) {
						console.error(`Report not found: ${reportInfo.report_id}`)
						continue
					}

					// Fetch all charts for this report
					const chartsRes = await fetch(`/api/proxy?endpoint=/api/charts/report/${reportInfo.report_id}`)
					if (!chartsRes.ok) continue
					const charts = await chartsRes.json()

					// Filter only selected chart_ids
					const selected = charts.filter((chart: any) => reportInfo.chart_ids.includes(chart.id))

					// Push each chart with its parent report
					selected.forEach((chart: any) => {
						allCharts.push({ report, chart })
					})
				}

				setSelectedCharts(allCharts)
			} catch (error) {
				console.error('Error fetching charts and reports:', error)
			}
		}

		fetchChartsForReports()
	}, [data])

	// fetch categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch('/api/proxy?endpoint=/api/categories')

				if (!response.ok) {
					console.error('Failed to fetch categories')
					return
				}
				
				const categoriesData = await response.json()
				
				// create a map of id -> name
				const categoriesMap = categoriesData.reduce((acc: {[id: string]: string}, category: {id: string, name: string}) => {
					acc[category.id] = category.name
					return acc
				}, {})
				
				setCategories(categoriesMap)
			} catch (error) {
				console.error('Error fetching categories:', error)
			}
		}
		
		fetchCategories()
	}, [])

	// function to get unique product types
	const getUniqueProductTypes = (charts: any[]) => {
		if (!charts || charts.length === 0) return []
		
		// extract unique product types
		const productTypes = new Set<string>()
		
		charts.forEach(({ report }) => {
			if (report?.product_type) {
				productTypes.add(report.product_type.toLowerCase())
			}
		})
		
		return Array.from(productTypes)
	}

	const notes = {
		skuAnalysis: 'This chart shows the number of SKUs for each retailer. The number of SKUs is the number of different products for each retailer.',
		priceDistributionByBrand: 'This chart shows the price distribution by brand. The price is the average price of each brand across all retailers.',
		pricePointAnalysis: 'This chart shows the price point analysis. The price point is the average price of the product across all retailers incremementing by $5.',
		pricePointByRetailer: 'This chart shows the price point (minimum, average, maximum) by retailer.',
		colors: 'This chart shows how many colors are available for each product. The colors are the colors of the product across all retailers.',
		verticalBars: 'This chart was generated by AI. Feel free to edit these notes to better reflect the chart.',
		mapUSA: 'This chart shows the number of products sold in each state. The states are the states of the US.',
	}

	return (
		<main className={styles.component}>
			<div className='container container--big'>

				<div className={styles.header}>
					<div className={styles.wrapper}>

						<div className={styles.flex}>
						
							<h1 className='text-35 bold blue mb-half'>
								Generate Report
							</h1>

							<p className='text-16'>
								Below you can preview the report that will be generated. You can also edit most fields by clicking on them. Whenever you ready, click on the <b>"Print / Generate PDF"</b> button to generate the report.
							</p>

						</div>

						<button
							className='button button--gradient-blue text-16'
							onClick={() => {
								window.print()
							}}
						>
							<FileChartColumnIncreasing /> Print / Generate PDF
						</button>

					</div>
				</div>

				{project ? (
					<div className={styles.pages}>

						<section className={clsx(styles.page, styles.frontPage)}>
							
							<div
								className={clsx(styles.top, 'bg-purple-dark')}
								style={{ backgroundImage: 'url(' + dots.src + ')' }}
							>
								<div className={styles.wrapper}>

									<div className={styles.logo}>
										<Logo />
									</div>

									<p className='text-12 white'>
										Powered by: www.platform360.ai
									</p>

								</div>
							</div>

							<div className={styles.bottom}>
								<div className={styles.wrapper}>

									<div className={styles.topPart}>

										<p
											className={clsx(styles.title, 'blue bold')}
											contentEditable
											suppressContentEditableWarning
										>
											{project?.name}
										</p>

										<p
											className={clsx(styles.goal, 'text-16')}
											contentEditable
											suppressContentEditableWarning
										>
											{project?.project_goal}
										</p>

										<p className={clsx(styles.sub, 'bold')}>
											Executive summary:
										</p>

										<p
											className={clsx(styles.summary, 'text-16')}
											contentEditable
											suppressContentEditableWarning
										>
											This report provides a visual and data-driven overview of key patterns and trends within the selected product category. The insights presented here are based on a comprehensive analysis of available data, aiming to support strategic decision-making across areas such as pricing, assortment planning, and product development.<br /><br />

											Charts included in this report highlight distributions, comparisons, and performance metrics to help identify opportunities, evaluate market presence, and guide next steps. Users are encouraged to interpret the findings in the context of their specific goals and adjust strategies accordingly.
										</p>

									</div>

									<div className={styles.bottomPart}>

										<p className={clsx(styles.sub, 'bold mb-half')}>
											Products used:
										</p>

										{(() => {
											const uniqueProductTypes = getUniqueProductTypes(selectedCharts);
											return (
												<div className={styles.products}>
													{uniqueProductTypes.includes('shop360') && (
														<Image
															src={shop360_black}
															alt='Shop360'
															width='311'
															height='57'
														/>
													)}

													{uniqueProductTypes.includes('demand360') && (
														<Image
															src={demand360_black}
															alt='Demand360'
															width='363'
															height='45'
														/>
													)}

													{uniqueProductTypes.includes('insight360') && (
														<Image
															src={insight360_black}
															alt='Insight360'
															width='351'
															height='57'
														/>
													)}

													{uniqueProductTypes.includes('feedback360') && (
														<Image
															src={feedback360_black}
															alt='Feedback360'
															width='417'
															height='49'
														/>
													)}
												</div>
											);
										})()}

										<div className={styles.dateClient}>

											<div>

												<p className={clsx(styles.sub, 'bold')}>
													Date: 
												</p>

												<p
													className={clsx(styles.date, 'text-16')}
													contentEditable
													suppressContentEditableWarning
												>
													{new Date().toLocaleDateString('en-US', {
														month: 'short',
														day: 'numeric',
														year: 'numeric'
													}).replace(/ /g, ' ')}
												</p>

											</div>

											<div>

												<p className={clsx(styles.sub, 'bold')}>
													Client: 
												</p>

												<p
													className={clsx(styles.date, 'text-16')}
													contentEditable
													suppressContentEditableWarning
												>
													Name of the client goes here
												</p>

											</div>

										</div>

									</div>
									
								</div>
							</div>

						</section>


						{selectedCharts.map(({ report, chart }) => (
							<section key={chart.id} className={clsx(styles.page, styles.regularPage)}>
								
								<div className={styles.top}>
									
									<div
										className={styles.bg}
										style={{ backgroundImage: 'url(' + dots.src + ')' }}
									></div>

									<div className='relative z2'>
										<div className={styles.wrapper}>

											<div className={styles.left}>

												<div className={styles.logo}>
													<Logo />
												</div>

												<div className={styles.line}></div>

												<p className={clsx(styles.title, 'white')}>
													{report.name}
												</p>

												<Image
													src={report.product_type === 'shop360' ? shop360 : report.product_type === 'demand360' ? demand360 : report.product_type === 'feedback360' ? feedback360 : insight360}
													alt={report.product_type === 'shop360' ? 'Shop360' : report.product_type === 'demand360' ? 'Demand360' : report.product_type === 'feedback360' ? 'Feedback360' : 'Insight360'}
													width={report.product_type === 'shop360' ? 311 : report.product_type === 'demand360' ? 363 : report.product_type === 'feedback360' ? 417 : 351}
													height={report.product_type === 'shop360' ? 57 : report.product_type === 'demand360' ? 45 : report.product_type === 'feedback360' ? 49 : 57}
													className={styles.productType}
												/>

											</div>

											<p className={clsx(styles.powered, 'white')}>
												Powered by: www.platform360.ai
											</p>

										</div>
									</div>

								</div>

								<div className={styles.bottom}>

									<div className={styles.left}>

										{(() => {
											const { chartData, chartType } = formatChartData(chart)

											console.log(chartType)
											
											return (
												<ChartBox
													id={chart.id}
													boxSize='full'
													AIGenerated={chart.chat_generated || false}
													chart={chartData}
													chartHeight={chartHeight}
													chartType={chartType}
													reportSummary={getChartSummary(report, formatDateForReport)}
													showAllNumbers
												/>
											)
										})()}

										<p
											className={clsx(styles.notes, 'text-16')}
											contentEditable
											suppressContentEditableWarning
										>
											{(() => {
												const { chartType } = formatChartData(chart)
												// Map the chartType to the notes object key
												const noteKey = 
													chartType === 'sku_analysis' ? 'skuAnalysis' :
													chartType === 'price_distribution_by_brand' ? 'priceDistributionByBrand' :
													chartType === 'price_point_analysis' ? 'pricePointAnalysis' :
													chartType === 'price_point_by_retailer' ? 'pricePointByRetailer' :
													chartType === 'colors' ? 'colors' :
													chartType === 'map_usa' ? 'mapUSA' :
													chartType === 'vertical' ? 'verticalBars' : null
												
												// Return the corresponding note or default text
												return noteKey && notes[noteKey] ? notes[noteKey] : 'Notes'
											})()}
										</p>

									</div>

									<div className={styles.right}>

										<p
											className={clsx(styles.title, 'text-20 bold')}
											contentEditable
											suppressContentEditableWarning
										>
											{chart.title}
										</p>

										<p
											className={clsx(styles.description, 'text-16')}
											contentEditable
											suppressContentEditableWarning
										>
											{chart.description}
										</p>

										<div className={styles.details}>

											<p>
												Category: <span>{categories[report.category_id] || report.category_id}</span>
											</p>

											<p className='capitalize'>
												Retailers: <span>{report.product_settings?.retailers?.join(', ') || '--'}</span>
											</p>

											<p className='capitalize'>
												Brands: <span>{report.product_settings?.brands?.join(', ') || '--'}</span>
											</p>

											<p className='capitalize'>
												Genders: <span>{report.product_settings?.genders?.join(', ') || '--'}</span>
											</p>

											<p className='capitalize'>
												Time period: <span>{formatDateForReport(report.product_settings?.start_date)} - {formatDateForReport(report.product_settings?.end_date)}</span>
											</p>

											<p className='capitalize'>
												Type: <span>{report.product_settings?.type_store?.join(', ') || '--'}</span>
											</p>

										</div>

									</div>

								</div>

							</section>
						))}

					</div>
				) : (
					<Loading simple />
				)}

				<div className={styles.footer}>
					<div className={styles.wrapper}>

						<div></div>

						<button
							className='button button--gradient-blue text-16'
							onClick={() => {
								window.print()
							}}
						>
							<FileChartColumnIncreasing /> Print / Generate PDF
						</button>

					</div>
				</div>

			</div>
		</main>
	)
}

export default function GenerateReport() {
	return (
		<LazyLoad>
			<GenerateReportContent />
		</LazyLoad>
	)
}