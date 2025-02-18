'use client'

// libraries
import clsx from 'clsx'
import { useRef, useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'

// css
import styles from './form.module.scss'

export interface FormProps {
    className?: string
    children: React.ReactNode
    endpoint: string
    isFormData?: boolean
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
    clearOnSubmit?: boolean
}

interface FormValues {
    [key: string]: any
}

export default function Form({
    className,
    children,
    endpoint,
    isFormData,
    onSuccess,
    onError,
    clearOnSubmit
}: FormProps) {
    
    // refs
    const form = useRef<HTMLFormElement>(null)

    // form validations
    const methods = useForm({
        criteriaMode: 'all',
        mode: 'all'
    })

    // local state for any global errors
    const [globalError, setGlobalError] = useState('')

    // submit function
    const onSubmit: SubmitHandler<FormValues> = async (data) => {

        // clear any old error messages
        setGlobalError('')

        // fake response time (1s)
        let fakeTimer = 1000

        if (form.current) {
            (form.current as HTMLElement).classList.add('is-sending')
            document.dispatchEvent(new Event('formSending'))
        }

        let body

        if(isFormData) {
            const formData = new FormData()

            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })

            body = formData
        } else {
            body = JSON.stringify(data)
        }

        fetch(endpoint, {
            method: 'post',
            body: body
        })

        .then(async (response) => {
            if (!response.ok) {
                // if the response is not ok, we try to parse the error message
                const errBody = await response.json().catch(() => ({}))
                const message = errBody.message || 'Something went wrong'
                throw new Error(message)
            }

            // if response is ok, parse the JSON
            return response.json()
        })

        // if success
        .then((responseData) => {
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess(responseData)

                    if(form.current) {
                        setTimeout(() => {
                            form?.current?.classList.remove('is-sending')
                            document.dispatchEvent(new Event('formSent'))  
                        }, 600)

                        if (clearOnSubmit) {
                            form?.current?.reset()
                            document.dispatchEvent(new Event('formReset'))
                        }
                    }
                }, fakeTimer)
            }
        })

        // if error
        .catch(error => {
            setTimeout(() => {
                //console.error('Error:', error)
                setGlobalError(error.message)
            }, fakeTimer)

            if (onError) {
                setTimeout(() => {
                    onError(error)

                    if (form.current) {
                        form.current.classList.remove('is-sending')
                        document.dispatchEvent(new Event('formError'))
                    }
                }, fakeTimer)
            }
        })
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className={clsx(styles.form, className)}
                ref={form}
            >

                {children}

                {globalError && (
                    <span className={clsx(styles.globalError, 'text-16 red')}>
                        {globalError}
                    </span>
                )}

            </form>
        </FormProvider>
    )
}