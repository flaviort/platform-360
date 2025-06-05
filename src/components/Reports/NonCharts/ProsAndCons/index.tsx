'use client'

// libraries
import clsx from 'clsx'
import Image from 'next/image'

// css
import styles from './index.module.scss'

// svg
import { ShieldMinus, ShieldPlus, ShieldX } from 'lucide-react'

// utils
import { placeholder } from '@/utils/functions'

// interface
export interface ProsAndConsProps {
    title: string
    executive_summary: string
    pros_features: Array<{
        name: string
        description: string
    }>
    cons_features: Array<{
        name: string
        description: string
    }>
}

export default function ProsAndCons({
    title,
    executive_summary,
    pros_features,
    cons_features
}: ProsAndConsProps) {
    return (
        <div className={styles.component}>

            <div className={styles.summary}>
                <p className='text-18'>
                    <strong>Executive Summary:</strong><br />
                    {executive_summary}
                </p>
            </div>

            <div className={styles.blocks}>

                <div className={clsx(styles.column, styles.pros)}>

                    <div className={styles.title}>

                        <ShieldPlus />

                        <h3 className='text-30 bold'>
                            Pros
                        </h3>

                    </div>
                
                    <div className={styles.innerBlocks}>
                        {pros_features.map((item, i) => (
                            <div key={i} className={styles.block}>

                                <h4 className='text-18 bold uppercase'>
                                    {item.name}
                                </h4>

                                <p className='text-18'>
                                    {item.description}
                                </p>

                            </div>
                        ))}
                    </div>

                </div>

                <div className={clsx(styles.column, styles.cons)}>

                    <div className={styles.title}>

                        <ShieldMinus />

                        <h3 className='text-30 bold'>
                            Cons
                        </h3>

                    </div>
                    
                    <div className={styles.innerBlocks}>
                        {cons_features.map((item, i) => (
                            <div key={i} className={styles.block}>

                                <h4 className='text-18 bold uppercase'>
                                    {item.name}
                                </h4>

                                <p className='text-18'>
                                    {item.description}
                                </p>

                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </div>
    )
}