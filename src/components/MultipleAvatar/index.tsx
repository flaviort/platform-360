// libraries
import clsx from 'clsx'

// components
import Avatar from '@/components/Avatar'

// css
import styles from './index.module.scss'

// svg
import { Plus } from 'lucide-react'

interface MultipleAvatarProps {
    showAriaLabel?: boolean
    avatars: Array<{
        image?: string
        alt?: string
        letter?: string
    }>
    className?: string
}

export default function MultipleAvatar({
    showAriaLabel,
    avatars,
    className
}: MultipleAvatarProps) {
    return (
        <span className={clsx(styles.component, className)}>
            {avatars.slice(0, 3).map((item, i) => (
                <Avatar
                    key={i}
                    image={item.image}
                    alt={item.alt}
                    letter={item.letter}
                    showAriaLabel={showAriaLabel}
                />
            ))}

            {avatars.length > 3 && (
                <span className={styles.plus}>
                    <Plus />
                </span>
            )}
        </span>
    )
}