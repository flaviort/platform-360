'use client'

// libraries
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell, ReferenceLine } from 'recharts'

// styles
import styles from './index.module.scss'

// interface
export interface PositiveNegativeBarsProps {
    data: Array<{
        name: string
        value: number
        color: string
    }>
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

export default function PositiveNegativeBars({
    data
}: PositiveNegativeBarsProps) {
    const maxValue = Math.max(...data.map(item => Math.abs(item.value)))
    const domain = [-maxValue, maxValue]

    return (
        <div className={styles.component}>
            <ResponsiveContainer height={400} className={styles.chart}>
                <BarChart 
                    data={data}
                    margin={{ bottom: 30, left: 0, right: 0, top: 0 }}
                >
                    <CartesianGrid 
                        strokeDasharray='3 3' 
                        horizontal={true}
                        vertical={false}
                    />

                    <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        //hide
                        tick={{ fontSize: 12, fill: '#666' }}
                    />

                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => `${value > 0 ? value/1000 : -value/1000}k`}
                        domain={domain}
                        width={30}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <ReferenceLine 
                        y={0} 
                        stroke="#E5E7EB"
                        strokeWidth={1}
                    />

                    <Bar
                        dataKey='value'
                        radius={20}
                        barSize={20}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}