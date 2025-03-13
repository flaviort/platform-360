// libraries
import clsx from 'clsx'

// components
import PopupForm from './form'
import ProjectName from './components/ProjectName'
import ReportName from './components/ReportName'
import Category from './components/Category'
import Goal from './components/Goal'
import Dropdown from '@/components/Form/Dropdown'
import Checkbox from '@/components/Form/Checkbox'
import DateRange from '@/components/Form/DateRange'
import InputHidden from '@/components/Form/InputHidden'

// css
import styles from './index.module.scss'

// db
import { retailers } from '@/db/retailers'
import { brands } from '@/db/brands'

// functions
import { slugify } from '@/utils/functions'

interface PopupShop360Props {
	icon: React.ComponentType<any>
	text: string
}

export default function PopupShop360({
	icon: Icon,
	text
}: PopupShop360Props) {

	return (
		<PopupForm
			icon={Icon}
			text={text}
		>

			<InputHidden
				name='reportType'
				value='Shop360'
			/>

			<ProjectName />

			<ReportName />

			<Category />

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

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-brands' className='text-16 semi-bold'>
						Brands <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Dropdown
						defaultValue='Select up to 5...'
						limitSelected={5}
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
					<label htmlFor='report-include-images' className='text-16 semi-bold'>
						Inlcude Images
					</label>
				</div>

				<div className={clsx(styles.input, styles.checkboxes)}>
					<Checkbox
						type='checkbox'
						id='report-include-images'
						name='include-images'
						label='Yes'
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

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-time-period' className='text-16 semi-bold'>
						Time Period <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<DateRange
						name='time-period'
						required
						hideLabel
						startDate='2018-01-01'
						endDate='2025-03-10'
					/>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label className='text-16 semi-bold'>
						Type <span className='red'>*</span>
					</label>
				</div>

				<div className={clsx(styles.input, styles.checkboxes)}>

					<Checkbox
						type='radio'
						id='report-type-instore'
						name='type'
						label='Instore'
						required
					/>

					<Checkbox
						type='radio'
						id='report-type-online'
						name='type'
						label='Online'
						required
					/>

					<Checkbox
						type='radio'
						id='report-type-both'
						name='type'
						label='Both'
						required
					/>

				</div>

			</div>

			<Goal />

		</PopupForm>
	)
}