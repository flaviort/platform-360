'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'

// components
import AccountWrapper from '@/layouts/Account'

// data / utils / db
import { pages } from '@/utils/routes'

// css
import styles from './index.module.scss'

export default function ForgotPasswordConfirmation() {
	return (
		<AccountWrapper>
			<div className={styles.page}>
				<div className={styles.whiteBlock}>

					<h2 className='text-25 bold'>
						Check your Email
					</h2>

					<p className={clsx(styles.desc, 'text-16')}>
						An email with instructions to reset your password has been sent to you.<br /><br />

						Remember to check your spam folder in case you didn't find the email.
					</p>

					<Link
						href={pages.login}
						className={clsx(styles.button, 'button button--gradient-blue text-16')}
					>
						<span className='button__text'>
							Back
						</span>
					</Link>

				</div>

			</div>
		</AccountWrapper>
	)
}
