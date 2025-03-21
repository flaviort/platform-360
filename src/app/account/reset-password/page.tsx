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

export default function ResetPassword() {

	const router = useRouter()

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
						endpoint='/api/proxy?endpoint=/api/auth/reset-password'
						method='POST'
						onSuccess={() => router.push(pages.account.reset_password_success)}
						onError={() => {}}
					>

						<div className={styles.flex}>

							<Input
								id='reset-password-password'
								label='New Password'
								name='password'
								type='password'
								placeholder='Type here'
								required
								minLength={6}
							/>

							<Input
								id='reset-password-repeat-password'
								label='Repeat New Password'
								name='repeat-password'
								type='password'
								placeholder='Type here'
								required
								hidePasswordToggle
								match='New Password'
							/>

						</div>

						<Submit
							style='gradient-blue'
							className={styles.submit}
							text='Reset Password'
						/>

						<Link href={pages.account.login} className='hover-underline text-16 gray-400'>
							Cancel
						</Link>

					</Form>

				</div>

			</div>
		</AccountWrapper>
	)
}
