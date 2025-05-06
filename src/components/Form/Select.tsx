// libraries
import clsx from 'clsx'
import { useFormContext, Controller } from 'react-hook-form'

// svg
import { ChevronDown } from 'lucide-react'

// css
import styles from './form.module.scss'

export interface SelectProps {
    id: string
    label: string
    name: string
    hideLabel?: boolean
    className?: string
    selectClassName?: string
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
    name,
    hideLabel,
    className,
    selectClassName,
    required,
    hideValidations,
    defaultValue,
    onChange = () => {},
    children,
    disabled
}: SelectProps) {

    const { control } = useFormContext()

    const validationRules = !hideValidations ? {
        required: required && 'This field is required'
    } : {}

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ''}
            rules={validationRules}
            render={({ field, fieldState }) => {
                
                const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                    field.onChange(e)
                    onChange && onChange(e)
                }

                return (
                    <div className={clsx(
                        styles.formLine,
                        className,
                        hideLabel && styles.noLabel,
                        !hideValidations && fieldState.error && styles.error
                    )}>
                        {!hideLabel && (
                            <label
                                className={clsx(styles.label, 'text-16')}
                                htmlFor={id}
                            >
                                {label} {required && <span className='red'>*</span>}
                            </label>
                        )}

                        <div className={styles.lineWrapper}>
                            <select
                                id={id}
                                className={clsx(styles.input, styles.select, selectClassName)}
                                disabled={disabled || false}
                                value={field.value}
                                onChange={handleChange}
                                name={field.name}
                                ref={field.ref}
                            >
                                {children}
                            </select>

                            <span className={styles.sideIcon}>
                                <ChevronDown />
                            </span>
                        </div>

                        {!hideValidations && fieldState.error && (
                            <p className={styles.errorMsg}>
                                {fieldState.error.message}
                            </p>
                        )}
                    </div>
                )
            }}
        />
    )
}