'use client'

// components
import Breadcrumbs from '@/components/Breadcrumbs'
import TitlePart from '@/components/TitlePart'
import List, { ListProps } from './list'

// db
import { fakeProjects } from '@/db/fake-projects'

// css
import styles from './index.module.scss'

export default function DashboardMyReports() {

	return (
		<main className={styles.page}>

			<Breadcrumbs
				breadcrumbs={[
					{
						name: 'Home',
						link: '#'
					},
					{
						name: 'My Reports',
						link: '#'
					}
				]}
			/>
		
			<TitlePart
				title='My Reports'
				description='Below are all the reports you have created. You can filter them by product clicking on the logos below or even search for a specific report by typing in the search bar. You can also create new reports by clicking the "+ New" button.'
			/>

			<List projects={fakeProjects as ListProps['projects']} />

		</main>
	)
}