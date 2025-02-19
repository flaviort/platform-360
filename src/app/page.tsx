'use client'

// libraries
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// context
import { useAuth } from '@/contexts/AuthContext'

// utils
import { pages } from '@/utils/routes'

export default function Default() {
	const router = useRouter()
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		if (isAuthenticated) {
			router.push(pages.dashboard.my_reports)
		} else {
			router.push(pages.account.login)
		}
	}, [isAuthenticated, router])

	return null
}