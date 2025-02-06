// libraries
import clsx from 'clsx'
import Image from 'next/image'

// img / svg
import { ListFilter, ChevronDown, Search, Plus } from 'lucide-react'
import demand360 from '@/assets/img/logos/demand-360.png'
import feedback360 from '@/assets/img/logos/feedback-360.png'
import insight360 from '@/assets/img/logos/insight-360.png'
import shop360 from '@/assets/img/logos/shop-360.png'

// css
import styles from './index.module.scss'

export default function Filters() {
	return (
		<section className={styles.filtersSection}>
			<div className='container container--big'>
				<div className={styles.flex}>

					<div className={styles.left}>

						<div className={styles.filters}>

							<button className={clsx(styles.filtersButton, 'button button--hollow-light text-16')}>

								<ListFilter />

								<span className='medium'>
									Filters
								</span>

								<ChevronDown />

							</button>

						</div>

						<div className={styles.products}>

							<button className={clsx(styles.productsMobile, 'button button--hollow-light text-16')}>

								<span className='medium'>
									Products
								</span>

								<ChevronDown />

							</button>

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

						<div className={styles.search}>

							<button className={styles.searchMobile}>
								<Search />
							</button>

							<div className={styles.searchWrapper}>

								<Search />

								<input
									type='text'
									placeholder='Search...'
									className={clsx(styles.input, 'text-16')}
								/>

							</div>
						</div>

						<div className={styles.new}>

							<button
								className={clsx(styles.button, 'button button--gradient-blue uppercase text-14')}
							>

								<Plus />

								<span>
									New
								</span>

								<ChevronDown />

							</button>

						</div>

					</div>

				</div>
			</div>
		</section>
	)
}