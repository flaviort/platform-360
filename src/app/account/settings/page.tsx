'use client'

// libraries
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { useFormContext } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'

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
import { countries } from '@/utils/countries'

// context
import { useUser } from '@/contexts/UserContext'

// css
import styles from './index.module.scss'

export default function AccountSettings() {
    const { userData, updateUserData } = useUser()
    
    const [accountSuccess, setAccountSuccess] = useState(false)
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)

    useEffect(() => {
        if (accountSuccess) {
            setTimeout(() => {
                setAccountSuccess(false)
            }, 5000)
        }
    }, [accountSuccess])

    useEffect(() => {
        if (passwordSuccess) {
            setTimeout(() => {
                setPasswordSuccess(false)
            }, 5000)
        }
    }, [passwordSuccess])

    useEffect(() => {
        const handleFormSending = () => {
            setAccountSuccess(false)
            setPasswordSuccess(false)
        }

        // check if the event exists before adding the listener
        if (typeof document !== 'undefined') {
            document.addEventListener('formSending', handleFormSending)
        }

        return () => {
            if (typeof document !== 'undefined') {
                document.removeEventListener('formSending', handleFormSending)
            }
        }
    }, [])

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

                            <h2 className='text-25 bold mb-1 gray-700'>
                                Account Details
                            </h2>

                            <Form
                                className={styles.form}
                                endpoint='/api/proxy?endpoint=/api/users/me'
                                method='PATCH'
                                contentType='application/json'
                                onSuccess={(responseData) => {
                                    setAccountSuccess(true)
                                    if (responseData && typeof responseData === 'object') {
                                        updateUserData(responseData)
                                    }
                                }}
                                onError={(error) => {
                                    console.error('Update failed:', error)
                                }}
                            >

                                <div className={clsx(styles.flex, 'form-fields')}>
                                    <AccountDetailsForm userData={userData} />
                                </div>

                                <div className={styles.submit}>

                                    <Submit
                                        style='gradient-blue'
                                        text='Update'
                                    />

                                    <AnimatePresence>
                                        {accountSuccess && (
                                            <motion.p 
                                                className='text-16 blue'
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                Account details updated successfully
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                </div>

                            </Form>

                            <h2 className={clsx(styles.title, 'text-25 bold mb-2 pt-smallest mt-smaller gray-700')}>
                                Update Password
                            </h2>

                            <Form
                                className={styles.form}
                                endpoint='/api/proxy?endpoint=/api/users/me'
                                method='PATCH'
                                contentType='application/json'
                                onSuccess={(responseData) => {
                                    setPasswordSuccess(true)
                                    setPasswordError(null)
                                }}
                                onError={(error) => {
                                    console.error('Update failed:', error)
                                    setPasswordError(error.message || 'Failed to update password')
                                }}
                                clearOnSubmit
                                beforeSubmit={(data) => {
                                    // check if new password matches current password
                                    if (data.current_password === data.password) {
                                        setPasswordError('New password must be different from current password')
                                        return false
                                    }
                                    return data
                                }}
                            >

                                <div className={clsx(styles.flex, 'form-fields')}>
                                    <Input
                                        id='account-current-password'
                                        label='Current Password'
                                        name='current_password'
                                        type='password'
                                        placeholder='Current Password'
                                        required
                                        minLength={6}
                                        labelAlwaysVisible
                                    />

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

                                <div className={styles.submit}>

                                    <Submit
                                        style='gradient-blue'
                                        text='Update'
                                    />

                                    <AnimatePresence>
                                    
                                        {passwordSuccess && (
                                            <motion.p 
                                                className='text-16 blue'
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                Password updated successfully
                                            </motion.p>
                                        )}

                                        {passwordError && (
                                            <motion.p 
                                                className='text-16 red'
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {passwordError}
                                            </motion.p>
                                        )}

                                    </AnimatePresence>

                                </div>

                            </Form>
                        </div>
                    </div>
                </section>
            </main>
        </OtherWrapper>
    )
}

function AccountDetailsForm({ userData }: { userData: any }) {
    const { setValue, reset } = useFormContext()

    useEffect(() => {
        if (userData) {
            // reset form with all default values at once
            reset({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                role: userData.role || '',
                company_name: userData.company_name || '',
                country: userData.country || '',
                state: userData.state || '',
                city: userData.city || '',
                zipcode: userData.zip_code || ''
            })
        }
    }, [userData, reset])

    return (
        <>
            <div className='row mt-smallest'>
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
                    <Input
                        id='account-role'
                        label='Role'
                        name='role'
                        type='text'
                        placeholder='Role'
                        maxLength={50}
                        labelAlwaysVisible
                    />	
                </div>

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
                        required
                        labelAlwaysVisible
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
        </>
    )
}