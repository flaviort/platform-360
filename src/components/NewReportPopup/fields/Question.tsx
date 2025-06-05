'use client'

import Textarea from '@/components/Form/Textarea'

// css
import styles from '../index.module.scss'

export default function Question() {
	return (
		<div className={styles.group}>
			<div className={styles.label}>
				<label htmlFor='report-goal' className='text-16 semi-bold'>
					Question <span className='red'>*</span>
				</label>
			</div>

			<div className={styles.input}>
				<Textarea
					placeholder='Type your question here'
					required
					label='Question'
					name='question'
					hideLabel
					id='report-question'
					maxLength={1000}
				/>
			</div>
		</div>
	)
}