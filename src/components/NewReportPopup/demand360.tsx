'use client'

// libraries
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

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

export default function PopupDemand360({
	icon: Icon,
	text,
	className
}: PopupDemand360Props) {

	const router = useRouter()
	const [isGenerating, setIsGenerating] = useState(false)

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

			// transform form data to match API format
			const reportData: CreateReportData = {
				name: data.reportName,
				product_type: 'demand360',
				category_id: categoryId,
				status: false,
				goal: data.goal,
				project_id: projectId,
				product_settings: {
					start_date: data.timePeriodStart instanceof Date 
						? data.timePeriodStart.toISOString()
						: new Date(data.timePeriodStart).toISOString(),
					end_date: data.timePeriodEnd instanceof Date
						? data.timePeriodEnd.toISOString()
						: new Date(data.timePeriodEnd).toISOString(),
					location: data.location,
					regions: Object.entries(data.regions || {})
						.filter(([_, selected]) => selected === true)
						.map(([name, _]) => {
							// Get all regions from all location sources
							const allRegions = [
								...canadaProvinces,
								...usaStates,
								...europeanCountries,
								...ukRegions
							]
							// Find the region object by name and return its label
							const region = allRegions.find(r => r.name === name)
							return region ? region.label : name
						})
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
			
			// Use the helper to get auth token
			//const reportAuthToken = getAuthToken()
			
			const verifyReportResponse = await fetch(`/api/proxy?endpoint=/api/charts/report/${report.id}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					//'Authorization': `Bearer ${reportAuthToken}` // Add authorization token
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
			
			// Step 3: Create chart using the report ID
			/*
			const chartData = {
				title: "sample chart",
				description: "this chart is coming from the DB",
				preferences: {
					chart_type: "vertical",
				},
				query: {
					categories: [data.category || ""],
					// Ensure these are always arrays
					companies: Array.isArray(reportData.product_settings.retailers) ? 
						reportData.product_settings.retailers : [],
					brands: Array.isArray(reportData.product_settings.brands) ? 
						reportData.product_settings.brands : [],
					sex: Array.isArray(data.genders) ? 
						data.genders : (data.genders ? [data.genders] : []),
					range: {
						start_date: startDate,
						end_date: endDate
					},
					limit: 10
				},
				report_id: report.id
			}

			console.log('Creating chart with data:', JSON.stringify(chartData, null, 2))
			
			// Add a delay before creating the chart to ensure DB consistency
			console.log('Waiting for database to synchronize before creating chart...')
			await new Promise(resolve => setTimeout(resolve, 2000))
			
			// Use the same fetch format as createReport for consistency
			const chartResponse = await fetch('/api/proxy?endpoint=/api/charts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
				},
				body: JSON.stringify(chartData)
			})
			
			console.log('Chart response status:', chartResponse.status)
			const responseText = await chartResponse.text()
			console.log('Raw chart response:', responseText)
			
			if (!chartResponse.ok) {
				// Log detailed error information
				if (chartResponse.status === 401) {
					console.error('Authentication failed (401 Unauthorized). Auth token may be invalid or expired.')
					//console.error('Current auth token:', chartAuthToken ? `${chartAuthToken.substring(0, 10)}...` : 'None')
				}
				
				console.error(`Chart creation failed with status: ${chartResponse.status}`)
				console.error('Request headers:', {
					'Content-Type': 'application/json',
					//'Authorization': chartAuthToken ? 'Bearer token present' : 'No authorization'
				})
				console.error('Request data sent:', JSON.stringify(chartData, null, 2))
				console.error('Response:', responseText)
				
				// Report was created but chart creation failed
				console.error(`Report ID ${report.id} was created but chart creation failed. Operation aborted.`)
				
				// Create a helpful error message based on the error type
				const errorType = chartResponse.status === 401 ? '401 Authentication Error' : 
								 chartResponse.status === 500 ? '500 Server Error' : 
								 `${chartResponse.status} ${chartResponse.statusText}`;
								 
				const authHelp = chartResponse.status === 401 ? 
					'Authentication token may be invalid. Try logging out and back in to refresh your session.' : 
					'';
				
				document.dispatchEvent(new Event('formError'))
				throw new Error(
					`Failed to create chart. Report was created with ID ${report.id}, but chart creation failed with ${errorType}. ` +
					`${authHelp} Please check the console logs and contact the developer with this report ID.`
				)
			}
			
			// Chart creation succeeded
			const chart = responseText ? JSON.parse(responseText) : {}
			console.log('Created chart:', chart)
			
			// Only redirect if both report and chart were created successfully
			console.log('Both report and chart created successfully. Redirecting to report page...')
			*/

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
        document.dispatchEvent(new Event('formError'))
	}

	// This function will be called when the Generate Goal button is clicked
	const generateGoal = () => {
		try {
			setIsGenerating(true)
			
			// Create a custom event to request the form data
			const event = new CustomEvent('requestFormDataForGoal', {
				detail: { productType: 'demand360' }
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
			if (e.detail.productType !== 'demand360') return
			
			try {
				const {
					category = 'Unknown Category',
					location = '',
					regions = {},
					timePeriodStart,
					timePeriodEnd,
					setGoalValue
				} = e.detail
				
				// Parse regions
				const regionsList = Object.entries(regions || {})
					.filter(([_, selected]) => selected)
					.map(([name, _]) => {
						// Get all regions from all location sources
						const allRegions = [
							...canadaProvinces,
							...usaStates,
							...europeanCountries,
							...ukRegions
						]
						// Find the region object by name and return its label
						const region = allRegions.find(r => r.name === name)
						return region ? region.label : name
					})
				
				// Format time period
				let timePeriod = "recent time period"
				if (timePeriodStart && timePeriodEnd) {
					const startDate = new Date(timePeriodStart)
					const endDate = new Date(timePeriodEnd)
					
					timePeriod = `period from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`
				}
				
				// Generate goal text
				let goalText = `Analyze ${category} data`
				
				// Add location if available
				if (location) {
					goalText += ` in ${location}`
				}
				
				// Add regions if available
				if (regionsList.length > 0) {
					goalText += ` from ${regionsList.length > 1 ? 'the following regions:' : 'the following region:'} ${regionsList.join(', ')}`
				}
				
				// Add time period
				goalText += ` during the ${timePeriod}.`
				
				// Add action statement
				goalText += ` Identify key trends, competitive insights, and strategic opportunities to optimize product positioning and marketing strategies.`
				
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
			// Only handle events for this product type
			if (e.detail.productType !== 'demand360') return
			
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
		<PopupForm
			icon={Icon}
			text={text}
			onSuccess={handleSuccess}
			onError={handleError}
			className={className}
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
	)
}