// components
import TopMenu from '@/components/Menu'
import Footer from '@/components/Footer'

interface DashboardWrapperProps {
	children: React.ReactNode
}

export default function DashboardWrapper({
	children
}: DashboardWrapperProps) {
	return (
		<>
			
			<TopMenu />

			{children}

			<Footer internal />

		</>
	)
}