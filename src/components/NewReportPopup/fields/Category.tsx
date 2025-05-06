'use client'

// libraries
import { useState, useEffect } from 'react'

// components
import Select from '@/components/Form/Select'

// css
import styles from '../index.module.scss'

interface Category {
	id: string
	name: string
}

export default function Category() {
    /*
	const [categories, setCategories] = useState<Category[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch('/api/proxy?endpoint=/api/categories')
				const data = await response.json()
				setCategories(data)
			} catch (error) {
				console.error('Error fetching categories:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchCategories()
	}, [])
    */

	return (
		<div className={styles.group}>

            <div className={styles.label}>
                <label htmlFor='report-category' className='text-16 semi-bold'>
                    Category <span className='red'>*</span>
                </label>
            </div>

            <div className={styles.input}>
                <Select
                    defaultValue=''
                    required
                    label='Category'
                    name='category'
                    hideLabel
                    id='report-category'
                    selectClassName='capitalize'
                >
                    {/*   
                    <option value='' disabled>
                        {isLoading ? 'Loading categories...' : 'Select one'}
                    </option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                    */}
                    <option value=''>Select one</option>
                    <option value='Footwear'>Footwear</option>
                    <option value='Apparel' disabled>Apparel</option>
                    <option value='Equipment' disabled>Equipment</option>
                    <option value='Accessories' disabled>Accessories</option>
                    <option value='Work' disabled>Work</option>
                    <option value='Home' disabled>Home</option>
                    <option value='In Home' disabled>In Home</option>
                    <option value='Electronics' disabled>Electronics</option>
                </Select>
            </div>

        </div>
	)
}