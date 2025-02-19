'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// components
import AccountWrapper from '@/layouts/Account'
import Form from '@/components/Form/Form'
import Input from '@/components/Form/Input'
import Checkbox from '@/components/Form/Checkbox'
import Submit from '@/components/Form/Submit'

// data / utils / db
import { pages } from '@/utils/routes'

// context
import { useAuth } from '@/contexts/AuthContext'

// css
import styles from './index.module.scss'

interface LoginFormData {
    email: string
    password: string
    remember: boolean
}

export default function Login() {
	const { login, setIsAuthenticated } = useAuth()
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
						onSuccess={async (responseData, formData: LoginFormData) => {
                            if (responseData.message === 'Login successful!') {
                                if (formData.remember) {
                                    localStorage.setItem('auth_token', 'fake_token')
                                }
                                
                                document.cookie = `auth_token=fake_token; path=/; ${formData.remember ? 'max-age=31536000' : ''}`
                                setIsAuthenticated(true)
                                router.push(pages.dashboard.my_reports)
                            }
                        }}
						onError={() => {}}
					>
						<div className={styles.flex}>
							<Input
								id='login-email'
								label='Email'
								name='email'
								hideValidations
								type='text'
								placeholder='Username / Email'
								maxLength={100}
								required
							/>

							<Input
								id='login-password'
								label='Password'
								name='password'
								hideValidations
								type='password'
								placeholder='Password'
								required
							/>

							<div className={styles.options}>
								<Checkbox
									type='checkbox'
									id='login-remember'
									label='Remember me'
									name='remember'
									checked
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
