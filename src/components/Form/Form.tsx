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
    beforeSubmit?: (data: any) => any
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
    enableConsoleLog,
    beforeSubmit
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

        try {
            // process form data before submission if beforeSubmit is provided
            const processedData = beforeSubmit ? beforeSubmit(data) : data

            // If beforeSubmit returned false, stop submission
            if (processedData === false) {
                if (form.current) {
                    form.current.classList.remove('is-sending')
                    document.dispatchEvent(new Event('formError'))
                }
                return
            }

            let body
            
            if (contentType === 'application/x-www-form-urlencoded') {
                const formData = new URLSearchParams()
                for (const [key, value] of Object.entries(processedData)) {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value.toString())
                    }
                }
                body = formData
            } else if (isFormData) {
                const formData = new FormData()
                for (const [key, value] of Object.entries(processedData)) {
                    if (value !== undefined && value !== null) {
                        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
                        formData.append(key, stringValue)
                    }
                }
                body = formData
            } else {
                body = JSON.stringify(processedData)
            }

            if(enableConsoleLog) {
                console.log('Submitting form data:', processedData)
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
                        onSuccess(responseData, processedData)  // Pass both response data and form data
                
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
        } catch (error) {
            // If an error occurs, set global error and call onError
            setTimeout(() => {
                setGlobalError(error instanceof Error ? error.message : 'An error occurred')
            }, fakeTimer)

            if (onError) {
                setTimeout(() => {
                    onError(error instanceof Error ? error : new Error('An error occurred'))

                    if (form.current) {
                        form.current.classList.remove('is-sending')
                        document.dispatchEvent(new Event('formError'))
                    }
                }, fakeTimer)
            }
        }
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