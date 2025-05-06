'use client'

// libraries
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// components
import PopupForm from './form'
import ProjectName from './fields/ProjectName'
import ReportName from './fields/ReportName'
import Category from './fields/Category'
import Retailers from './fields/Retailers'
import Brands from './fields/Brands'
import Genders from './fields/Genders'
import Type from './fields/Type'
import IncludeImages from './fields/IncludeImages'
import TimePeriod from './fields/TimePeriod'
import Goal from './fields/Goal'
import Loading from '@/components/Loading'
import InputHidden from '@/components/Form/InputHidden'

// img / svg
import { Sparkles } from 'lucide-react'

// utils
import { createReport, CreateReportData, getProjectAndCategoryIds } from '@/utils/reports'

// css
import styles from './index.module.scss'

interface PopupShop360Props {
	icon: React.ComponentType<any>
	text: string
	className?: string
}

// loading messages to display during report generation
const loadingMessages = [
	"Generating your report...",
	"Saving data to the database...",
	"Syncing your data...",
	"Analyzing colors and patterns...",
	"Generating charts...",
	"Populating fields...",
	"Processing retailers data...",
	"Preparing brand information...",
	"Almost there...",
	"Creating beautiful visualizations..."
]

export default function PopupShop360({
	icon: Icon,
	text,
	className
}: PopupShop360Props) {

	const router = useRouter()
	const [isGenerating, setIsGenerating] = useState(false)

	const handleSuccess = async (data: any) => {
		
		let report: any = null
		
		try {
			console.log('Form data received:', data);
			console.log('Project goal from form:', data.projectGoal);
			
			// get project and category IDs
			const { projectId, categoryId } = await getProjectAndCategoryIds({
				selectedProject: data.selectedProject,
				newProjectName: data.newProjectName,
				projectGoal: data.projectGoal,
				category: data.category
			})

			// selected fields
			let selectedCategory = [data.category || '']
			
			if (selectedCategory.includes('Footwear')) {
				selectedCategory = ['running shoes', 'heels', 'sandals', 'loafers', 'sneakers', 'shoes', 'flats', 'slippers', 'boots', 'clogs', 'oxfords']
			}
			
			const selectedRetailers = data.retailers ? Object.keys(data.retailers).filter(key => data.retailers[key] === true).map(retailer => retailer) : []
			
			const selectedBrands = data.brands ? Object.keys(data.brands).filter(key => data.brands[key] === true).map(brand => brand) : []
			
			// transform gender values: convert to lowercase and remove 's or 's at the end
			const transformGender = (gender: string): string => {
				const lowercased = gender.toLowerCase()

				if (lowercased === "kids") {
					return "kids"
				}
				
				if (lowercased.endsWith("'s")) {
					return lowercased.slice(0, -2)
				} else if (lowercased.endsWith("s")) {
					return lowercased.slice(0, -1)
				}

				return lowercased
			}

			const selectedGenders = Array.isArray(data.genders)  ? data.genders.map(transformGender)  : (data.genders ? [transformGender(data.genders)] : [])
			
			// format dates to remove the milliseconds and Z timezone indicator
			const formatISODate = (date: Date | string): string => {
				const isoString = date instanceof Date ? date.toISOString() : new Date(date).toISOString()
				return isoString.substring(0, 19)
			}

			const selectedStartDate = formatISODate(data.timePeriodStart)
			const selectedEndDate = formatISODate(data.timePeriodEnd)

			// transform form data to match API format
			const reportData: CreateReportData = {
				name: data.reportName,
				product_type: 'shop360',
				category_id: categoryId,
				status: false,
				goal: data.goal,
				project_id: projectId,
				product_settings: {
					retailers: selectedRetailers,
					brands: selectedBrands,
					genders: selectedGenders,
					type_store: [data.type],
					include_images: data.includeImages,
					start_date: selectedStartDate,
					end_date: selectedEndDate
				}
			}

			// step 1: create the report
			console.log('Creating report with data:', reportData)
			report = await createReport(reportData)
			console.log('Report created:', report)

			if (!report || !report.id) {
				throw new Error('Report creation failed or returned invalid data')
			}

			// step 2: verify report exists in database
			console.log(`Verifying report ${report.id} exists in database...`)
			
			const verifyReportResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${report.id}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
				}
			})

			if (!verifyReportResponse.ok) {
				const errorText = await verifyReportResponse.text()
				console.error('Report verification failed:', errorText)
				throw new Error(`Failed to verify report existence: ${verifyReportResponse.statusText}`)
			}

			const reportCharts = await verifyReportResponse.json()
			console.log('Report verification successful:', reportCharts)

			// debug time period data from form
			console.log('Raw form data:', data)
			
			// step 3: create multiple charts using the report ID
			console.log('Creating multiple charts for report ID:', report.id)
			
			// add a delay before creating charts to ensure DB consistency
			console.log('Waiting for database to synchronize before creating charts...')
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			// base data for all charts
			const baseChartData = {
				report_id: report.id,
				query: {
					category: selectedCategory,
					company: selectedRetailers,
					brand: selectedBrands,
					gender: selectedGenders,
					operator: {
						start_date: selectedStartDate,
						end_date: selectedEndDate
					}
				}
			}

			// 1. price point analysis
			const pricePointAnalysis = {
				...baseChartData,
				title: 'Price Point Analysis',
				description: 'Pricing Distribution ($5 increments)',
				preferences: {
					chart_type: 'price_point_analysis',
					box_size: 'full'
				},
				query: {
					...baseChartData.query,
					operator: {
						limit: 30,
						aggregate: 'distribution',
						operates_on: 'price',
						boundaries: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150]
					}
				}
			}

			// 2. price point by retailer
			const pricePointByRetailer = {
				...baseChartData,
				title: 'Price Point by Retailer',
				description: 'Pricing Distribution by Retailer',
				preferences: {
					chart_type: 'price_point_by_retailer',
					box_size: 'full'
				},
				query: {
					...baseChartData.query,
					operator: {
						...baseChartData.query.operator,
						limit: 10,
						aggregate: 'all',
						operates_on: 'company'
					}
				}
			}

			// 3. price distribution by brand
			const priceDistribution = {
				...baseChartData,
				title: 'Price Distribution by Brand',
				description: 'Average price distribution by brand',
				preferences: {
					chart_type: 'price_distribution_by_brand'
				},
				query: {
					...baseChartData.query,
					operator: {
						...baseChartData.query.operator,
						limit: 10,
						aggregate: 'average',
						operates_on: 'brand'
					}
				}
			}
			
			// 4. sku analysis
			const skuAnalysis = {
				...baseChartData,
				title: 'SKU Analysis',
				description: 'Number of SKUs associated with each retailer',
				preferences: {
					chart_type: 'sku_analysis' 
				},
				query: {
					...baseChartData.query,
					operator: {
						...baseChartData.query.operator,
						limit: 8,
						aggregate: 'count',
						operates_on: 'company'
					}
				}
			}

			// 5. color analysis
			const colorAnalysis = {
				...baseChartData,
				title: 'Color Analysis',
				description: 'Analysis of product colors distribution',
				preferences: {
					chart_type: 'colors',
					box_size: 'full'
				},
				query: {
					...baseChartData.query,
					operator: {
						...baseChartData.query.operator,
						limit: 20,
						aggregate: 'count',
						operates_on: 'color'
					}
				}
			}
			
			// array of charts
			const chartsToCreate = [
				{ name: 'Price Point Analysis', data: pricePointAnalysis },
				{ name: 'Price Point by Retailer', data: pricePointByRetailer },
				{ name: 'Price Distribution by Brand', data: priceDistribution },
				{ name: 'SKU Analysis', data: skuAnalysis },
				{ name: 'Color Analysis', data: colorAnalysis }
			]
			
			// Create all charts in parallel
			const chartPromises = chartsToCreate.map(chart => {
				console.log(`Creating ${chart.name} chart with data:`, JSON.stringify(chart.data, null, 2))
				
				return fetch('/api/proxy?endpoint=/api/charts', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
					},
					body: JSON.stringify(chart.data)
				})
				.then(async chartResponse => {
					console.log(`${chart.name} chart response status:`, chartResponse.status)
					const responseText = await chartResponse.text()
					
					if (!chartResponse.ok) {
						console.error(`Failed to create ${chart.name} chart:`, responseText)
						return { ok: false, name: chart.name }
					}
					
					const chartData = responseText ? JSON.parse(responseText) : {}
					console.log(`Created ${chart.name} chart:`, chartData)
					
					return { 
						ok: true, 
						data: chartData, 
						name: chart.name,
						hasData: chartData && chartData.results && chartData.results.length > 0
					}
				})
				.catch(error => {
					console.error(`Error creating ${chart.name} chart:`, error)
					return { ok: false, name: chart.name }
				})
			})

			// Wait for all chart creations to complete
			const results = await Promise.all(chartPromises)

			// Process results
			const chartResults = results.filter(r => r.ok).map(r => r.data)
			const atleastOneChartHasData = results.some(r => r.hasData)
			
			if (!atleastOneChartHasData) {
				console.log('⚠️ All charts have empty results. Deleting report and notifying user.')
				
				// Delete the report that was just created
				try {
					console.log(`Deleting report with ID: ${report.id} because all charts have empty results`)
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
					
					if (deleteResponse.ok) {
						console.log('Report deleted successfully due to empty chart results')
					} else {
						console.error('Failed to delete report:', await deleteResponse.text())
					}
					
					// Notify user with alert (temporary solution)
					alert('No data found for the selected criteria. Please try different filters or time period.')
					
					// Dispatch form error event
					document.dispatchEvent(new Event('formError'))
					
					return // Don't redirect
				} catch (deleteError) {
					console.error('Error deleting report with empty charts:', deleteError)
				}
			} else {
				// only redirect if at least one chart has data
				console.log('Report and charts creation process completed. At least one chart has data. Redirecting to report page...')
				document.dispatchEvent(new Event('formSent'))
				router.push(`/dashboard/my-reports/${projectId}/${report.id}`)
			}
		} catch (error) {
			console.error('Error during report/chart creation process:', error)
			document.dispatchEvent(new Event('formError'))
			
			// If we created a report but chart creation failed, log the report ID for reference
			if (report && report.id) {
				console.warn(`Report was created (ID: ${report.id}) but chart creation failed. Operation aborted.`)
				// We could add code here to delete the orphaned report if needed
			}
			
			// Always throw the error - never redirect on failure
			throw error // Will be handled by handleError
		}
	}

	const handleError = (error: any) => {
		console.error('Form submission error:', error)
		// You might want to show this error to the user in the UI
		// For example, using a toast notification or error message component
        document.dispatchEvent(new Event('formError'))
	}

	// This function will be called when the Generate Goal button is clicked
	const generateGoal = () => {
		try {
			setIsGenerating(true)
			
			// Create a custom event to request the form data
			const event = new CustomEvent('requestFormDataForGoal', {
				detail: { productType: 'shop360' }
			})
			document.dispatchEvent(event)
			
			// Set a timeout to reset the generating state if no response comes back
			setTimeout(() => {
				setIsGenerating(false)
			}, 2000)
		} catch (error) {
			console.error('Error generating goal:', error)
			setIsGenerating(false)
		}
	}
	
	// Listen for the form data event and handle generating the goal
	useEffect(() => {
		const handleFormData = (e: any) => {
			// Make sure this event is for us
			if (e.detail.productType !== 'shop360') return
			
			try {
				const {
					category = 'Unknown Category',
					retailers = {},
					brands = {},
					genders = [],
					timePeriodStart,
					timePeriodEnd,
					setGoalValue
				} = e.detail
				
				// Create a helper function to generate the goal text
				const generateGoalText = (
					category: string, 
					retailers: string[], 
					brands: string[], 
					genders: string[],
					timePeriodStart: any,
					timePeriodEnd: any
				) => {
					// Generate goal text
					let goalText = `Analyze ${category} data`
					
					// Add retailers if available
					if (retailers.length > 0) {
						goalText += ` from ${retailers.length > 1 ? 'the following retailers:' : 'the following retailer:'} ${retailers.join(', ')}`
					}
					
					// Add brands if available
					if (brands.length > 0) {
						goalText += ` for ${brands.length > 1 ? 'the following brands:' : 'the following brand:'} ${brands.join(', ')}`
					}
					
					// Add gender if available
					if (genders.length > 0) {
						goalText += ` targeting ${genders.join(' and ')} demographics`
					}
					
					// Format time period
					let timePeriod = "recent time period"
					
					if (timePeriodStart && timePeriodEnd) {
						const startDate = new Date(timePeriodStart)
						const endDate = new Date(timePeriodEnd)
						
						timePeriod = `period from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`
					}
					
					// Add time period
					goalText += ` during the ${timePeriod}.`
					
					// Add action statement
					goalText += ` Identify key trends, competitive insights, and strategic opportunities to optimize product positioning and marketing strategies.`
					
					return goalText
				}
				
				// Generate goal text
				let goalText = generateGoalText(
					category,
					Object.entries(retailers || {})
						.filter(([_, selected]) => selected)
						.map(([name, _]) => name),
					Object.entries(brands || {})
						.filter(([_, selected]) => selected)
						.map(([name, _]) => name),
					genders,
					timePeriodStart,
					timePeriodEnd
				)
				
				// Set the goal value using the provided function
				if (typeof setGoalValue === 'function') {
					setGoalValue(goalText)
					console.log('Generated goal:', goalText)
				} else {
					console.error('setGoalValue is not a function', setGoalValue)
				}
			} catch (error) {
				console.error('Error processing form data for goal:', error)
			} finally {
				setIsGenerating(false)
			}
		}
		
		// Listen for incomplete form data events
		const handleIncompleteData = (e: any) => {
			console.log('Incomplete form data:', e.detail)
			setIsGenerating(false)
		}
		
		document.addEventListener('formDataForGoal', handleFormData)
		document.addEventListener('formDataForGoalIncomplete', handleIncompleteData)
		
		return () => {
			document.removeEventListener('formDataForGoal', handleFormData)
			document.removeEventListener('formDataForGoalIncomplete', handleIncompleteData)
		}
	}, [])

	return (
		<>
			<PopupForm
				icon={Icon}
				text={text}
				onSuccess={handleSuccess}
				onError={handleError}
				className={className}
				loadingMessages={loadingMessages}
			>

				<InputHidden
					name='productType'
					value='shop360'
				/>

				<ProjectName />

				<ReportName />

				<TimePeriod />

				<Category />

				<Retailers />

				<Brands />

				<Genders />

				<Type />

				<IncludeImages />

				<div className='relative'>

					<Goal />

					<button
						type='button'
						className={clsx(styles.ai, 'button button--gradient-purple')}
						onClick={generateGoal}
						disabled={isGenerating}
					>
						{isGenerating ? (
							<Loading
								simple
								noContainer
								className={styles.loading}
								text='Generating...'
							/>
						) : (
							<>
								<Sparkles /> Generate Goal
							</>
						)}
					</button>

				</div>

			</PopupForm>
		</>
	)
}