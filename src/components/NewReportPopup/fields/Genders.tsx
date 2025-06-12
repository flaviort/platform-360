// libraries
import clsx from 'clsx'

// components
import Checkbox from '@/components/Form/Checkbox'

// css
import styles from '../index.module.scss'

export default function Genders() {
	return (
		<div className={styles.group}>

			<div className={styles.label}>
				<label className='text-16 semi-bold'>
					Genders <span className='red'>*</span>
				</label>
			</div>

			<div className={clsx(styles.input, styles.checkboxes)}>

				<Checkbox
					type='checkbox'
					id='report-genders-unisex'
					name='genders'
					label='Unisex'
					required
					checked
				/>

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
					label='Kids'
					required
				/>
				
			</div>

		</div>
	)
} 