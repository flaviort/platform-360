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
    method?: string
    contentType?: string
    isFormData?: boolean
    onSuccess?: (data: any, formData?: any) => void 
    onError?: (error: any) => void
    clearOnSubmit?: boolean
    hideErrors?: boolean
    enableConsoleLog?: boolean
}

interface FormValues {
    [key: string]: any
}

export default function Form({
    className,
    children,
    endpoint,
    method,
    contentType,
    isFormData,
    onSuccess,
    onError,
    clearOnSubmit,
    hideErrors,
    enableConsoleLog
}: FormProps) {
    
    // refs
    const form = useRef<HTMLFormElement>(null)

    // form validations
    const methods = useForm({
        criteriaMode: 'all',
        mode: 'onChange',
        reValidateMode: 'onChange'
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
        if (contentType === 'application/x-www-form-urlencoded') {
            const formData = new URLSearchParams()
            for (const [key, value] of Object.entries(data)) {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString())
                }
            }
            body = formData
        } else if (isFormData) {
            const formData = new FormData()
            for (const [key, value] of Object.entries(data)) {
                if (value !== undefined && value !== null) {
                    formData.append(key, value)
                }
            }
            body = formData
        } else {
            body = JSON.stringify(data)
        }

        if(enableConsoleLog) {
            console.log('Submitting form data:', data)
        }

        fetch(endpoint, {
            method: method || 'post',
            body: body,
            headers: contentType === 'application/x-www-form-urlencoded' ? {
                'Content-Type': 'application/x-www-form-urlencoded'
            } : contentType ? {
                'Content-Type': contentType
            } : {}
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
                    onSuccess(responseData, data)  // Pass both response data and form data
            
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

                {!hideErrors && globalError && (
                    <span className={clsx(styles.globalError, 'text-16 red')}>
                        {globalError}
                    </span>
                )}

            </form>
        </FormProvider>
    )
}