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

interface PopupFeedback360Props {
	icon: React.ComponentType<any>
	text: string
}

export default function PopupFeedback360({
	icon: Icon,
	text
}: PopupFeedback360Props) {
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
					<label htmlFor='report-audience' className='text-16 semi-bold'>
						Audience <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Input
						placeholder='Type here'
						required
						label='Audience'
						name='audience'
						hideLabel
						id='report-audience'
						type='text'
					/>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label className='text-16 semi-bold'>
						Gender <span className='red'>*</span>
					</label>
				</div>

				<div className={clsx(styles.input, styles.checkboxes)}>

					<Checkbox
						type='checkbox'
						id='report-gender-men'
						name='gender'
						label="Men's"
						required
					/>

					<Checkbox
						type='checkbox'
						id='report-gender-women'
						name='gender'
						label="Women's"
						required
					/>

					<Checkbox
						type='checkbox'
						id='report-gender-kids'
						name='gender'
						label="Kids"
						required
					/>

				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-age' className='text-16 semi-bold'>
						Age <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Select
						defaultValue=''
						required
						label='Age'
						name='age'
						hideLabel
						id='report-age'
					>
						<option value=''>Select...</option>
						<option value='0-10'>0-10</option>
						<option value='10-20'>10-20</option>
						<option value='20-30'>20-30</option>
						<option value='30-40'>30-40</option>
						<option value='40-50'>40-50</option>
						<option value='50-60'>50-60</option>
						<option value='60+'>60+</option>
					</Select>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-location' className='text-16 semi-bold'>
						Location <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Input
						placeholder='Please specify'
						required
						label='Location'
						name='location'
						hideLabel
						id='report-location'
						type='text'
					/>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-shopper' className='text-16 semi-bold'>
						Shopper <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Input
						placeholder='Please specify'
						required
						label='Shopper'
						name='shopper'
						hideLabel
						id='report-shopper'
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
					<Input
						placeholder='Please specify'
						required
						label='Category'
						name='category'
						hideLabel
						id='report-category'
						type='text'
					/>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-questions' className='text-16 semi-bold'>
						Questions <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Input
						placeholder='List up to 10'
						required
						label='Questions'
						name='questions'
						hideLabel
						id='report-questions'
						type='text'
					/>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-price' className='text-16 semi-bold'>
						Price <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Input
						placeholder='Min / Max'
						required
						label='Price'
						name='price'
						hideLabel
						id='report-price'
						type='text'
					/>
				</div>

			</div>

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-upload-images' className='text-16 semi-bold'>
						Upload Images <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Input
						placeholder='Click here to upload'
						required
						label='Upload Images'
						name='upload-images'
						hideLabel
						id='report-upload-images'
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