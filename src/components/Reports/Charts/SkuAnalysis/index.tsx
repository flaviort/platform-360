'use client'

// libraries
import clsx from 'clsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// styles
import styles from './index.module.scss'

// interface
export interface HorizontalBarsProps {
    data: Array<{
        company: string
        count: number
    }>
}

const CustomLabel = (props: any) => {
    const { x, y, width, value, height, payload } = props

    // safe access to company name, fallback to the value prop if payload is undefined
    const companyName = payload && payload.company ? payload.company : value

    return (
        <foreignObject
            x={0}
            y={y}
            width='70'
            height={height}
            alignmentBaseline='middle'
        >
            <div className={clsx(styles.companyLabel, 'text-14 medium')}>
                <p>
                    {companyName}
                </p>
            </div>
        </foreignObject>
    )
}

const CustomValueLabel = (props: any) => {
    
    const { x, y, width, value, height } = props
    
    return (
        <text
            x={x + width + 10}
            y={y + height / 2}
            fill='#333'
            alignmentBaseline='middle'
            className='text-14 medium'
        >
            {value}
        </text>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.tooltip}>

                <p className='text-14 medium'>
                    Retailer: {payload[0].payload.company}
                </p>

                <p className='text-14 bold'>
                    Count: {payload[0].payload.count}
                </p>

            </div>
        )
    }
    
    return null
}

export default function HorizontalBars({
    data
}: HorizontalBarsProps) {
    return (
        <div className={styles.component}>

            <div className={styles.header}>
                
                <h4 className='text-14 gray-600'>
                    List of Retailers
                </h4>

                <span className='text-14 gray-600'>
                    {data.length} retailers
                </span>

            </div>

            <ResponsiveContainer height={data.length * 50} className={styles.chart}>
                <BarChart
                    data={data}
                    layout='vertical'
                    margin={{ left: 90 }}
                >
                    <defs>
                        <linearGradient id='horizontalBarsGradient' x1='0' y1='0' x2='1' y2='0'>
                            <stop offset='0%' stopColor='#48238F' />
                            <stop offset='100%' stopColor='#3691E1' />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray='3 3' horizontal={false} />

                    <XAxis hide type='number' dataKey='count' />

                    <YAxis hide type='category' dataKey='company' />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='count'
                        radius={[0, 20, 20, 0]}
                        barSize={22}
                        fill='url(#horizontalBarsGradient)'
                    >
                        
                        <LabelList
                            dataKey='company'
                            content={CustomLabel}
                            position='left'
                        />

                        <LabelList
                            dataKey='count'
                            content={CustomValueLabel}
                        />

                    </Bar>

                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}