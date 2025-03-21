'use client'

// libraries
import Link from 'next/link'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import { useState, useEffect } from 'react'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'

export default function GDPR() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        
        // only check localStorage if cookies were previously accepted
        const consent = localStorage.getItem('gdpr-consent')
        if (consent === 'accepted') {
            setIsVisible(false)
        }
    }, [])

    const handleConsent = (accepted: boolean) => {
        if (accepted) {
            
            // only store in localStorage if user accepts
            localStorage.setItem('gdpr-consent', 'accepted')
            
            // initialize your analytics/tracking services
            console.log('Cookies accepted - initialize tracking')
        }
        
        // hide the banner
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <AnimatePresence mode='wait'>
            <motion.div
                className={styles.component}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{
                    duration: .3,
                    ease: 'easeInOut'
                }}
            >
                <div className={styles.wrapper}>

                    <h2 className='text-16'>
                        <strong>
                            Cookies & Privacy
                        </strong>
                    </h2>

                    <p className='text-16'>
                        Our website uses cookies. By using our website and agreeing to this policy, you consent to our use of cookies in accordance with our <Link href={pages.privacy} className='hover-underline'>Privacy Policy</Link> and our <Link href={pages.terms} className='hover-underline'>Terms and Conditions</Link>.
                    </p>

                    <div className={styles.buttons}>
                        <button 
                            className='button button--hollow text-14 button--smaller'
                            onClick={() => handleConsent(true)}
                        >
                            Accept
                        </button>

                        <button 
                            className='button button--hollow text-14 button--smaller'
                            onClick={() => handleConsent(false)}
                        >
                            Reject
                        </button>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    )
}