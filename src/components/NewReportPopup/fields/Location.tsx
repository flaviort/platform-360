'use client'

// libraries
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

// components
import Select from '@/components/Form/Select'
import Dropdown from '@/components/Form/Dropdown'

// css
import styles from '../index.module.scss'

// db
import { usaStates } from '@/db/usa'
import { canadaProvinces } from '@/db/canada'
import { europeanCountries } from '@/db/europe'
import { ukRegions } from '@/db/uk'

interface Region {
	name: string
	label: string
}

export default function Location() {
	const [selectedLocation, setSelectedLocation] = useState('')
	const [regions, setRegions] = useState<Region[]>([])
	const { setValue } = useFormContext()

	const handleLocationChange = (value: string) => {
		setSelectedLocation(value)
		
		setValue('regions', {}, { shouldValidate: true })
		
		switch(value) {
			case 'US':
				setRegions(usaStates)
				break
			case 'CA':
				setRegions(canadaProvinces)
				break
			case 'EU':
				setRegions(europeanCountries)
				break
			case 'GB':
				setRegions(ukRegions)
				break
			default:
				setRegions([])
		}
	}

	return (
        <>
		    <div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='reportLocation' className='text-16 semi-bold'>
						Location <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Select
						defaultValue=''
						required
						label='Location'
						name='location'
						hideLabel
						id='reportLocation'
						onChange={(e) => handleLocationChange(e.target.value)}
					>
						<option value='' disabled>Select one</option>
						<option value='US'>United States</option>
						<option value='CA'>Canada</option>
						<option value='EU'>Europe</option>
					</Select>
				</div>

			</div>

			{/*selectedLocation && (
				<div className={styles.group}>
					<div className={styles.label}>
						<p className='text-16 semi-bold'>
							Region(s) <span className='red'>*</span>
						</p>
					</div>

					<div className={styles.input}>
						<Dropdown
							defaultValue='Now select the region(s)'
							showHideAll
							items={regions}
							searchable
							required
							name='regions'
							id='regions'
						/>
					</div>
				</div>
			)*/}
        </>
	)
}