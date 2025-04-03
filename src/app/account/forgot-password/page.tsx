'use client'

// libraries
import { useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// components
import AccountWrapper from '@/layouts/Account'
import Form from '@/components/Form/Form'
import Input from '@/components/Form/Input'
import Submit from '@/components/Form/Submit'

// data / utils / db
import { pages } from '@/utils/routes'
import { sendEmail } from '@/utils/email'
import ForgotPasswordEmail from '@/components/Emails/ForgotPasswordEmail'

// css
import styles from './index.module.scss'

export default function ForgotPassword() {
	const router = useRouter()
	const [emailError, setEmailError] = useState<string | null>(null)
	const [resetToken, setResetToken] = useState<string | null>(null)

	const sendAutomatedEmail = async (email: string, resetToken: string) => {
		try {
			setEmailError(null)
			const emailContent = ForgotPasswordEmail({ resetToken })
			const response = await sendEmail({
				to: email,
				from: 'noreply@platform360.ai',
				subject: emailContent.subject,
				body_html: emailContent.body_html,
				body_text: emailContent.body_text
			})

			if (!response.success) {
				throw new Error(response.error || 'Failed to send password reset email')
			}

			return response.message
		} catch (error) {
			console.error('Error sending password reset email:', error)
			setEmailError(error instanceof Error ? error.message : 'Failed to send email')
			throw error
		}
	}

	return (
		<AccountWrapper>
			<div className={styles.page}>
				<div className={styles.whiteBlock}>
					<h2 className='text-25 bold'>
						Forgot your Password?
					</h2>

					<p className={clsx(styles.desc, 'text-16')}>
						Enter your email and we will send you a link to reset your password.
					</p>

					{process.env.NODE_ENV === 'development' && resetToken && (
						<div className={clsx(styles.testEmail, 'bg-gray-100 p-1 mt-1')}>
							<p className='text-14 gray-700'>
								Reset Link:
							</p>
							<Link 
								href={`/account/reset-password?token=${resetToken}`}
								className='text-14 blue hover-underline block break-all'
							>
								{`${window.location.origin}/account/reset-password?token=${resetToken}`}
							</Link>
						</div>
					)}

					<Form
						className={styles.form}
						endpoint='/api/proxy?endpoint=/api/auth/forgot-password'
						method='POST'
						contentType='application/json'
						onSuccess={async (responseData, formData) => {
							console.log('API Response:', responseData)
							
							// The API returns null for successful requests
							if (responseData === null) {
								// For testing purposes, use a test token
								const testToken = 'test-token-123'
								setResetToken(testToken)
								return
							}
							
							// If we get here, the response wasn't null, so try to extract the token
							const token = responseData.reset_token || responseData.token || responseData
							if (!token || typeof token !== 'string') {
								throw new Error('Invalid token format received from API')
							}
							
							setResetToken(token)
							
							if (process.env.NODE_ENV === 'development') {
								// In development, just show the link
								return
							}
							
							// In production, send the email
							await sendAutomatedEmail(formData.email, token)
							router.push(pages.account.forgot_confirmation)
						}}
						onError={(error) => {
							console.error('Error:', error)
							setEmailError(error.message || 'Failed to process request')
						}}
					>
						<div className={styles.flex}>
							<Input
								id='forgot-password-email'
								label='Email'
								name='email'
								type='email'
								placeholder='email@email.com'
								maxLength={100}
								required
							/>
						</div>

						<Submit
							style='gradient-blue'
							className={styles.submit}
							text='Reset Password'
						/>

						{emailError && (
							<p className='text-14 red mt-1'>
								{emailError}
							</p>
						)}
					</Form>
				</div>

				<p className={clsx(styles.bottomText, 'text-18')}>
					Remember your password? <Link href={pages.account.login} className='hover-underline blue medium'>Sign in</Link>
				</p>
			</div>
		</AccountWrapper>
	)
}
