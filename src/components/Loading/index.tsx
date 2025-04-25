// libraries
import clsx from 'clsx'

// css
import styles from './index.module.scss'

// img / svg
import { LoaderCircle } from 'lucide-react'

export default function Loading({
    className,
    noContainer,
    simple,
    text
}: {
    className?: string
    noContainer?: boolean
    simple?: boolean
    text?: string
}) {
    return (
        noContainer ? (
            <div className={clsx(styles.component, className, simple && styles.simple)}>

                <span className='rotation purple' style={{ '--speed': '.5' } as any}>
                    <LoaderCircle />
                </span>

                <p className='text-16 semi-bold gray-500'>
                    {text || 'Loading...'}
                </p>

            </div>
        ) : (
            <div className='container container--big'>
                <div className={clsx(styles.component, className)}>

                    <span className='rotation purple' style={{ '--speed': '.5' } as any}>
                        <LoaderCircle />
                    </span>

                    <p className='text-16 semi-bold gray-500'>
                        {text || 'Loading...'}
                    </p>

                </div>
            </div>
        )
    )
}