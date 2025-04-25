'use client'

// libraries
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

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
			const selectedCategory = [data.category || '']
			const selectedRetailers = data.retailers ? Object.keys(data.retailers).filter(key => data.retailers[key] === true) : []
			const selectedBrands = data.brands ? Object.keys(data.brands).filter(key => data.brands[key] === true) : []
			const selectedGenders = Array.isArray(data.genders) ? data.genders : (data.genders ? [data.genders] : [])
			const selectedStartDate = data.timePeriodStart instanceof Date ? data.timePeriodStart.toISOString() : new Date(data.timePeriodStart).toISOString()
			const selectedEndDate = data.timePeriodEnd instanceof Date ? data.timePeriodEnd.toISOString() : new Date(data.timePeriodEnd).toISOString()

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

			// Step 1: Create the report
			console.log('Creating report with data:', reportData)
			report = await createReport(reportData)
			console.log('Report created:', report)

			if (!report || !report.id) {
				throw new Error('Report creation failed or returned invalid data')
			}

			// Step 2: Verify report exists in database
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

			// Debug time period data from form
			console.log('Raw form data:', data)

			// Format dates correctly from the form data
			let startDate = "2022-01-01"
			let endDate = "2025-01-01"
			
			// TimePeriod component uses timePeriodStart and timePeriodEnd fields
			// Check for these fields directly in the form data
			if (data.timePeriodStart) {
				if (data.timePeriodStart instanceof Date) {
					startDate = data.timePeriodStart.toISOString().split('T')[0]
				} else if (typeof data.timePeriodStart === 'string') {
					startDate = data.timePeriodStart
				}
			}
			
			if (data.timePeriodEnd) {
				if (data.timePeriodEnd instanceof Date) {
					endDate = data.timePeriodEnd.toISOString().split('T')[0]
				} else if (typeof data.timePeriodEnd === 'string') {
					endDate = data.timePeriodEnd
				}
			}
			
			// Step 3: Create multiple charts using the report ID
			console.log('Creating multiple charts for report ID:', report.id)
			
			// Add a delay before creating charts to ensure DB consistency
			console.log('Waiting for database to synchronize before creating charts...')
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			// base data for all charts
			const baseChartData = {
				report_id: report.id
			}

			/*
			// 1. price point analysis
			const pricePointAnalysisChart = {
				...baseChartData,
				title: 'Price Point Analysis',
				description: 'Pricing Distribution',
				preferences: {
					chart_type: 'price_point_analysis',
					box_size: 'full'
				},
				query: {
					product_name: '',
					brands: null,
					color: null,
					sex: null,
					companies: selectedRetailers,
					month: null,
					year: null,
					price: null,
					limit: 20,
					aggregate: 'distribution',
					operate_on: 'product_name',
					boundaries: [0, 5, 10, 15, 20, 25, 30, 35]
				}
			}

			// 2. price point by retailer
			const pricePointByRetailerChart = {
				...baseChartData,
				title: 'Price Point by Retailer',
				description: 'Pricing Distribution by Retailer',
				preferences: {
					chart_type: 'vertical_grouped',
					box_size: 'full'
				},
				query: {
					product_name: '',
					brands: '',
					color: null,
					sex: null,
					companies: null,
					month: null,
					year: null,
					price: null,
					limit: 20,
					aggregate: 'all',
					operate_on: 'company'
				}
			}
			*/

			// 3. price distribution by brand
			const priceDistributionChart = {
				...baseChartData,
				title: 'Price Distribution by Brand',
				description: 'Average price distribution by brand',
				preferences: {
					chart_type: 'price_distribution'
				},
				query: {
					product_name: '',
					brands: null,
					color: null,
					sex: null,
					companies: null,
					month: null,
					year: null,
					price: null,
					limit: 10,
					aggregate: 'average',
					operate_on: 'brand'
				}
			}
			
			// 4. sku analysis
			const skuAnalysisChart = {
				...baseChartData,
				title: 'SKU Analysis',
				description: 'Number of SKUs associated with each retailer',
				preferences: {
					chart_type: 'sku_analysis' 
				},
				query: {
					product_name: '',
					brands: '',
					color: null,
					sex: null,
					companies: null,
					month: null,
					year: null,
					price: null,
					limit: 8,
					aggregate: 'count',
					operate_on: 'company'
				}
			}

			// 5. color analysis
			const colorAnalysisChart = {
				...baseChartData,
				title: 'Color Analysis',
				description: 'Analysis of product colors distribution',
				preferences: {
					chart_type: 'colors',
					box_size: 'full'
				},
				query: {
					brands: selectedBrands,
					color: null,
					sex: null,
					companies: selectedRetailers,
					limit: 20,
					aggregate: 'count',
					operate_on: 'color'
				}
			}

			// 6. test chart
			const testChart = {
				...baseChartData,
				title: 'sample chart',
				description: 'this chart is coming from the DB',
				preferences: {
					chart_type: 'vertical',
				},
				query: {
					categories: selectedCategory,
					companies: selectedRetailers,
					brands: selectedBrands,
					sex: selectedGenders,
					range: {
						start_date: startDate,
						end_date: endDate
					},
					limit: 10
				}
			}
			
			// array of charts
			const chartsToCreate = [
				//{ name: 'Price Point Analysis', data: pricePointAnalysisChart },
				//{ name: 'Price Point by Retailer', data: pricePointByRetailerChart },
				{ name: 'Price Distribution by Brand', data: priceDistributionChart },
				{ name: 'SKU Analysis', data: skuAnalysisChart },
				{ name: 'Color Analysis', data: colorAnalysisChart },
				{ name: 'Test Chart', data: testChart }
			]
			
			// Create each chart sequentially
			for (const chart of chartsToCreate) {
				try {
					console.log(`Creating ${chart.name} chart with data:`, JSON.stringify(chart.data, null, 2))
					
					const chartResponse = await fetch('/api/proxy?endpoint=/api/charts', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
						},
						body: JSON.stringify(chart.data)
					})
					
					console.log(`${chart.name} chart response status:`, chartResponse.status)
					const responseText = await chartResponse.text()
					
					if (!chartResponse.ok) {
						console.error(`Failed to create ${chart.name} chart:`, responseText)
						console.warn(`Continuing with other charts despite ${chart.name} chart creation failure`)
					} else {
						const chartData = responseText ? JSON.parse(responseText) : {}
						console.log(`Created ${chart.name} chart:`, chartData)
					}
					
					// Add a small delay between chart creations
					await new Promise(resolve => setTimeout(resolve, 500))
				} catch (error) {
					console.error(`Error creating ${chart.name} chart:`, error)
					console.warn(`Continuing with other charts despite ${chart.name} chart creation failure`)
				}
			}
			
			// Only redirect after attempting to create all charts
			console.log('Report and charts creation process completed. Redirecting to report page...')
            document.dispatchEvent(new Event('formSent'))
			router.push(`/dashboard/my-reports/${projectId}/${report.id}`)
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

				<Category />

				<Retailers />

				<Brands />

				<Genders />

				<Type />

				<IncludeImages />

				<TimePeriod />

				<div className={styles.goal}>

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