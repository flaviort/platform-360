// libraries
import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'

// css
import styles from './form.module.scss'

export interface TextareaProps {
    id: string
    label: string
    name: string
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
    name,
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
        watch,
        formState: {
            errors
        },
        setError,
        clearErrors
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

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (maxLength && e.target.value.length > maxLength) {
            e.target.value = e.target.value.slice(0, maxLength)
            setError(name, {
                type: 'maxLength',
                message: 'Maximum characters exceeded'
            })
        } else {
            clearErrors(name)
        }
    }

    return (
        <div className={clsx(
            styles.formLine,
            className,
            !hideValidations && errors[name] && styles.error
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
                    onInput={handleInput}
                    maxLength={maxLength}
                    {...register(name, validations)}
                />
            </div>

            {maxLength && (
                <p className={clsx(styles.helper, 'text-12 gray-400')}>
                    {maxLength - (watch(name)?.length || 0)} / {maxLength} characters
                </p>
            )}

            {!hideValidations && errors[name] && (
                <p className={clsx(styles.errorMsg, maxLength && styles.hasHelper)}>
                    {String(errors[name].message)}
                </p>
            )}

        </div>
    )
}