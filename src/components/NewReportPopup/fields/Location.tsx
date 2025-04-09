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
		
		setValue('reportStates', {}, { shouldValidate: true })
		
		switch(value) {
			case 'United States':
				setRegions(usaStates)
				break
			case 'Canada':
				setRegions(canadaProvinces)
				break
			case 'Europe':
				setRegions(europeanCountries)
				break
			case 'UK':
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
						<option value='United States'>United States</option>
						<option value='Canada'>Canada</option>
						<option value='Europe'>Europe</option>
						<option value='UK'>UK</option>
					</Select>
				</div>

			</div>

			{selectedLocation && (
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
							name='reportStates'
							id='reportStates'
						/>
					</div>
				</div>
			)}
        </>
	)
}