'use client'

// libraries
import React, { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'

// css
import styles from './index.module.scss'

interface SubWrapperProps {
    children: React.ReactNode
	className?: string
}

function SubWrapper({
	children,
	className
}: SubWrapperProps) {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (!wrapperRef.current) return

		const toggles = wrapperRef.current.querySelectorAll('[data-toggle-sub]')

		const handleToggle = () => {

			toggles.forEach(toggle => {
                toggle.setAttribute('data-open', String(!isOpen))
            })

			setIsOpen(prev => !prev)
		}

		toggles.forEach(toggle => toggle.addEventListener('click', handleToggle))

		return () => {
			toggles.forEach(toggle =>
				toggle.removeEventListener('click', handleToggle)
			)
		}
	}, [])

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
				setIsOpen(false)

				const toggles = wrapperRef.current.querySelectorAll('[data-toggle-sub]')

				toggles.forEach(toggle => {
                    toggle.setAttribute('data-open', 'false')
                })

			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const processedChildren = React.Children.map(children, child => {
		if (!React.isValidElement(child)) return child

		if (child.type === Sub) {
			return React.cloneElement(child, { isOpen } as SubProps)
		}

		return child
	})

	return (
		<div
			ref={wrapperRef}
			className={clsx(
				styles.wrapper,
				className
			)}
		>
			{processedChildren}
		</div>
	)
}

interface SubProps {
    children: React.ReactNode
    isOpen?: boolean
	className?: string
}

function Sub({
	children,
	isOpen = false,
	className
}: SubProps) {
    return (
		<div
			className={clsx(
				styles.sub,
				isOpen && styles.open,
				className
			)}
			data-sub={isOpen}
		>
			{children}
		</div>
    )
}

export { SubWrapper, Sub }
