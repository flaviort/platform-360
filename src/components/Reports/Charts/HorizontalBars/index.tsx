'use client'

// libraries
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// styles
import styles from './index.module.scss'

// interface
export interface HorizontalBarsProps {
    data: Array<{
        name: string
        value: number
        color: string
    }>
}

const CustomLabel = (props: any) => {

    const { x, y, width, value, height } = props

    return (
        <text
            x={0}
            y={y + height / 2}
            fill='#333'
            alignmentBaseline='middle'
            className='text-14 medium'
        >
            {props.name}
        </text>
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
                    {payload[0].payload.name}
                </p>

                <p className='text-14 bold'>
                    {payload[0].value}
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

            {/*
            <div className={styles.header}>
                
                <h4 className='text-14 gray-600'>
                    List of Retailers
                </h4>

                <span className='text-14 gray-600'>
                    {data.length} retailers
                </span>

            </div>
            */}

            <ResponsiveContainer height={data.length * 50} className={styles.chart}>
                <BarChart
                    data={data}
                    layout='vertical'
                    margin={{ left: 90 }}
                >

                    <CartesianGrid strokeDasharray='3 3' horizontal={false} />

                    <XAxis hide type='number' />

                    <YAxis hide type='category' />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='value'
                        radius={5}
                        barSize={32}
                    >

                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}

                        <LabelList
                            content={CustomLabel}
                            position='left'
                        />

                        <LabelList
                            content={CustomValueLabel}
                        />

                    </Bar>

                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}