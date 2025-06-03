'use client'

// libraries
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

// components
import Select from '@/components/Form/Select'

// css
import styles from '../index.module.scss'

// db
import { footwear } from '@/db/sub-categories'

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
}

export default function Category({
    hasSubCategories = false
}: CategoryProps) {
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

            {hasSubCategories && selectedCategory && (
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
                            label='Sub-category'
                            name='subCategory'
                            hideLabel
                            id='report-sub-category'
                            selectClassName='capitalize'
                        >
                            <option value=''>Select one</option>

                            {footwear.map((subCategory) => (
                                <option key={subCategory.name} value={subCategory.name}>
                                    {subCategory.label}
                                </option>
                            ))}
                        </Select>
                    </div>

                </div>
            )}
        </>
	)
}