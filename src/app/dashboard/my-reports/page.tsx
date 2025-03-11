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
				description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.'
			/>

			<List projects={fakeProjects as ListProps['projects']} />

		</main>
	)
}