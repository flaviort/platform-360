'use client'

// libraries
import clsx from 'clsx'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

// components
import { SubWrapper, Sub } from '@/components/SubMenu'
import PopupShop360 from '@/components/NewReportPopup/shop360'
import PopupDemand360 from '@/components/NewReportPopup/demand360'
import PopupInsight360 from '@/components/NewReportPopup/insight360'
import PopupFeedback360 from '@/components/NewReportPopup/feedback360'

// img / svg
import { ChevronDown, Search, Plus, ShoppingCart, ChartNoAxesCombined, FilePenLine, X } from 'lucide-react'
import demand360 from '@/assets/img/logos/demand-360.png'
import feedback360 from '@/assets/img/logos/feedback-360.png'
import insight360 from '@/assets/img/logos/insight-360.png'
import shop360 from '@/assets/img/logos/shop-360.png'

// css
import styles from './index.module.scss'

// Add a type for the product filter
export type ProductFilter = 'Demand360' | 'Feedback360' | 'Shop360' | 'Insight360' | null

// Add props interface to receive the filter handler
interface FiltersProps {
	onFilterChange: (filter: ProductFilter, search: string) => void
}

export default function Filters({ onFilterChange }: FiltersProps) {

	// search
	const [searchMobile, setSearchMobile] = useState(false)
  
	const searchMobileRef = useRef(null)
	const searchRef = useRef<HTMLInputElement>(null)

	const [activeFilter, setActiveFilter] = useState<ProductFilter>(null)

	// Add search term state
	const [searchTerm, setSearchTerm] = useState("")

	const openSearchMobile = () => {
		setSearchMobile((prev) => !prev)

		setTimeout(() => {
			if (searchRef.current) {
				searchRef.current.focus()
			}
		}, 200)
	}

	const closeSearchMobile = () => {
		setSearchMobile(false)
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && searchMobile) {
				closeSearchMobile()
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (
				searchMobile &&
				searchMobileRef.current &&
				!(searchMobileRef.current as HTMLElement).contains(e.target as Node)
			) {
				closeSearchMobile()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [searchMobile])

	const handleFilterClick = (productName: ProductFilter) => {
		const newFilter = activeFilter === productName ? null : productName
		setActiveFilter(newFilter)
		onFilterChange(newFilter, searchTerm)
	}

	// Update handleSearch to pass both search and active filter
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchTerm(value)
		onFilterChange(activeFilter, value)
	}

	return (
		<section className={styles.filtersSection}>
			<div className='container container--big'>
				<div className={styles.flex}>

					<div className={styles.left}>

						{/*
						<SubWrapper className={styles.filters}>

							<button
								className={clsx(
									styles.filtersButton,
									'button button--hollow-light text-16'
								)}
								data-toggle-sub
							>

								<ListFilter />

								<span className='medium'>
									Filters
								</span>

								<ChevronDown />

							</button>

							<Sub className={styles.sub}>
								{[
									{
										text: 'Filter option 1'
									},
									{
										text: 'Filter option 2'
									},
									{
										text: 'Filter option 3'
									}
								].map((item, i) => (
									<button
										className='text-14 bold'
										key={i}
									>
										{item.text}
									</button>
								))}
							</Sub>

						</SubWrapper>
						*/}

						<SubWrapper className={styles.products}>

							<button
								className={clsx(
									styles.productsMobile,
									'button button--hollow-light text-16'
								)}
								data-toggle-sub
							>

								<span className='medium'>
									Products
								</span>

								<ChevronDown />

							</button>

							<Sub className={styles.sub}>
								{[
									{
										icon: ShoppingCart,
										text: 'Demand360' as ProductFilter
									},
									{
										icon: ChartNoAxesCombined,
										text: 'Feedback360' as ProductFilter
									},
									{
										icon: Search,
										text: 'Shop360' as ProductFilter
									},
									{
										icon: FilePenLine,
										text: 'Insight360' as ProductFilter
									}
								].map((item, i) => (
									<button
										type='button'
										className={clsx(
											'text-14 bold',
											activeFilter === item.text && styles.active
										)}
										key={i}
										onClick={() => handleFilterClick(item.text)}
										data-toggle-sub
									>

										<item.icon />

										<span>
											{item.text}
										</span>

									</button>
								))}

								{activeFilter !== null && (
									<button
										type='button'
										className={clsx(styles.clear, 'text-14 bold')}
										onClick={() => handleFilterClick(null)}
										data-toggle-sub
									>

										<X />

										<span>
											Clear Filters
										</span>

									</button>
								)}

							</Sub>

							<p className={clsx(styles.label, 'text-14 gray-400 bold uppercase')}>
								<span>View by product:</span>
								<span>Products:</span>
							</p>

							<div className={styles.list}>
								{[
									{
										image: demand360.src,
										name: 'Demand360' as ProductFilter,
										width: 365
									},
									{
										image: feedback360.src,
										name: 'Feedback360' as ProductFilter,
										width: 420
									},
									{
										image: shop360.src,
										name: 'Shop360' as ProductFilter,
										width: 355
									},
									{
										image: insight360.src,
										name: 'Insight360' as ProductFilter,
										width: 315
									}
								].map((item, i) => (
									<button
										type='button'
										key={i}
										aria-label={String(item.name)}
										onClick={() => handleFilterClick(item.name)}
										className={activeFilter === item.name ? styles.active : ''}
									>
										<Image
											src={item.image}
											alt={String(item.name)}
											width={item.width}
											height={157}
										/>
									</button>
								))}
								
								{activeFilter !== null && (
									<button
										type='button'
										className={clsx(styles.clear, 'button button--solid text-16')}
										onClick={() => handleFilterClick(null)}
									>
										View All
										<X />
									</button>
								)}
								
							</div>
							
						</SubWrapper>

					</div>

					<div className={styles.right}>

						<div className={styles.search} ref={searchMobileRef}>

							<button
								className={clsx(
									styles.searchMobile,
									searchMobile && styles.open
								)}
								onClick={openSearchMobile}
							>
								<Search />
							</button>

							<div
								className={clsx(
									styles.searchWrapper,
									searchMobile && styles.open
								)}
							>

								<input
									type='text'
									placeholder='Search...'
									className={clsx(styles.input, 'text-16')}
									ref={searchRef}
									value={searchTerm}
									onChange={handleSearch}
								/>

								{searchTerm !== '' && (
									<button
										type='button'
										className={clsx(styles.clear, 'text-14 bold button button--solid')}
										onClick={() => {
											setSearchTerm('')
											if (searchRef.current) {
												searchRef.current.value = ''
											}
											onFilterChange(activeFilter, '')
											closeSearchMobile()
										}}
									>
										<X />

										<span>
											Clear
										</span>

									</button>
								)}

								<button
									type='button'
									className={styles.icon}
								>
									<Search />
								</button>

							</div>
						</div>

						<SubWrapper className={styles.new}>

							<button
								className={clsx(
									styles.button,
									'button button--gradient-blue uppercase text-14'
								)}
								data-toggle-sub
							>

								<Plus />

								<span>
									New
								</span>

								<ChevronDown />

							</button>

							<Sub className={styles.sub}>
									
								{/*
								<p className='text-14 bold gray-400 uppercase'>
									Projects
								</p>

								<button
									className='text-14 bold'
								>

									<Folders />

									<span>
										New Project
									</span>

								</button>

								<div className={styles.line}></div>
								*/}

								<p className='text-14 bold gray-400 uppercase'>
									Reports
								</p>

								<PopupDemand360
									icon={ShoppingCart}
									text='Demand360'
								/>

								<PopupFeedback360
									icon={ChartNoAxesCombined}
									text='Feedback360'
								/>

								<PopupShop360
									icon={Search}
									text='Shop360'
								/>

								<PopupInsight360
									icon={FilePenLine}
									text='Insight360'
								/>

							</Sub>

						</SubWrapper>

					</div>

				</div>
			</div>
		</section>
	)
}