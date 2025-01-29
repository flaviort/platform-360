'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'

// components
import AccountWrapper from '@/layouts/Account'
import { Form, Input } from '@/components/Form'

// img / svg
import UxSpinner from '@/assets/svg/ux/spinner.svg'

// data / utils / db
import { pages } from '@/utils/routes'

// css
import styles from './index.module.scss'

export default function ForgotPassword() {
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

					<Form
						className={styles.form}
						endpoint='/api/auth'
						onSuccess={() => {}}
						onError={() => {}}
					>

						<div className={styles.flex}>
							<Input
								id='forgot-password-email'
								label='Email'
								type='email'
								placeholder='email@email.com'
								maxLength={100}
								required
							/>
						</div>

						<button
							type='submit'
							className={clsx(styles.submit, 'button button--gradient-blue text-16')}
						>
							<span className='button__text'>
								Submit
							</span>

							<span className='button__loading'>
								<span className='rotation' style={{ '--speed': '.3' } as any}>
									<UxSpinner />
								</span>
							</span>

						</button>

					</Form>

				</div>

				<p className={clsx(styles.bottomText, 'text-18')}>
					Remember your password? <Link href={pages.login} className='hover-underline blue medium'>Sign in</Link>
				</p>

			</div>
		</AccountWrapper>
	)
}
