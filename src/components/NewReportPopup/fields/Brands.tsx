// components
import Dropdown from '@/components/Form/Dropdown'

// css
import styles from '../index.module.scss'

// utils
import { brands } from '@/db/brands'
import { slugify } from '@/utils/functions'

export default function Brands() {
	return (
		<div className={styles.group}>

			<div className={styles.label}>
				<label htmlFor='report-brands' className='text-16 semi-bold'>
					Brands <span className='red'>*</span>
				</label>
			</div>

			<div className={styles.input}>
				<Dropdown
					defaultValue='Select up to 5...'
					limitSelected={5}
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
	)
} 