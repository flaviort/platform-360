// components
import PopupForm from './form'
import ProjectName from './components/ProjectName'
import ReportName from './components/ReportName'
import Category from './components/Category'
import Location from './components/Location'
import Goal from './components/Goal'
import TimePeriod from './components/TimePeriod'
import InputHidden from '@/components/Form/InputHidden'

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

			<InputHidden
				name='product'
				value='Demand360'
			/>

			<ProjectName />

			<ReportName />

			<Category />

			<TimePeriod />

			<Location />

			<Goal />

		</PopupForm>
	)
}