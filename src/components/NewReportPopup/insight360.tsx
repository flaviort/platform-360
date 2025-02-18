'use client'

// libraries
import clsx from 'clsx'

// components
import PopupForm from './form'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Checkbox from '@/components/Form/Checkbox'
import Textarea from '@/components/Form/Textarea'

// css
import styles from './index.module.scss'

interface PopupInsight360Props {
	icon: React.ComponentType<any>
	text: string
}

export default function PopupInsight360({
	icon: Icon,
	text
}: PopupInsight360Props) {
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
					<label htmlFor='report-brands' className='text-16 semi-bold'>
						Brands <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Input
						placeholder='Please specify'
						required
						label='Brands'
						hideLabel
						id='report-brands'
						type='text'
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
						name='Genders'
						label="Men's"
						required
					/>

					<Checkbox
						type='checkbox'
						id='report-genders-women'
						name='Genders'
						label="Women's"
						required
					/>

					<Checkbox
						type='checkbox'
						id='report-genders-kids'
						name='Genders'
						label="Kids"
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