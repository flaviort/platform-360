'use client'

// libraries
import { useState, useEffect, useCallback } from 'react'

// components
import Search from '@/components/Form/Search'

// css
import styles from '../index.module.scss'

interface Brand {
	slug: string
	name: string
}

export default function Brands() {
	const [searchResults, setSearchResults] = useState<Brand[]>([])
	const [selectedBrands, setSelectedBrands] = useState<Record<string, boolean>>({})
	const [isLoading, setIsLoading] = useState(false)
	
	// track selected brands to keep them visible
	const updateSelectedBrands = useCallback((name: string, value: Record<string, boolean>) => {
		setSelectedBrands(value)
	}, [])
	
	// transform all results to include selected items
	const getDisplayItems = useCallback(() => {

		// get unique brands from both search results and selected brands
		const selectedBrandSlugs = Object.entries(selectedBrands)
			.filter(([_, isSelected]) => isSelected)
			.map(([slug]) => slug)
		
		// find selected brands that aren't in current search results
		const selectedBrandsNotInSearch = selectedBrandSlugs.filter(slug => 
			!searchResults.some(brand => brand.slug === slug)
		)
		
		// create a complete list of items to display

		// first add all search results
		const displayItems = searchResults.map(brand => ({
			name: brand.slug,
			label: brand.name
		}))
		
		// then add any selected items that aren't in the search results
		// for these, we don't have the original name, so we use the slug as both name and label
		selectedBrandsNotInSearch.forEach(slug => {
			displayItems.push({
				name: slug,
				label: slug
			})
		})
		
		return displayItems
	}, [searchResults, selectedBrands])
	
	const fetchBrands = useCallback(async (query: string) => {
		if (!query || query.length < 2) {
			setSearchResults([])
			return
		}
		
		setIsLoading(true)
		try {
			const response = await fetch(`/api/proxy?endpoint=/api/brands?query=${encodeURIComponent(query)}`)
			const data = await response.json()
			//console.log('API response for brands:', data)
			setSearchResults(data)
		} catch (error) {
			console.error('Error fetching brands:', error)
			setSearchResults([])
		} finally {
			setIsLoading(false)
		}
	}, [])

	return (
		<div className={styles.group}>
			<div className={styles.label}>
				<label htmlFor='report-brands' className='text-16 semi-bold'>
					Brands <span className='red'>*</span>
				</label>
			</div>

			<div className={styles.input}>
				<Search
					defaultValue='Search and select up to 5 brands...'
					limitSelected={5}
					items={getDisplayItems()}
					searchable
					required
					name='brands'
					id='report-brands'
					onSearch={fetchBrands}
					isLoading={isLoading}
					onFieldChange={updateSelectedBrands}
				/>
			</div>
		</div>
	)
} 