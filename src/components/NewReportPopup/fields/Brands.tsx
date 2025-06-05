'use client'

// libraries
import { useState, useCallback } from 'react'

// components
import CustomSearch from './CustomSearch'

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
		
		// Map API results
		const apiItems = searchResults.map(brand => ({
			name: brand.slug,
			label: brand.name
		}))
		
		// Add any selected items
		const selectedItems = selectedBrandsNotInSearch.map(slug => ({
			name: slug,
			label: slug
		}))
		
		// Combine the lists
		const allItems = [...apiItems, ...selectedItems]
		
		//console.log('API Search Results:', searchResults.map(b => b.name))
		//console.log('Items for Search component:', allItems.map(i => i.label))
		
		return allItems
	}, [searchResults, selectedBrands])
	
	const fetchBrands = useCallback(async (query: string) => {
		if (!query || query.length < 2) {
			setSearchResults([])
			return
		}
		
		setIsLoading(true)
		try {
			//console.log('Fetching brands for query:', query)
			const response = await fetch(`/api/proxy?endpoint=/api/brands?query=${encodeURIComponent(query)}`)
			const data = await response.json()
			
			//console.log('API response for query:', query, data)
			
			// Store the search results
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
				<CustomSearch
					defaultValue='Search up to 5 brands...'
					limitSelected={5}
					items={getDisplayItems()}
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