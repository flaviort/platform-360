// components
import Select from '@/components/Form/Select'

// css
import styles from '../index.module.scss'

export default function Category() {
	return (
		<div className={styles.group}>

            <div className={styles.label}>
                <label htmlFor='report-category' className='text-16 semi-bold'>
                    Category <span className='red'>*</span>
                </label>
            </div>

            <div className={styles.input}>
                <Select
                    defaultValue=''
                    required
                    label='Category'
                    name='category'
                    hideLabel
                    id='report-category'
                >
                    <option value='' disabled>Select one</option>
                    <option value='Footwear'>Footwear</option>
                    <option value='Apparel'>Apparel</option>
                    <option value='Equipment'>Equipment</option>
                    <option value='Accessories'>Accessories</option>
                    <option value='Work'>Work</option>
                    <option value='Home'>Home</option>
                    <option value='In Home'>In Home</option>
                    <option value='Electronics'>Electronics</option>
                </Select>
            </div>

        </div>
	)
}