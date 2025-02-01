'use client'

// libraries
import clsx from 'clsx'
import React, { useRef, useState } from 'react'
import { useForm, FormProvider, useFormContext, SubmitHandler, RegisterOptions } from 'react-hook-form'

// svg
import { Check, LoaderCircle, ChevronDown, Eye, EyeOff } from 'lucide-react'

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

export const Form = ({
    className,
    children,
    endpoint,
    isFormData,
    onSuccess,
    onError,
    clearOnSubmit
}: FormProps) => {
    
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

export interface InputProps {
    id: string
    label: string
    labelAlwaysVisible?: boolean
    type: string
    placeholder: string
    className?: string
    required?: boolean
    maxLength?: number
    minLength?: number
    hideValidations?: boolean
    hidePasswordToggle?: boolean
    disabled?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    match?: string;
}

export const Input = ({
    id,
    label,
    labelAlwaysVisible,
    type,
    placeholder,
    className,
    required,
    maxLength,
    minLength,
    hideValidations,
    hidePasswordToggle,
    disabled,
    onChange = () => {},
    onKeyDown,
    match
}: InputProps) => {

    const { register, watch, formState: { errors } } = useFormContext()

    // watch the input value
    const inputValue = watch(label, '')

    // track focus state
    const [isFocused, setIsFocused] = useState(false)

    let validations: RegisterOptions = {
        onChange: (e) => onChange(e),
        required
    }

    if (match) {
        validations.validate = (value) => 
            value === watch(match) || 'Password does not match'
    }

    let text = type === 'password' ? 'password' : 'message'

    if (!hideValidations) {
        validations = {
            ...validations,
            required: required && 'This field is required',
            maxLength: maxLength && {
                value: maxLength,
                message: `Maximum characters exceeded`
            },
            minLength: minLength && {
                value: minLength,
                message: `The ${text} is too short`
            }
        }

        // add pattern validation for email type
        if (type === 'email') {
            validations = {
                ...validations,
                pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email'
                }
            } as {
                required: string | false | undefined
                maxLength: 0 | {
                    value: number
                    message: string
                } | undefined
                minLength: 0 | {
                    value: number
                    message: string
                } | undefined
                pattern: {
                    value: RegExp
                    message: string
                }
            }
        }
    }

    // track visibility for password fields
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    // decide which input type to use (if 'password', swap to 'text' when toggled)
    const currentInputType = type === 'password' && isPasswordVisible ? 'text' : type

    const handleTogglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && onKeyDown) {
            onKeyDown(event)
        }
    }

    // determine whether the label should shrink based on focus or input value
    const shouldShrinkLabel = isFocused || inputValue !== ''

    const isLabelAlwaysVisible = labelAlwaysVisible ? false : true

    return (
        <div className={clsx(
            styles.formLine,
            className,
            !hideValidations && errors[label] && styles.error
        )}>

            <label
                className={clsx(styles.label, 'text-16')}
                htmlFor={id}
                data-shrink={shouldShrinkLabel ? 'false' : isLabelAlwaysVisible}
            >
                {label} {required && <span className='red'>*</span>}
            </label>

            <div className={styles.lineWrapper}>

                <input
                    type={currentInputType}
                    id={id}
                    placeholder={placeholder}
                    className={styles.input}
                    disabled={disabled || false}
                    onKeyDown={handleKeyPress}
                    onFocus={() => setIsFocused(true)}
                    {...register(label, {
                        ...validations,
                        onBlur: () => {
                            setIsFocused(false)
                        }
                    })}
                />

                {type === 'password' && !hidePasswordToggle && (
                    <button
                        className={styles.sideIcon}
                        onClick={handleTogglePassword}
                        type='button'
                    >
                        {isPasswordVisible ? (
                            <EyeOff />
                        ) : (
                            <Eye />
                        )}
                    </button>
                )}

            </div>

            {!hideValidations && errors[label] && (
                <p className={styles.errorMsg}>
                    {String(errors[label].message)}
                </p>
            )}

        </div>
    )
}

export interface SelectProps {
    id: string
    label: string
    hideLabel?: boolean
    className?: string
    required?: boolean
    hideValidations?: boolean
    defaultValue?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    children: React.ReactNode,
    disabled?: boolean
}

export const Select = ({
    id,
    label,
    hideLabel,
    className,
    required,
    hideValidations,
    defaultValue,
    onChange = () => {},
    children,
    disabled
}: SelectProps) => {

    const { register, watch, formState: { errors } } = useFormContext()

    // watch the input value
    const inputValue = watch(label, '')

    // track focus state
    const [isFocused, setIsFocused] = useState(false)

    let validations: RegisterOptions = {
        onChange: (e) => onChange(e),
        required
    }
    
    if (!hideValidations) {
        validations = {
            required: required && 'This field is required'
        }
    }

    // determine whether the label should shrink based on focus or input value
    const shouldShrinkLabel = isFocused || inputValue !== ''

    return (
        <div className={clsx(
            styles.formLine,
            className,
            !hideValidations && errors[label] && styles.error
        )}>

            {!hideLabel && (
                <label
                    className={clsx(styles.label, 'text-16')}
                    htmlFor={id}
                    data-shrink={shouldShrinkLabel ? 'false' : 'true'}
                >
                    {label} {required && <span className='red'>*</span>}
                </label>
            )}

            <div className={styles.lineWrapper}>

                <select
                    id={id}
                    className={clsx(styles.input, styles.select)}
                    defaultValue={defaultValue}
                    disabled={disabled || false}
                    {...register(label, {
                        onChange: (e) => onChange && onChange(e),
                        ...validations
                    })}
                >
                    {children}
                </select>

                <span className={styles.sideIcon}>
                    <ChevronDown />
                </span>

            </div>

            {!hideValidations && errors[label] && (
                <p className={styles.errorMsg}>
                    {String(errors[label].message)}
                </p>
            )}

        </div>
    )
}

export interface TextareaProps {
    id: string
    label: string
    hideLabel?: boolean
    placeholder?: string
    className?: string
    required?: boolean
    maxLength?: number
    minLength?: number
    hideValidations?: boolean
}

export const Textarea = ({
    id,
    label,
    hideLabel,
    placeholder,
    required,
    minLength,
    maxLength,
    className,
    hideValidations
}: TextareaProps) => {

    const {
        register,
        formState: {
            errors
        }
    } = useFormContext() ?? {}

    let validations = {}
    
    if (!hideValidations) {
        validations = {
            required: required && 'This field is required',
            maxLength: maxLength && {
                value: maxLength,
                message: `Maximum characters exceeded`
            },
            minLength: minLength && {
                value: minLength,
                message: `The message is too short`
            }
        }
    }

    return (
        <div className={clsx(
            styles.formLine,
            className,
            !hideValidations && errors[label] && styles.error
        )}>

            {!hideLabel && (
                <label className={clsx(styles.label, 'text-16')} htmlFor={id}>
                    {label} {required && <span className='red'>*</span>}
                </label>
            )}

            <div className={styles.lineWrapper}>
                <textarea
                    id={id}
                    placeholder={placeholder}
                    className={clsx(styles.input, styles.textarea)}
                    {...register(label, validations)}
                />
            </div>

            {!hideValidations && errors[label] && (
                <p className={styles.errorMsg}>
                    {String(errors[label].message)}
                </p>
            )}

        </div>
    )
}

export interface InputHiddenProps {
    label: string
    value: string
}

export const InputHidden = ({
    label,
    value
}: InputHiddenProps) => {

    const {
        register
    } = useFormContext() ?? {}

    return (
        <input
            type='hidden'
            value={value}
            {...register(label)}
        />
    )
}

export interface SubmitProps {
    style: 'gradient-blue'
    text: string
    className?: string
}

export const Submit = ({
    style,
    text,
    className
}: SubmitProps) => {
    return (
        <button
            className={clsx(
                styles.submit,
                className,
                'button text-16',
                style === 'gradient-blue' && 'button--gradient-blue'
            )}
            type='submit'
        >

            <span className='button__text'>
                {text}
            </span>

            <span className='button__loading'>
                <span className='rotation' style={{ '--speed': '.5' } as any}>
                    <LoaderCircle />
                </span>
            </span>

        </button>
    )
}

export interface CheckboxProps {
    type: 'checkbox' | 'radio'
    id: string
    label: string
    name: string
    className?: string
    required?: boolean
    hideValidations?: boolean
    disabled?: boolean
    checked?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Checkbox = ({
    type,
    id,
    label,
    name,
    className,
    required,
    hideValidations,
    disabled,
    checked,
    onChange = () => {}
}: CheckboxProps) => {

    const { register, formState: { errors } } = useFormContext()

    let validations: RegisterOptions = {
        onChange: (e) => onChange(e),
        required
    }

    if (!hideValidations) {
        validations = {
            ...validations,
            required: required && 'This field is required'
        }
    }

    return (
        <label
            htmlFor={id}
            className={clsx(
                styles.radioWrapper,
                className
            )}
            data-error={errors[name] ? true : false}
            data-label
        >

            <input
                type={type}
                id={id}
                className={styles.checkbox}
                checked={checked}
                disabled={disabled || false}
                {...register(name, { ...validations })}
            />

            <span className={styles.radioWrapperInner}>

                <span className={styles.radioBox}>
                    <Check />
                </span>

                <span className={clsx(styles.radioText, 'text-14')}>
                    {label}
                </span>

            </span>

        </label>
    )
}