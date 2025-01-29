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

export default function ResetPassword() {
	return (
		<AccountWrapper>
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
						endpoint='/api/auth'
						onSuccess={() => {}}
						onError={() => {}}
					>

						<div className={styles.flex}>

							<Input
								id='reset-password-password'
								label='New Password'
								type='password'
								placeholder='Type here'
								required
								minLength={6}
							/>

							<Input
								id='reset-password-repeat-password'
								label='Repeat New Password'
								type='password'
								placeholder='Type here'
								required
								hidePasswordToggle
								match='New Password'
							/>

						</div>

						<button
							type='submit'
							className={clsx(styles.submit, 'button button--gradient-blue text-16')}
						>
							<span className='button__text'>
								Reset Password
							</span>

							<span className='button__loading'>
								<span className='rotation' style={{ '--speed': '.3' } as any}>
									<UxSpinner />
								</span>
							</span>

						</button>

						<Link href={pages.login} className='hover-underline text-16 gray-400'>
							Cancel
						</Link>

					</Form>

				</div>

			</div>
		</AccountWrapper>
	)
}
