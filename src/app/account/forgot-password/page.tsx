'use client'

// libraries
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

// css
import styles from './index.module.scss'

export default function ForgotPassword() {

	const router = useRouter()

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
						endpoint='/api/account/forgot-password'
						onSuccess={() => router.push(pages.account.forgot_confirmation)}
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

						<Submit
							style='gradient-blue'
							className={styles.submit}
							text='Submit'
						/>

					</Form>

				</div>

				<p className={clsx(styles.bottomText, 'text-18')}>
					Remember your password? <Link href={pages.account.login} className='hover-underline blue medium'>Sign in</Link>
				</p>

			</div>
		</AccountWrapper>
	)
}
