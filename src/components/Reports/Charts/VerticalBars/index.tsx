'use client'

// libraries
import clsx from 'clsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// utils
import useWindowSize from '@/utils/useWindowSize'

// styles
import styles from './index.module.scss'

// interface
export interface VerticalBarsProps {
    data: Array<{
        label: string
        labelTitle?: string
        value: number
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

                <p className='text-14 medium'>
                    {payload[0].payload.label}
                </p>

                <p className='text-14 bold'>
                    {payload[0].payload.labelTitle && (
                        payload[0].payload.labelTitle + ': '
                    )}
                    {payload[0].value}
                </p>

            </div>
        )
    }
    
    return null
}

export default function VerticalBars({
    data
}: VerticalBarsProps) {

    // the functions below changes the size of the font and the bars according to the window size
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 8 : 12
    const barSize = data.length > 10 
        ? (windowSize.width < 575 ? 5 : windowSize.width < 992 ? 10 : 15) 
        : 15

    return (
        <div className={styles.component}>
            <ResponsiveContainer height={400} className={styles.chart}>
                <BarChart 
                    data={data}
                    margin={{ bottom: 70, left: 0, right: 5, top: 0 }}
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
                        dataKey='label' 
                        axisLine={false}
                        tickLine={false}
                        hide
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                    />

                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                        width={45}
                        domain={[0, 'dataMax']}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='value'
                        radius={20}
                        barSize={barSize}
                        spacing={20}
                        fill='url(#verticalBarsGradient)'
                    >
                        <LabelList 
                            dataKey='label'
                            content={CustomLabel}
                            position='bottom'
                        />
                    </Bar>
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}