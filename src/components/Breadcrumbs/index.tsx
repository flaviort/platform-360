// libraries
import clsx from 'clsx'
import Link from 'next/link'

// svg
import { ChevronRight } from 'lucide-react'

// css
import styles from './index.module.scss'

interface BreadcrumbsProps {
    breadcrumbs?: Array<{
        name: string
        link: string
    }>
}

export default function Breadcrumbs({
    breadcrumbs
}: BreadcrumbsProps) {  
    return (
        <section className={clsx(styles.component, 'bg-gray-200 gray-500')}>
            <div className='container container--big'>
                <ul className={styles.breadcrumbs}>
                    {breadcrumbs?.map((item, i) => (
                        <li key={i}>

                            <Link
                                href={item.link}
                                className={clsx(styles.link, 'hover-underline text-16')}
                            >
                                {item.name}
                            </Link>

                            {i < breadcrumbs.length - 1 && (
                                <ChevronRight />
                            )}

                        </li>
                    ))} 
                </ul>
            </div>
        </section>
    )
}