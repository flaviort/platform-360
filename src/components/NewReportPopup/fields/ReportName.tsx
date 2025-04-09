// components
import Input from '@/components/Form/Input'

// css
import styles from '../index.module.scss'

export default function ReportName() {
	return (
		<div className={styles.group}>

            <div className={styles.label}>
                <label htmlFor='reportName' className='text-16 semi-bold'>
                    Report Name <span className='red'>*</span>
                </label>
            </div>

            <div className={styles.input}>
                <Input
                    placeholder='Type here'
                    required
                    label='Report Name'
                    name='reportName'
                    hideLabel
                    id='reportName'
                    type='text'
                />
            </div>

        </div>
	)
}