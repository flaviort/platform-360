// libraries
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

// components
import PopupForm from './form'
import ProjectName from './fields/ProjectName'
import ReportName from './fields/ReportName'
import Category from './fields/Category'
import Goal from './fields/Goal'
import Dropdown from '@/components/Form/Dropdown'
import Checkbox from '@/components/Form/Checkbox'

// css
import styles from './index.module.scss'

// db
import { brands } from '@/db/brands'

// utils
import { slugify } from '@/utils/functions'
import { createReport, CreateReportData, getProjectAndCategoryIds } from '@/utils/reports'

interface PopupInsight360Props {
	icon: React.ComponentType<any>
	text: string
	className?: string
}

// loading messages to display during report generation
const loadingMessages = [
	"Generating your report...",
	"Saving data to the database...",
	"Syncing your data...",
	"Analyzing colors and patterns...",
	"Generating charts...",
	"Populating fields...",
	"Processing retailers data...",
	"Preparing brand information...",
	"Almost there...",
	"Creating beautiful visualizations..."
]

export default function PopupInsight360({
	icon: Icon,
	text,
	className
}: PopupInsight360Props) {
	const router = useRouter()

	const handleSuccess = async (data: any) => {
		try {
			// get project and category IDs
			const { projectId, categoryId } = await getProjectAndCategoryIds({
				selectedProject: data.selectedProject,
				newProjectName: data.newProjectName,
				category: data.category
			})

			// selected fields
			const selectedCategory = [data.category || '']
			const selectedRetailers = data.retailers ? Object.keys(data.retailers).filter(key => data.retailers[key] === true) : []
			const selectedBrands = data.brands ? Object.keys(data.brands).filter(key => data.brands[key] === true) : []
			const selectedGenders = Array.isArray(data.genders) ? data.genders : (data.genders ? [data.genders] : [])
			const selectedStartDate = data.timePeriodStart instanceof Date ? data.timePeriodStart.toISOString() : new Date(data.timePeriodStart).toISOString()
			const selectedEndDate = data.timePeriodEnd instanceof Date ? data.timePeriodEnd.toISOString() : new Date(data.timePeriodEnd).toISOString()

			// transform form data to match API format
			const reportData: CreateReportData = {
				name: data.reportName,
				product_type: 'insight360',
				category_id: categoryId,
				status: true,
				goal: data.goal,
				project_id: projectId,
				product_settings: {
					start_date: selectedStartDate,
					end_date: selectedEndDate
				}
			}

			console.log('Creating report with data:', reportData)
			const report = await createReport(reportData)
			
			// Redirect to the report page
			router.push(`/dashboard/my-reports/${projectId}/${report.id}`)
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
			loadingMessages={loadingMessages}
		>
			<ProjectName />
			
			<ReportName />

			<Category />

			<div className={styles.group}>
				<div className={styles.label}>
					<label htmlFor='report-brands' className='text-16 semi-bold'>
						Brands <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Dropdown
						defaultValue='Select up to 10...'
						limitSelected={10}
						items={brands.map((brand) => ({
							name: slugify(brand),
							label: brand
						}))}
						searchable
						required
						name='brands'
						id='report-brands'
					/>
				</div>
			</div>

			<div className={styles.group}>
				<div className={styles.label}>
					<label className='text-16 semi-bold'>
						Genders <span className='red'>*</span>
					</label>
				</div>

				<div className={clsx(styles.input, styles.checkboxes)}>
					<Checkbox
						type='checkbox'
						id='report-genders-men'
						name='genders'
						label="Men's"
						required
					/>

					<Checkbox
						type='checkbox'
						id='report-genders-women'
						name='genders'
						label="Women's"
						required
					/>

					<Checkbox
						type='checkbox'
						id='report-genders-kids'
						name='genders'
						label="Kids"
						required
					/>
				</div>
			</div>

			<Goal />
		</PopupForm>
	)
}