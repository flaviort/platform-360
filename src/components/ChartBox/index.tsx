// components
import HorizontalBars from '@/components/Reports/Charts/HorizontalBars'
import VerticalBars from '@/components/Reports/Charts/VerticalBars'
import PositiveNegativeBars from '@/components/Reports/Charts/PositiveNegativeBars'
import ProductPrice from '@/components/Reports/NonCharts/ProductPrice'

// svg
import { Ellipsis, Sparkle } from 'lucide-react'

// styles
import styles from './index.module.scss'

// interface
interface ChartBoxProps {
    title: string
    description: string
    AIGenerated?: boolean
    chart: {
        horizontal?: Array<{
            name: string
            value: number
            color: string
        }>
        vertical?: Array<{
            name: string
            value: number
            color: string
        }>
        positiveNegative?: Array<{
            name: string
            value: number
            color: string
        }>
        productPrice?: Array<{
            name: string
            price: string
            image: string
        }>
    }
}

export default function ChartBox({
    title,
    description,
    AIGenerated,
    chart
}: ChartBoxProps) {
    return (
        <div className={styles.content}>

            <div className={styles.header}>

                <div className={styles.left}>

                    <h3 className='bold'>
                        {title}
                    </h3>

                    <p className='text-14'>
                        {description}
                    </p>
                    
                </div>

                <div className={styles.right}>

                    {AIGenerated && (
                        <div
                            className={styles.AIGenerated}
                            aria-label='This chart was generated by A.I.'
                            data-balloon-pos='up'
                        >

                            <Sparkle />

                            <span className='text-12 semi-bold'>
                                Gen by A.I.
                            </span>

                        </div>
                    )}

                    <button
                        className={styles.options}
                    >
                        <Ellipsis />
                    </button>

                </div>

            </div>

            <div className={styles.chart}>
                
                {chart.horizontal && (
                    <HorizontalBars data={chart.horizontal} />
                )}

                {chart.vertical && (
                    <VerticalBars data={chart.vertical} />
                )}

                {chart.positiveNegative && (
                    <PositiveNegativeBars data={chart.positiveNegative} />
                )}

                {chart.productPrice && (
                    <ProductPrice data={chart.productPrice} />
                )}

            </div>

        </div>
    )
}