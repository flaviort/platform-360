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

interface SearchProps {
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
    onSearch?: (query: string) => void
    isLoading?: boolean
    onFieldChange?: (name: string, value: Record<string, boolean>) => void
}

export default function Search({
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
    onSearch,
    isLoading = false,
    onFieldChange,
}: SearchProps) {

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
        const newValue = {
            ...currentValue,
            [itemName]: checked
        }
        
        setValue(name, newValue, { shouldValidate: true })
        
        // Notify parent component about field changes
        if (onFieldChange) {
            onFieldChange(name, newValue)
        }
    }

    const handleSelectAll = () => {
        const filteredItems = items.filter(item => {
            const itemLabel = typeof item.label === 'string' ? item.label : String(item.label || '')
            return itemLabel.toLowerCase().includes(searchValue.toLowerCase())
        })
        const itemsToSelect = limitSelected 
            ? filteredItems.slice(0, limitSelected) 
            : filteredItems
            
        const newValue: Record<string, boolean> = {}
        itemsToSelect.forEach(item => {
            newValue[item.name] = true
        })
        setValue(name, newValue, { shouldValidate: true })
        
        // Notify parent component about field changes
        if (onFieldChange) {
            onFieldChange(name, newValue)
        }
    }

    const handleDeselectAll = () => {
        const newValue = {}
        setValue(name, newValue, { shouldValidate: true })
        
        // Notify parent component about field changes
        if (onFieldChange) {
            onFieldChange(name, newValue)
        }
    }

    const handleDeselectItem = (itemName: string) => {
        const currentValue = field.value || {}
        const newValue = {
            ...currentValue,
            [itemName]: false
        }
        setValue(name, newValue, { shouldValidate: true })
        
        // Notify parent component about field changes
        if (onFieldChange) {
            onFieldChange(name, newValue)
        }
    }

    // reset component state on form reset
    useEffect(() => {
        const handleFormReset = () => {
            setIsDropdownVisible(false)
            setSearchValue('')
            const newValue = {}
            setValue(name, newValue, { shouldValidate: true })
            
            // Notify parent component about field changes
            if (onFieldChange) {
                onFieldChange(name, newValue)
            }
        }

        document.addEventListener('formReset', handleFormReset)

        return () => {
            document.removeEventListener('formReset', handleFormReset) 
        }
    }, [name, setValue, onFieldChange])
    
    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchValue(query)
        
        if (onSearch) {
            onSearch(query)
        }
    }

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

                    {isLoading ? (
                        <div className={styles.item}>
                            <span className={clsx(styles.text, 'text-16')}>
                                Loading brands...
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Always show selected items first */}
                            {items.filter(item => field.value?.[item.name]).map((item, i) => (
                                <label className={styles.item} key={`selected-${i}`}>
                                    <input
                                        type='checkbox'
                                        className={styles.checkbox}
                                        checked={true}
                                        onChange={(e) => handleCheckboxChange(item.name, e.target.checked)}
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
                            ))}
                            
                            {/* Show divider if there are both selected items and search results */}
                            {items.some(item => field.value?.[item.name]) && 
                             items.some(item => {
                                const itemLabel = typeof item.label === 'string' ? item.label : String(item.label || '')
                                return !field.value?.[item.name] && 
                                  (!searchValue || itemLabel.toLowerCase().includes(searchValue.toLowerCase()))
                             }) && (
                                <div className={styles.divider}></div>
                            )}
                            
                            {/* Show unselected items that match search */}
                            {items.length === 0 && searchValue.length >= 2 ? (
                                <div className={styles.item}>
                                    <span className={clsx(styles.text, 'text-16')}>
                                        No brands found
                                    </span>
                                </div>
                            ) : (
                                items
                                    .filter(item => {
                                        const itemLabel = typeof item.label === 'string' ? item.label : String(item.label || '')
                                        return !field.value?.[item.name] && 
                                            (!searchValue || itemLabel.toLowerCase().includes(searchValue.toLowerCase()))
                                    })
                                    .map((item, i) => (
                                        <label className={styles.item} key={`unselected-${i}`}>
                                            <input
                                                type='checkbox'
                                                className={styles.checkbox}
                                                checked={false}
                                                onChange={(e) => handleCheckboxChange(item.name, e.target.checked)}
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

            {!hideValidations && errors[name] && (
                <p className={styles.errorMsg}>
                    {String(errors[name]?.message)}
                </p>
            )}

        </div>
    )
}