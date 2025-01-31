// layouts
import DashboardWrapper from '@/layouts/Dashboard'

interface RootLayoutProps {
	children: React.ReactNode
}

export default function RootLayout({
	children
}: RootLayoutProps) {
	return (
		<DashboardWrapper>
			{children}
		</DashboardWrapper>
	)
}