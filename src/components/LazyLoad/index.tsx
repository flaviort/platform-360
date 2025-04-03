// libraries
import { Suspense } from 'react'

// css
import styles from './index.module.scss'

// svg
import { Loader } from 'lucide-react'

// props
interface LazyLoadProps {
	children: React.ReactNode
}

export default function LazyLoad({ children }: LazyLoadProps) {
	return (
		<Suspense fallback={
			<div className={styles.component}>
				<div className='py-smaller container purple'>
					<div className={styles.flex}>

						<Loader className={styles.loader} />

						<span>
							Loading...
						</span>

					</div>
				</div>
			</div>
		}>
			{children}
		</Suspense>
	)
}