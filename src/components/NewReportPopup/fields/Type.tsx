import Checkbox from '@/components/Form/Checkbox'
import styles from '../index.module.scss'
import clsx from 'clsx'

export default function Type() {
	return (
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
	)
} 