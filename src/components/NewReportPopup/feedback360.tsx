// libraries
import clsx from 'clsx'

// components
import PopupForm from './form'
import ProjectName from './components/ProjectName'
import ReportName from './components/ReportName'
import Category from './components/Category'
import Location from './components/Location'
import Goal from './components/Goal'
import InputList from '@/components/Form/InputList'
import Dropdown from '@/components/Form/Dropdown'
import Checkbox from '@/components/Form/Checkbox'
import Price from '@/components/Form/Price'
import Upload from '@/components/Form/Upload'
import InputHidden from '@/components/Form/InputHidden'

// css
import styles from './index.module.scss'

// db
import { retailers } from '@/db/retailers'

// functions
import { slugify } from '@/utils/functions'

interface PopupFeedback360Props {
	icon: React.ComponentType<any>
	text: string
}

export default function PopupFeedback360({
	icon: Icon,
	text
}: PopupFeedback360Props) {

	return (
		<PopupForm
			icon={Icon}
			text={text}
		>

			<InputHidden
				name='reportType'
				value='Feedback360'
			/>

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