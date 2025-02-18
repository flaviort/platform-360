'use client'

// libraries
import { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import { useFormContext, RegisterOptions } from 'react-hook-form'

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

    if (!hideValidations) {
        validations = {
            required: required && 'This field is required',
            validate: {
                limitSelected: (value) => {
                    //return `You can select up to ${limitSelected} item${limitSelected > 1 ? 's' : ''}.`
                    return true
                }
            }
        }
    }
    
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

    return (
        <div className={clsx(
            styles.formLine,
            className,
            hideLabel && styles.noLabel
        )}>

            {!hideLabel && (
                <p
                    className={clsx(styles.label, 'text-16')}
                    //data-shrink={shouldShrinkLabel ? 'false' : isLabelAlwaysVisible}
                >
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
                        //onBlur={() => selectedValue === '' && trigger(label)}
                    >
                        {defaultValue}
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
                                required
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

            {/*!hideValidations && errors && (
                <p className={styles.errorMsg}>
                    {String(errors.message)}
                </p>
            )*/}

        </div>
    )
}