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
						You're almost set!
					</h2>

					<p className='text-16'>
						Thanks for registering! We’ve emailed you a link to confirm your account, please check both your inbox and spam folder. Once you confirm, your account will be ready to use.
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
