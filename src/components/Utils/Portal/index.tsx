'use client'

// libraries
import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
    children: ReactNode
}

export default function Portal({ children }: PortalProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const portalRoot = document.getElementById('portal')

    if (!portalRoot) {
        return null
    }

    return createPortal(children, portalRoot)
}