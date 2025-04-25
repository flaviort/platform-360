'use client'

// libraries
import clsx from 'clsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// utils
import useWindowSize from '@/utils/useWindowSize'

// styles
import styles from './index.module.scss'

// interface
export interface ColorsProps {
    data: Array<{
        color: string | null
        count: number
    }>
}

// process and filter data to remove empty/null colors and calculate percentages
const processData = (data: ColorsProps['data']) => {
    
    // first filter out any items with empty, null, whitespace-only, or "Unknown" colors
    const filteredData = data.filter(item => {
        if (item.color === null || item.color === undefined) return false
        if (item.color === '') return false
        if (item.color.trim() === '') return false
        if (item.color.toLowerCase() === 'unknown') return false
        return true
    })
    
    // calculate total count across all valid colors
    const totalCount = filteredData.reduce((sum, item) => sum + item.count, 0)
    
    // calculate percentage for each color
    return filteredData.map(item => ({
        ...item,
        percentage: totalCount > 0 ? ((item.count / totalCount) * 100) : 0,
        percentageFormatted: totalCount > 0 ? `${Math.round((item.count / totalCount) * 100)}%` : '0%'
    }))
}

const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props

    // don't render labels for empty/null values
    if (!value || value === '' || value === 'Unknown') return null

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
        // Don't show tooltip for empty/null values
        if (!payload[0].payload.color) return null
        
        return (
            <div className={styles.tooltip}>
                <p className='text-14 medium gray-600'>
                    Color: {payload[0].payload.color}
                </p>
                <p className='text-14 bold gray-600'>
                    Percentage: {payload[0].payload.percentageFormatted}
                </p>
                <p className='text-12 gray-600'>
                    Count: {payload[0].payload.count}
                </p>
            </div>
        )
    }
    
    return null
}

// Custom label for percentage values
const CustomPercentageLabel = (props: any) => {
    const { x, y, width, value } = props
    
    return (
        <text
            x={x + width + 5}
            y={y + 22}
            fill="#666"
            textAnchor="start"
            className="text-12 medium"
        >
            {value}
        </text>
    )
}

export default function Colors({
    data
}: ColorsProps) {
    // Filter out null or empty colors and calculate percentages
    const processedData = processData(data)
    
    // Return a message if no valid data is available
    if (processedData.length === 0) {
        return (
            <div className={styles.component}>
                <div className="flex">
                    <p className="text-14 gray-600">No color data available</p>
                </div>
            </div>
        )
    }
    
    // the functions below changes the size of the font and the bars according to the window size
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 10 : 12
    const barSize = processedData.length > 10 ? (windowSize.width < 575 ? 10 : windowSize.width < 992 ? 15 : 22) : 15

    return (
        <div className={styles.component}>
            <ResponsiveContainer height={400} className={styles.chart}>
                <BarChart 
                    data={processedData}
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
                        dataKey='color' 
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
                        domain={[0, 100]} // Set domain to 0-100 for percentages
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='percentage' // Use percentage instead of count
                        radius={[20, 20, 0, 0]}
                        barSize={barSize}
                        spacing={20}
                        fill='url(#verticalBarsGradient)'
                    >
                        <LabelList 
                            dataKey='color'
                            content={CustomLabel}
                            position='bottom'
                        />
                        <LabelList 
                            dataKey='percentageFormatted'
                            content={CustomPercentageLabel}
                            position='top'
                        />
                    </Bar>
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}