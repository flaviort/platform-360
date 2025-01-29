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

export default function ResetPasswordSuccess() {
	return (
		<AccountWrapper>
			<div className={styles.page}>
				<div className={styles.whiteBlock}>

					<h2 className='text-25 bold'>
						Success!
					</h2>

					<p className={clsx(styles.desc, 'text-16')}>
						Your password has been successfully reset.
					</p>

					<Link
						href={pages.login}
						className={clsx(styles.submit, 'button button--gradient-blue text-16')}
					>
						<span className='button__text'>
							Login now
						</span>
					</Link>

				</div>

			</div>
		</AccountWrapper>
	)
}
