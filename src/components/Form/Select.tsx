// libraries
import clsx from 'clsx'
import { useState } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'

// svg
import { ChevronDown } from 'lucide-react'

// css
import styles from './form.module.scss'

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

export default function Select({
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
}: SelectProps) {

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
            hideLabel && styles.noLabel,
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