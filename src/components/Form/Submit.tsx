// libraries
import clsx from 'clsx'

// svg
import { LoaderCircle } from 'lucide-react'

// css
import styles from './form.module.scss'

export interface SubmitProps {
    style: 'gradient-blue'
    text: string
    className?: string
}

export default function Submit({
    style,
    text,
    className
}: SubmitProps) {
    return (
        <button
            className={clsx(
                styles.submit,
                className,
                'button text-16',
                style === 'gradient-blue' && 'button--gradient-blue'
            )}
            type='submit'
        >

            <span className='button__text'>
                {text}
            </span>

            <span className='button__loading'>
                <span className='rotation' style={{ '--speed': '.5' } as any}>
                    <LoaderCircle />
                </span>
            </span>

        </button>
    )
}