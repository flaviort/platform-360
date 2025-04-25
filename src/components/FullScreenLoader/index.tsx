// css
import styles from './index.module.scss'

// img / svg
import { LoaderCircle } from 'lucide-react'

export default function FullScreenLoader() {
    return (
        <div className={styles.component}>

            <span className='rotation purple' style={{ '--speed': '.5' } as any}>
                <LoaderCircle />
            </span>

            <p className='text-16 semi-bold gray-500'>
                Loading...
            </p>

        </div>
    )
}