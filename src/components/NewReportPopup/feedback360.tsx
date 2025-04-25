// libraries
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

// components
import PopupForm from './form'
import ProjectName from './fields/ProjectName'
import ReportName from './fields/ReportName'
import Category from './fields/Category'
import Location from './fields/Location'
import Goal from './fields/Goal'
import InputList from '@/components/Form/InputList'
import Dropdown from '@/components/Form/Dropdown'
import Checkbox from '@/components/Form/Checkbox'
import Price from '@/components/Form/Price'
import Upload from '@/components/Form/Upload'

// css
import styles from './index.module.scss'

// db
import { retailers } from '@/db/retailers'

// utils
import { slugify } from '@/utils/functions'	
import { createReport, CreateReportData, getProjectAndCategoryIds } from '@/utils/reports'

interface PopupFeedback360Props {
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

export default function PopupFeedback360({
	icon: Icon,
	text,
	className
}: PopupFeedback360Props) {
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
				product_type: 'Feedback360',
				category_id: categoryId,
				status: true,
				goal: data.goal,
				project_id: projectId,
				audience_size: data.audienceSize,
				age: data.age,
				genders: data.genders,
				retailers: Object.keys(data.retailers || {}),
				questions: data.questions,
				price: data.price
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

			<div className={styles.group}>
				<div className={styles.label}>
					<label htmlFor='report-audience-size' className='text-16 semi-bold'>
						Audience Size <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Dropdown
						defaultValue='Select one'
						limitSelected={1}
						items={[
							{
								name: '0-10',
								label: '0-10'
							},
							{
								name: '10-20',
								label: '10-20'
							},
							{
								name: '20-30',
								label: '20-30'
							},
							{
								name: '30-40',
								label: '30-40'
							},
							{
								name: '40-50',
								label: '40-50'
							},
							{
								name: '50-60',
								label: '50-60'
							},
							{
								name: '60-70',
								label: '60-70'
							},
							{
								name: '70-80',
								label: '70-80'
							},
							{
								name: '80-90',
								label: '80-90'
							},
							{
								name: '90-100',
								label: '90-100'
							},
							{
								name: '100+',
								label: '100+'
							}
						]}
						required
						name='audience-size'
						id='report-audience-size'
					/>
				</div>
			</div>

			<div className={styles.group}>
				<div className={styles.label}>
					<label className='text-16 semi-bold'>
						Gender <span className='red'>*</span>
					</label>
				</div>

				<div className={clsx(styles.input, styles.checkboxes)}>
					<Checkbox
						type='checkbox'
						id='report-gender-men'
						name='gender'
						label="Men's"
						required
					/>

					<Checkbox
						type='checkbox'
						id='report-gender-women'
						name='gender'
						label="Women's"
						required
					/>

					<Checkbox
						type='checkbox'
						id='report-gender-kids'
						name='gender'
						label="Kids"
						required
					/>
				</div>
			</div>

			<div className={styles.group}>
				<div className={styles.label}>
					<label htmlFor='report-age' className='text-16 semi-bold'>
						Age <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Dropdown
						defaultValue='Select...'
						items={[
							{
								name: '0-10',
								label: '0-10'
							},
							{
								name: '10-20',
								label: '10-20'
							},
							{
								name: '20-30',
								label: '20-30'
							},
							{
								name: '30-40',
								label: '30-40'
							},
							{
								name: '40-50',
								label: '40-50'
							},
							{
								name: '50-60',
								label: '50-60'
							},
							{
								name: '60+',
								label: '60+'
							}
						]}
						required
						name='age'
						id='report-age'
					/>
				</div>
			</div>

			<Location />

			<div className={styles.group}>
				<div className={styles.label}>
					<p className='text-16 semi-bold'>
						Retailers <span className='red'>*</span>
					</p>
				</div>

				<div className={styles.input}>
					<Dropdown
						defaultValue='Select up to 5...'
						limitSelected={5}
						items={retailers.map((retailer) => ({
							name: slugify(retailer),
							label: retailer
						}))}
						searchable
						required
						name='retailers'
						id='report-retailers'
					/>
				</div>
			</div>

			<Category />

			<div className={styles.group}>
				<div className={styles.label}>
					<label htmlFor='report-questions' className='text-16 semi-bold'>
						Questions <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<InputList
						placeholder='List up to 10'
						required
						label='Questions'
						name='questions'
						hideLabel
						id='report-questions'
						type='text'
						limit={10}
					/>
				</div>
			</div>

			<div className={styles.group}>
				<div className={styles.label}>
					<label htmlFor='report-price' className='text-16 semi-bold'>
						Price <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Price
						required
						label='Price'
						name='price'
						hideLabel
						id='report-price'
					/>
				</div>
			</div>

			<div className={styles.group}>
				<div className={styles.label}>
					<label htmlFor='report-upload-images' className='text-16 semi-bold'>
						Upload Images
					</label>
				</div>

				<div className={styles.input}>
					<Upload
						id='report-upload-images'
						name='upload-images'
						uploadButtonText='Upload Images'
						multiple
						maxFileSize={5}
						accept='image/*'
						helperText='<p>Max file size: 5MB</p><p>Accepted file types: JPG, PNG, GIF</p>'
					/>
				</div>
			</div>

			<Goal />
		</PopupForm>
	)
}