'use client'

// libraries
import clsx from 'clsx'
import { useState } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'

// svg
import { Eye, EyeOff } from 'lucide-react'

// css
import styles from './form.module.scss'

export interface InputProps {
    id: string
    label: string
    name: string
    labelAlwaysVisible?: boolean
    hideLabel?: boolean
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

export default function Input({
    id,
    label,
    name,
    labelAlwaysVisible,
    hideLabel,
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
}: InputProps) {

    const { register, watch, formState: { errors } } = useFormContext()

    // watch the input value
    const inputValue = watch(name, '')

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
            hideLabel && styles.noLabel,
            !hideValidations && errors[name] && styles.error
        )}>

            {!hideLabel && (
                <label
                    className={clsx(styles.label, 'text-16')}
                    htmlFor={id}
                    data-shrink={shouldShrinkLabel ? 'false' : isLabelAlwaysVisible}
                >
                    {label} {required && <span className='red'>*</span>}
                </label>
            )}

            <div className={styles.lineWrapper}>

                <input
                    type={currentInputType}
                    id={id}
                    placeholder={placeholder}
                    className={styles.input}
                    disabled={disabled || false}
                    onKeyDown={handleKeyPress}
                    onFocus={() => setIsFocused(true)}
                    {...register(name, {
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

            {!hideValidations && errors[name] && (
                <p className={styles.errorMsg}>
                    {String(errors[name].message)}
                </p>
            )}

        </div>
    )
}