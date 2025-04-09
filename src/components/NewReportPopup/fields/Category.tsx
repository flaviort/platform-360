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
                >
                    <option value='' disabled>
                        {isLoading ? 'Loading categories...' : 'Select one'}
                    </option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </Select>
            </div>

        </div>
	)
}