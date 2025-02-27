'use client'

// libraries
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// styles
import styles from './index.module.scss'

// interface
export interface VerticalBarsProps {
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
            x={x + width/2}
            y={y + height + 20}
            fill='#333'
            textAnchor="middle"
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

export default function VerticalBars({
    data
}: VerticalBarsProps) {
    return (
        <div className={styles.component}>
            <ResponsiveContainer height={400} className={styles.chart}>
                <BarChart 
                    data={data}
                    margin={{ bottom: 30, left: 0, right: 0, top: 0 }}
                >
                    <CartesianGrid 
                        strokeDasharray='3 3' 
                        vertical={false}
                    />

                    <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        hide
                        tick={{ fontSize: 12, fill: '#666' }}
                    />

                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                        width={30}
                        domain={[0, 'dataMax + 5']}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='value'
                        radius={15}
                        barSize={15}
                        spacing={20}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}
                        
                        <LabelList 
                            dataKey="value"
                            content={CustomLabel}
                            position="bottom"
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}