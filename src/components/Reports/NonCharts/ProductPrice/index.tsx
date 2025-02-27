'use client'

// libraries
import clsx from 'clsx'
import Image from 'next/image'

// css
import styles from './index.module.scss'

// utils
import { placeholder } from '@/utils/functions'

// interface
export interface ProductPriceProps {
    data: Array<{
        name: string
        price: string
        image: string
    }>
}

export default function ProductPrice({
    data
}: ProductPriceProps) {
    return (
        <div className={styles.component}>
            {data.map((item, i) => (
                <div
                    className={styles.item}
                    key={item.name + i}
                >
                    <div className={styles.image}>
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            placeholder='blur'
                            blurDataURL={placeholder()}
                        />
                    </div>

                    <div className={styles.info}>

                        <p className={clsx(styles.name, 'text-16')}>
                            {item.name}
                        </p>

                        <p className={clsx(styles.price, 'text-16 semi-bold')}>
                            {item.price}
                        </p>

                    </div>

                </div>
            ))}
        </div>
    )
}