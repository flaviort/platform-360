import Checkbox from '@/components/Form/Checkbox'
import styles from '../index.module.scss'
import clsx from 'clsx'

export default function IncludeImages() {
	return (
		<div className={styles.group}>
			<div className={styles.label}>
				<label htmlFor='report-include-images' className='text-16 semi-bold'>
					Include Images
				</label>
			</div>

			<div className={clsx(styles.input, styles.checkboxes)}>
				<Checkbox
					type='checkbox'
					id='report-include-images'
					name='includeImages'
					label='Yes'
				/>
			</div>
		</div>
	)
} 