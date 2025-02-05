// libraries
import Link from 'next/link'

// components
import AccountWrapper from '@/layouts/Account'

// data / utils / db
import { pages } from '@/utils/routes'

// css
import styles from './index.module.scss'

export default function RegisterConfirmation() {
	return (
		<AccountWrapper>
			<div className={styles.page}>
				<div className={styles.whiteBlock}>

					<h2 className='text-25 bold'>
						Congratulations!
					</h2>

					<p className='text-16'>
						Your account has been successfully activated. You can now log in to access your dashboard.
					</p>

					<Link
						href={pages.account.login}
						className='button text-16 button--gradient-blue uppercase'
					>
						<span className='button__text'>
							Login	
						</span>
					</Link>

				</div>

			</div>
		</AccountWrapper>
	)
}
