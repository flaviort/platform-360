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

interface DateRangeProps {
    name: string
    required?: boolean
    hideLabel?: boolean
    startDate: string // format: 'YYYY-MM-DD'
    endDate: string // format: 'YYYY-MM-DD'
    defaultStartDate?: string // format: 'YYYY-MM-DD'
    defaultEndDate?: string // format: 'YYYY-MM-DD'
    hideValidations?: boolean
    hideArrows?: boolean
    className?: string
}

export default function DateRange({
    name,
    required,
    hideLabel,
    startDate,
    endDate,
    defaultStartDate,
    defaultEndDate,
    hideValidations,
    hideArrows,
    className
}: DateRangeProps) {
    const { control, formState: { errors } } = useFormContext()

    // convert string dates to date objects
    const startDateObj = new Date(startDate + 'T00:00:00')
    const endDateObj = new Date(endDate + 'T00:00:00')
    const defaultStartDateObj = defaultStartDate ? new Date(defaultStartDate + 'T00:00:00') : null
    const defaultEndDateObj = defaultEndDate ? new Date(defaultEndDate + 'T00:00:00') : null

    let validations = {}
    
    if (!hideValidations) {
        validations = {
            required: required && 'Please select both start and end dates'
        }
    }

    const { field } = useController({
        name,
        control,
        rules: {
            validate: {
                required: (value) => {
                    if (!required) return true
                    return (value && value[0] && value[1]) || 'Please select both start and end dates'
                }
            }
        },
        defaultValue: [defaultStartDateObj, defaultEndDateObj]
    })

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        field.onChange(dates)
    }

    const range = (start: number, end: number) => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    // reset component state on form reset
    useEffect(() => {
        const handleFormReset = () => {
            field.onChange([defaultStartDateObj, defaultEndDateObj])
        }

        document.addEventListener('formReset', handleFormReset)

        return () => {
            document.removeEventListener('formReset', handleFormReset)
        }
    }, [defaultStartDateObj, defaultEndDateObj, field])

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
                styles.dateRangeWrapper
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
                        const startYear = getYear(startDateObj)
                        const endYear = getYear(endDateObj)
                        const years = range(startYear, endYear)
                    
                        // get available months based on the selected year
                        const getAvailableMonths = () => {
                            const currentYear = getYear(date)
                            const isStartYear = currentYear === startYear
                            const isEndYear = currentYear === endYear
                            
                            if (isStartYear && isEndYear) {
                                // if we're in the same year as both start and end dates
                                return months.filter((_, index) => 
                                    index >= getMonth(startDateObj) && 
                                    index <= getMonth(endDateObj)
                                )
                            } else if (isStartYear) {
                                // if we're in the start year
                                return months.filter((_, index) => index >= getMonth(startDateObj))
                            } else if (isEndYear) {
                                // if we're in the end year
                                return months.filter((_, index) => index <= getMonth(endDateObj))
                            }
                            
                            // if we're in a year between start and end
                            return months
                        }

                        const availableMonths = getAvailableMonths()

                        // Helper function to get the last available month for a year
                        const getLastAvailableMonth = (year: number) => {
                            if (year === endYear) {
                                return getMonth(endDateObj)
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
                    selected={field.value?.[0]}
                    selectsRange
                    startDate={field.value?.[0]}
                    endDate={field.value?.[1]}
                    minDate={startDateObj}
                    maxDate={endDateObj}
                    onChange={(dates) => handleDateChange(dates as [Date | null, Date | null])}
                    placeholderText='From - To'
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