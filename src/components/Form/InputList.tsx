'use client'

// libraries
import clsx from 'clsx'
import { useState } from 'react'
import { useFormContext, RegisterOptions, FieldErrors, FieldErrorsImpl } from 'react-hook-form'

// svg
import { Plus, X } from 'lucide-react'

// css
import styles from './form.module.scss'

export interface InputListProps {
    id: string
    label: string
    name: string
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
    limit: number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    match?: string
}

export default function InputList({
    id,
    label,
    name,
    hideLabel,
    placeholder,
    className,
    required,
    maxLength,
    minLength,
    hideValidations,
    disabled,
    limit,
    onChange = () => {},
    onKeyDown
}: InputListProps) {
    const { register, watch, formState: { errors }, setValue } = useFormContext()
    
    // Track the number of input fields
    const [inputCount, setInputCount] = useState(1)
    
    // Watch all input values using array syntax
    const inputValues = watch(name) || ['']

    // track focus states for each input
    const [focusedInputs, setFocusedInputs] = useState<boolean[]>([false])

    const addInput = () => {
        if (inputCount < limit) {
            setInputCount(prev => prev + 1)
            setFocusedInputs(prev => [...prev, false])
            
            // Add new empty value to the form
            const newValues = [...inputValues, '']
            setValue(name, newValues)
        }
    }

    const removeInput = (index: number) => {
        if (inputCount > 1) {
            setInputCount(prev => prev - 1)
            
            // Remove the focused state for this input
            const newFocusedInputs = [...focusedInputs]
            newFocusedInputs.splice(index, 1)
            setFocusedInputs(newFocusedInputs)
            
            // Remove the value from the form
            const newValues = [...inputValues]
            newValues.splice(index, 1)
            setValue(name, newValues)
        }
    }

    // Helper function to check if a specific input has an error
    const hasInputError = (index: number) => {
        return errors[name] && (errors[name] as unknown as FieldErrorsImpl<{ [key: number]: any }>)?.[index]
    }

    // Helper function to get error message for a specific input
    const getInputErrorMessage = (index: number) => {
        if (!errors[name] || !(errors[name] as unknown as FieldErrorsImpl<{ [key: number]: any }>)?.[index]) return null
        return (errors[name] as unknown as FieldErrorsImpl<{ [key: number]: any }>)[index]?.message
    }

    let validations: RegisterOptions = {
        onChange: (e) => onChange(e)
        // Remove the required from here as we'll handle it per input
    }

    if (!hideValidations) {
        validations = {
            ...validations,
            maxLength: maxLength && {
                value: maxLength,
                message: `Maximum characters exceeded`
            },
            minLength: minLength && {
                value: minLength,
                message: `The text is too short`
            }
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && onKeyDown) {
            onKeyDown(event)
        }
    }

    return (
        <div className={clsx(
            styles.formLine,
            styles.inputList,
            className,
            hideLabel && styles.noLabel
        )}>
            {!hideLabel && (
                <label
                    className={clsx(styles.label, 'text-16')}
                    htmlFor={id}
                >
                    {label} {required && <span className='red'>*</span>}
                </label>
            )}

            {Array.from({ length: inputCount }).map((_, index) => (
                <div key={index} className={styles.lineWrapper}>
                    <div className={clsx(styles.inputContainer, !hideValidations && hasInputError(index) && styles.error)}>
                        
                        <input
                            type='text'
                            id={`${id}-${index}`}
                            placeholder={placeholder}
                            className={clsx(
                                styles.input,
                                !hideValidations && hasInputError(index) && styles.error
                            )}
                            disabled={disabled || false}
                            onKeyDown={handleKeyPress}
                            onFocus={() => {
                                const newFocusedInputs = [...focusedInputs]
                                newFocusedInputs[index] = true
                                setFocusedInputs(newFocusedInputs)
                            }}
                            {...register(`${name}.${index}`, {
                                ...validations,
                                required: required && {
                                    value: true,
                                    message: 'This field is required'
                                },
                                onBlur: () => {
                                    const newFocusedInputs = [...focusedInputs]
                                    newFocusedInputs[index] = false
                                    setFocusedInputs(newFocusedInputs)
                                }
                            })}
                        />

                        {!hideValidations && hasInputError(index) && (
                            <p className={styles.errorMsg}>
                                {getInputErrorMessage(index) as string}
                            </p>
                        )}

                    </div>
                    
                    {inputCount > 1 && (
                        <button 
                            type='button' 
                            onClick={() => removeInput(index)}
                            className={styles.removeButton}
                        >
                            Remove <X />
                        </button>
                    )}
                </div>
            ))}

            {inputCount < limit && (
                <button 
                    type='button' 
                    onClick={addInput}
                    className={clsx(styles.addButton, 'button text-16 button--gradient-purple')}
                >
                    Add another <Plus />
                </button>
            )}
        </div>
    )
}