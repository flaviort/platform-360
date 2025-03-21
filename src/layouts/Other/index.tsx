// components
import TopMenu from '@/components/Menu'
import Footer from '@/components/Footer'

interface OtherWrapperProps {
	children: React.ReactNode
	className?: string
}

export default function OtherWrapper({
	children,
	className
}: OtherWrapperProps) {
	return (
		<div className={className}>
			
			<TopMenu />

			{children}

			<Footer />

		</div>
	)
}