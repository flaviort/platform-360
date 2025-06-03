import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useChartSuggestion } from '@/utils/hooks'

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
		start_date: Date | string
		end_date: Date | string

		// demand360 specific fields
		location?: string
		regions?: string[]
		category?: string[]
		sub_category?: string[]

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
					if (data && data.goal_suggestion && Array.isArray(data.goal_suggestion) && data.goal_suggestion.length > 0) {
						// Select suggestion based on current index
						const currentIndex = suggestionIndex % data.goal_suggestion.length
						const selectedSuggestion = data.goal_suggestion[currentIndex]
						
						setGoalValue(selectedSuggestion)
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
}

export async function createChartsInParallel(
	chartDefinitions: any[],
	onProgress?: (chartName: string, status: 'creating' | 'success' | 'error') => void
): Promise<ChartCreationResult[]> {
	const chartPromises = chartDefinitions.map(chart => {
		onProgress?.(chart.name, 'creating')
		console.log(`Creating ${chart.name} chart...`)
		console.log('Chart data:', chart.data)
		
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
				onProgress?.(chart.name, 'error')
				return { ok: false, name: chart.name }
			}
			
			const chartData = responseText ? JSON.parse(responseText) : {}
			onProgress?.(chart.name, 'success')
			
			return { 
				ok: true, 
				data: chartData, 
				name: chart.name,
				hasData: chartData && chartData.results && chartData.results.length > 0
			}
		})
		.catch(error => {
			console.error(`Error creating ${chart.name} chart:`, error)
			onProgress?.(chart.name, 'error')
			return { ok: false, name: chart.name }
		})
	})

	return Promise.all(chartPromises)
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
		
		// Create all charts in parallel
		const results = await createChartsInParallel(
			chartsToCreate,
			(chartName, status) => config.onProgress?.('chart_progress', { chartName, status })
		)
			
		const atleastOneChartHasData = results.some(r => 'hasData' in r && r.hasData)
		
		if (!atleastOneChartHasData) {
			config.onProgress?.('no_data_cleanup')
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
			config.onProgress?.('success', { reportId: report.id })
			console.log('Report and charts creation completed successfully')
			document.dispatchEvent(new Event('formSent'))
			
			// Get project ID from the report data
			const projectId = reportData.project_id
			config.router.push(`/dashboard/my-reports/${projectId}/${report.id}`)
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
			if (!data.product_settings.type_store) { throw new Error('Type of store must be selected') }
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
        
        //console.log('Sending formatted data to API:', JSON.stringify(data, null, 2))
        
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
                errorDetails = JSON.stringify(errorResponse, null, 2)
            } catch (e) {
                errorDetails = await response.text()
            }
            
            console.error(`API Error (${response.status}): ${errorDetails}`)
			
            throw new Error('Failed to create report')
        }
        
        const responseData = await response.json()
        return responseData
    } catch (error) {
        console.error('Error creating report:', error)
        throw error
    }
} 