'use client'

// libraries
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// components
import TitlePart from '@/components/TitlePart'
import List from './list'
import Loading from '@/components/Loading'

// css
import styles from './index.module.scss'

interface Report {
	id: string
	name: string
	product_type: string
	category_id: string
	status: boolean
	goal: string
	created_by_id: string
	project_id: string
	created_at: string
}

interface Category {
	id: string
	name: string
}

interface Project {
	id: string
	name: string
	project_goal: string
	created_at: string
}

interface User {
	id: string
	first_name: string
	last_name: string
}

export default function DashboardMyReports() {
	const router = useRouter()
	const [reports, setReports] = useState<Report[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [projects, setProjects] = useState<Project[]>([])
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [refreshKey, setRefreshKey] = useState(0)

	const refreshData = () => {
		setRefreshKey(prev => prev + 1)
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch reports
				const reportsResponse = await fetch('/api/proxy?endpoint=/api/reports/me')

				if (!reportsResponse.ok) {
					if (reportsResponse.status === 401) {
						router.push('/account/login')
						return
					}
					throw new Error('Failed to fetch reports')
				}

				const reportsData = await reportsResponse.json()
				setReports(reportsData)

				// Fetch categories
				const categoriesResponse = await fetch('/api/proxy?endpoint=/api/categories')

				if (!categoriesResponse.ok) {
					throw new Error('Failed to fetch categories')
				}

				const categoriesData = await categoriesResponse.json()
				setCategories(categoriesData)

				// Fetch projects
				const projectsResponse = await fetch('/api/proxy?endpoint=/api/projects/me')

				if (!projectsResponse.ok) {
					throw new Error('Failed to fetch projects')
				}

				const projectsData = await projectsResponse.json()
				setProjects(projectsData)

				// Fetch current user
				const userResponse = await fetch('/api/proxy?endpoint=/api/users/me')

				if (!userResponse.ok) {
					throw new Error('Failed to fetch user')
				}

				const userData = await userResponse.json()
				setCurrentUser(userData)
			} catch (error) {
				console.error('Error fetching data:', error)
				setError('Failed to load data. Please try again later.')
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [router, refreshKey])

	// Memoize the user name formatter
	const formatUserName = useMemo(() => (user: User | null) => {
		if (!user) return 'Unknown User'
		return `${user.first_name} ${user.last_name.charAt(0)}.`
	}, [])

	// Memoize the transformed projects data
	const transformedProjects = useMemo(() => {
		
		// Start with all projects, even if they have no reports
		return projects.map(project => {
			// Find all reports for this project
			const projectReports = reports.filter(report => report.project_id === project.id)
			
			// Transform each report
			const transformedReports = projectReports.map(report => {
				// Find category name by ID
				const category = categories.find(c => c.id === report.category_id)
				const categoryName = category?.name || 'Unknown Category'

				// Use current user for now
				const userName = formatUserName(currentUser)

				return {
					id: report.id,
					reportName: report.name,
					status: report.status ? 'green' as const : 'empty' as const,
					category: categoryName,
					createdAt: report.created_at,
					product: report.product_type as 'Shop360' | 'Feedback360' | 'Insight360' | 'Demand360',
					createdBy: {
						name: userName,
						image: undefined
					},
					access: [],
					goal: report.goal
				}
			})
			
			// Return project with its reports (or empty array)
			return {
				project: project.name,
				projectId: project.id,
				projectGoal: project.project_goal,
				reports: transformedReports
			}
		})
	}, [reports, projects, categories, currentUser, formatUserName])

	if (isLoading) {
		return (
			<Loading />
		)
	}

	if (error) {
		return (
			<main className={styles.page}>
				<div className='container container--big pt-smallest'>
					<div className='flex items-center justify-center'>
						<p className='text-16 semi-bold red'>
							{error}
						</p>
					</div>
				</div>
			</main>
		)
	}

	return (
		<main className={styles.page}>
		
			{projects.length > 0 && (
				<TitlePart title='My Reports' />
			)}

			<List 
				projects={transformedProjects} 
				onRefresh={refreshData} 
			/>

		</main>
	)
}