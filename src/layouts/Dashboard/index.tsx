// components
import TopMenu from '@/components/Menu'

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

		</>
	)
}