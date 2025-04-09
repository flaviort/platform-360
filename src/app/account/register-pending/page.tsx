// libraries
import Link from 'next/link'

// components
import AccountWrapper from '@/layouts/Account'

// data / utils / db
import { pages, contact } from '@/utils/routes'
import { email } from '@/utils/functions'

// css
import styles from './index.module.scss'

export default function RegisterPending() {
	return (
		<AccountWrapper>
			<div className={styles.page}>
				<div className={styles.whiteBlock}>

					<h2 className='text-25 bold'>
						You're almost set!
					</h2>

					<p className='text-16'>
						Thanks for registering! Please check your email for the verification link. If you don't see it, please check your spam folder. If you still don't see it, please contact us at <Link href={email(contact.email)} className='hover-underline blue'>{contact.email}</Link>.
					</p>

					<Link
						href={pages.account.login}
						className='button text-16 button--gradient-blue uppercase'
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
