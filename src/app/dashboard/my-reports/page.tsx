'use client'

// libraries
import { useEffect, useState } from 'react'

// components
import Breadcrumbs from '@/components/Breadcrumbs'
import TitlePart from '@/components/TitlePart'
//import List, { ListProps } from './list-bkp'
import List from './list'

// db
import { fakeProjects } from '@/db/fake-projects'

// css
import styles from './index.module.scss'

export default function DashboardMyReports() {

	const [projects, setProjects] = useState([])

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await fetch('/api/projects')
				const data = await response.json()
				
				if (data.success) {
					setProjects(data.data)
				}
			} catch (error) {
				console.error('Error fetching projects:', error)
			}
		}

		fetchProjects()
	}, [])

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

			{/*<List projects={fakeProjects as ListProps['projects']} />*/}

			<List projects={projects} />

		</main>
	)
}