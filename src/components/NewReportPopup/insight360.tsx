'use client'

// libraries
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

// components
import PopupForm from './form'
import ProjectName from './fields/ProjectName'
import ReportName from './fields/ReportName'
import Category from './fields/Category'
import Brands from './fields/Brands'
import Genders from './fields/Genders'
import Question from './fields/Question'

// utils
import { 
	CreateReportData, 
	getProjectAndCategoryIds,
	createReportWithCharts,
	extractSelectedItems,
	transformGender
} from '@/utils/reports'
import loadingMessages from '@/utils/loadingMessages'

interface PopupInsight360Props {
	icon: React.ComponentType<any>
	text: string
	className?: string
}

// chart definitions for creating charts after report creation
const getChartDefinitions = (baseChartData: any) => {
	return [
		{ 
			name: 'Pros and Cons', 
			data: {
				...baseChartData,
				title: 'Pros and Cons',
				description: 'This chart shows all the pros and cons of the selected brand, gender and category.',
				preferences: {
					chart_type: 'pros_and_cons',
					box_size: 'full'
				},
				query: {
					...baseChartData.query,
					chart_type: 'pro_features'
				}
			} 
		}
	]
}

export default function PopupInsight360({
	icon: Icon,
	text,
	className
}: PopupInsight360Props) {
	
	const router = useRouter()

	// format form data for report creation
	const formatFormData = useCallback(async (data: any): Promise<CreateReportData> => {
		
		// get project and category IDs
		const { projectId, categoryId } = await getProjectAndCategoryIds({
			selectedProject: data.selectedProject,
			newProjectName: data.newProjectName,
			projectGoal: data.projectGoal,
			category: data.category
		})

		// get selected sub-category
		let selectedCategory = [
			data.subCategory || ''
		].filter(Boolean)

		// format data for API
		const selectedBrands = extractSelectedItems(data.brands)
		const selectedGenders = transformGender(data.genders)

		return {
			name: data.reportName,
			product_type: 'insight360',
			category_id: categoryId,
			status: false,
			goal: data.question,
			project_id: projectId,
			product_settings: {
				category: selectedCategory.length > 0 ? selectedCategory : [data.category],
				retailers: [],
				brands: selectedBrands,
				genders: selectedGenders
			}
		}
	}, [])

	// create base chart data
	const createBaseChartData = useCallback((data: any, report: any) => {

		// format data for API
		let selectedCategory = [ data.subCategory || '' ].filter(Boolean)
		const selectedBrands = extractSelectedItems(data.brands)
		const selectedGenders = transformGender(data.genders)

		return {
			report_id: report.id,
			query: {
				product_description: data.question + `. Make a pros and cons list using the following fields along with the previous text: Category: ${selectedCategory}, Brands: ${selectedBrands}, Genders: ${selectedGenders}`
			}
		}
	}, [])

	const handleSuccess = async (data: any) => {
		try {
			await createReportWithCharts(data, {
				productType: 'insight360',
				chartDefinitionsFactory: getChartDefinitions,
				formatFormData,
				createBaseChartData,
				router,
				maxRetries: 30,
				onProgress: (step: string, details?: any) => {
					if (step === 'chart_progress' && details) {
						const { chartName, status } = details
						console.log(`Insight360 Chart progress: ${chartName} - ${status}`)
						
						if (status === 'duplicate') {
							console.log(`⚠️ Duplicate chart creation prevented for: ${chartName}`)
						} else if (status === 'retrying') {
							console.log(`🔄 Retrying chart creation for: ${chartName} (up to 30 attempts)`)
						}
					}
				}
			})
		} catch (error) {
			console.error('Error during insight360 report creation:', error)
			
			if (error instanceof Error) {
				if (error.message.includes('timeout') || error.message.includes('504')) {
					console.error('⚠️ Insight360 chart creation timed out. This may be due to high server load. Some charts may still be processing in the background.')
				}
			}
			
			throw error
		}
	}

	const handleError = (error: any) => {
		console.error('Form submission error:', error)
        document.dispatchEvent(new Event('formError'))
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
			<ProjectName />
			
			<ReportName />

			<Category hasSubCategories />

			<Brands />

			<Genders />

			<Question />

		</PopupForm>
	)
}