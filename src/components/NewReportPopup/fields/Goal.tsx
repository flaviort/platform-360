'use client'

import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import Textarea from '@/components/Form/Textarea'

// css
import styles from '../index.module.scss'

export default function Goal() {
	const { getValues, setValue, trigger } = useFormContext()

	// Listen for request to generate goal
	useEffect(() => {
		const handleRequestData = async (e: Event) => {
			// Cast the event to CustomEvent to access detail
			const customEvent = e as CustomEvent<any>
			// Get the product type from the event detail
			const productType = customEvent.detail?.productType || getValues('productType') || 'shop360'
			
			// Get common form values
			const category = getValues('category')
			const retailers = getValues('retailers') || {}
			const brands = getValues('brands') || {}
			const genders = getValues('genders') || []
			const timePeriodStart = getValues('timePeriodStart')
			const timePeriodEnd = getValues('timePeriodEnd')
			const location = getValues('location')
			const regions = getValues('regions') || {}
			const audienceSize = getValues('audienceSize')
			const age = getValues('age')
			const minPrice = getValues('minPrice')
			const maxPrice = getValues('maxPrice')
			
			// Track required fields and missing fields
			const fieldsToValidate = []
			const fieldsToShow = []
			
			// Different validation rules based on product type
			switch (productType) {
				case 'shop360':
					// Check retailers
					const hasRetailers = Object.values(retailers).some(value => value === true)
					if (!hasRetailers) {
						fieldsToValidate.push('retailers')
						fieldsToShow.push('Retailers')
					}
					
					// Check brands
					const hasBrands = Object.values(brands).some(value => value === true)
					if (!hasBrands) {
						fieldsToValidate.push('brands')
						fieldsToShow.push('Brands')
					}
					
					// Check genders
					if (!genders.length) {
						fieldsToValidate.push('genders')
						fieldsToShow.push('Genders')
					}
					
					// Check category
					if (!category) {
						fieldsToValidate.push('category')
						fieldsToShow.push('Category')
					}
					
					// Check time period
					if (!timePeriodStart || !timePeriodEnd) {
						fieldsToValidate.push('timePeriodStart', 'timePeriodEnd')
						fieldsToShow.push('Time Period')
					}
					break;
					
				case 'demand360':
					// Check category
					if (!category) {
						fieldsToValidate.push('category')
						fieldsToShow.push('Category')
					}
					
					// Check time period
					if (!timePeriodStart || !timePeriodEnd) {
						fieldsToValidate.push('timePeriodStart', 'timePeriodEnd')
						fieldsToShow.push('Time Period')
					}
					
					// Check location
					if (!location) {
						fieldsToValidate.push('location')
						fieldsToShow.push('Location')
					}
					
					// Check regions
					const hasRegions = Object.values(regions).some(value => value === true)
					if (!hasRegions) {
						fieldsToValidate.push('regions')
						fieldsToShow.push('Regions')
					}
					break;
					
				case 'insight360':
					// Check category
					if (!category) {
						fieldsToValidate.push('category')
						fieldsToShow.push('Category')
					}
					
					// Check brands
					const hasBrandsInsight = Object.values(brands).some(value => value === true)
					if (!hasBrandsInsight) {
						fieldsToValidate.push('brands')
						fieldsToShow.push('Brands')
					}
					
					// Check genders
					if (!genders.length) {
						fieldsToValidate.push('genders')
						fieldsToShow.push('Genders')
					}
					break;
					
				case 'feedback360':
					// Check audience size
					if (!audienceSize) {
						fieldsToValidate.push('audienceSize')
						fieldsToShow.push('Audience Size')
					}
					
					// Check genders
					if (!genders.length) {
						fieldsToValidate.push('genders')
						fieldsToShow.push('Genders')
					}
					
					// Check age
					if (!age) {
						fieldsToValidate.push('age')
						fieldsToShow.push('Age')
					}
					
					// Check location
					if (!location) {
						fieldsToValidate.push('location')
						fieldsToShow.push('Location')
					}
					
					// Check regions
					const hasRegionsFeedback = Object.values(regions).some(value => value === true)
					if (!hasRegionsFeedback) {
						fieldsToValidate.push('regions')
						fieldsToShow.push('Regions')
					}
					
					// Check retailers
					const hasRetailersFeedback = Object.values(retailers).some(value => value === true)
					if (!hasRetailersFeedback) {
						fieldsToValidate.push('retailers')
						fieldsToShow.push('Retailers')
					}
					
					// Check category
					if (!category) {
						fieldsToValidate.push('category')
						fieldsToShow.push('Category')
					}
					
					// Check price range
					if (!minPrice || !maxPrice) {
						fieldsToValidate.push('minPrice', 'maxPrice')
						fieldsToShow.push('Price Range')
					}
					break;
			}
			
			// Validate time period if applicable
			if (fieldsToValidate.includes('timePeriodStart') || fieldsToValidate.includes('timePeriodEnd')) {
				try {
					const timePeriodValidationEvent = new CustomEvent('validateTimePeriod', {
						bubbles: true,
						cancelable: true
					})
					document.dispatchEvent(timePeriodValidationEvent)
				} catch (e) {
					console.error('Error triggering time period validation:', e)
				}
			}
			
			// If any required fields are missing, trigger validation and send incomplete event
			if (fieldsToValidate.length > 0) {
				console.log(`Required fields missing for ${productType}:`, fieldsToValidate)
				
				// Trigger validation on missing fields
				await Promise.all(fieldsToValidate.map(field => trigger(field)))
				
				// Send incomplete data event
				const incompleteEvent = new CustomEvent('formDataForGoalIncomplete', {
					detail: { 
						productType,
						missingFields: fieldsToValidate,
						missingFieldsLabels: fieldsToShow
					}
				})
				document.dispatchEvent(incompleteEvent)
				return
			}
			
			// All required fields are present, prepare the data
			const formData = {
				productType,
				category,
				retailers,
				brands,
				genders,
				timePeriodStart,
				timePeriodEnd,
				location,
				regions,
				audienceSize,
				age,
				minPrice,
				maxPrice,
				// Pass a function to set the goal value
				setGoalValue: (value: string) => {
					setValue('goal', value, { shouldValidate: true })
				}
			}

			// Send data back via custom event
			const responseEvent = new CustomEvent('formDataForGoal', {
				detail: formData
			})
			document.dispatchEvent(responseEvent)
		}

		// Listen for the request event
		document.addEventListener('requestFormDataForGoal', handleRequestData)

		// Clean up
		return () => {
			document.removeEventListener('requestFormDataForGoal', handleRequestData)
		}
	}, [getValues, setValue, trigger])

	return (
		<div className={styles.group}>
			<div className={styles.label}>
				<label htmlFor='report-goal' className='text-16 semi-bold'>
					Goal <span className='red'>*</span>
				</label>
			</div>

			<div className={styles.input}>
				<Textarea
					placeholder='Specify the goal of the report or use AI to generate one'
					required
					label='Goal'
					name='goal'
					hideLabel
					id='report-goal'
					maxLength={1000}
				/>
			</div>
		</div>
	)
}