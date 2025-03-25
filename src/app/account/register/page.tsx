'use client'

// libraries
import { useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// components
import AccountWrapper from '@/layouts/Account'
import Form from '@/components/Form/Form'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Submit from '@/components/Form/Submit'

// data / utils / db
import { pages } from '@/utils/routes'
import { countries } from '@/utils/countries'

// css
import styles from './index.module.scss'

export default function Register() {

	const [differentArea, setDifferentArea] = useState(false)

	const router = useRouter()

	return (
		<AccountWrapper>
			<div className={styles.page}>
				<div className={styles.whiteBlock}>

					<h2 className='text-25 bold'>
						Create an account
					</h2>

					<p className='text-16'>
						Please fill in all the fields below
					</p>

					<Form
						className={styles.form}
						endpoint='/api/proxy?endpoint=/api/auth/register'
						method='POST'
						contentType='application/json'
						onSuccess={(responseData) => {
							if (responseData.id) {
								router.push(pages.account.register_confirmation)
							}
						}}
						onError={() => {}}
					>

						<div className={styles.flex}>

							<div className='row'>

								<div className='col-md-6'>
									<Input
										id='create-account-first-name'
										label='First Name'
										name='first_name'
										type='text'
										placeholder='Type here'
										maxLength={50}
										required
									/>
								</div>

								<div className='col-md-6'>
									<Input
										id='create-account-last-name'
										label='Last Name'
										name='last_name'
										type='text'
										placeholder='Type here'
										maxLength={50}
									/>
								</div>

								<div className='col-md-6'>
									<Input
										id='create-account-email'
										label='Email'
										name='email'
										type='email'
										placeholder='email@email.com'
										maxLength={100}
										required
									/>
								</div>

								<div className='col-md-6'>
									<Input
										id='create-account-phone'
										label='Phone'
										name='phone'
										type='tel'
										placeholder='Phone'
										maxLength={50}
									/>		
								</div>

								<div className='col-12'>
									<Select
										id='create-account-role'
										label='Role'
										name='role'
										defaultValue=''
										required
										onChange={(e) => setDifferentArea(e.target.value === 'Other')}
									>
										<option value='' disabled>Select one</option>
										<option value='Leadership'>Leadership</option>
										<option value='Product development'>Product development</option>
										<option value='Design'>Design</option>
										<option value='Merchandising'>Merchandising</option>
										<option value='Buying'>Buying</option>
										<option value='Sales'>Sales</option>
										<option value='Marketing'>Marketing</option>
										<option value='Supplier'>Supplier</option>
										<option value='Manufacturing'>Manufacturing</option>
										<option value='Other'>Other</option>
									</Select>
								</div>

								{differentArea && (
									<div className='col-12'>
										<Input
											id='create-account-area-other'
											label='Please specify'
											name='role_other'
											type='text'
											placeholder='Type here'
											maxLength={100}
											required
										/>
									</div>
								)}

								<div className='col-12'>
									<Input
										id='create-account-company-name'
										label='Company Name'
										name='company_name'
										type='text'
										placeholder='Type here'
										maxLength={100}
										required
									/>
								</div>

								<div className='col-md-6'>
									<Select
										id='create-account-country'
										label='Country'
										name='country'
										defaultValue=''
										required
									>
										<option value='' disabled>Select one</option>
										{countries.map((item, i) => (
											<option
												key={i}
												value={item.name}
											>
												{item.name}
											</option>
										))}
									</Select>
								</div>

								<div className='col-md-6'>
									<Input
										id='create-account-state'
										label='State'
										name='state'
										type='text'
										placeholder='Type here'
										maxLength={50}
										required
									/>
								</div>

								<div className='col-md-6'>
									<Input
										id='create-account-city'
										label='City'
										name='city'
										type='text'
										placeholder='Type here'
										maxLength={50}
										required
									/>
								</div>

								<div className='col-md-6'>
									<Input
										id='create-account-zip'
										label='ZIP Code'
										name='zipcode'
										type='text'
										placeholder='Type here'
										maxLength={50}
										required
									/>
								</div>

							</div>

							<Input
								id='create-account-password'
								label='Password'
								name='password'
								type='password'
								placeholder='Password'
								required
								minLength={6}
							/>

							<Input
								id='create-account-repeat-password'
								label='Repeat Password'
								name='repeat_password'
								type='password'
								placeholder='Repeat Password'
								required
								hidePasswordToggle
								match='password'
							/>

						</div>

						<Submit
							style='gradient-blue'
							className={styles.submit}
							text='Create Account'
						/>

					</Form>

				</div>

				<p className={clsx(styles.bottomText, 'text-18')}>
					Already have an account? <Link href={pages.account.login} className='hover-underline blue medium'>Sign in</Link>
				</p>

			</div>
		</AccountWrapper>
	)
}
