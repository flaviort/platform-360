'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import clsx from 'clsx'
import { ChevronDown, Check, X } from 'lucide-react'

// Import existing styles
import styles from '../../Form/form.module.scss'

interface SearchItem {
    name: string
    label: string
}

interface CustomSearchProps {
    defaultValue: string
    items: SearchItem[]
    limitSelected?: number
    required?: boolean
    name: string
    id: string
    onSearch: (query: string) => void
    isLoading?: boolean
    onFieldChange?: (name: string, value: Record<string, boolean>) => void
}

export default function CustomSearch({
    defaultValue,
    items,
    limitSelected,
    required,
    name,
    id,
    onSearch,
    isLoading = false,
    onFieldChange,
}: CustomSearchProps) {
    const { watch, formState: { errors }, setValue, control } = useFormContext()
    
    const [selectedCount, setSelectedCount] = useState(0)
    const [buttonText, setButtonText] = useState<string | JSX.Element>(defaultValue)
    const [searchValue, setSearchValue] = useState('')
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)
    
    // References for DOM elements
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    
    // Get the current value of the form field
    const groupValue = watch(name) || {}
    
    // Register field with form context
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
    
    // Update selectedCount when groupValue changes
    useEffect(() => {
        const selectedItems = Object.values(groupValue).filter(Boolean).length
        setSelectedCount(selectedItems)
    }, [groupValue])
    
    // Update buttonText when selectedCount changes
    useEffect(() => {
        if (selectedCount === 0) {
            setButtonText(defaultValue)
        } else {
            // Find selected items and create buttons for each
            const selectedItemsArray = items.filter(item => groupValue[item.name])
            
            setButtonText(
                <span className={styles.selectedItems}>
                    {selectedItemsArray.map((item, index) => (
                        <span
                            key={index}
                            className={styles.button}
                            onClick={(e) => {
                                e.stopPropagation() // Prevent dropdown from toggling
                                handleDeselectItem(item.name)
                            }}
                        >
                            {typeof item.label === 'string' ? item.label : String(item.label || '')} <X size={14} />
                        </span>
                    ))}
                </span>
            )
        }
    }, [selectedCount, defaultValue, groupValue, items])
    
    // Click outside handler
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
    
    // Handle checkbox changes
    const handleCheckboxChange = useCallback((itemName: string, checked: boolean) => {
        const currentValue = field.value || {}
        const newValue = {
            ...currentValue,
            [itemName]: checked
        }
        
        setValue(name, newValue, { shouldValidate: true })
        
        // Notify parent component
        if (onFieldChange) {
            onFieldChange(name, newValue)
        }
    }, [field.value, name, onFieldChange, setValue])
    
    // Handle deselection
    const handleDeselectItem = useCallback((itemName: string) => {
        const currentValue = field.value || {}
        const newValue = {
            ...currentValue,
            [itemName]: false
        }
        setValue(name, newValue, { shouldValidate: true })
        
        if (onFieldChange) {
            onFieldChange(name, newValue)
        }
    }, [field.value, name, onFieldChange, setValue])
    
    // Handle search input changes
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchValue(query)
        
        if (onSearch) {
            onSearch(query)
        }
    }, [onSearch])
    
    // Separate selected items from unselected
    const selectedItems = items.filter(item => groupValue[item.name])
    const unselectedItems = items.filter(item => !groupValue[item.name])
    
    return (
        <div className={clsx(
            styles.formLine,
            errors[name] && styles.error
        )}>
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
                        className={clsx(styles.input, 'capitalize')}
                        id={id}
                        onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                    >
                        {buttonText}
                    </button>

                    <div className={styles.sideIcon}>
                        <ChevronDown />
                    </div>

                    {selectedCount > 0 && isDropdownVisible && (
                        <div className={styles.close}>
                            <button
                                type='button'
                                className='button text-14 button--gradient-purple'
                                onClick={() => setIsDropdownVisible(false)}
                            >
                                Proceed
                            </button>
                        </div>
                    )}
                    
                </div>

                <div className={clsx(
                    styles.options,
                    isDropdownVisible && styles.visible
                )}>

                    {/* Search Input */}
                    <div className={styles.search}>
                        <input
                            type='text'
                            placeholder='Search'
                            className={styles.input}
                            value={searchValue}
                            onChange={handleSearchChange}
                        />

                        {searchValue && (
                            <button 
                                type='button'
                                className={styles.clear}
                                onClick={() => {
                                    setSearchValue('')
                                    if (onSearch) onSearch('')
                                }}
                            >
                                Clear <X />
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className={styles.item}>
                            <span className={clsx(styles.text, 'text-16')}>
                                Loading brands...
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Selected Items */}
                            {selectedItems.length > 0 && (
                                <>
                                    {selectedItems.map((item, i) => (
                                        <label className={styles.item} key={`selected-${i}`}>
                                            
                                            <input
                                                type='checkbox'
                                                className={styles.checkbox}
                                                checked={true}
                                                onChange={() => handleCheckboxChange(item.name, false)}
                                            />

                                            <span className={styles.checkboxWrapper}>
                                                
                                                <span className={styles.check}>
                                                    <Check />
                                                </span>

                                                <span className={clsx(styles.text, 'text-16 capitalize')}>
                                                    {typeof item.label === 'string' ? item.label : String(item.label || '')}
                                                </span>

                                            </span>
                                        </label>
                                    ))}
                                    
                                    {unselectedItems.length > 0 && <div className={styles.divider}></div>}
                                </>
                            )}
                            
                            {/* Unselected Items - No client-side filtering */}
                            {unselectedItems.length === 0 && searchValue.length >= 2 ? (
                                <div className={styles.item}>
                                    <span className={clsx(styles.text, 'text-16')}>
                                        No brands found
                                    </span>
                                </div>
                            ) : (
                                unselectedItems.map((item, i) => (
                                    <label className={styles.item} key={`unselected-${i}`}>
                                        <input
                                            type='checkbox'
                                            className={styles.checkbox}
                                            checked={false}
                                            onChange={() => handleCheckboxChange(item.name, true)}
                                            disabled={Boolean(limitSelected && selectedCount >= limitSelected)}
                                        />
                                        <span className={styles.checkboxWrapper}>
                                            <span className={styles.check}>
                                                <Check />
                                            </span>
                                            <span className={clsx(styles.text, 'text-16')}>
                                                {typeof item.label === 'string' ? item.label : String(item.label || '')}
                                            </span>
                                        </span>
                                    </label>
                                ))
                            )}
                        </>
                    )}
                    
                </div>
            </div>

            {errors[name] && (
                <p className={styles.errorMsg}>
                    {String(errors[name]?.message)}
                </p>
            )}
        </div>
    )
} 