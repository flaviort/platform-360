'use client'

// libraries
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import Link from 'next/link'

// components
import AccountWrapper from '@/layouts/Account'
import Form from '@/components/Form/Form'
import Input from '@/components/Form/Input'
import InputHidden from '@/components/Form/InputHidden'
import Submit from '@/components/Form/Submit'
import LazyLoad from '@/components/LazyLoad'

// data / utils / db
import { pages } from '@/utils/routes'

// css
import styles from './index.module.scss'

function ResetPasswordForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	if (!token) {
		return (
			<AccountWrapper>
				<div className={styles.page}>
					<div className={styles.whiteBlock}>

						<h2 className='text-25 bold'>
							Invalid Reset Link
						</h2>

						<p className={clsx(styles.desc, 'text-16')}>
							This password reset link is invalid or has expired. Please request a new one.
						</p>

						<Link 
							href={pages.account.forgot}
							className={clsx(styles.button, 'button text-16 button--gradient-blue uppercase')}
						>
							Request New Reset Link
						</Link>

					</div>
				</div>
			</AccountWrapper>
		)
	}

	return (
		<AccountWrapper hideBottomLinks>
			<div className={styles.page}>
				<div className={styles.whiteBlock}>

					<h2 className='text-25 bold'>
						Reset your Password
					</h2>

					<p className={clsx(styles.desc, 'text-16')}>
						Enter your new password and confirm it.
					</p>

					<Form
						className={styles.form}
						endpoint='/api/proxy?endpoint=/api/auth/reset-password'
						method='POST'
						contentType='application/json'
						onSuccess={() => {
							// show success message briefly before redirecting
							setSuccess('Password reset successful! Redirecting to login...')
							setTimeout(() => {
								router.push(pages.account.login)
							}, 3000)
						}}
						onError={(error) => {
							console.error('Error:', error)
							setError(error.message || 'Failed to reset password')
						}}
					>

						<InputHidden 
							name='token' 
							value={token} 
						/>

						<div className={styles.flex}>
							<Input
								id='reset-password-password'
								label='New Password'
								name='password'
								type='password'
								placeholder='Type here'
								required
								minLength={6}
							/>

							<Input
								id='reset-password-repeat-password'
								label='Repeat New Password'
								name='confirm_password'
								type='password'
								placeholder='Type here'
								required
								hidePasswordToggle
								match='password'
							/>
						</div>

						<Submit
							style='gradient-blue'
							className={styles.submit}
							text='Reset Password'
						/>

						{error && (
							<p className='text-14 red mt-2'>
								{error}
							</p>
						)}

						{success && (
							<p className='text-14 blue mt-2'>
								{success}
							</p>
						)}

						<Link href={pages.account.login} className='hover-underline text-16 gray-400'>
							Cancel
						</Link>

					</Form>
				</div>

			</div>
		</AccountWrapper>
	)
}

export default function ResetPassword() {
	return (
		<LazyLoad>
			<ResetPasswordForm />
		</LazyLoad>
	)
}
