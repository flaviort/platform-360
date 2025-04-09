// components
import Dropdown from '@/components/Form/Dropdown'

// css
import styles from '../index.module.scss'

// utils
import { retailers } from '@/db/retailers'
import { slugify } from '@/utils/functions'

export default function Retailers() {
	return (
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
	)
} 