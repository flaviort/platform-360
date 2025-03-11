// components
import PopupForm from './form'
import ProjectName from './components/ProjectName'
import ReportName from './components/ReportName'
import Category from './components/Category'
import Location from './components/Location'
import Goal from './components/Goal'
import DateRange from '@/components/Form/DateRange'

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

			<ProjectName />

			<ReportName />

			<Category />

			<div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='report-time-period' className='text-16 semi-bold'>
						Time Period <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<DateRange
						name='time-period'
						required
						hideLabel
						startDate='2018-01-01'
						endDate='2025-03-10'
					/>
				</div>

			</div>

			<Location />

			<Goal />

		</PopupForm>
	)
}