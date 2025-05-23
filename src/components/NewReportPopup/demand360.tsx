'use client'

// libraries
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

// components
import PopupForm from './form'
import ProjectName from './fields/ProjectName'
import ReportName from './fields/ReportName'
import Category from './fields/Category'
import Location from './fields/Location'
import Goal from './fields/Goal'
import TimePeriod from './fields/TimePeriod'
import Loading from '@/components/Loading'
import InputHidden from '@/components/Form/InputHidden'

// img / svg
import { Sparkles } from 'lucide-react'

// utils
import { createReport, CreateReportData, getProjectAndCategoryIds } from '@/utils/reports'
import { useChartSuggestion } from '@/utils/hooks'
import loadingMessages from '@/utils/loadingMessages'

// css
import styles from './index.module.scss'

// region data
import { canadaProvinces } from '@/db/canada' 
import { usaStates } from '@/db/usa'
import { europeanCountries } from '@/db/europe'
import { ukRegions } from '@/db/uk'

interface PopupDemand360Props {
	icon: React.ComponentType<any>
	text: string
	className?: string
}

// Chart definitions for creating charts after report creation
const getChartDefinitions = (baseChartData: any) => [
	{ 
		name: 'Category Trend', 
		data: {
			...baseChartData,
			title: 'Category Trend',
			description: 'Category trend analysis',
			preferences: {
				chart_type: 'vertical',
				box_size: 'full'
			},
			query: {
				...baseChartData.query,
				operator: {
					...baseChartData.query.operator,
					limit: 10,
					aggregate: 'all',
					operates_on: 'time'
				}
			}
		} 
	},
	/*
	{ 
		name: 'Price Distribution by Brand', 
		data: {
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
	},
	{ 
		name: 'SKU Analysis', 
		data: {
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
	},
	{ 
		name: 'Color Analysis', 
		data: {
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
	}
	*/
]

// Helper function to extract selected items from form checkbox state
const extractSelectedItems = (items: Record<string, boolean> = {}) => 
	Object.entries(items)
		.filter(([_, selected]) => selected)
		.map(([name, _]) => name)

// Helper function to format dates for API
const formatISODate = (date: Date | string): string => {
	const isoString = date instanceof Date ? date.toISOString() : new Date(date).toISOString()
	return isoString.substring(0, 19)
}

// Format date for display
const formatDisplayDate = (date: string) => {
	if (!date) return ''
	const d = new Date(date)
	return d.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'short', 
		day: 'numeric' 
	})
}

export default function PopupDemand360({
	icon: Icon,
	text,
	className
}: PopupDemand360Props) {

	const router = useRouter()
	const [isGenerating, setIsGenerating] = useState(false)

	const { getSuggestions, loading, error } = useChartSuggestion()
	
	// Track the current suggestion index for rotation
	const [suggestionIndex, setSuggestionIndex] = useState(0)
	
	// Track the last form data to detect changes
	const [lastFormData, setLastFormData] = useState<any>(null)

	const handleSuccess = async (data: any) => {
		
		let report: any = null
		
		try {
			console.log('Form data received:', data)
			console.log('Project goal from form:', data.projectGoal)
			
			// get project and category IDs
			const { projectId, categoryId } = await getProjectAndCategoryIds({
				selectedProject: data.selectedProject,
				newProjectName: data.newProjectName,
				projectGoal: data.projectGoal,
				category: data.category
			})

			// Process selected fields
			let selectedCategory = [data.category || '']
			
			// Special case for footwear category
			if (selectedCategory.includes('Footwear')) {
				selectedCategory = ['running shoes', 'heels', 'sandals', 'loafers', 'sneakers', 'shoes', 'flats', 'slippers', 'boots', 'clogs', 'oxfords']
			}

			// Format dates for API
			const selectedStartDate = formatISODate(data.timePeriodStart)
			const selectedEndDate = formatISODate(data.timePeriodEnd)

			const selectedRegions = Object.entries(data.regions || {})
				.filter(([_, selected]) => selected === true)
				.map(([name, _]) => {
					// get all regions from all location sources
					const allRegions = [
						...canadaProvinces,
						...usaStates,
						...europeanCountries,
						...ukRegions
					]

					// find the region object by name and return its label
					const region = allRegions.find(r => r.name === name)
					return region ? region.label : name
			})

			// Prepare report data for API
			const reportData: CreateReportData = {
				name: data.reportName,
				product_type: 'demand360',
				category_id: categoryId,
				status: false,
				goal: data.goal,
				project_id: projectId,
				product_settings: {
					start_date: selectedStartDate,
					end_date: selectedEndDate,
					//location: data.location,
					location: 'US',
					//regions: selectedRegions
					category: ['']
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
				headers: { 'Accept': 'application/json' }
			})

			if (!verifyReportResponse.ok) {
				const errorText = await verifyReportResponse.text()
				console.error('Report verification failed:', errorText)
				throw new Error(`Failed to verify report existence: ${verifyReportResponse.statusText}`)
			}

			const reportCharts = await verifyReportResponse.json()
			console.log('Report verification successful:', reportCharts)
			
			// Step 3: Create charts for the report
			console.log('Creating charts for report ID:', report.id)
			
			// Add a delay to ensure DB consistency
			await new Promise(resolve => setTimeout(resolve, 1000))

			// Base data for all charts
			const baseChartData = {
				report_id: report.id,
				query: {
					category: selectedCategory,
					location: data.location,
					regions: selectedRegions,
					operator: {
						start_date: selectedStartDate,
						end_date: selectedEndDate
					}
				}
			}

			// Define all charts to create
			const chartsToCreate = getChartDefinitions(baseChartData)
			
			// Create all charts in parallel
			const chartPromises = chartsToCreate.map(chart => {
				console.log(`Creating ${chart.name} chart...`)
				
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
			const chartResults = results
				.filter(r => r.ok && 'data' in r)
				.map(r => (r as { data: any }).data)
				
			const atleastOneChartHasData = results.some(r => 'hasData' in r && r.hasData)
			
			if (!atleastOneChartHasData) {
				console.log('⚠️ All charts have empty results. Deleting report.')
				
				// Delete the report that was just created
				try {
					console.log(`Deleting report ${report.id} due to empty chart results`)
					const deleteResponse = await fetch(`/api/delete-report`, {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ reportId: report.id })
					})
					
					if (deleteResponse.ok) {
						console.log('Report deleted successfully')
					} else {
						console.error('Failed to delete report:', await deleteResponse.text())
					}
					
					// Notify user
					alert('No data found for the selected criteria. Please try different filters or time period.')
					document.dispatchEvent(new Event('formError'))
					return // Don't redirect
				} catch (deleteError) {
					console.error('Error deleting report with empty charts:', deleteError)
				}
			} else {
				// Success - redirect to the report page
				console.log('Report and charts creation completed successfully')
				document.dispatchEvent(new Event('formSent'))
				router.push(`/dashboard/my-reports/${projectId}/${report.id}`)
			}
		} catch (error) {
			console.error('Error during report/chart creation process:', error)
			document.dispatchEvent(new Event('formError'))
			
			// Log orphaned report
			if (report && report.id) {
				console.warn(`Report was created (ID: ${report.id}) but chart creation failed`)
			}
			
			throw error
		}
	}

	const handleError = (error: any) => {
		console.error('Form submission error:', error)
        document.dispatchEvent(new Event('formError'))
	}

	// Create a fallback goal text based on form data
	const createFallbackGoalText = useCallback((
		category: string | undefined, 
		location: string | undefined, 
		regions: string[],
		startDate: string | undefined, 
		endDate: string | undefined
	): string => {
		const timeRangeText = startDate && endDate 
			? `during ${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}`
			: 'during the selected time period'
			
		return `Analyze ${category} data from ${regions.join(', ')} ${timeRangeText}. Identify key trends, competitive insights, and strategic opportunities.`
	}, [])

	// handle form data for goal generation
	useEffect(() => {
		const handleFormData = async (e: any) => {
			// Verify this event is for our component
			if (e.detail.productType !== 'demand360') return
			
			try {
				const {
					category,
					location,
					regions = [],
					timePeriodStart,
					timePeriodEnd,
					setGoalValue,
					goal
				} = e.detail
				
				// Extract selected values
				const selectedRegions = extractSelectedItems(regions)
				
				// Create form data summary for change detection
				const currentFormData = {
					category,
					location,
					regions: selectedRegions.join(','),
					timePeriod: `${timePeriodStart}-${timePeriodEnd}`,
					goal: goal || ''
				}
				
				// Check if form data has changed
				const formDataChanged = !lastFormData || JSON.stringify(currentFormData) !== JSON.stringify(lastFormData)
				
				// Reset or increment suggestion index
				if (formDataChanged) {
					setSuggestionIndex(0)
					setLastFormData(currentFormData)
				} else {
					setSuggestionIndex(prevIndex => (prevIndex + 1))
				}

				// Create dynamic fallback goal text based on current form data
				const fallbackGoalText = createFallbackGoalText(
					category,
					location,
					selectedRegions,
					timePeriodStart,
					timePeriodEnd
				)
				
				// Use direct DOM access as a last resort to get the goal value
				let finalGoalValue = goal

				if (!finalGoalValue) {
					const goalTextarea = document.getElementById('report-goal') as HTMLTextAreaElement
					if (goalTextarea && goalTextarea.value) {
						finalGoalValue = goalTextarea.value
					} else {
						finalGoalValue = fallbackGoalText
					}
				}
				
				// Prepare request for suggestion API
				const requestParams = {
					product_name: 'Demand360',
					category: [category || ''],
					location: [location || ''],
					regions: selectedRegions.join(','),
					comment: finalGoalValue
				}
				
				console.log('Sending to suggestion API:', requestParams)

				// Call the suggestion API
				await getSuggestions(requestParams, (data) => {
					//console.log('API response:', data)
					
					if (data && data.goal_suggestion && Array.isArray(data.goal_suggestion) && data.goal_suggestion.length > 0) {
						// Select suggestion based on current index
						const currentIndex = suggestionIndex % data.goal_suggestion.length
						const selectedSuggestion = data.goal_suggestion[currentIndex]
						
						setGoalValue(selectedSuggestion)
						//console.log(`Using suggestion ${currentIndex + 1}/${data.goal_suggestion.length}:`, selectedSuggestion)
					} else {
						// Fall back to the basic goal text
						setGoalValue(fallbackGoalText)
						console.log('No suggestions received, using fallback:', fallbackGoalText)
					}
				})
			} catch (error) {
				console.error('Error processing form data for goal:', error)
			} finally {
				setIsGenerating(false)
			}
		}
		
		// Handle incomplete form data
		const handleIncompleteData = (e: any) => {
			console.log('Incomplete form data:', e.detail)
			setIsGenerating(false)
		}
		
		// Set up event listeners
		document.addEventListener('formDataForGoal', handleFormData)
		document.addEventListener('formDataForGoalIncomplete', handleIncompleteData)
		
		// Clean up event listeners
		return () => {
			document.removeEventListener('formDataForGoal', handleFormData)
			document.removeEventListener('formDataForGoalIncomplete', handleIncompleteData)
		}
	}, [getSuggestions, suggestionIndex, lastFormData, createFallbackGoalText])

	// Generate a goal statement using the AI suggestion API
	const generateGoal = () => {
		try {
			setIsGenerating(true)
			
			// Request form data through custom event
			console.log('DEBUG demand360.tsx - Dispatching requestFormDataForGoal event')
			const event = new CustomEvent('requestFormDataForGoal', {
				detail: { 
					productType: 'demand360',
					// Include that we need the current goal value
					includeCurrentGoal: true
				}
			})
			document.dispatchEvent(event)
		} catch (error) {
			console.error('Error triggering goal generation:', error)
			setIsGenerating(false)
		}
	}

	return (
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
				value='demand360'
			/>
			
			<ProjectName />

			<ReportName />

			<Category />

			<TimePeriod />

			<Location />

			<div className='relative'>

				<Goal />

				<button
					type='button'
					className={clsx(styles.ai, 'button button--gradient-purple')}
					onClick={generateGoal}
					disabled={isGenerating || loading}
				>
					{isGenerating || loading ? (
						<Loading
							simple
							noContainer
							className={styles.loading}
							text='Generating...'
						/>
					) : (
						<>
							<Sparkles /> Improve Goal
						</>
					)}
				</button>
				
			</div>
			
		</PopupForm>
	)
}