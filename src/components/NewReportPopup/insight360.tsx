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

			// transform form data to match API format
			const reportData: CreateReportData = {
				name: data.reportName,
				product_type: 'Insight360',
				category_id: categoryId,
				status: true,
				goal: data.goal,
				project_id: projectId,
				brands: Object.keys(data.brands || {}),
				genders: data.genders
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