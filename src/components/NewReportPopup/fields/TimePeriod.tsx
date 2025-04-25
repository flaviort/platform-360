'use client'

// libraries
import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'
import { useEffect, useState } from 'react'

// components
import SingleDatePicker from '@/components/Form/SingleDatePicker'

// css
import styles from '../index.module.scss'

export default function TimePeriod() {
	const { watch, formState: { errors }, trigger, setValue, register } = useFormContext()
	
	// Watch both date values
	const startDate = watch('timePeriodStart')
	const endDate = watch('timePeriodEnd')
	
	// Register the fields with required validation at the form level
	useEffect(() => {
		// Register the date fields with required validation
		register('timePeriodStart', { 
			required: 'This field is required',
			validate: {
				startDateValidation: (value: Date | null) => {
					if (!value) return 'This field is required'
					if (endDate && value > endDate) {
						return 'Start date must be before end date'
					}
					return true
				}
			}
		})
		
		register('timePeriodEnd', { 
			required: 'This field is required',
			validate: {
				endDateValidation: (value: Date | null) => {
					if (!value) return 'This field is required'
					if (startDate && value < startDate) {
						return 'End date must be after start date'
					}
					return true
				}
			}
		})
	}, [register, startDate, endDate])
	
	// Trigger validation when either date changes
	useEffect(() => {
		if (startDate || endDate) {
			trigger(['timePeriodStart', 'timePeriodEnd'])
		}
	}, [startDate, endDate, trigger])

	// Listen for validation events
	useEffect(() => {
		const handleValidateTimePeriod = () => {
			console.log('TimePeriod component: Received validation request')
			
			// Simply trigger React Hook Form validation for the date fields
			// Let React Hook Form handle showing the errors
			trigger('timePeriodStart')
			trigger('timePeriodEnd')
		}

		// Listen for the validation event
		document.addEventListener('validateTimePeriod', handleValidateTimePeriod)

		// Clean up
		return () => {
			document.removeEventListener('validateTimePeriod', handleValidateTimePeriod)
		}
	}, [trigger])

	return (
		<div className={styles.group}>

            <div className={styles.label}>
                <label htmlFor='report-time-period' className='text-16 semi-bold'>
                    Time Period <span className='red'>*</span>
                </label>
            </div>

            <div className={clsx(styles.input, styles.timePeriod)}>
                
                <div className={clsx(styles.dateContainer, errors.timePeriodStart && styles.error)}>

                    <SingleDatePicker
                        name='timePeriodStart'
                        required
                        hideLabel
                        minDate='2018-01-01'
                        maxDate='2025-03-10'
                        placeholderText='Start date'
                        hideValidations
                    />

                    {errors.timePeriodStart && (
                        <p className={styles.errorMsg}>
                            {String(errors.timePeriodStart.message)}
                        </p>
                    )}
                </div>

                <p className='text-16 gray-500'>
                    to
                </p>

                <div className={clsx(styles.dateContainer, errors.timePeriodEnd && styles.error)}>

                    <SingleDatePicker
                        name='timePeriodEnd'
                        required
                        hideLabel
                        minDate='2018-01-01'
                        maxDate='2025-03-10'
                        placeholderText='End date'
                        hideValidations
                    />

                    {errors.timePeriodEnd && (
                        <p className={styles.errorMsg}>
                            {String(errors.timePeriodEnd.message)}
                        </p>
                    )}
                    
                </div>

            </div>

        </div>
	)
}