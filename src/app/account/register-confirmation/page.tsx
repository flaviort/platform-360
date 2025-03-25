// libraries
import Link from 'next/link'

// components
import AccountWrapper from '@/layouts/Account'

// data / utils / db
import { contact, pages } from '@/utils/routes'

// css
import styles from './index.module.scss'
import { email } from '@/utils/functions'

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
						
						If everything is in order, we’ll approve your account and you'll be able to access the platform. This process usually takes between 1-3 business days. Someone from our team will contact you once your account is activated.<br /><br />
						
						But if you're in a real hurry, you can e-mail us at: <Link href={email(contact.email)} className='hover-underline'>{contact.email}</Link>.
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
