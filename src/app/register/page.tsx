'use client'

// libraries
import { useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

// components
import AccountWrapper from '@/layouts/Account'
import { Form, Input, Select, Submit } from '@/components/Form'

// data / utils / db
import { pages } from '@/utils/routes'
import { countries } from '@/utils/countries'

// css
import styles from './index.module.scss'

export default function Register() {

	const [differentArea, setDifferentArea] = useState(false)

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
						endpoint='/api/auth'
						onSuccess={() => {}}
						onError={() => {}}
					>

						<div className={styles.flex}>

							<div className='row'>

								<div className='col-md-6'>
									<Input
										id='create-account-first-name'
										label='First Name'
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
										type='text'
										placeholder='Type here'
										maxLength={50}
									/>
								</div>

								<div className='col-md-6'>
									<Input
										id='create-account-email'
										label='Email'
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
										type='tel'
										placeholder='Phone'
										maxLength={50}
									/>		
								</div>

								<div className='col-12'>
									<Select
										id='create-account-area'
										label='Area of interest'
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
								type='password'
								placeholder='Password'
								required
								minLength={6}
							/>

							<Input
								id='create-account-repeat-password'
								label='Repeat Password'
								type='password'
								placeholder='Repeat Password'
								required
								hidePasswordToggle
								match='Password'
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
					Already have an account? <Link href={pages.login} className='hover-underline blue medium'>Sign in</Link>
				</p>

			</div>
		</AccountWrapper>
	)
}
