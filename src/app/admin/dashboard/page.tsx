'use client'

// libraries
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// layouts
import DashboardWrapper from '@/layouts/Dashboard'

// components
import List from './list'

export default function AdminDashboard() {
	const router = useRouter()
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		const checkAdminAccess = async () => {
			try {
				const response = await fetch('/api/proxy?endpoint=/api/users/me')

				if (!response.ok) {
					if (response.status === 401) {
						router.push('/account/login')
						return
					}
					throw new Error('Failed to fetch user data')
				}

				const userData = await response.json()
				
				if (!userData.is_superuser) {
					router.push('/404')
					return
				}

				setIsAdmin(true)
			} catch (error) {
				console.error('Error checking admin access:', error)
				router.push('/404')
			}
		}

		checkAdminAccess()
	}, [router])

	if (!isAdmin) {
		return <></>
	}

	return (
		<DashboardWrapper>
		
			<section className='pt-smallest pb-smaller bg-purple-dark white'>
				<div className='container container--big'>

					<h1 className='text-45 bold'>
						Admin Dashboard
					</h1>

					<p className='mt-half'>
						From here you can manage who has access to the platform.
					</p>

				</div>
			</section>

			<List />

		</DashboardWrapper>
	)
}
