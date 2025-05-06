'use client'

// libraries
import clsx from 'clsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// utils
import useWindowSize from '@/utils/useWindowSize'
import { formatPrice } from '@/utils/functions'

// styles
import styles from './index.module.scss'

// interface
export interface PriceDistributionByBrandProps {
    data: Array<{
        brand: string
        price: number
    }>
}

const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props

    return (
        <foreignObject
            x={x - 45}
            y={y + height + 1}
            width='50'
            height='30'
            transform={`rotate(-90 ${x + width/2} ${y + height + 10})`}
        >
            <div className={clsx(styles.bottomLabel, 'text-12 gray-600')}>
                {value}
            </div>
        </foreignObject>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.tooltip}>

                <p className='text-14 medium gray-600 capitalize'>
                    Brand: {payload[0].payload.brand}
                </p>

                <p className='text-14 bold gray-600'>
                    Avg. Price: {formatPrice(payload[0].payload.price)}
                </p>

            </div>
        )
    }
    
    return null
}

export default function PriceDistributionByBrand({
    data
}: PriceDistributionByBrandProps) {

    // the functions below changes the size of the font and the bars according to the window size
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 8 : 12

    return (
        <div className={styles.component}>
            <ResponsiveContainer height={400} className={styles.chart}>
                <BarChart 
                    data={data}
                    margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
                >
                    <defs>
                        <linearGradient id='verticalBarsGradient' x1='0' y1='1' x2='0' y2='0'>
                            <stop offset='0%' stopColor='#48238F' />
                            <stop offset='100%' stopColor='#3691E1' />
                        </linearGradient>
                    </defs>

                    <CartesianGrid 
                        strokeDasharray='3 3' 
                        vertical={false}
                    />

                    <XAxis 
                        dataKey='brand' 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                        className='text-12 capitalize'
                        textAnchor='middle'
                    />

                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                        domain={[0, 'dataMax']}
                        tickFormatter={(value) => {
                            return `$${value.toFixed(2)}`
                        }}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='price'
                        radius={[20, 20, 0, 0]}
                        barSize={20}
                        spacing={20}
                        fill='url(#verticalBarsGradient)'
                    />
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}