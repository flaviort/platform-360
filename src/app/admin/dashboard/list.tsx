'use client'

// libraires
import clsx from 'clsx'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// svg
import { LoaderCircle, ArrowLeft, ArrowRight } from 'lucide-react'

// css
import styles from './index.module.scss'

// utils
import { email, phone } from '@/utils/functions'

// fake db
import { users } from '@/db/users'

export interface ListProps {
    users: Array<{
		registerDate: string
        firstName: string
        lastName: string
		email: string
		phone: string
		role: string
		companyName: string
		country: string
		state: string
		city: string
		zipcode: string
		isActive: boolean
	}>
}

export default function List() {
	const [isLoading, setIsLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 100
	const [updatingUsers, setUpdatingUsers] = useState<{[key: string]: boolean}>({})

	// Sort users by registerDate (newest first)
	const sortedUsers = [...users].sort((a, b) => {
		return new Date(b.registerDate).getTime() - new Date(a.registerDate).getTime()
	})

	useEffect(() => {
		const initializeUsers = async () => {
			setIsLoading(true)
			await new Promise(resolve => setTimeout(resolve, 100))
			setIsLoading(false)
		}

		initializeUsers()
	}, [])

	// calculate total number of users
	const totalUsers = sortedUsers.length

	// calculate total pages
	const totalPages = Math.ceil(totalUsers / itemsPerPage)

	// calculate start and end index for current page
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage

	// get current page of users
	const currentUsers = sortedUsers.slice(startIndex, endIndex)

	// function to handle pagination
	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(prev => prev + 1)
		}
	}

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(prev => prev - 1)
		}
	}

	// toggle active
	const handleToggleActive = async (userId: string, newStatus: boolean) => {
		try {
			setUpdatingUsers(prev => ({ ...prev, [userId]: true }))
			
			// this will be replaced with actual API call when ready
			await new Promise(resolve => setTimeout(resolve, 500))
			console.log(`Toggle user ${userId} active status to: ${newStatus}`)
			
			// TODO: replace with actual API call
			// const response = await fetch(`/api/proxy?endpoint=/api/users/${userId}`, {
			//     method: 'PATCH',
			//     headers: {
			//         'Content-Type': 'application/json'
			//     },
			//     body: JSON.stringify({
			//         is_active: newStatus
			//     })
			// })
			
			// if (!response.ok) throw new Error('Failed to update user status')

		} catch (error) {
			console.error('Error updating user status:', error)
			// you might want to add error handling UI here
		} finally {
			setUpdatingUsers(prev => ({ ...prev, [userId]: false }))
		}
	}

	return (
		<div className='pb-small pb-md-smaller pt-smaller'>
			
			<section className={styles.list}>
				<div className='container container--big'>
					<div className={styles.listWrapper}>

						<div className={styles.listTitle}>
							{[
								{
									text: 'Is Active'
								},
								{
									text: 'Register Date'
								},
								{
									text: 'Full Name'
								},
								{
									text: 'Email / Phone'
								},
								{
									text: 'Company Name / Role'
								},
								{
									text: 'Country / City / Zipcode'
								}
							].map((item, i) => (
								<p className='gray-400 uppercase text-12 bold' key={i}>
									{item.text}
								</p>
							))}
						</div>

						{isLoading ? (
							<div className={styles.loading}>
								
								<span className='rotation purple' style={{ '--speed': '.5' } as any}>
									<LoaderCircle />
								</span>

								<p className='text-16 semi-bold gray-500'>
									Loading...
								</p>

							</div>
						) : sortedUsers.length === 0 ? (
							<div className={styles.noResults}>
								<p className='text-16 semi-bold gray-500'>
									No users found
								</p>
							</div>
						) : currentUsers.map((user: any, i: number) => (
							<ListItem key={i} user={user} />
						))}

					</div>
				</div>
			</section>

			{totalUsers > itemsPerPage && (
				<section className={styles.pagination}>
					<div className='container container--big pt-smaller pt-md-smallest'>
						<div className={styles.flex}>

							<div className={styles.left}>

								<p className='text-14 gray-500'>
									Showing <span>{startIndex + 1}</span>-<span>{Math.min(endIndex, totalUsers)}</span> out of <span>{totalUsers}</span>
								</p>

							</div>

							<div className={styles.right}>

								<button 
									disabled={currentPage === 1}
									onClick={handlePrevPage}
								>
									<ArrowLeft />
								</button>

								<button 
									disabled={currentPage === totalPages}
									onClick={handleNextPage}
								>
									<ArrowRight />
								</button>

							</div>

						</div>
					</div>
				</section>
			)}

		</div>
	)
}

export function ListItem({
	user
}: {
	user: ListProps['users'][number]
}) {
	const [isActive, setIsActive] = useState(user.isActive)
	const [isUpdating, setIsUpdating] = useState(false)

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newStatus = e.target.checked
		setIsUpdating(true)
		try {
			// This will be replaced with actual API call
			await new Promise(resolve => setTimeout(resolve, 500))
			setIsActive(newStatus)
		} catch (error) {
			// Revert on error
			setIsActive(!newStatus)
		} finally {
			setIsUpdating(false)
		}
	}

	return (
		<div className={styles.listItem}>

			<div className={styles.checkboxWrapper}>

				<p className={clsx(styles.mobile, 'text-16')}>
					Is Active?
				</p>

				<label
					htmlFor={`isActive-${user.email}`}
					className={clsx(
						styles.checkbox,
						isUpdating && styles.updating
					)}
				>
					
					<input
						type="checkbox"
						id={`isActive-${user.email}`}
						checked={isActive}
						onChange={handleChange}
						disabled={isUpdating}
					/>

					<span className={styles.checkboxToggle}>

						<span className={styles.circle}>
							{isUpdating && (
								<span className='rotation gray-400' style={{ '--speed': '.5' } as any}>
									<LoaderCircle />
								</span>
							)}
						</span>

						<span className={clsx('text-14', styles.yes)}>
							Yes
						</span>

						<span className={clsx('text-14', styles.no)}>
							No
						</span>

					</span>

				</label>

			</div>

			<div className={styles.item}>
				{user.registerDate && (
					<p className='text-16'>
						<span className={styles.mobile}>Register Date: </span>{user.registerDate}
					</p>
				)}
			</div>
			
		
			<div className={styles.item}>

				{user.firstName && (
					<p className='text-16'>
						<span className={styles.mobile}>First Name: </span>{user.firstName}
					</p>
				)}

				{user.lastName && (
					<p className='text-16'>
						<span className={styles.mobile}>Last Name: </span>{user.lastName}
					</p>
				)}

			</div>

			<div className={styles.item}>

				{user.email && (
					<p className='text-16'>
						<span className={styles.mobile}>Email: </span>{user.email && <Link href={email(user.email)} className='hover-underline blue'>{user.email}</Link> }
					</p>
				)}

				{user.phone && (
					<p className='text-16'>
						<span className={styles.mobile}>Phone: </span>{user.phone && <Link href={phone(user.phone)} className='hover-underline blue'>{user.phone}</Link> }
					</p>
				)}

			</div>

			<div className={styles.item}>

				{user.companyName && (
					<p className='text-16'>
						<span className={styles.mobile}>Company: </span>{user.companyName}
					</p>
				)}

				{user.role && (
					<p className='text-16'>
						<span className={styles.mobile}>Role: </span>{user.role}
					</p>
				)}

			</div>

			<div className={styles.item}>

				{user.country && (
					<p className='text-16'>
						<span className={styles.mobile}>Country: </span>{user.country}
					</p>
				)}

				{user.city && (
					<p className='text-16'>
						<span className={styles.mobile}>City: </span>{user.city}
					</p>
				)}

				{user.zipcode && (
					<p className='text-16'>
						<span className={styles.mobile}>Zipcode: </span>{user.zipcode}
					</p>
				)}

			</div>

		</div>
	)
}