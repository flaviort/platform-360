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
	transformGender,
	createInsight360Charts
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
		},
		/*
		{
			name: 'Cons Features',
			data: {
				...baseChartData,
				title: 'Cons Features',
				description: 'This chart shows all the cons of the selected brand, gender and category.',
				preferences: {
					chart_type: 'cons_features',
					box_size: 'half'
				},
				query: {
					...baseChartData.query,
					chart_type: 'cons_features'
				}
			}
		}
		*/
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
		const selectedGenders = Array.isArray(data.genders) ? data.genders.map(transformGender) : (data.genders ? [transformGender(data.genders)] : [])

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
				genders: selectedGenders,
				question: data.question
			}
		}
	}, [])

	// create base chart data
	const createBaseChartData = useCallback((data: any, report: any) => {

		// format data for API
		let selectedCategory = [ data.subCategory || '' ].filter(Boolean)
		const selectedBrands = extractSelectedItems(data.brands)
		const selectedGenders = Array.isArray(data.genders) ? data.genders.map(transformGender) : (data.genders ? [transformGender(data.genders)] : [])

		return {
			query: {
				report_id: report.id,
				question: data.question + ` Use the following fields along with the previous text: Category: ${selectedCategory}, Brand(s): ${selectedBrands}, Gender(s): ${selectedGenders}`
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
				customChartCreation: createInsight360Charts
			})
		} catch (error) {
			console.error('Error during report creation:', error)
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