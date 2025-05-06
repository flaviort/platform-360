// libraries
import clsx from 'clsx'
import { useFormContext, Controller } from 'react-hook-form'

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

    const { control, setError, clearErrors } = useFormContext() ?? {}

    const validationRules = !hideValidations ? {
        required: required && 'This field is required',
        maxLength: maxLength && {
            value: maxLength,
            message: `Maximum characters exceeded`
        },
        minLength: minLength && {
            value: minLength,
            message: `The message is too short`
        }
    } : {}

    return (
        <Controller
            name={name}
            control={control}
            rules={validationRules}
            render={({ field, fieldState }) => {
                const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    if (maxLength && e.target.value.length > maxLength) {
                        const truncated = e.target.value.slice(0, maxLength)
                        e.target.value = truncated
                        field.onChange(truncated)
                        
                        // set error manually as in original component
                        setError(name, {
                            type: 'maxLength',
                            message: 'Maximum characters exceeded'
                        })
                    } else {
                        field.onChange(e)
                        
                        // clear errors as in original component
                        clearErrors(name)
                    }
                }

                return (
                    <div className={clsx(
                        styles.formLine,
                        className,
                        !hideValidations && fieldState.error && styles.error
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
                                value={field.value || ''}
                                onChange={field.onChange} 
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                            />
                        </div>

                        {maxLength && (
                            <p className={clsx(styles.helper, 'text-12 gray-400')}>
                                {maxLength - (field.value?.length || 0)} / {maxLength} characters
                            </p>
                        )}

                        {!hideValidations && fieldState.error && (
                            <p className={clsx(styles.errorMsg, maxLength && styles.hasHelper)}>
                                {fieldState.error.message}
                            </p>
                        )}
                    </div>
                )
            }}
        />
    )
}