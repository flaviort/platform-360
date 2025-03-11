'use client'

// libraries
import clsx from 'clsx'
import { useState } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'

// css
import styles from './form.module.scss'

interface PriceFormValues {
    [key: string]: {
        min: string
        max: string
    }
}

export interface PriceProps {
    id: string
    label: string
    name: string
    labelAlwaysVisible?: boolean
    hideLabel?: boolean
    className?: string
    required?: boolean
    maxLength?: number
    minLength?: number
    hideValidations?: boolean
    disabled?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function Price({
    id,
    label,
    name,
    labelAlwaysVisible,
    hideLabel,
    className,
    required,
    hideValidations,
    disabled,
    onChange = () => {},
    onKeyDown
}: PriceProps) {
    const { register, watch, formState: { errors } } = useFormContext<PriceFormValues>()

    // watch both input values
    const minValue = watch(`${name}.min`, '')
    const maxValue = watch(`${name}.max`, '')

    // track focus states separately for min and max
    const [isMinFocused, setIsMinFocused] = useState(false)
    const [isMaxFocused, setIsMaxFocused] = useState(false)

    // Base validations for both inputs
    const getValidations = (fieldName: 'min' | 'max'): RegisterOptions => ({
        required: required && {
            value: true,
            message: `${fieldName === 'min' ? 'Minimum' : 'Maximum'} price is required`
        },
        min: {
            value: 0,
            message: 'Price cannot be negative'
        },
        validate: {
            validRange: (value) => {
                if (fieldName === 'max' && minValue !== '' && Number(value) < Number(minValue)) {
                    return 'Must be greater than minimum price'
                }
                if (fieldName === 'min' && maxValue !== '' && Number(value) > Number(maxValue)) {
                    return 'Must be less than maximum price'
                }
                return true
            }
        },
        onChange: (e) => onChange(e)
    })

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && onKeyDown) {
            onKeyDown(event)
        }
    }

    // determine whether the label should shrink based on focus or input value
    const shouldShrinkLabel = isMinFocused || isMaxFocused || minValue !== '' || maxValue !== ''
    const isLabelAlwaysVisible = labelAlwaysVisible ? false : true

    // Helper functions to check for errors
    const hasMinError = errors[name as keyof PriceFormValues]?.min
    const hasMaxError = errors[name as keyof PriceFormValues]?.max

    return (
        <div className={clsx(
            styles.formLine,
            className,
            hideLabel && styles.noLabel
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
                <div className={styles.priceWrapper}>

                    <div className={clsx(styles.priceInput, !hideValidations && hasMinError && styles.error)}>

                        <span className={styles.currency}>
                            $
                        </span>

                        <input
                            type='number'
                            id={`${id}-min`}
                            placeholder='Min'
                            className={clsx(
                                styles.input,
                                !hideValidations && hasMinError && styles.error
                            )}
                            disabled={disabled || false}
                            onKeyDown={handleKeyPress}
                            onFocus={() => setIsMinFocused(true)}
                            {...register(`${name}.min`, {
                                ...getValidations('min'),
                                onBlur: () => setIsMinFocused(false)
                            })}
                        />

                        {!hideValidations && hasMinError && (
                            <p className={styles.errorMsg}>
                                {String(errors[name as keyof PriceFormValues]?.min?.message)}
                            </p>
                        )}

                    </div>

                    <span className={styles.separator}>-</span>

                    <div className={clsx(styles.priceInput, !hideValidations && hasMaxError && styles.error)}>

                        <span className={styles.currency}>
                            $
                        </span>

                        <input
                            type='number'
                            id={`${id}-max`}
                            placeholder='Max'
                            className={clsx(
                                styles.input,
                                !hideValidations && hasMaxError && styles.error
                            )}
                            disabled={disabled || false}
                            onKeyDown={handleKeyPress}
                            onFocus={() => setIsMaxFocused(true)}
                            {...register(`${name}.max`, {
                                ...getValidations('max'),
                                onBlur: () => setIsMaxFocused(false)
                            })}
                        />

                        {!hideValidations && hasMaxError && (
                            <p className={styles.errorMsg}>
                                {String(errors[name as keyof PriceFormValues]?.max?.message)}
                            </p>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}