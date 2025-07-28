'use client'

// libraries
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { motion } from 'framer-motion'

// css
import styles from './index.module.scss'

// types
interface FullScreenLoaderProps {
    text?: string
}

export default function FullScreenLoader({
    text = 'Loading...'
}: FullScreenLoaderProps) {
    return (
        <motion.div  className={styles.component}>

            <motion.div
                className={styles.bg}
                initial={{ transform: 'translateY(110%)' }}
                animate={{ transform: 'translateY(0)' }}
                exit={{
                    transform: 'translateY(-110%)',
                    transition: {
                        duration: .3,
                        delay: .5,
                        ease: 'easeInOut'
                    }
                }}
            />

            <motion.div
                className={styles.container}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: {
                        duration: .3,
                        delay: .5,
                        ease: 'easeInOut'
                    }
                }}
                exit={{
                    opacity: 0,
                    transition: {
                        duration: .3,
                        ease: 'easeInOut'
                    }
                }}
            >

                <span className={styles.loader}>
                    <DotLottieReact
                        src='/svg/lottie/walk-shoes.lottie'
                        loop
                        autoplay
                    />
                </span>

                <p className='text-24 semi-bold white'>
                    {text}
                </p>

            </motion.div>

        </motion.div>
    )
}