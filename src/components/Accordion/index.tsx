'use client'

// libraries
import clsx from 'clsx'
import { useState } from 'react'

// svg

// css
import styles from './index.module.scss'

// interface
export interface AccordionProps {
    title: string
    children: string
}

export default function Accordion({
    title,
    children
}: AccordionProps) {

    const [isActive, setIsActive] = useState(false)

	const toggle = () => {
		setIsActive((prev) => !prev)
	}

    return (
        <div className={clsx(
            styles.accordion,
            isActive && styles.isActive
        )}>

            <div
                className={clsx(styles.title, 'text-25')}
                onClick={toggle}
            >
                
                <b>
                    {title}
                </b>

                <div className={styles.circle}>
                    {/*<AngleRight />*/}
                </div>

            </div>

            <div className={styles.content}>
                <div>
                    <div
                        dangerouslySetInnerHTML={{ __html: children }}
                    />
                </div>
            </div>

        </div>
    )
}