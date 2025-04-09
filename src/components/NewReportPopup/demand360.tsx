// libraries
import { useRouter } from 'next/navigation'

// components
import PopupForm from './form'
import ProjectName from './fields/ProjectName'
import ReportName from './fields/ReportName'
import Category from './fields/Category'
import Location from './fields/Location'
import Goal from './fields/Goal'
import TimePeriod from './fields/TimePeriod'

// utils
import { createReport, CreateReportData, getProjectAndCategoryIds } from '@/utils/reports'
import { slugify } from '@/utils/functions'

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

	const handleSuccess = async (data: any) => {
		try {
			// Get project and category IDs
			const { projectId, categoryId } = await getProjectAndCategoryIds({
				selectedProject: data.selectedProject,
				newProjectName: data.newProjectName,
				category: data.category
			})

			// Transform form data to match API format
			const reportData: CreateReportData = {
				name: data.reportName,
				product_type: 'Demand360',
				category_id: categoryId,
				status: true,
				goal: data.goal,
				project_id: projectId
			}

			console.log('Creating report with data:', reportData)
			const report = await createReport(reportData)
			
			// Redirect to the report page
			const projectName = data.selectedProject === 'New Project' ? data.newProjectName : data.selectedProject
			const reportName = data.reportName
			router.push(`/dashboard/my-reports/${slugify(projectName)}/${slugify(reportName)}`)
		} catch (error) {
			console.error('Failed to create report:', error)
			throw error // Re-throw to be handled by handleError
		}
	}

	const handleError = (error: any) => {
		console.error('Form submission error:', error)
		// You might want to show this error to the user in the UI
		// For example, using a toast notification or error message component
	}

	return (
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

			<TimePeriod />

			<Location />

			<Goal />
			
		</PopupForm>
	)
}