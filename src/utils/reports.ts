import { useState, useEffect, useCallback } from 'react'
import { useChartSuggestion } from '@/utils/hooks'

// region data imports
import { usaStates } from '@/db/usa'
import { ukRegions } from '@/db/uk'
import { europeanCountries } from '@/db/europe'
import { canadaProvinces } from '@/db/canada'

export interface CreateReportData {
	name: string
	product_type: 'shop360' | 'demand360' | 'insight360' | 'feedback360'
	category_id: string
	status: boolean
	goal: string
	project_id: string

	product_settings: {

		// shop360 specific fields
		retailers?: string[]
		brands?: string[]
		genders?: string[]
		type_store?: string[]
		include_images?: boolean
		start_date?: Date | string
		end_date?: Date | string

		// demand360 specific fields
		location?: string
		regions?: string[]
		category?: string[]
		sub_category?: string[]

		// insight360 specific fields
		question?: string

		// feedback360 specific fields
		audience_size?: number
		age?: number
		questions?: string[]
		min_price?: number
		max_price?: number
	}
}

interface ProjectAndCategoryIds {
	projectId: string
	categoryId: string
}

// ===============================
// SHARED UTILITY FUNCTIONS
// ===============================

// Helper function to get all regions for a given location
export const getAllRegionsForLocation = (location: string): string[] => {
	switch (location) {
		case 'US':
			return usaStates.map(state => state.name)
		case 'CA':
			return canadaProvinces.map(province => province.name)
		case 'EU':
			return europeanCountries.map(country => country.name)
		case 'GB':
			return ukRegions.map(region => region.name)
		default:
			return []
	}
}

// Format date for display
export const formatDisplayDate = (date: string) => {
	if (!date) return ''
	const d = new Date(date)
	return d.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'short', 
		day: 'numeric' 
	})
}

// Helper function to extract selected items from form checkbox state
export const extractSelectedItems = (items: Record<string, boolean> = {}) => 
	Object.entries(items)
		.filter(([_, selected]) => selected)
		.map(([name, _]) => name)

// Helper function to transform gender values
export const transformGender = (gender: string): string => {
	const lowercased = gender.toLowerCase()

	if (lowercased === 'kids') {
		return 'kids'
	}
	
	if (lowercased.endsWith("'s")) {
		return lowercased.slice(0, -2)
	} else if (lowercased.endsWith('s')) {
		return lowercased.slice(0, -1)
	}

	return lowercased
}

// Helper function to format dates for API
export const formatISODate = (date: Date | string): string => {
	const isoString = date instanceof Date ? date.toISOString() : new Date(date).toISOString()
	return isoString.substring(0, 19)
}

// Utility functions for creating time range text
export const createTimeRangeText = (startDate?: string, endDate?: string) => {
	return startDate && endDate 
		? `from ${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}`
		: 'during the selected time period'
}

export const createDuringTimeRangeText = (startDate?: string, endDate?: string) => {
	return startDate && endDate 
		? `during ${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}`
		: 'during the selected time period'
}

// ===============================
// GOAL TEXTS
// ===============================

// Create goal text for shop360
export const generateShop360Goal = (formData: {
	category?: string
	retailers?: string[]
	brands?: string[]
	genders?: string[]
	timePeriodStart?: string
	timePeriodEnd?: string
}): string => {
	return ''
}

// Create goal text for demand360
export const generateDemand360Goal = (formData: {
	category?: string
	location?: string
	timePeriodStart?: string
	timePeriodEnd?: string
}): string => {
	return ''
}

// ===============================
// GOAL GENERATION FUNCTIONALITY
// ===============================

interface GoalGenerationConfig<T = any> {
	productType: string
	productName: string
	createFallbackText: (formData: T) => string
	createRequestParams: (formData: T, goalValue: string) => any
	extractFormData: (eventDetail: any) => T
}

export function useGoalGeneration<T = any>(config: GoalGenerationConfig<T>) {
	const { getSuggestions, loading, error } = useChartSuggestion()
	const [isGenerating, setIsGenerating] = useState(false)
	const [suggestionIndex, setSuggestionIndex] = useState(0)
	const [lastFormData, setLastFormData] = useState<any>(null)

	// Handle form data for goal generation
	useEffect(() => {
		const handleFormData = async (e: any) => {
			// Verify this event is for our component
			if (e.detail.productType !== config.productType) return

			console.log(e.detail)
			
			try {
				const { setGoalValue, goal, timePeriodStart, timePeriodEnd, ...otherData } = e.detail
				
				// Extract form data using the provided extractor
				const formData = config.extractFormData({ ...otherData, timePeriodStart, timePeriodEnd })
				
				// Create form data summary for change detection
				const currentFormData = {
					...formData,
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
				const fallbackGoalText = config.createFallbackText({
					...formData,
					timePeriodStart,
					timePeriodEnd
				} as T)
				
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
				
				// Prepare request for suggestion API using the provided param creator
				const requestParams = config.createRequestParams(formData as T, finalGoalValue)
				
				// Call the suggestion API
				await getSuggestions(requestParams, (data) => {
					if (data && data.goal_suggestion) {
						let selectedSuggestion
						
						// Handle both string and array responses
						if (typeof data.goal_suggestion === 'string') {
							selectedSuggestion = data.goal_suggestion
						} else if (Array.isArray(data.goal_suggestion) && data.goal_suggestion.length > 0) {
							// Select suggestion based on current index for array responses
							const currentIndex = suggestionIndex % data.goal_suggestion.length
							selectedSuggestion = data.goal_suggestion[currentIndex]
						}
						
						if (selectedSuggestion) {
							//console.log('Setting goal value to:', selectedSuggestion)
							setGoalValue(selectedSuggestion)
						} else {
							//console.log('No valid suggestion found, using fallback')
							setGoalValue(fallbackGoalText)
						}
					} else {
						//console.log('No goal_suggestion in response, using fallback')
						setGoalValue(fallbackGoalText)
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
			//console.log('Incomplete form data:', e.detail)
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
	}, [getSuggestions, suggestionIndex, lastFormData, config])

	// Generate a goal statement using the AI suggestion API
	const generateGoal = useCallback(() => {
		try {
			setIsGenerating(true)

			const event = new CustomEvent('requestFormDataForGoal', {
				detail: { 
					productType: config.productType,
					includeCurrentGoal: true
				}
			})
			document.dispatchEvent(event)
		} catch (error) {
			console.error('Error triggering goal generation:', error)
			setIsGenerating(false)
		}
	}, [config.productType])

	return {
		generateGoal,
		isGenerating: isGenerating || loading,
		error
	}
}

// ===============================
// CHART CREATION UTILITIES
// ===============================

interface ChartCreationResult {
	ok: boolean
	name: string
	data?: any
	hasData?: boolean
	retryCount?: number
	isDuplicate?: boolean
}

// Detect Vercel environment and adjust timeouts accordingly
const getVercelTimeout = () => {
	const isDevelopment = process.env.NODE_ENV === 'development'
	const isVercel = process.env.VERCEL === '1'
	
	if (isDevelopment) {
		return 120000 // 2 minutes for local development
	}
	
	if (isVercel) {
		// Use aggressive timeouts for Vercel Pro plan
		// Pro plan supports up to 300s (5 minutes) without Fluid Compute
		// Pro plan supports up to 800s (13+ minutes) with Fluid Compute
		return 270000 // 4.5 minutes - safe buffer under 5 minute Pro limit
	}
	
	return 60000 // 1 minute for other environments
}

// Generate a unique chart request ID to prevent duplicates
const generateChartRequestId = (chartDefinition: any): string => {
	// Use chart name and type as the primary identifiers
	const reportId = chartDefinition.data.report_id
	const chartType = chartDefinition.data.preferences?.chart_type || 'unknown'
	const chartName = chartDefinition.name || chartDefinition.data.title || 'unnamed'
	
	// Create a hash of the chart name to ensure uniqueness while keeping it short
	const nameHash = btoa(chartName).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)
	const typeHash = btoa(chartType).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)
	
	// Combine with a random component for absolute uniqueness
	const random = Math.random().toString(36).substring(2, 8)
	
	return `${reportId}_${typeHash}_${nameHash}_${random}`
}

// Track active chart requests to prevent duplicates
const activeChartRequests = new Map<string, Promise<ChartCreationResult>>()

// Check if chart already exists to prevent duplicates
async function checkExistingChart(reportId: string, chartType: string, title: string): Promise<boolean> {
	try {
		const response = await fetch(`/api/proxy?endpoint=/api/charts/report/${reportId}`, {
			method: 'GET',
			headers: { 
				'Accept': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		})

		if (!response.ok) {
			console.warn('Could not check existing charts, proceeding with creation')
			return false
		}

		const existingCharts = await response.json()
		
		// Check if a chart with the same type and title already exists
		const duplicate = existingCharts.some((chart: any) => 
			chart.preferences?.chart_type === chartType && 
			chart.title === title
		)
		
		if (duplicate) {
			console.log(`Chart "${title}" of type "${chartType}" already exists for report ${reportId}`)
		}
		
		return duplicate
	} catch (error) {
		console.warn('Error checking existing charts:', error)
		return false // Proceed with creation if we can't check
	}
}

// Robust fetch with timeout and retry logic adapted for Vercel
async function fetchWithTimeoutAndRetry(
	url: string,
	options: RequestInit,
	timeoutMs: number = getVercelTimeout(),
	maxRetries: number = 10 // Increased default from 3 to 10
): Promise<Response> {
	let lastError: Error
	
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		let timeoutId: NodeJS.Timeout | undefined
		
		try {
			const controller = new AbortController()
			timeoutId = setTimeout(() => controller.abort(), timeoutMs)
			
			const response = await fetch(url, {
				...options,
				signal: controller.signal
			})
			
			clearTimeout(timeoutId)
			
			// Handle 504 Gateway Timeout specifically
			if (response.status === 504) {
				console.warn(`504 Gateway Timeout on attempt ${attempt + 1} for ${url}`)
				
				// For 504 errors, don't retry immediately as the original request might still be processing
				if (attempt < maxRetries) {
					// With Pro plan, we can afford longer backoff times
					const backoffTime = Math.pow(2, attempt + 3) * 1000 // 8s, 16s, 32s
					console.log(`Waiting ${backoffTime}ms before retry due to 504 error...`)
					await new Promise(resolve => setTimeout(resolve, backoffTime))
					continue
				}
			}
			
			// If response is ok or it's the last attempt, return it
			if (response.ok || attempt === maxRetries) {
				return response
			}
			
			// For other errors, retry with shorter backoff
			console.warn(`Attempt ${attempt + 1} failed with status ${response.status}, retrying...`)
			
		} catch (error) {
			if (timeoutId) clearTimeout(timeoutId)
			lastError = error as Error
			
			if (attempt === maxRetries) {
				throw lastError
			}
			
			// Handle abort errors (timeouts) with longer backoff
			if (error instanceof Error && error.name === 'AbortError') {
				console.warn(`Request timeout on attempt ${attempt + 1}, retrying...`)
				await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt + 2) * 2000)) // 8s, 16s
			} else {
				console.warn(`Attempt ${attempt + 1} failed with error: ${error}, retrying...`)
				await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt + 1) * 1000)) // 2s, 4s
			}
		}
	}
	
	throw lastError!
}

// Enhanced chart creation with duplicate prevention and better error handling
async function createChartWithRetry(
	chartDefinition: any,
	onProgress?: (chartName: string, status: 'creating' | 'success' | 'error' | 'retrying' | 'duplicate') => void,
	maxRetries: number = 10 // Increased default from 3 to 10
): Promise<ChartCreationResult> {
	
	console.log(`createChartWithRetry called for ${chartDefinition.name} with maxRetries: ${maxRetries}`)
	
	// Generate unique request ID for this chart
	const requestId = generateChartRequestId(chartDefinition)
	console.log(`Generated request ID for ${chartDefinition.name}: ${requestId}`)
	
	// Check if this chart is already being created
	if (activeChartRequests.has(requestId)) {
		console.log(`Chart ${chartDefinition.name} is already being processed, waiting for existing request...`)
		console.log(`Active requests:`, Array.from(activeChartRequests.keys()))
		onProgress?.(chartDefinition.name, 'duplicate')
		
		try {
			const existingResult = await activeChartRequests.get(requestId)!
			return { ...existingResult, isDuplicate: true }
		} catch (error) {
			console.warn(`Existing request failed, creating new one for ${chartDefinition.name}`)
		}
	}
	
	// Create the chart creation promise
	const chartPromise = createChartInternal(chartDefinition, onProgress, maxRetries)
	
	// Store the promise to prevent duplicates
	activeChartRequests.set(requestId, chartPromise)
	console.log(`Added ${chartDefinition.name} to active requests. Total active:`, activeChartRequests.size)
	
	try {
		const result = await chartPromise
		return result
	} finally {
		// Clean up the request tracking
		activeChartRequests.delete(requestId)
		console.log(`Removed ${chartDefinition.name} from active requests. Remaining:`, activeChartRequests.size)
	}
}

// Internal chart creation logic
async function createChartInternal(
	chartDefinition: any,
	onProgress?: (chartName: string, status: 'creating' | 'success' | 'error' | 'retrying') => void,
	maxRetries: number = 10 // Increased default from 3 to 10
): Promise<ChartCreationResult> {
	
	console.log(`createChartInternal called for ${chartDefinition.name} with maxRetries: ${maxRetries}`)
	
	// Check if chart already exists in database
	const reportId = chartDefinition.data.report_id
	const chartType = chartDefinition.data.preferences?.chart_type
	const title = chartDefinition.data.title
	
	if (reportId && chartType && title) {
		const exists = await checkExistingChart(reportId, chartType, title)
		if (exists) {
			console.log(`Skipping creation of ${chartDefinition.name} - already exists in database`)
			return {
				ok: true,
				name: chartDefinition.name,
				isDuplicate: true,
				hasData: true,
				retryCount: 0
			}
		}
	}
	
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			if (attempt > 0) {
				onProgress?.(chartDefinition.name, 'retrying')
				console.log(`Retrying ${chartDefinition.name} chart (attempt ${attempt + 1}/${maxRetries + 1})...`)
			} else {
				onProgress?.(chartDefinition.name, 'creating')
				console.log(`Creating ${chartDefinition.name} chart...`)
			}
			
			console.log('Chart data:', chartDefinition.data)
			
			const response = await fetchWithTimeoutAndRetry(
				'/api/proxy?endpoint=/api/charts',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
					},
					body: JSON.stringify(chartDefinition.data)
				},
				getVercelTimeout(),
				0 // No retries at fetch level - we handle retries at chart level
			)

			console.log(`${chartDefinition.name} chart response status:`, response.status)
			const responseText = await response.text()
			
			if (!response.ok) {
				console.error(`Failed to create ${chartDefinition.name} chart:`, responseText)
				
				// Special handling for 504 errors - don't retry as aggressively
				if (response.status === 504) {
					console.log(`504 error for ${chartDefinition.name}, skipping further retries to prevent duplicates`)
					onProgress?.(chartDefinition.name, 'error')
					return { 
						ok: false, 
						name: chartDefinition.name,
						retryCount: attempt
					}
				}
				
				// If this is the last attempt, return failure
				if (attempt === maxRetries) {
					onProgress?.(chartDefinition.name, 'error')
					return { 
						ok: false, 
						name: chartDefinition.name,
						retryCount: attempt
					}
				}
				
				// Continue to next attempt
				continue
			}
			
			const chartData = responseText ? JSON.parse(responseText) : {}
			onProgress?.(chartDefinition.name, 'success')
			
			return { 
				ok: true, 
				data: chartData, 
				name: chartDefinition.name,
				hasData: chartData && chartData.results && chartData.results.length > 0,
				retryCount: attempt
			}
			
		} catch (error) {
			console.error(`Error creating ${chartDefinition.name} chart (attempt ${attempt + 1}):`, error)
			
			// Special handling for timeout errors - don't retry as aggressively
			if (error instanceof Error && error.name === 'AbortError') {
				console.log(`Timeout error for ${chartDefinition.name}, may be processing in background`)
			}
			
			if (attempt === maxRetries) {
				onProgress?.(chartDefinition.name, 'error')
				return { 
					ok: false, 
					name: chartDefinition.name,
					retryCount: attempt
				}
			}
			
			// Wait before retry
			await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
		}
	}
	
	// This should never be reached, but just in case
	return { 
		ok: false, 
		name: chartDefinition.name,
		retryCount: maxRetries
	}
}

export async function createChartsWithStaggeredStart(
	chartDefinitions: any[],
	onProgress?: (chartName: string, status: 'creating' | 'success' | 'error' | 'retrying' | 'duplicate') => void,
	delayMs: number = 1000, // Reduced delay since we have Pro plan timeouts now
	maxRetries: number = 10 // Increased default from 3 to 10
): Promise<ChartCreationResult[]> {
	
	console.log(`createChartsWithStaggeredStart called with maxRetries: ${maxRetries}`)
	console.log(`Starting staggered creation of ${chartDefinitions.length} charts with ${delayMs}ms delay between each request...`)
	
	// Start all chart creation promises with staggered delays
	const chartPromises = chartDefinitions.map((chart, index) => {
		return new Promise<ChartCreationResult>(async (resolve) => {
			// Wait for the staggered delay before starting this chart
			if (index > 0) {
				const waitTime = index * delayMs
				console.log(`Chart ${chart.name} will start in ${waitTime}ms...`)
				await new Promise(delayResolve => setTimeout(delayResolve, waitTime))
			}
			
			console.log(`Starting chart ${index + 1}/${chartDefinitions.length}: ${chart.name}`)
			
			// Create the chart with configurable retry logic
			const result = await createChartWithRetry(chart, onProgress, maxRetries)
			resolve(result)
		})
	})

	// Wait for all charts to complete (they were started with staggered delays)
	const results = await Promise.all(chartPromises)
	
	const successful = results.filter(r => r.ok && r.hasData && !r.isDuplicate)
	const failed = results.filter(r => !r.ok)
	const duplicates = results.filter(r => r.isDuplicate)
	const totalRetries = results.reduce((sum, r) => sum + (r.retryCount || 0), 0)
	
	console.log(`Chart creation completed: ${successful.length} successful, ${failed.length} failed, ${duplicates.length} duplicates prevented, ${totalRetries} total retries (maxRetries: ${maxRetries})`)
	
	return results
}

// Keep the parallel version for background retries with duplicate prevention
export async function createChartsInParallel(
	chartDefinitions: any[],
	onProgress?: (chartName: string, status: 'creating' | 'success' | 'error' | 'retrying' | 'duplicate') => void,
	maxRetries: number = 10 // Increased default from 3 to 10
): Promise<ChartCreationResult[]> {
	
	//console.log(`Starting creation of ${chartDefinitions.length} charts with retry logic...`)
	
	// Create all charts in parallel with configurable retry logic
	const chartPromises = chartDefinitions.map(chart => 
		createChartWithRetry(chart, onProgress, maxRetries)
	)

	const results = await Promise.all(chartPromises)
	
	const successful = results.filter(r => r.ok && r.hasData && !r.isDuplicate)
	const failed = results.filter(r => !r.ok)
	const duplicates = results.filter(r => r.isDuplicate)
	const totalRetries = results.reduce((sum, r) => sum + (r.retryCount || 0), 0)
	
	console.log(`Chart creation completed: ${successful.length} successful, ${failed.length} failed, ${duplicates.length} duplicates prevented, ${totalRetries} total retries (maxRetries: ${maxRetries})`)
	
	return results
}

// Background retry function for failed charts with duplicate prevention
export async function retryFailedChartsInBackground(
	failedCharts: any[],
	onProgress?: (chartName: string, status: 'creating' | 'success' | 'error' | 'retrying' | 'duplicate') => void,
	maxRetries: number = 10 // Increased default from 3 to 10
): Promise<ChartCreationResult[]> {
	console.log(`Retrying ${failedCharts.length} failed charts in background...`)
	
	const retryPromises = failedCharts.map(chart => 
		createChartWithRetry(chart, onProgress, maxRetries)
	)
	
	return Promise.all(retryPromises)
}

// ===============================
// REPORT CREATION WORKFLOW
// ===============================

interface ReportCreationConfig {
	productType: string
	chartDefinitionsFactory: (baseChartData: any) => any[]
	formatFormData: (data: any) => CreateReportData | Promise<CreateReportData>
	createBaseChartData: (data: any, report: any) => any
	router: any
	onProgress?: (step: string, details?: any) => void
	maxRetries?: number // Allow configurable retry attempts
	customChartCreation?: (
		formData: any,
		report: any,
		chartDefinitions: any[],
		onProgress?: (chartName: string, status: 'creating' | 'success' | 'error' | 'retrying' | 'duplicate') => void
	) => Promise<ChartCreationResult[]>
}

export async function createReportWithCharts(
	formData: any,
	config: ReportCreationConfig
): Promise<void> {

	let report: any = null
	
	try {
		config.onProgress?.('formatting_data')
		
		// Step 1: Format and create the report
		const reportData = await config.formatFormData(formData)
		
		config.onProgress?.('creating_report')
		report = await createReport(reportData)
		
		if (!report || !report.id) {
			throw new Error('Report creation failed or returned invalid data')
		}

		// Step 2: Verify report exists in database
		config.onProgress?.('verifying_report', { reportId: report.id })
		//console.log(`Verifying report ${report.id} exists in database...`)
		
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
		//console.log('Report verification successful:', reportCharts)
		
		// Step 3: Create charts for the report
		config.onProgress?.('creating_charts')
		//console.log('Creating charts for report ID:', report.id)
		
		// Add a delay to ensure DB consistency
		await new Promise(resolve => setTimeout(resolve, 1000))

		// Create base chart data
		const baseChartData = config.createBaseChartData(formData, report)
		
		// Define all charts to create
		const chartsToCreate = config.chartDefinitionsFactory(baseChartData)
		
		// Use custom chart creation if provided, otherwise use staggered creation with configurable retries
		const maxRetries = config.maxRetries ?? 10 // Default to 10 retries if not specified
		const results = config.customChartCreation
			? await config.customChartCreation(
				formData,
				report,
				chartsToCreate,
				(chartName: string, status: 'creating' | 'success' | 'error' | 'retrying' | 'duplicate') => config.onProgress?.('chart_progress', { chartName, status })
			)
			: await createChartsWithStaggeredStart(
				chartsToCreate,
				(chartName: string, status: 'creating' | 'success' | 'error' | 'retrying' | 'duplicate') => config.onProgress?.('chart_progress', { chartName, status }),
				1000, // 1 second delay between chart starts (Pro plan)
				maxRetries // Use configurable retry count
			)
			
		const successfulCharts = results.filter(r => r.ok && r.hasData)
		const failedCharts = results.filter(r => !r.ok)
		
		console.log(`Chart creation summary: ${successfulCharts.length} successful, ${failedCharts.length} failed`)
		
		if (successfulCharts.length === 0) {
			config.onProgress?.('no_data_cleanup')
			console.log('⚠️ All charts failed to create or have empty results. Deleting report.')
			
			// Delete the report that was just created
			try {
				console.log(`Deleting report ${report.id} due to no successful charts`)
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
			// Success - at least one chart was created successfully
			config.onProgress?.('success', { reportId: report.id })
			//console.log('Report and charts creation completed successfully')
			document.dispatchEvent(new Event('formSent'))
			
			// Get project ID from the report data
			const projectId = reportData.project_id
			
			// Navigate to the report page first
			config.router.push(`/dashboard/my-reports/${projectId}/${report.id}`)
			
			// If there are failed charts, retry them in the background
			if (failedCharts.length > 0) {
				//console.log(`Starting background retry for ${failedCharts.length} failed charts...`)
				
				// Create chart definitions for failed charts
				const failedChartDefinitions = chartsToCreate.filter(chart => 
					failedCharts.some((failed: ChartCreationResult) => failed.name === chart.name)
				)
				
				// Start background retry - don't wait for it
				setTimeout(async () => {
					try {
						const backgroundResults = config.customChartCreation
							? await config.customChartCreation(
								formData,
								report,
								failedChartDefinitions,
								(chartName, status) => console.log(`Background retry: ${chartName} - ${status}`)
							)
							: await retryFailedChartsInBackground(
								failedChartDefinitions,
								(chartName, status) => console.log(`Background retry: ${chartName} - ${status}`),
								maxRetries // Use same retry count for background retries
							)
						
						const backgroundSuccessful = backgroundResults.filter(r => r.ok && r.hasData)
						//console.log(`Background retry completed: ${backgroundSuccessful.length}/${failedCharts.length} charts recovered`)
						
					} catch (error) {
						console.error('Background chart retry failed:', error)
					}
				}, 2000) // Start background retry after 2 seconds
			}
		}
	} catch (error) {
		config.onProgress?.('error', { error })
		console.error('Error during report/chart creation process:', error)
		document.dispatchEvent(new Event('formError'))
		
		// Log orphaned report
		if (report && report.id) {
			console.warn(`Report was created (ID: ${report.id}) but chart creation failed`)
		}
		
		throw error
	}
}

// ===============================
// EXISTING FUNCTIONALITY (UNCHANGED)
// ===============================

export async function getProjectAndCategoryIds(data: { selectedProject: string, newProjectName?: string, projectGoal?: string, category: string }): Promise<ProjectAndCategoryIds> {
	
	const token = localStorage.getItem('auth_token')
	
	if (!token) {
		throw new Error('Authentication required')
	}

	let projectId = ''
	let projectName = data.selectedProject

	// if creating a new project, create it first
	if (data.selectedProject === 'New Project') {
		const requestBody = {
			name: data.newProjectName,
			project_goal: data.projectGoal
		}

		//console.log('Creating new project with data:', requestBody)

		const newProjectResponse = await fetch('/api/proxy?endpoint=/api/projects', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(requestBody)
		})

		if (!newProjectResponse.ok) {
			// Get error details
			let errorDetails = 'Unknown error'

			try {
				const errorResponse = await newProjectResponse.json()
				errorDetails = JSON.stringify(errorResponse, null, 2)
			} catch (e) {
				errorDetails = await newProjectResponse.text()
			}
			
			console.error(`API Error (${newProjectResponse.status}): ${errorDetails}`)
			throw new Error('Failed to create new project')
		}

		const newProject = await newProjectResponse.json()

		//console.log('New project created with response:', newProject)

		projectId = newProject.id
		projectName = newProject.name
	} else {

		// get project ID from the selected project
		const projectsResponse = await fetch('/api/proxy?endpoint=/api/projects/me', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})

		if (!projectsResponse.ok) {
			throw new Error('Failed to fetch projects')
		}

		const projects = await projectsResponse.json()
		const selectedProject = projects.find((p: any) => p.name === projectName)

		if (!selectedProject) {
			throw new Error('Selected project not found')
		}

		projectId = selectedProject.id
	}

	// get category ID from the selected category
	const categoriesResponse = await fetch('/api/proxy?endpoint=/api/categories', {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})
	if (!categoriesResponse.ok) {
		throw new Error('Failed to fetch categories')
	}
	const categories = await categoriesResponse.json()
	const selectedCategory = categories.find((c: any) => c.name === data.category)
	if (!selectedCategory) {
		throw new Error('Selected category not found')
	}

	return {
		projectId,
		categoryId: selectedCategory.id
	}
}

export function validateReportData(data: CreateReportData): void {
	
	// validate required fields
	if (!data.name) {
		throw new Error('Report name is required')
	}
	if (!data.product_type) {
		throw new Error('Product type is required')
	}
	if (!data.category_id) {
		throw new Error('Category is required')
	}
	if (!data.project_id) {
		throw new Error('Project is required')
	}
	if (!data.goal) {
		throw new Error('Goal is required')
	}

	// validate product-specific fields
	switch (data.product_type) {
		case 'shop360':
			if (!data.product_settings.retailers?.length) { throw new Error('At least one retailer must be selected') }
			if (!data.product_settings.brands?.length) { throw new Error('At least one brand must be selected') }
			if (!data.product_settings.genders?.length) { throw new Error('At least one gender must be selected') }
			//if (!data.product_settings.type_store) { throw new Error('Type of store must be selected') }
			if (!data.product_settings.start_date) { throw new Error('Start date must be selected') }
			if (!data.product_settings.end_date) { throw new Error('End date must be selected') }
			break
		case 'demand360':
			if (!data.product_settings.sub_category?.length) { throw new Error('At least one sub-category must be selected') }
			if (!data.product_settings.start_date) { throw new Error('Start date must be selected') }
			if (!data.product_settings.end_date) { throw new Error('End date must be selected') }
			if (!data.product_settings.location) { throw new Error('Location must be selected') }
			if (!data.product_settings.regions?.length) { throw new Error('At least one region must be selected') }
			break
		case 'insight360':
			if (!data.product_settings.sub_category?.length) { throw new Error('At least one sub-category must be selected') }
			if (!data.product_settings.brands?.length) { throw new Error('At least one brand must be selected') }
			if (!data.product_settings.genders?.length) { throw new Error('At least one gender must be selected') }
			break
		case 'feedback360':
			if (!data.product_settings.audience_size) { throw new Error('Audience size is required') }
			if (!data.product_settings.genders?.length) { throw new Error('At least one gender must be selected') }
			if (!data.product_settings.age) { throw new Error('Age is required') }
			if (!data.product_settings.location) { throw new Error('Location must be selected') }
			if (!data.product_settings.regions?.length) { throw new Error('At least one region must be selected') }
			if (!data.product_settings.retailers?.length) { throw new Error('At least one retailer must be selected') }
			if (!data.product_settings.questions?.length) { throw new Error('At least one question is required') }
			if (!data.product_settings.min_price) { throw new Error('Minimum price is required') }
			if (!data.product_settings.max_price) { throw new Error('Maximum price is required') }
			break
		default:
			throw new Error(`Unknown product type: ${data.product_type}`)
	}
}

export const createReport = async (data: CreateReportData): Promise<any> => {
    try {
        console.log('Creating report with data:', data)
        
        // Format dates correctly if they are Date objects
        if (data.product_settings) {
            if (data.product_settings.start_date instanceof Date) {
                data.product_settings.start_date = data.product_settings.start_date.toISOString().split('T')[0]
            }
            
            if (data.product_settings.end_date instanceof Date) {
                data.product_settings.end_date = data.product_settings.end_date.toISOString().split('T')[0]
            }
        }
        
        console.log('Sending formatted data to API:', JSON.stringify(data, null, 2))
        
        const response = await fetch('/api/proxy?endpoint=/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(data)
        })
        
        if (!response.ok) {
            // Get the error details from the response
            let errorDetails = 'Unknown error'

            try {
                const errorResponse = await response.json()
                console.error('Full API error response:', errorResponse)
                errorDetails = JSON.stringify(errorResponse, null, 2)
            } catch (e) {
                errorDetails = await response.text()
                console.error('API error response (text):', errorDetails)
            }
            
            console.error(`API Error (${response.status}): ${errorDetails}`)
			
            throw new Error('Failed to create report')
        }
        
        const responseData = await response.json()

		//console.log('Report created successfully:', responseData)

        return responseData
		
    } catch (error) {
        console.error('Error creating report:', error)
        throw error
    }
} 