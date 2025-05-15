'use client'

// libraries
import clsx from 'clsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// utils
import useWindowSize from '@/utils/useWindowSize'

// styles
import styles from './index.module.scss'

// interface
export interface PricePointAnalysisProps {
    data: Array<{
        id: string
        count: number
    }>
    height?: number
    showAllNumbers?: boolean
}

const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props

    return (
        <foreignObject
            x={x - 55}
            y={y + height + 1}
            width='70'
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
                
                <p className='text-14 gray-600'>
                    Price Range: {payload[0].payload.id}
                </p>

                <p className='text-14 bold gray-600'>
                    How many: {payload[0].payload.count.toLocaleString('en-US')}
                </p>
            </div>
        )
    }
    
    return null
}

const CustomValueLabel = (props: any) => {
    const { x, y, width, value } = props
    
    // format number with US locale (adds commas as thousand separators)
    const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US') : value
    
    // Calculate position for rotated text
    const rotationX = x + (width / 2 + 4)
    const rotationY = y - 7
    
    return (
        <text
            x={rotationX}
            y={rotationY}
            fill='#333'
            //textAnchor="left"
            transform={`rotate(-90, ${rotationX}, ${rotationY})`}
            className='text-14 medium'
        >
            {formattedValue}
        </text>
    )
}

export default function PricePointAnalysis({
    data,
    height,
    showAllNumbers
}: PricePointAnalysisProps) {

    // the functions below changes the size of the font and the bars according to the window size
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 8 : 12
    const barSize = windowSize.width < 992 ? 12 : 18
    
    // Sort data by numeric order, keeping '$145 - $150' at the end
    const sortedData = [...data].sort((a, b) => {
        if (a.id === '$145 - $150') return 1
        if (b.id === '$145 - $150') return -1
        
        const extractNumber = (str: string) => {
            const match = str.match(/\$(\d+)/)
            return match ? parseInt(match[1]) : 0
        }
        
        return extractNumber(a.id) - extractNumber(b.id)
    })

    return (
        <div className={styles.component}>
            <ResponsiveContainer height={height || 400} className={styles.chart}>
                <BarChart 
                    data={sortedData}
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

                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                        width={60}
                        domain={[0, 'dataMax']}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='count'
                        radius={[20, 20, 0, 0]}
                        barSize={barSize}
                        spacing={20}
                        fill='url(#verticalBarsGradient)'
                    >
                        <LabelList 
                            dataKey='id'
                            content={CustomLabel}
                        />

                        {showAllNumbers && (
                            <LabelList
                                dataKey='count'
                                content={CustomValueLabel}
                            />
                        )}

                    </Bar>
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}