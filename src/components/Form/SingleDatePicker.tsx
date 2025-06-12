'use client'

// libraries
import clsx from 'clsx'
import { useFormContext, useController } from 'react-hook-form'
import { useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// css
import styles from './form.module.scss'

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
    selectedDay?: 'firstDay' | 'lastDay'
}

export default function SingleDatePicker({
    name,
    required,
    hideLabel,
    minDate,
    maxDate,
    defaultDate,
    hideValidations,
    className,
    placeholderText,
    rules,
    selectedDay,
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
        if (!date) {
            field.onChange(null)
            return
        }

        let newDate = new Date(date)
        if (selectedDay === 'firstDay') {
            newDate.setDate(1)
        } else if (selectedDay === 'lastDay') {
            newDate.setMonth(newDate.getMonth() + 1)
            newDate.setDate(0)
        }
        console.log('Selected date:', newDate)
        field.onChange(newDate)
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
                    selected={field.value}
                    onChange={handleDateChange}
                    minDate={minDateObj}
                    maxDate={maxDateObj}
                    placeholderText={placeholderText}
                    disabledKeyboardNavigation
                    className={styles.input}
                    showMonthYearPicker
                    dateFormat='MMM / yyyy'
                    renderMonthContent={(month, shortMonth, longMonth, day) => {
                        const fullYear = new Date(day).getFullYear()
                        const tooltipText = `Month: ${longMonth} ${fullYear}`
                        return <span title={tooltipText}>{shortMonth}</span>
                    }}
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