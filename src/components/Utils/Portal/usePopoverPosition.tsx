'use client'

// libraries
import { useState, useEffect, RefObject } from 'react'

function usePopoverPosition(
    ref: RefObject<HTMLElement>,
    isOpen: boolean
) {
    const [style, setStyle] = useState<React.CSSProperties>({})

    useEffect(() => {
        function updatePosition() {
            if (ref.current && isOpen) {

                const rect = ref.current.getBoundingClientRect()

                setStyle({
                    position: 'fixed',
                    top: rect.bottom + 7, 
                    left: rect.right,
                    transform: 'translateX(-100%)',
                    zIndex: 90
                })
            }
        }

        updatePosition()

        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition, true)

        return () => {
            window.removeEventListener('scroll', updatePosition, true)
            window.removeEventListener('resize', updatePosition, true)
        }
    }, [ref, isOpen])

    return style
}

export default usePopoverPosition