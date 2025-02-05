// css
import styles from './index.module.scss'

interface TitlePartProps {
    title: string
    description?: string
    rightSide?: React.ReactNode
}

export default function TitlePart({
    title,
    description,
    rightSide
}: TitlePartProps) {
    return (
        <section className={styles.component}>
            <div className='container container--big'>
                <div className={styles.flex}>

                    <div className={styles.left}>

                        <h1 className='text-45'>
                            <strong>
                                {title}
                            </strong>
                        </h1>

                        {description && (
                            <p className='text-16'>
                                {description}
                            </p>
                        )}

                    </div>

                    {rightSide && (
                        <div className={styles.right}>
                            {rightSide}
                        </div>
                    )}

                </div>
            </div>
        </section>
    )
}