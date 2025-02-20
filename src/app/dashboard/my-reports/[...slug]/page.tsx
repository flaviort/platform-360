// components
import Breadcrumbs from '@/components/Breadcrumbs'
import TitlePart from '@/components/TitlePart'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'

export default function DashboardMyReports() {

	return (
		<main className={styles.page}>

			<Breadcrumbs
				breadcrumbs={[
					{
						name: 'Home',
						link: pages.home
					},
					{
						name: 'My Reports',
						link: pages.dashboard.my_reports
					},
					{
						name: 'Lululemon Summer 2025',
						link: '#'
					}
				]}
			/>
		
			<TitlePart
				title='Lululemon Summer 2025'
			/>

		</main>
	)
}