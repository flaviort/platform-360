'use client'

// libraires
import clsx from 'clsx'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// svg
import { LoaderCircle, ArrowLeft, ArrowRight, Trash } from 'lucide-react'

// css
import styles from './index.module.scss'

// utils
import { email, phone } from '@/utils/functions'

export interface User {
    id: string
    email: string
    is_active: boolean
    is_superuser: boolean
    is_verified: boolean
    first_name: string
    last_name: string
    phone: string
    role: string
    company_name: string
    country: string
    state: string
    city: string
    zip_code: string
    created_at: string
}

export default function List() {
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [users, setUsers] = useState<User[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 100
	const [updatingUsers, setUpdatingUsers] = useState<{[key: string]: boolean}>({})
	const [deletingUsers, setDeletingUsers] = useState<{[key: string]: boolean}>({})

	// Fetch users from API
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true)
				setError(null)
				const token = localStorage.getItem('auth_token')
				
				if (!token) {
					window.location.href = '/account/login'
					return
				}

				const response = await fetch('/api/proxy?endpoint=/api/users', {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				
				if (!response.ok) {
					if (response.status === 401) {
						window.location.href = '/account/login'
						return
					}
					throw new Error('Failed to fetch users')
				}

				const data = await response.json()
				setUsers(data)
			} catch (error) {
				console.error('Error fetching users:', error)
				setError('Failed to load users. Please try again later.')
			} finally {
				setIsLoading(false)
			}
		}

		fetchUsers()
	}, [])

	// Sort users by created_at (newest first)
	const sortedUsers = [...users].sort((a, b) => {
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	})

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
			
			const token = localStorage.getItem('auth_token')
			if (!token) {
				window.location.href = '/account/login'
				return
			}

			// Use different endpoints for activation and deactivation
			const endpoint = newStatus ? '/api/proxy?endpoint=/api/users/activate' : '/api/deactivate-user'
			
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: userId
				})
			})
			
			if (!response.ok) {
				if (response.status === 401) {
					window.location.href = '/account/login'
					return
				}
				const errorData = await response.json().catch(() => ({}))
				const action = newStatus ? 'activate' : 'deactivate'
				throw new Error(`Failed to ${action} user: ${errorData.details || errorData.error || 'Unknown error'}`)
			}

			// Update local state
			setUsers(prevUsers => 
				prevUsers.map(user => 
					user.id === userId 
						? { ...user, is_active: newStatus }
						: user
				)
			)

		} catch (error) {
			console.error('Error toggling user status:', error)
			alert(error instanceof Error ? error.message : 'Failed to update user status')
		} finally {
			setUpdatingUsers(prev => ({ ...prev, [userId]: false }))
		}
	}

	// Delete user
	const handleDeleteUser = async (userId: string) => {
		// Show confirmation dialog
		const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.')
		
		if (!confirmed) {
			return
		}

		try {
			setDeletingUsers(prev => ({ ...prev, [userId]: true }))
			
			const token = localStorage.getItem('auth_token')
			if (!token) {
				window.location.href = '/account/login'
				return
			}

			const response = await fetch('/api/delete-user', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: userId
				})
			})
			
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				
				if (response.status === 401) {
					window.location.href = '/account/login'
					return
				}
				if (response.status === 403) {
					alert('You do not have permission to delete users.')
					return
				}
				if (response.status === 404) {
					alert('User not found.')
					return
				}
				
				// Show more detailed error message
				const errorMessage = errorData.details || errorData.error || 'Failed to delete user'
				alert(`Error: ${errorMessage}`)
				return
			}

			// Remove user from local state
			setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))

		} catch (error) {
			console.error('Error deleting user:', error)
			alert('Failed to delete user. Please try again.')
		} finally {
			setDeletingUsers(prev => ({ ...prev, [userId]: false }))
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
								},
								/*
								{
									text: 'Delete'
								}
								*/
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
						) : error ? (
							<div className={styles.error}>
								<p className='text-16 semi-bold red'>
									{error}
								</p>
							</div>
						) : sortedUsers.length === 0 ? (
							<div className={styles.noResults}>
								<p className='text-16 semi-bold gray-500'>
									No users found
								</p>
							</div>
						) : currentUsers.map((user) => (
							<ListItem 
								key={user.id} 
								user={user} 
								onToggleActive={handleToggleActive}
								onDeleteUser={handleDeleteUser}
								isUpdating={updatingUsers[user.id]}
								isDeleting={deletingUsers[user.id]}
							/>
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

interface ListItemProps {
	user: User
	onToggleActive: (userId: string, newStatus: boolean) => Promise<void>
	onDeleteUser: (userId: string) => Promise<void>
	isUpdating: boolean
	isDeleting: boolean
}

export function ListItem({
	user,
	onToggleActive,
	onDeleteUser,
	isUpdating,
	isDeleting
}: ListItemProps) {
	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newStatus = e.target.checked
		await onToggleActive(user.id, newStatus)
	}

	console.log(user)

	return (
		<div className={styles.listItem}>

			<div className={styles.checkboxWrapper}>

				<p className={clsx(styles.mobile, 'text-16')}>
					Is Active?
				</p>

				<label
					htmlFor={`isActive-${user.id}`}
					className={clsx(
						styles.checkbox,
						isUpdating && styles.updating
					)}
				>
					
					<input
						type="checkbox"
						id={`isActive-${user.id}`}
						checked={user.is_active}
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
				<p className='text-16'>
					<span className={styles.mobile}>Register Date: </span>
					{new Date(user.created_at).toLocaleDateString()}
				</p>
			</div>
			
			<div className={styles.item}>
				{user.first_name && (
					<p className='text-16'>
						<span className={styles.mobile}>First Name: </span>{user.first_name}
					</p>
				)}

				{user.last_name && (
					<p className='text-16'>
						<span className={styles.mobile}>Last Name: </span>{user.last_name}
					</p>
				)}
			</div>

			<div className={styles.item}>
				{user.email && (
					<p className='text-16'>
						<span className={styles.mobile}>Email: </span>
						<Link href={email(user.email)} className='hover-underline blue'>{user.email}</Link>
					</p>
				)}

				{user.phone && (
					<p className='text-16'>
						<span className={styles.mobile}>Phone: </span>
						<Link href={phone(user.phone)} className='hover-underline blue'>{user.phone}</Link>
					</p>
				)}
			</div>

			<div className={styles.item}>
				{user.company_name && (
					<p className='text-16'>
						<span className={styles.mobile}>Company: </span>{user.company_name}
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

				{user.zip_code && (
					<p className='text-16'>
						<span className={styles.mobile}>Zipcode: </span>{user.zip_code}
					</p>
				)}
			</div>

			{/*<div className={styles.item}>
				<button
					className={clsx(
						styles.delete,
						isDeleting && styles.deleting
					)}
					onClick={() => onDeleteUser(user.id)}
					disabled={isDeleting}
				>

					{isDeleting ? (
						<span className='rotation gray-400' style={{ '--speed': '.5' } as any}>
							<LoaderCircle />
						</span>
					) : (
						<Trash />
					)}

					<span className='text-14'>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</span>

				</button>
			</div>*/}

		</div>
	)
}