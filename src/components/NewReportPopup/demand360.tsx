'use client'

// libraries
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

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
import { 
	CreateReportData, 
	getProjectAndCategoryIds,
	useGoalGeneration,
	createReportWithCharts,
	extractSelectedItems,
	formatISODate,
	createDuringTimeRangeText,
	formatDisplayDate,
	getAllRegionsForLocation,
	generateDemand360Goal
} from '@/utils/reports'
import loadingMessages from '@/utils/loadingMessages'

// css
import styles from './index.module.scss'

interface PopupDemand360Props {
	icon: React.ComponentType<any>
	text: string
	className?: string
}

// chart definitions for creating charts after report creation
const getChartDefinitions = (baseChartData: any) => {
	return [
		{ 
			name: 'Geography Trend', 
			data: {
				...baseChartData,
				title: 'Geography Trend',
				description: 'Level of interest in the selected category, broken down by regions. 0 means no interest while 100 means highest interest.',
				preferences: {
					chart_type: 'geography_trend',
					box_size: 'full'
				},
				query: {
					...baseChartData.query,
					chart_type: 'geography_trend'
				}
			} 
		},
		{
			name: 'Category Trend',
			data: {
				...baseChartData,
				title: 'Category Trend',
				description: 'Interest in the selected category over time, from 0 (lowest) to 100 (highest).',
				preferences: {
					chart_type: 'category_trend',
					box_size: 'half'
				},
				query: {
					...baseChartData.query,
					chart_type: 'category_trend'
				}
			}
		}
	]
}

// form data type for demand360
interface Demand360FormData {
	category: string
	location: string
	regions: string[]
	timePeriodStart: string
	timePeriodEnd: string
}

export default function PopupDemand360({
	icon: Icon,
	text,
	className
}: PopupDemand360Props) {

	const router = useRouter()

	// extract form data for goal generation
	const extractFormData = useCallback((eventDetail: any): Demand360FormData => {
		const location = eventDetail.location || ''
		const regions = getAllRegionsForLocation(location)
		
		return {
			category: eventDetail.category || '',
			location: location,
			regions: regions,
			timePeriodStart: eventDetail.timePeriodStart || '',
			timePeriodEnd: eventDetail.timePeriodEnd || ''
		}
	}, [])

	// create request parameters for GOAL suggestion API
	const createRequestParams = useCallback((formData: Demand360FormData, goalValue: string) => ({
		product_name: 'Demand360',
		category: [formData.category || ''],
		location: [formData.location || ''],
		comment: goalValue
	}), [])

	// initialize goal generation hook
	const { generateGoal, isGenerating } = useGoalGeneration<Demand360FormData>({
		productType: 'demand360',
		productName: 'Demand360',
		createFallbackText: generateDemand360Goal,
		createRequestParams,
		extractFormData
	})

	// format form data for report creation
	const formatFormData = useCallback(async (data: any): Promise<CreateReportData> => {

		const regions = getAllRegionsForLocation(data.location)
		
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

		// format dates for API
		const selectedStartDate = formatISODate(data.timePeriodStart)
		const selectedEndDate = formatISODate(data.timePeriodEnd)

		return {
			name: data.reportName,
			product_type: 'demand360',
			category_id: categoryId,
			status: false,
			goal: data.goal,
			project_id: projectId,
			product_settings: {
				start_date: selectedStartDate,
				end_date: selectedEndDate,
				location: data.location,
				regions: regions,
				category: selectedCategory
			}
		}
	}, [])

	// create base chart data
	const createBaseChartData = useCallback((data: any, report: any) => {
		const regions = getAllRegionsForLocation(data.location)

		return {
			report_id: report.id,
			query: {
				category: [data.subCategory || ''].filter(Boolean),
				location: data.location,
				regions: regions,
				start_date: new Date(data.timePeriodStart).toISOString(),
				end_date: new Date(data.timePeriodEnd).toISOString()
			}
		}
	}, [])

	const handleSuccess = async (data: any) => {
		try {
			await createReportWithCharts(data, {
				productType: 'demand360',
				chartDefinitionsFactory: getChartDefinitions,
				formatFormData,
				createBaseChartData,
				router
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

			<InputHidden
				name='productType'
				value='demand360'
			/>
			
			<ProjectName />

			<ReportName />

			<Category hasSubCategories />

			<TimePeriod />

			<Location />

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
							<Sparkles /> Improve Goal
						</>
					)}
				</button>
				
			</div>
			
		</PopupForm>
	)
}