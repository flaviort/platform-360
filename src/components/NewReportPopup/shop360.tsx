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
import { 
	CreateReportData, 
	getProjectAndCategoryIds,
	useGoalGeneration,
	createReportWithCharts,
	extractSelectedItems,
	formatISODate,
	createTimeRangeText
} from '@/utils/reports'
import loadingMessages from '@/utils/loadingMessages'

// css
import styles from './index.module.scss'

interface PopupShop360Props {
	icon: React.ComponentType<any>
	text: string
	className?: string
}

// chart definitions for creating charts after report creation
const getChartDefinitions = (baseChartData: any) => [
	{ 
		name: 'Price Point Analysis', 
		data: {
			...baseChartData,
			title: 'Price Point Analysis',
			description: 'Pricing Distribution ($5 increments)',
			preferences: {
				chart_type: 'price_point_analysis',
				box_size: 'full'
			},
			query: {
				...baseChartData.query,
				operator: {
					...baseChartData.query.operator,
					limit: 30,
					aggregate: 'distribution',
					operates_on: 'price',
					boundaries: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150]
				}
			}
		} 
	},
	{ 
		name: 'Price Point by Retailer', 
		data: {
			...baseChartData,
			title: 'Price Point by Retailer',
			description: 'Pricing Distribution by Retailer',
			preferences: {
				chart_type: 'price_point_by_retailer',
				box_size: 'full'
			},
			query: {
				...baseChartData.query,
				operator: {
					...baseChartData.query.operator,
					limit: 10,
					aggregate: 'all',
					operates_on: 'company'
				}
			}
		} 
	},
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
]

// helper function to transform gender values
const transformGender = (gender: string): string => {
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

// form data type for shop360
interface Shop360FormData {
	category: string
	retailers: string[]
	brands: string[]
	genders: string[]
	timePeriodStart: string
	timePeriodEnd: string
}

export default function PopupShop360({
	icon: Icon,
	text,
	className
}: PopupShop360Props) {

	const router = useRouter()

	// create base chart data
	const createBaseChartData = useCallback((data: any, report: any) => {
		
		// process fields the same way as in formatFormData
		let selectedCategory = [data.category || '']

		if (selectedCategory.includes('Footwear')) {
			selectedCategory = ['running shoes', 'heels', 'sandals', 'loafers', 'sneakers', 'shoes', 'flats', 'slippers', 'boots', 'clogs', 'oxfords', 'athletic shoes', 'wedges', 'mules clogs']
		}
		
		const selectedRetailers = extractSelectedItems(data.retailers)
		const selectedBrands = extractSelectedItems(data.brands)
		const selectedGenders = Array.isArray(data.genders) 
			? data.genders.map(transformGender) 
			: (data.genders ? [transformGender(data.genders)] : [])
		
		const selectedStartDate = formatISODate(data.timePeriodStart)
		const selectedEndDate = formatISODate(data.timePeriodEnd)

		return {
			report_id: report.id,
			query: {
				category: selectedCategory,
				company: selectedRetailers,
				brand: selectedBrands,
				gender: selectedGenders,
				operator: {
					start_date: selectedStartDate,
					end_date: selectedEndDate
				}
			}
		}
	}, [])

	// create request parameters for suggestion API
	const createRequestParams = useCallback((formData: Shop360FormData, goalValue: string) => ({
		product_name: 'Shop360',
		category: [formData.category || ''],
		company: formData.retailers,
		brand: formData.brands,
		gender: formData.genders,
		comment: goalValue
	}), [])

	// format form data for report creation
	const formatFormData = useCallback(async (data: any): Promise<CreateReportData> => {
		//console.log('Form data received:', data)
		//console.log('Project goal from form:', data.projectGoal)
		
		// get project and category IDs
		const { projectId, categoryId } = await getProjectAndCategoryIds({
			selectedProject: data.selectedProject,
			newProjectName: data.newProjectName,
			projectGoal: data.projectGoal,
			category: data.category
		})

		// process selected fields
		let selectedCategory = [data.category || '']
		
		// special case for footwear category
		if (selectedCategory.includes('Footwear')) {
			selectedCategory = ['running shoes', 'heels', 'sandals', 'loafers', 'sneakers', 'shoes', 'flats', 'slippers', 'boots', 'clogs', 'oxfords', 'athletic shoes', 'wedges', 'mules clogs']
		}
		
		const selectedRetailers = extractSelectedItems(data.retailers)
		const selectedBrands = extractSelectedItems(data.brands)
		
		// transform and prepare gender values
		const selectedGenders = Array.isArray(data.genders) 
			? data.genders.map(transformGender) 
			: (data.genders ? [transformGender(data.genders)] : [])
		
		// format dates for API
		const selectedStartDate = formatISODate(data.timePeriodStart)
		const selectedEndDate = formatISODate(data.timePeriodEnd)

		return {
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
	}, [])

	// extract form data for goal generation
	const extractFormData = useCallback((eventDetail: any): Shop360FormData => {
		const selectedRetailers = extractSelectedItems(eventDetail.retailers || {})
		const selectedBrands = extractSelectedItems(eventDetail.brands || {})
		
		return {
			category: eventDetail.category || '',
			retailers: selectedRetailers,
			brands: selectedBrands,
			genders: eventDetail.genders || [],
			timePeriodStart: eventDetail.timePeriodStart || '',
			timePeriodEnd: eventDetail.timePeriodEnd || ''
		}
	}, [])

	// create a fallback goal text based on form data
	const createFallbackGoalText = useCallback((formData: Shop360FormData): string => {
		const timeRangeText = createTimeRangeText(formData.timePeriodStart, formData.timePeriodEnd)
		return `Analyze ${formData.category} data from ${formData.retailers.join(', ')} for ${formData.brands.join(', ')} targeting ${formData.genders.join(' and ')} ${timeRangeText}. Identify key trends, competitive insights, and strategic opportunities.`
	}, [])

	// initialize goal generation hook
	const { generateGoal, isGenerating } = useGoalGeneration<Shop360FormData>({
		productType: 'shop360',
		productName: 'Shop360',
		createFallbackText: createFallbackGoalText,
		createRequestParams,
		extractFormData
	})

	const handleSuccess = async (data: any) => {
		try {
			await createReportWithCharts(data, {
				productType: 'shop360',
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
		<>
			<PopupForm
				icon={Icon}
				text={text}
				onSuccess={handleSuccess}
				onError={handleError}
				className={className}
				loadingMessages={loadingMessages}
			>

				<InputHidden name='productType' value='shop360' />

				<ProjectName />

				<ReportName />

				<TimePeriod />

				<Category />

				<Retailers />

				<Brands />

				<Genders />

				<Type />

				<IncludeImages />

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
		</>
	)
}