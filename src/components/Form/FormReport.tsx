'use client'

// libraries
import { useRef, useState, useEffect } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import clsx from 'clsx'

// css
import styles from './form.module.scss'

export interface FormReportProps {
    className?: string
    children: React.ReactNode
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

export default function FormReport({
    className,
    children,
    onSuccess,
    onError,
    clearOnSubmit,
    hideErrors,
    enableConsoleLog,
    beforeSubmit
}: FormReportProps) {
    
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
                    //form.current.classList.remove('is-sending')
                    //document.dispatchEvent(new Event('formError'))
                }
                return
            }

            if(enableConsoleLog) {
                console.log('Submitting form data:', processedData)
            }

            // Call onSuccess with the processed data
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess(processedData, processedData)  // Pass both response data and form data
                
                    if(form.current) {
                        setTimeout(() => {
                            //form?.current?.classList.remove('is-sending')
                            //document.dispatchEvent(new Event('formSent'))  
                        }, 600)
                
                        if (clearOnSubmit) {
                            form?.current?.reset()
                            document.dispatchEvent(new Event('formReset'))
                        }
                    }
                }, fakeTimer)
            }
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

    useEffect(() => {
        if (form.current) {
            document.addEventListener('formSent', () => {
                if (form.current) {
                    form.current.classList.remove('is-sending')
                }
            })

            document.addEventListener('formError', () => {
                if (form.current) {
                    form.current.classList.remove('is-sending')
                }
            })
        }
    }, [])

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