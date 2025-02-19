'use client'

// libraries
import clsx from 'clsx'

// components
import PopupForm from './form'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Dropdown from '@/components/Form/Dropdown'
import Checkbox from '@/components/Form/Checkbox'
import Textarea from '@/components/Form/Textarea'

// css
import styles from './index.module.scss'

interface PopupShop360Props {
	icon: React.ComponentType<any>
	text: string
}

export default function PopupShop360({
	icon: Icon,
	text
}: PopupShop360Props) {
	return (
		<PopupForm
			icon={Icon}
			text={text}
		>

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
						<option value=''>Select...</option>
						<option value='Category 1'>Category 1</option>
						<option value='Category 2'>Category 2</option>
						<option value='Category 3'>Category 3</option>
					</Select>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<p className='text-16 semi-bold'>
						Retailers <span className='red'>*</span>
					</p>
				</div>

				<div className={styles.input}>
					<Dropdown
						defaultValue='Select up to 3...'
						limitSelected={3}
						items={[
							{
								name: 'report-retailers 1',
								label: 'Costco'
							},
							{
								name: 'report-retailers 2',
								label: 'Amazon'
							},
							{
								name: 'report-retailers 3',
								label: 'Target'
							},
							{
								name: 'report-retailers 4',
								label: 'Walmart'
							},
							{
								name: 'report-retailers 5',
								label: 'BestBuy'
							},
							{
								name: 'report-retailers 6',
								label: 'Nancys'
							}
						]}
					/>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-brands' className='text-16 semi-bold'>
						Brands <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Input
						placeholder='Please specify'
						required
						label='Brands'
						name='brands'
						hideLabel
						id='report-brands'
						type='text'
					/>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-include-images' className='text-16 semi-bold'>
						Inlcude Images
					</label>
				</div>

				<div className={clsx(styles.input, styles.checkboxes)}>
					<Checkbox
						type='checkbox'
						id='report-include-images'
						name='include-images'
						label='Yes'
					/>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label className='text-16 semi-bold'>
						Genders <span className='red'>*</span>
					</label>
				</div>

				<div className={clsx(styles.input, styles.checkboxes)}>

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
						label="Kids"
						required
					/>

				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-year-pulled' className='text-16 semi-bold'>
						Year Pulled <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Select
						defaultValue=''
						required
						label='Year Pulled'
						name='year-pulled'
						hideLabel
						id='report-year-pulled'
					>
						<option value=''>Select...</option>
						{['2025', '2024', '2023', '2022', '2021', '2020', '2019'].map((item, i) => (
							<option value={item} key={i}>
								{item}
							</option>	
						))}
					</Select>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-month-pulled' className='text-16 semi-bold'>
						Month Pulled <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Select
						defaultValue=''
						required
						label='Month Pulled'
						name='month-pulled'
						hideLabel
						id='report-month-pulled'
					>
						<option value=''>Select...</option>
						<option value='January'>January</option>	
						<option value='February'>February</option>	
						<option value='March'>March</option>	
						<option value='April'>April</option>	
						<option value='May'>May</option>	
						<option value='June'>June</option>	
						<option value='July'>July</option>	
						<option value='August'>August</option>	
						<option value='September'>September</option>	
						<option value='October'>October</option>	
						<option value='November'>November</option>	
						<option value='December'>December</option>
					</Select>
				</div>

			</div>

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

					<p className={clsx(styles.helper, 'text-12 gray-400')}>
						Max. 250 characters
					</p>

				</div>

			</div>

		</PopupForm>
	)
}