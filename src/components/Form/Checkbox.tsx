// libraries
import clsx from 'clsx'
import { useFormContext, RegisterOptions } from 'react-hook-form'

// svg
import { Check } from 'lucide-react'

// css
import styles from './form.module.scss'

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

export default function Checkbox({
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
}: CheckboxProps) {

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
                className,
                errors[name] && styles.error
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

                {type === 'radio' ? (
                    <span className={clsx(styles.radioBox, styles.circle)}>
                        <span className={styles.circleInner}></span>
                    </span>
                ) : (
                    <span className={styles.radioBox}>
                        <Check />
                    </span>
                )}
                

                <span className={clsx(styles.radioText, 'text-14')}>
                    {label}
                </span>

            </span>

        </label>
    )
}