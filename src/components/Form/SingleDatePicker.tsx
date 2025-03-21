'use client'

// libraries
import clsx from 'clsx'
import { useFormContext, useController } from 'react-hook-form'
import { useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getYear, getMonth } from 'date-fns'

// svg
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react'

// css
import styles from './form.module.scss'

// db
import { months } from '@/db/months'

interface SingleDatePickerProps {
    name: string
    required?: boolean
    hideLabel?: boolean
    minDate: string // format: 'YYYY-MM-DD'
    maxDate: string // format: 'YYYY-MM-DD'
    defaultDate?: string // format: 'YYYY-MM-DD'
    hideValidations?: boolean
    hideArrows?: boolean
    className?: string
    placeholderText: string
    rules?: any // You can make this more specific if needed
}

export default function SingleDatePicker({
    name,
    required,
    hideLabel,
    minDate,
    maxDate,
    defaultDate,
    hideValidations,
    hideArrows,
    className,
    placeholderText,
    rules,
}: SingleDatePickerProps) {
    const { control, formState: { errors } } = useFormContext()

    // convert string dates to date objects
    const minDateObj = new Date(minDate + 'T00:00:00')
    const maxDateObj = new Date(maxDate + 'T00:00:00')
    const defaultDateObj = defaultDate ? new Date(defaultDate + 'T00:00:00') : null

    let validations = {}
    
    if (!hideValidations) {
        validations = {
            required: required && 'Please select a date'
        }
    }

    const { field } = useController({
        name,
        control,
        rules: {
            validate: {
                required: (value) => {
                    if (!required) return true
                    return value || 'Please select a date'
                },
                ...(rules?.validate || {})
            },
            ...rules
        },
        defaultValue: defaultDateObj
    })

    const handleDateChange = (date: Date | null) => {
        field.onChange(date)
    }

    const range = (start: number, end: number) => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    // reset component state on form reset
    useEffect(() => {
        const handleFormReset = () => {
            field.onChange(defaultDateObj)
        }

        document.addEventListener('formReset', handleFormReset)

        return () => {
            document.removeEventListener('formReset', handleFormReset)
        }
    }, [defaultDateObj, field])

    return (
        <div className={clsx(
            styles.formLine,
            className,
            hideLabel && styles.noLabel,
            !hideValidations && errors[name] && styles.error
        )}>
            {!hideLabel && (
                <p className={clsx(styles.label, 'text-16')}>
                    {name} {required && <span className='red'>*</span>}
                </p>
            )}

            <div className={clsx(
                styles.lineWrapper,
                styles.datePickerWrapper
            )}>
                <DatePicker
                    renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                        prevYearButtonDisabled,
                        nextYearButtonDisabled
                    }) => {

                        // get the years range based on start and end dates
                        const startYear = getYear(minDateObj)
                        const endYear = getYear(maxDateObj)
                        const years = range(startYear, endYear)
                    
                        // get available months based on the selected year
                        const getAvailableMonths = () => {
                            const currentYear = getYear(date)
                            const isStartYear = currentYear === startYear
                            const isEndYear = currentYear === endYear
                            
                            if (isStartYear && isEndYear) {
                                // if we're in the same year as both start and end dates
                                return months.filter((_, index) => 
                                    index >= getMonth(minDateObj) && 
                                    index <= getMonth(maxDateObj)
                                )
                            } else if (isStartYear) {
                                // if we're in the start year
                                return months.filter((_, index) => index >= getMonth(minDateObj))
                            } else if (isEndYear) {
                                // if we're in the end year
                                return months.filter((_, index) => index <= getMonth(maxDateObj))
                            }
                            
                            // if we're in a year between start and end
                            return months
                        }

                        const availableMonths = getAvailableMonths()

                        // Helper function to get the last available month for a year
                        const getLastAvailableMonth = (year: number) => {
                            if (year === endYear) {
                                return getMonth(maxDateObj)
                            }
                            return 11 // December for years between start and end
                        }

                        // Helper function to handle year change
                        const handleYearChange = (newYear: number) => {
                            const lastAvailableMonth = getLastAvailableMonth(newYear)
                            changeYear(newYear)
                            changeMonth(lastAvailableMonth)
                        }
                    
                        return (
                            <div className='react-datepicker__custom-header'>
                                
                                <div className='react-datepicker__selects'>
                                    <div className='select-wrapper'>

                                        <select
                                            value={months[getMonth(date)]}
                                            onChange={({ target: { value } }) =>
                                                changeMonth(months.indexOf(value))
                                            }
                                            className={clsx(styles.input, styles.select)}
                                        >
                                            {availableMonths.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>

                                        <span className='side-icon'>
                                            <ChevronDown />
                                        </span>

                                    </div>
                    
                                    <div className='select-wrapper'>

                                        <select
                                            value={getYear(date)}
                                            onChange={({ target: { value } }) => handleYearChange(Number(value))}
                                            className={clsx(styles.input, styles.select)}
                                        >
                                            {years.map((option: any) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>

                                        <span className='side-icon'>
                                            <ChevronDown />
                                        </span>

                                    </div>
                                </div>
                    
                                {!hideArrows && (
                                    <div className='react-datepicker__arrows'>
                                        
                                        <button
                                            type='button'
                                            aria-label='Previous Year'
                                            onClick={() => handleYearChange(getYear(date) - 1)}
                                            disabled={prevYearButtonDisabled}
                                        >
                                            <ChevronsLeft />
                                        </button>
                        
                                        <button
                                            type="button"
                                            aria-label="Previous Month"
                                            onClick={decreaseMonth}
                                            disabled={prevMonthButtonDisabled}
                                        >
                                            <ChevronLeft />
                                        </button>

                        
                                        <button
                                            type='button'
                                            aria-label='Next Month'
                                            onClick={increaseMonth}
                                            disabled={nextMonthButtonDisabled}
                                        >
                                            <ChevronRight />
                                        </button>
                        
                                        <button
                                            type='button'
                                            aria-label='Next Year'
                                            onClick={() => handleYearChange(getYear(date) + 1)}
                                            disabled={nextYearButtonDisabled}
                                        >
                                            <ChevronsRight />
                                        </button>

                                    </div>
                                )}

                            </div>
                        )
                    }}
                    className={styles.input}
                    selected={field.value}
                    onChange={handleDateChange}
                    minDate={minDateObj}
                    maxDate={maxDateObj}
                    placeholderText={placeholderText}
                    disabledKeyboardNavigation
                    customInput={
                        <input
                            inputMode='none'
                            aria-readonly={true}
                            required={required}
                            {...field}
                        />
                    }
                    onInputClick={() => {
                        const input = document.activeElement as HTMLElement
                        input?.blur()
                    }}
                />
            </div>

            {!hideValidations && errors[name] && (
                <p className={styles.errorMsg}>
                    {String(errors[name]?.message)}
                </p>
            )}
        </div>
    )
}