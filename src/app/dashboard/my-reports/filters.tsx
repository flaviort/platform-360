'use client'

// libraries
import clsx from 'clsx'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

// img / svg
import { ListFilter, ChevronDown, Search, Plus, Folders, ShoppingCart, ChartNoAxesCombined, FilePenLine, } from 'lucide-react'
import demand360 from '@/assets/img/logos/demand-360.png'
import feedback360 from '@/assets/img/logos/feedback-360.png'
import insight360 from '@/assets/img/logos/insight-360.png'
import shop360 from '@/assets/img/logos/shop-360.png'

// css
import styles from './index.module.scss'

export default function Filters() {

	// filters
	const [filtersSub, setFiltersSub] = useState(false)
  
	const filtersSubRef = useRef(null)

	const openFiltersSub = () => {
		setFiltersSub((prev) => !prev)
	}

	const closeFiltersSub = () => {
		setFiltersSub(false)
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && filtersSub) {
				closeFiltersSub()
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (
				filtersSub &&
				filtersSubRef.current &&
				!(filtersSubRef.current as HTMLElement).contains(e.target as Node)
			) {
				closeFiltersSub()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [filtersSub])

	// products
	const [productsSub, setProductsSub] = useState(false)
  
	const productsSubRef = useRef(null)

	const openProductsSub = () => {
		setProductsSub((prev) => !prev)
	}

	const closeProductsSub = () => {
		setProductsSub(false)
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && productsSub) {
				closeProductsSub()
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (
				productsSub &&
				productsSubRef.current &&
				!(productsSubRef.current as HTMLElement).contains(e.target as Node)
			) {
				closeProductsSub()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [productsSub])

	// search
	const [searchMobile, setSearchMobile] = useState(false)
  
	const searchMobileRef = useRef(null)
	const searchRef = useRef<HTMLInputElement>(null)

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

	// + new
	const [newReportSub, setNewReportSub] = useState(false)
  
	const newReportSubRef = useRef(null)

	const openNewReportSub = () => {
		setNewReportSub((prev) => !prev)
	}

	const closeNewReportSub = () => {
		setNewReportSub(false)
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && newReportSub) {
				closeNewReportSub()
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (
				newReportSub &&
				newReportSubRef.current &&
				!(newReportSubRef.current as HTMLElement).contains(e.target as Node)
			) {
				closeNewReportSub()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [newReportSub])

	return (
		<section className={styles.filtersSection}>
			<div className='container container--big'>
				<div className={styles.flex}>

					<div className={styles.left}>

						<div className={styles.filters} ref={filtersSubRef}>

							<button
								className={clsx(
									styles.filtersButton,
									'button button--hollow-light text-16',
									filtersSub && styles.open
								)}
								onClick={openFiltersSub}
							>

								<ListFilter />

								<span className='medium'>
									Filters
								</span>

								<ChevronDown />

							</button>

							<div
								className={clsx(
									styles.sub,
									filtersSub && styles.open
								)}
							>
								<div className={styles.subWrapper}>
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
											onClick={closeFiltersSub}
										>
											{item.text}
										</button>
									))}
								</div>
							</div>

						</div>

						<div className={styles.products} ref={productsSubRef}>

							<button
								className={clsx(
									styles.productsMobile,
									'button button--hollow-light text-16',
									productsSub && styles.open
								)}
								onClick={openProductsSub}
							>

								<span className='medium'>
									Products
								</span>

								<ChevronDown />

							</button>

							<div className={
								clsx(
									styles.sub,
									productsSub && styles.open
								)}
							>
								<div className={styles.subWrapper}>
									{[
										{
											icon: ShoppingCart,
											text: 'Demand360'
										},
										{
											icon: ChartNoAxesCombined,
											text: 'Feedback360'
										},
										{
											icon: Search,
											text: 'Shop360'
										},
										{
											icon: FilePenLine,
											text: 'Insight360'
										}
									].map((item, i) => (
										<button
											className='text-14 bold'
											key={i}
											onClick={closeFiltersSub}
										>

											<item.icon />

											<span>
												{item.text}
											</span>

										</button>
									))}
								</div>
							</div>

							<p className={clsx(styles.label, 'text-14 gray-400 bold uppercase')}>
								<span>View by product:</span>
								<span>Products:</span>
							</p>

							<div className={styles.list}>
								{[
									{
										image: demand360.src,
										name: 'Demand360',
										width: 365
									},
									{
										image: feedback360.src,
										name: 'Feedback360',
										width: 420
									},
									{
										image: shop360.src,
										name: 'Shop360',
										width: 355
									},
									{
										image: insight360.src,
										name: 'Insight360',
										width: 315
									}
								].map((item, i) => (
									<button
										key={i}
										aria-label={item.name}
									>
										<Image
											src={item.image}
											alt={item.name}
											width={item.width}
											height={157}
										/>
									</button>
								))}
							</div>
							
						</div>

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
								/>

								<button className={styles.icon}>
									<span className='uppercase text-14 bold'>Search</span>
									<Search />
								</button>

							</div>
						</div>

						<div className={styles.new} ref={newReportSubRef}>

							<button
								className={clsx(
									styles.button,
									'button button--gradient-blue uppercase text-14',
									newReportSub && styles.open
								)}
								onClick={openNewReportSub}
							>

								<Plus />

								<span>
									New
								</span>

								<ChevronDown />

							</button>

							<div
								className={clsx(
									styles.sub,
									newReportSub && styles.open
								)}
							>
								<div className={styles.subWrapper}>
									
									<p className='text-14 bold gray-400 uppercase'>
										Projects
									</p>

									<button
										className='text-14 bold'
										onClick={closeNewReportSub}
									>

										<Folders />

										<span>
											New Project
										</span>

									</button>

									<div className={styles.line}></div>

									<p className='text-14 bold gray-400 uppercase'>
										Reports
									</p>

									{[
										{
											icon: ShoppingCart,
											text: 'Demand360'
										},
										{
											icon: ChartNoAxesCombined,
											text: 'Feedback360'
										},
										{
											icon: Search,
											text: 'Shop360'
										},
										{
											icon: FilePenLine,
											text: 'Insight360'
										}
									].map((item, i) => (
										<button
											className='text-14 bold'
											key={i}
											onClick={closeFiltersSub}
										>

											<item.icon />

											<span>
												{item.text}
											</span>

										</button>
									))}

								</div>
							</div>

						</div>

					</div>

				</div>
			</div>
		</section>
	)
}