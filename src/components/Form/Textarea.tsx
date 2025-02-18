// libraries
import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'

// css
import styles from './form.module.scss'

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

export default function Textarea({
    id,
    label,
    hideLabel,
    placeholder,
    required,
    minLength,
    maxLength,
    className,
    hideValidations
}: TextareaProps) {

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