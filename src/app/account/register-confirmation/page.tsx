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
						Thanks for registering! Your account is not active yet as our team is reviewing your information. <br/><br />
						
						If everything is in order, we’ll approve your account within 1-3 business days. You’ll receive an email notification once your account is activated.
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
