// libraries
import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'

// components
import SingleDatePicker from '@/components/Form/SingleDatePicker'

// css
import styles from '../index.module.scss'

export default function TimePeriod() {
	const { watch, formState: { errors }, trigger } = useFormContext()
	
	// Watch both date values
	const startDate = watch('timePeriodStart')
	const endDate = watch('timePeriodEnd')
	
	// Trigger validation when either date changes
	useEffect(() => {
		if (startDate || endDate) {
			trigger(['timePeriodStart', 'timePeriodEnd'])
		}
	}, [startDate, endDate, trigger])

	return (
		<div className={styles.group}>

            <div className={styles.label}>
                <label htmlFor='report-time-period' className='text-16 semi-bold'>
                    Time Period <span className='red'>*</span>
                </label>
            </div>

            <div className={clsx(styles.input, styles.timePeriod)}>
                
                <SingleDatePicker
                    name='timePeriodStart'
                    required
                    hideLabel
                    minDate='2018-01-01'
                    maxDate='2025-03-10'
                    placeholderText='Start date'
                    rules={{
                        validate: {
                            startDateValidation: (value: Date | null) => {
                                if (!value && !endDate) return true
                                if (!value) return 'Start date is required'
                                if (endDate && value > endDate) {
                                    return 'Start date must be before end date'
                                }
                                return true
                            }
                        }
                    }}
                />

                <p className='text-16 gray-500'>
                    to
                </p>

                <SingleDatePicker
                    name='timePeriodEnd'
                    required
                    hideLabel
                    minDate='2018-01-01'
                    maxDate='2025-03-10'
                    placeholderText='End date'
                    rules={{
                        validate: {
                            endDateValidation: (value: Date | null) => {
                                if (!value && !startDate) return true
                                if (!value) return 'End date is required'
                                if (startDate && value < startDate) {
                                    return 'End date must be after start date'
                                }
                                return true
                            }
                        }
                    }}
                />

            </div>

        </div>
	)
}