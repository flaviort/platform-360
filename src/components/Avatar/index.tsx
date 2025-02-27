// libraries
import clsx from 'clsx'
import Image from 'next/image'

// css
import styles from './index.module.scss'

// utils
import { firstChar, placeholder } from '@/utils/functions'

interface AvatarProps {
    image?: string
    alt?: string
    letter?: string
    className?: string
    showAriaLabel?: boolean
}

export default function Avatar({
    image,
    alt,
    letter,
    className,
    showAriaLabel
}: AvatarProps) {
    return (
        <span
            className={clsx(styles.component, className)}
            aria-label={showAriaLabel ? alt : undefined}
            data-balloon-pos={showAriaLabel ? 'up' : undefined}
        >
            {image ? (
                <Image
                    src={image || '/images/avatar.png'}
                    alt={alt || 'Avatar'}
                    fill
                    className='cover'
                    loading='lazy'
                    blurDataURL={placeholder()}
                />
            ) : (
                <span className={clsx(styles.letter, 'text-16')}>
                    {firstChar(letter ?? '') || ''}
                </span>
            )}
        </span>
    )
}