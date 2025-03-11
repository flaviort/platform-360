// components
import Input from '@/components/Form/Input'

// css
import styles from '../index.module.scss'

export default function ReportName() {
	return (
		<div className={styles.group}>

            <div className={styles.label}>
                <label htmlFor='report-name' className='text-16 semi-bold'>
                    Report Name <span className='red'>*</span>
                </label>
            </div>

            <div className={styles.input}>
                <Input
                    placeholder='Type here'
                    required
                    label='Report Name'
                    name='report-name'
                    hideLabel
                    id='report-name'
                    type='text'
                />
            </div>

        </div>
	)
}