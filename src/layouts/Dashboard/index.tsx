// components
import Menu from '@/components/Menu'

// css
import styles from './index.module.scss'

interface DashboardWrapperProps {
	children: React.ReactNode
}

export default function DashboardWrapper({
	children
}: DashboardWrapperProps) {
	return (
		<main className={styles.component}>
			
			<Menu />

			{children}

		</main>
	)
}