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

// css
import styles from './index.module.scss'

// db
import { brands } from '@/db/brands'

// functions
import { slugify } from '@/utils/functions'

interface PopupInsight360Props {
	icon: React.ComponentType<any>
	text: string
}

export default function PopupInsight360({
	icon: Icon,
	text
}: PopupInsight360Props) {
	return (
		<PopupForm
			icon={Icon}
			text={text}
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