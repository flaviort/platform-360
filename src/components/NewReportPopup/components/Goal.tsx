// components
import Textarea from '@/components/Form/Textarea'

// css
import styles from '../index.module.scss'

export default function Goal() {
	return (
		<div className={styles.group}>

            <div className={styles.label}>
                <label htmlFor='report-goal' className='text-16 semi-bold'>
                    Goal <span className='red'>*</span>
                </label>
            </div>

            <div className={styles.input}>
                <Textarea
                    placeholder='Type here'
                    required
                    label='Goal'
                    name='goal'
                    hideLabel
                    id='report-goal'
                    maxLength={250}
                />
            </div>

        </div>
	)
}