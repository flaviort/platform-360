'use client'

// libraries
import { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import { useFormContext, useController } from 'react-hook-form'
import React from 'react'

// svg
import { ChevronDown, Check, X } from 'lucide-react'

// css
import styles from './form.module.scss'

interface DropdownProps {
    label?: string
    hideLabel?: boolean
    required?: boolean
    className?: string
    defaultValue: string
    hideValidations?: boolean
    items: Array<{
        label: string
        name: string
    }>
    limitSelected?: number
    searchable?: boolean
    name: string
    id: string
    showHideAll?: boolean
}

export default function Dropdown({
    label,
    hideLabel,
    required,
    className,
    defaultValue,
    hideValidations,
    items,
    limitSelected,
    searchable,
    name,
    id,
    showHideAll,
}: DropdownProps) {

    const { register, watch, trigger, formState: { errors }, setValue, control } = useFormContext()

    const [selectedCount, setSelectedCount] = useState(0)
    const [buttonText, setButtonText] = useState<string | JSX.Element>(defaultValue)
    const [searchValue, setSearchValue] = useState('')

    const groupValue = watch(name) || {}
    
    useEffect(() => {
        const selectedItems = Object.values(groupValue).filter(Boolean).length
        setSelectedCount(selectedItems)
    }, [groupValue])
    
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

    // Register the group field
    const { field } = useController({
        name,
        control,
        rules: {
            validate: {
                required: (value) => {
                    if (!required) return true
                    const selectedItems = Object.values(value || {}).filter(Boolean).length
                    return selectedItems > 0 || 'Please select at least one option'
                },
                limitSelected: (value) => {
                    if (!limitSelected) return true
                    const selectedItems = Object.values(value || {}).filter(Boolean).length
                    return selectedItems <= limitSelected || 
                        `You can select up to ${limitSelected} item${limitSelected > 1 ? 's' : ''}`
                }
            }
        }
    })

    const handleCheckboxChange = (itemName: string, checked: boolean) => {
        const currentValue = field.value || {}
        setValue(name, {
            ...currentValue,
            [itemName]: checked
        }, { shouldValidate: true })
    }

    const handleSelectAll = () => {
        const filteredItems = items.filter(item => 
            item.label.toLowerCase().includes(searchValue.toLowerCase())
        )
        const itemsToSelect = limitSelected 
            ? filteredItems.slice(0, limitSelected) 
            : filteredItems
            
        const newValue: Record<string, boolean> = {}
        itemsToSelect.forEach(item => {
            newValue[item.name] = true
        })
        setValue(name, newValue, { shouldValidate: true })
    }

    const handleDeselectAll = () => {
        setValue(name, {}, { shouldValidate: true })
    }

    // reset component state on form reset
    useEffect(() => {
        const handleFormReset = () => {
            setIsDropdownVisible(false)
            setSearchValue('')
            setValue(name, {}, { shouldValidate: true })
        }

        document.addEventListener('formReset', handleFormReset)

        return () => {
            document.removeEventListener('formReset', handleFormReset) 
        }
    }, [name, setValue])

    return (
        <div className={clsx(
            styles.formLine,
            className,
            hideLabel && styles.noLabel,
            !hideValidations && errors[name] && styles.error
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
                        id={id}
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

                    {searchable && (
                        <div className={styles.search}>

                            <input
                                type='text'
                                placeholder='Search'
                                className={styles.input}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />

                            {searchValue && (
                                <button 
                                    type='button'
                                    className={styles.clear}
                                    onClick={() => setSearchValue('')}
                                >
                                    View All <X />
                                </button>
                            )}

                        </div>
                    )}

                    {showHideAll && (
                        <div className={styles.selectAll}>
                            <label className={styles.item}>

                                <input
                                    type='checkbox'
                                    className={styles.checkbox}
                                    checked={selectedCount === (limitSelected || items.length)}
                                    onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                                />

                                <span className={styles.checkboxWrapper}>
                                    
                                    <span className={styles.check}>
                                        <Check />
                                    </span>

                                    <span className={clsx(styles.text, 'text-16')}>
                                        {selectedCount === (limitSelected || items.length) ? 'Unselect All' : 'Select All'}
                                    </span>

                                </span>
                                
                            </label>
                        </div>
                    )}

                    {items?.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase())).map((item, i) => (
                        <label className={styles.item} key={i}>

                            <input
                                type='checkbox'
                                className={styles.checkbox}
                                checked={field.value?.[item.name] || false}
                                onChange={(e) => handleCheckboxChange(item.name, e.target.checked)}
                                disabled={Boolean(!field.value?.[item.name] && limitSelected && selectedCount >= limitSelected)}
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

            {!hideValidations && errors[name] && (
                <p className={styles.errorMsg}>
                    {String(errors[name]?.message)}
                </p>
            )}

        </div>
    )
}