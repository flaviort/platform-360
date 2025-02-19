'use client'

// libraries
import clsx from 'clsx'

// components
import PopupForm from './form'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Textarea from '@/components/Form/Textarea'

// css
import styles from './index.module.scss'

interface PopupDemand360Props {
	icon: React.ComponentType<any>
	text: string
}

export default function PopupDemand360({
	icon: Icon,
	text
}: PopupDemand360Props) {
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
					<label htmlFor='report-months' className='text-16 semi-bold'>
						Months <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Select
						defaultValue=''
						required
						label='Months'
						name='months'
						hideLabel
						id='report-months'
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
					<label htmlFor='report-years' className='text-16 semi-bold'>
						Years <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Select
						defaultValue=''
						required
						label='Years'
						name='years'
						hideLabel
						id='report-years'
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
					<label htmlFor='report-geography' className='text-16 semi-bold'>
						Geography <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Input
						placeholder='Type here'
						required
						label='Geography'
						name='geography'
						hideLabel
						id='report-geography'
						type='text'
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