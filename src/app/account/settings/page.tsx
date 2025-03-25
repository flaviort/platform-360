'use client'

// libraries
import { useState } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// layouts
import OtherWrapper from '@/layouts/Other'

// components
import Avatar from '@/components/Avatar'
import Form from '@/components/Form/Form'
import Input from '@/components/Form/Input'
import Select from '@/components/Form/Select'
import Submit from '@/components/Form/Submit'

// images
import dots from '@/assets/img/dots.png'

// svg
import { Pencil } from 'lucide-react'

// data / utils / db
import { pages } from '@/utils/routes'
import { countries } from '@/utils/countries'

// context
import { useUser } from '@/contexts/UserContext'

// css
import styles from './index.module.scss'

export default function AccountSettings() {

    const [differentArea, setDifferentArea] = useState(false)
	const router = useRouter()
    const { userData } = useUser()

    return (
        <OtherWrapper className={styles.wrapper}>
            <main className={styles.page}>

                <div className={styles.bg}>
					<Image
						src={dots}
						alt=''
						fill
						className='cover'
						priority
						sizes='100vw'
					/>
				</div>

                <section className='py-smallest py-sm-smaller relative z2'>
                    <div className='container'>
                        <div className={styles.content}>
                            
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

                                    <h2 className='text-25 bold mb-1 gray-700'>
                                        Account Details
                                    </h2>

                                    <div className={clsx(styles.avatarWrapper, 'mb-smaller')}>

                                        <div className={styles.avatarPhotoWrapper}>

                                            <Avatar
                                                image={userData?.image}
                                                alt={userData?.name ? `${userData.name.first || ''} ${userData.name.last || ''}`.trim() : userData?.email || ''}
                                                letter={userData?.name?.first?.[0] || userData?.email?.[0]?.toUpperCase()}
                                                className={styles.avatar}
                                            />

                                            <button
                                                className={styles.edit}
                                                type='button'
                                            >
                                                <Pencil />
                                            </button>

                                        </div>

                                        <button
                                            className={clsx(styles.remove, 'button button--hollow-light button--small text-14')}
                                            type='button'
                                        >
                                            Remove
                                        </button>

                                    </div>

                                    <div className='row'>

                                        <div className='col-md-6'>
                                            <Input
                                                id='account-first-name'
                                                label='First Name'
                                                name='first_name'
                                                type='text'
                                                placeholder='Type here'
                                                maxLength={50}
                                                required
                                                labelAlwaysVisible
                                                defaultValue={userData?.name?.first}
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <Input
                                                id='account-last-name'
                                                label='Last Name'
                                                name='last_name'
                                                type='text'
                                                placeholder='Type here'
                                                maxLength={50}
                                                labelAlwaysVisible
                                                defaultValue={userData?.name?.last}
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <Input
                                                id='account-email'
                                                label='Email'
                                                name='email'
                                                type='email'
                                                placeholder='email@email.com'
                                                maxLength={100}
                                                defaultValue={userData?.email}
                                                labelAlwaysVisible
                                                disabled
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <Input
                                                id='account-phone'
                                                label='Phone'
                                                name='phone'
                                                type='tel'
                                                placeholder='Phone'
                                                maxLength={50}
                                                labelAlwaysVisible
                                            />		
                                        </div>

                                        <div className='col-12'>
                                            <Select
                                                id='account-role'
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
                                                    id='account-area-other'
                                                    label='Please specify'
                                                    name='role_other'
                                                    type='text'
                                                    placeholder='Type here'
                                                    maxLength={100}
                                                    required
                                                    labelAlwaysVisible
                                                />
                                            </div>
                                        )}

                                        <div className='col-12'>
                                            <Input
                                                id='account-company-name'
                                                label='Company Name'
                                                name='company_name'
                                                type='text'
                                                placeholder='Type here'
                                                maxLength={100}
                                                required
                                                labelAlwaysVisible
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <Select
                                                id='account-country'
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
                                                id='account-state'
                                                label='State'
                                                name='state'
                                                type='text'
                                                placeholder='Type here'
                                                maxLength={50}
                                                required
                                                labelAlwaysVisible
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <Input
                                                id='account-city'
                                                label='City'
                                                name='city'
                                                type='text'
                                                placeholder='Type here'
                                                maxLength={50}
                                                required
                                                labelAlwaysVisible
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <Input
                                                id='account-zip'
                                                label='ZIP Code'
                                                name='zipcode'
                                                type='text'
                                                placeholder='Type here'
                                                maxLength={50}
                                                required
                                                labelAlwaysVisible
                                            />
                                        </div>

                                    </div>

                                    <Submit
                                        style='gradient-blue'
                                        className={styles.submit}
                                        text='Update'
                                    />

                                </div>
                            </Form>

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

                                    <h2 className={clsx(styles.title, 'text-25 bold mb-2 pt-smallest mt-smaller gray-700')}>
                                        Update Password
                                    </h2>

                                    <Input
                                        id='account-password'
                                        label='New Password'
                                        name='password'
                                        type='password'
                                        placeholder='New Password'
                                        required
                                        minLength={6}
                                        labelAlwaysVisible
                                    />

                                    <Input
                                        id='account-repeat-password'
                                        label='Repeat New Password'
                                        name='repeat_password'
                                        type='password'
                                        placeholder='Repeat New Password'
                                        required
                                        hidePasswordToggle
                                        match='password'
                                        labelAlwaysVisible
                                    />

                                </div>

                                <Submit
                                    style='gradient-blue'
                                    className={styles.submit}
                                    text='Update'
                                />

                            </Form>
                        </div>
                    </div>
                </section>
            </main>
        </OtherWrapper>
    )
}