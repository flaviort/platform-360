'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// components
import AccountWrapper from '@/layouts/Account'
import { Checkbox, Form, Input, Submit } from '@/components/Form'

// data / utils / db
import { pages } from '@/utils/routes'

// css
import styles from './index.module.scss'

export default function Login() {

	const router = useRouter()

	return (
		<AccountWrapper>
			<div className={styles.page}>
				<div className={styles.whiteBlock}>

					<h2 className='text-25 bold'>
						Sign in with email
					</h2>

					<p className='text-16'>
						Please enter your credentials
					</p>

					<Form
						className={styles.form}
						endpoint='/api/account/auth'
						onSuccess={() => router.push(pages.dashboard.my_reports)}
						onError={() => {}}
					>

						<div className={styles.flex}>

							<Input
								id='login-email'
								label='Email'
								hideValidations
								type='text'
								placeholder='Username / Email'
								maxLength={100}
							/>

							<Input
								id='login-password'
								label='Password'
								hideValidations
								type='password'
								placeholder='Password'
							/>

							<div className={styles.options}>

								<Checkbox
									type='checkbox'
									id='login-remember'
									label='Remember me'
									name='remember'
								/>

								<Link href={pages.account.forgot} className={clsx(styles.forgot, 'hover-underline blue text-14')}>
									Forgot your password?
								</Link>

							</div>

						</div>

						<Submit
							style='gradient-blue'
							text='Login'
							className={styles.submit}
						/>

					</Form>

				</div>

				<p className={clsx(styles.bottomText, 'text-18')}>
					Don't have an account? <Link href={pages.account.register} className='hover-underline blue medium'>Register now</Link>
				</p>

			</div>
		</AccountWrapper>
	)
}
