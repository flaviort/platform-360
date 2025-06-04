'use client'

// libraries
import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

// components
import Select from '@/components/Form/Select'
import Dropdown from '@/components/Form/Dropdown'

// css
import styles from '../index.module.scss'

// db
import { footwear, apparel, bagsAndCarriers, accessories, nutritionAndHealth, sportsAndActivities } from '@/db/sub-categories'

interface Category {
	id: string
	name: string
}

interface SubCategory {
	label: string
	name: string
}

interface CategoryProps {
    hasSubCategories?: boolean
    multipleSubCategories?: boolean
}

export default function Category({
    hasSubCategories = false,
    multipleSubCategories = false
}: CategoryProps) {
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

    const [selectedCategory, setSelectedCategory] = useState('')
	const [subCategories, setSubCategories] = useState<SubCategory[]>([])
	const { setValue } = useFormContext()

	const handleCategoryChange = (value: string) => {
		setSelectedCategory(value)
		
		setValue('subCategories', {}, { shouldValidate: true })
		
		switch(value) {
			case 'Footwear':
				setSubCategories(footwear)
				break
			case 'Apparel':
				setSubCategories(apparel)
				break
			case 'Electronics':
				setSubCategories([])
				break
			case 'Bags & Carriers':
				setSubCategories(bagsAndCarriers)
				break
			case 'Accessories':
				setSubCategories(accessories)
				break
			case 'Nutrition & Health':
				setSubCategories(nutritionAndHealth)
				break
			case 'Sports & Activities':
				setSubCategories(sportsAndActivities)
				break
			default:
				setSubCategories([])
		}
	}

	return (
        <>
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
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                        <option value='' disabled>
                            {isLoading ? 'Loading categories...' : 'Select one'}
                        </option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                        
                        {/*
                        <option value=''>Select one</option>
                        <option value='Footwear'>Footwear</option>
                        <option value='Apparel'>Apparel</option>
                        <option value='Electronics'>Electronics</option>
                        <option value='Bags & Carriers'>Bags & Carriers</option>
                        <option value='Accessories'>Accessories</option>
                        <option value='Nutrition & Health'>Nutrition & Health</option>
                        <option value='Sports & Activities'>Sports & Activities</option>
                        */}
                    </Select>
                </div>

            </div>

            {hasSubCategories && !multipleSubCategories && selectedCategory && subCategories.length > 0 && (
                <div className={styles.group}>

                    <div className={styles.label}>
                        <label htmlFor='report-sub-category' className='text-16 semi-bold'>
                            Sub-category <span className='red'>*</span>
                        </label>
                    </div>

                    <div className={styles.input}>
                        <Select
                            defaultValue=''
                            required
                            label='sub-category'
                            name='subCategory'
                            hideLabel
                            id='report-sub-category'
                            selectClassName='capitalize'
                        >
                            <option value=''>Select one</option>

                            {subCategories.map((subCategory) => (
                                <option key={subCategory.name} value={subCategory.name}>
                                    {subCategory.label}
                                </option>
                            ))}
                        </Select>
                    </div>

                </div>
            )}

            {hasSubCategories && multipleSubCategories && selectedCategory && subCategories.length > 0 && (
                <div className={styles.group}>

                    <div className={styles.label}>
                        <label htmlFor='report-sub-categories' className='text-16 semi-bold'>
                            Sub-categories <span className='red'>*</span>
                        </label>
                    </div>

                    <div className={styles.input}>
                        <Dropdown
                            defaultValue='Select up to 5...'
                            limitSelected={5}
                            alphabetical
                            items={subCategories}
                            required
                            name='subCategories'
                            id='subCategories'
                        />
                    </div>

                </div>
            )}
        </>
	)
}