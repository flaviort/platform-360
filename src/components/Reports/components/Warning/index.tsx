// css
import styles from './index.module.scss'

// svg
import { BadgeAlert } from 'lucide-react'

export default function Warning({
    text
}: {
    text: string
}) {
    return (
        <p
            className={styles.component}
            data-balloon-pos='down-left'
            data-balloon-length='xlarge'
            aria-label={text}
        >
            <BadgeAlert strokeWidth={1.5} /> Attention
        </p>
    )
}