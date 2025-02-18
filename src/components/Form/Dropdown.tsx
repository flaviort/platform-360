'use client'

// libraries
import { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import React from 'react'

// svg
import { ChevronDown, Check } from 'lucide-react'

// css
import styles from './form.module.scss'

interface DropdownProps {
    label?: string
    hideLabel?: boolean
    required?: boolean
    className?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    defaultValue: string
    hideValidations?: boolean
    items: Array<{
        label: string
        name: string
    }>
    limitSelected?: number
}

export default function Dropdown({
    label,
    hideLabel,
    required,
    className,
    onChange = () => {},
    defaultValue,
    hideValidations,
    items,
    limitSelected
}: DropdownProps) {

    const { register, watch, trigger, formState: { errors } } = useFormContext()

    let validations: RegisterOptions = {
        onChange: (e) => onChange(e),
        required
    }

    const [selectedCount, setSelectedCount] = useState(0)
    const [buttonText, setButtonText] = useState<string | JSX.Element>(defaultValue)

    const values = items.map(item => watch(item.name))

    useEffect(() => {
        const selectedItems = values.filter(Boolean).length
        setSelectedCount(selectedItems)
    }, [values])
    
    useEffect(() => {
        if (selectedCount === 0) {
            setButtonText(defaultValue)
        } else {
            setButtonText(
                <>
                    <span>{selectedCount}</span> Item{selectedCount > 1 ? 's' : ''} selected
                </>
            )
        }
    }, [selectedCount, defaultValue])
    
    // fake select dropdown
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)
    const [selectedValue, setSelectedValue] = useState('')
    const buttonRef = useRef<HTMLButtonElement>(null)
    
    // bind a function on click to close the fake select dropdown if clicked outside
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node | null)) {
                setIsDropdownVisible(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    if (!hideValidations) {
        validations = {
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                if (limitSelected) {
                    const isChecked = e.target.checked
                    if (isChecked && selectedCount >= limitSelected) {
                        e.preventDefault()
                        return false
                    }
                    setSelectedCount(prev => isChecked ? prev + 1 : prev - 1)
                }
                onChange(e)
                await trigger()
            },
            validate: {
                required: () => {
                    const selectedItems = values.filter(Boolean).length
                    return selectedItems > 0 || 'Please select at least one option'
                },
                limitSelected: () => {
                    if (limitSelected && selectedCount > limitSelected) {
                        return `You can select up to ${limitSelected} item${limitSelected > 1 ? 's' : ''}.`
                    }
                    return true
                }
            }
        }
    }

    return (
        <div className={clsx(
            styles.formLine,
            className,
            hideLabel && styles.noLabel,
            !hideValidations && (
                items.some(item => errors[item.name]) || 
                errors.required || 
                errors.limitSelected
            ) && styles.error
        )}>

            {!hideLabel && (
                <p className={clsx(styles.label, 'text-16')}>
                    {label} {required && <span className='red'>*</span>}
                </p>
            )}

            <div
                className={clsx(
                    styles.lineWrapper,
                    styles.dropdownWrapper,
                    isDropdownVisible && styles.open
                )}
                ref={dropdownRef}
            >

                <div className={styles.dropdownInnerWrapper}>

                    <button
                        ref={buttonRef}
                        type='button'
                        className={clsx(
                            styles.input,
                            selectedValue !== '' && 'invisible'
                        )}
                        onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                    >
                        {buttonText}
                    </button>

                    <div className={styles.sideIcon}>
                        <ChevronDown />
                    </div>

                </div>

                <div className={clsx(
                    styles.options,
                    isDropdownVisible && styles.visible
                )}>
                    {items?.map((item, i) => (
                        <label className={styles.item} key={i}>

                            <input
                                type='checkbox'
                                className={styles.checkbox}
                                value={label}
                                disabled={Boolean(!watch(item.name) && limitSelected && selectedCount >= limitSelected)}
                                {...register(item.name, { ...validations })}
                            />

                            <span className={styles.checkboxWrapper}>

                                <span className={styles.check}>
                                    <Check />
                                </span>

                                <span className={clsx(styles.text, 'text-16')}>
                                    {item.label}
                                </span>

                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {!hideValidations && (
                <>
                    {(errors.required || errors.limitSelected || items.some(item => errors[item.name])) && (
                        <p className={styles.errorMsg}>
                            {String(
                                errors.required?.message || 
                                errors.limitSelected?.message || 
                                (items.find(item => errors[item.name])?.name && 
                                    errors[items.find(item => errors[item.name])?.name as string]?.message)
                            )}
                        </p>
                    )}
                </>
            )}

        </div>
    )
}