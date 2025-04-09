// libraries
import { useRouter } from 'next/navigation'

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

// utils
import { createReport, CreateReportData, getProjectAndCategoryIds } from '@/utils/reports'
import { slugify } from '@/utils/functions'

interface PopupShop360Props {
	icon: React.ComponentType<any>
	text: string
	className?: string
}

export default function PopupShop360({
	icon: Icon,
	text,
	className
}: PopupShop360Props) {
	const router = useRouter()

	const handleSuccess = async (data: any) => {
		// Declare report variable outside try block so it's accessible in catch
		let report: any = null
		
		try {
			// get project and category IDs
			const { projectId, categoryId } = await getProjectAndCategoryIds({
				selectedProject: data.selectedProject,
				newProjectName: data.newProjectName,
				category: data.category
			})

			// transform form data to match API format
			const reportData: CreateReportData = {
				name: data.reportName,
				product_type: 'Shop360',
				category_id: categoryId,
				status: true,
				goal: data.goal,
				project_id: projectId,
				retailers: Object.keys(data.retailers || {}),
				brands: Object.keys(data.brands || {}),
				genders: data.genders,
				type: data.type,
				include_images: data.includeImages,
				time_period: data.timePeriod
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
					'Accept': 'application/json'
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
			const chartData = {
				title: "sample chart",
				description: "this chart is coming from the DB",
				preferences: {
					chart_type: "vertical",
				},
				query: {
					categories: [data.category || ""],
					companies: Array.isArray(data.retailers) ? data.retailers : Object.keys(data.retailers || {}),
					brands: Array.isArray(data.brands) ? data.brands : Object.keys(data.brands || {}),
					sex: Array.isArray(data.genders) ? data.genders : [data.genders].filter(Boolean),
					range: {
						start_date: startDate,
						end_date: endDate
					},
					limit: 1000
				},
				report_id: report.id
			}

			console.log('Creating chart with data:', JSON.stringify(chartData, null, 2))
			
			// Add a delay before creating the chart to ensure DB consistency
			console.log('Waiting for database to synchronize before creating chart...')
			await new Promise(resolve => setTimeout(resolve, 2000))
			
			// Get authentication token
			let authToken = '';
			try {
				authToken = localStorage.getItem('auth_token') || '';
				if (!authToken) {
					console.error('No auth_token found in localStorage');
					authToken = localStorage.getItem('token') || '';
				}
			} catch (e) {
				console.error('Error getting auth token:', e);
			}
			
			// Make a single attempt to create the chart
			console.log('Making chart creation request with auth token:', authToken ? 'Token found' : 'No token found');
			
			// Use the same fetch format as createReport for consistency
			const chartResponse = await fetch('/api/proxy?endpoint=/api/charts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authToken}`
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
					console.error('Current auth token:', authToken ? `${authToken.substring(0, 10)}...` : 'None')
				}
				
				console.error(`Chart creation failed with status: ${chartResponse.status}`)
				console.error('Request headers:', {
					'Content-Type': 'application/json',
					'Authorization': authToken ? 'Bearer token present' : 'No authorization'
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
            document.dispatchEvent(new Event('formSent'))
			const projectName = data.selectedProject === 'New Project' ? data.newProjectName : data.selectedProject
			const reportName = data.reportName
			router.push(`/dashboard/my-reports/${slugify(projectName)}/${slugify(reportName)}`)
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

	return (
		<>
			<PopupForm
				icon={Icon}
				text={text}
				onSuccess={handleSuccess}
				onError={handleError}
				className={className}
			>
				<ProjectName />

				<ReportName />

				<Category />

				<Retailers />

				<Brands />

				<Genders />

				<Type />

				<IncludeImages />

				<TimePeriod />

				<Goal />

			</PopupForm>
		</>
	)
}