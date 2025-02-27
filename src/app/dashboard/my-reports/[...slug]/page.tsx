'use client'

// libraries
import clsx from 'clsx'
import { useState } from 'react'

// components
import Breadcrumbs from '@/components/Breadcrumbs'
import TitlePart from '@/components/TitlePart'
import ChartBox from '@/components/ChartBox'
import ProjectDetails from './projectDetails'
import TopButtons from './topButtons'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'

// data
import { numberOfSkus, topColors, positiveNegative, productPrice, access } from './chart-data'

export default function DashboardMyReports() {
	
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isHidden, setIsHidden] = useState(false)

	const handleToggleCollapse = () => {
		setIsCollapsed(prev => !prev)
		
		if (!isHidden) {
			setIsHidden(true)
		} else {
			setTimeout(() => {
				setIsHidden(false)
			}, 300)
		}
	}

	return (
		<main className={styles.page}>

			<Breadcrumbs
				breadcrumbs={[
					{
						name: 'Home',
						link: pages.home
					},
					{
						name: 'My Reports',
						link: pages.dashboard.my_reports
					},
					{
						name: 'Nike Summer 2025',
						link: '#'
					}
				]}
			/>
		
			<TitlePart
				title='Nike Summer 2025'
			/>

			<section className={styles.topNavigation}>
				<div className='container container--big'>
					<div className={styles.wrapper}>
						<ul>

							<li>
								<button className={clsx(styles.active, 'text-16 gray-400 semi-bold')}>
									Running Shoes
								</button>
							</li>

							<li>
								<button className='text-16 gray-400 semi-bold'>
									Test123
								</button>
							</li>

							<li>
								<button className='text-16 gray-400 semi-bold'>
									Hoodies & Sweatshirts
								</button>
							</li>

							<li>
								<button className='text-16 gray-400 semi-bold'>
									Pants
								</button>
							</li>

						</ul>
					</div>
				</div>
			</section>

			<section className={clsx(
				styles.middleContent,
				isCollapsed && styles.collapsed,
				isHidden && styles.hidden
			)}>
				<div className='container container--big'>
					<div className={styles.contentWrapper}>

						<ProjectDetails
							product='shop360'
							members={access}
							summary={{
								name: 'Shoe Report',
								category: 'Footwear',
								retailers: 'Wallmart, Costco, Target',
								brands: 'Nike, Adidas, New Balance, Puma, Fila',
								genders: 'All',
								years: '2012 - 2022',
								months: 'Jan - Dec',
								type: 'Instore',
								goal: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.'
							}}
							onToggleCollapse={handleToggleCollapse}
							isCollapsed={isCollapsed}
						/>

						<div className={clsx(styles.chartsArea, 'relative')}>

							<div className={clsx(styles.bg, 'bg-gray-200')}></div>

							<div className='relative z2'>

								<TopButtons />

								<div className={styles.allCharts}>

									<ChartBox
										title='Number of SKUs associated with each retailer'
										description='Minim dolor in amet nulla laboris enim dolore consequatt...'
										AIGenerated={true}
										chart={{
											horizontal: numberOfSkus
										}}
									/>

									<ChartBox
										title='Top Colors'
										description='Colors by Numbers of SKUs'
										chart={{
											vertical: topColors
										}}
									/>

									<ChartBox
										title='Statistic'
										description='Minim dolor in amet nulla laboris enim dolore consequatt.'
										chart={{
											positiveNegative: positiveNegative
										}}
									/>

									<ChartBox
										title='Top Products'
										description='Priced at $35 or less'
										chart={{
											productPrice: productPrice
										}}
									/>

								</div>
							</div>

						</div>

					</div>
				</div>
			</section>

		</main>
	)
}