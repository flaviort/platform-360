// libraries
import clsx from 'clsx'
import { useState } from 'react'

// components
import DeleteChart from '@/components/DeleteChart'
import PricePointAnalysis from '@/components/Reports/Charts/PricePointAnalysis'
import PricePointByRetailer from '@/components/Reports/Charts/PricePointByRetailer'
import PriceDistributionByBrand from '@/components/Reports/Charts/PriceDistributionByBrand'
import SkuAnalysis from '@/components/Reports/Charts/SkuAnalysis'
import Colors from '@/components/Reports/Charts/Colors'
import VerticalBars from '@/components/Reports/Charts/VerticalBars'
import HorizontalBars from '@/components/Reports/Charts/HorizontalBars'
import PositiveNegativeBars from '@/components/Reports/Charts/PositiveNegativeBars'
import Maps from '@/components/Reports/NonCharts/Maps'
import CategoryTrend from '@/components/Reports/Charts/CategoryTrend'
import ProsAndCons from '@/components/Reports/NonCharts/ProsAndCons'

// non-chart components
import ProductPrice from '@/components/Reports/NonCharts/ProductPrice'

// svg
import { Sparkle } from 'lucide-react'

// styles
import styles from './index.module.scss'

// interface
interface ChartBoxProps {
    id: string
    title?: string
    description?: string
    AIGenerated?: boolean
    AIChatChart?: boolean
    boxSize: 'half' | 'full'
    chartType: string
    chartHeight?: number
    showAllNumbers?: boolean
    switchToPercentage?: boolean
    chart: {
        // shop360 default charts
        pricePointAnalysis?: Array<{
            id: string
            count: number
        }>
        pricePointByRetailer?: Array<{
            company: string
            min: number
            avg: number
            max: number
        }>
        priceDistributionByBrand?: Array<{
            brand: string
            price: number
        }>
        skuAnalysis?: Array<{
            company: string
            count: number
        }>
        colors?: Array<{
            color: string
            count: number
        }>

        // demand360 default charts
        geographyTrend?: Array<{
            geo: string
            name: string
            values: Array<{
                query: string
                value: number
            }>
        }>
        categoryTrend?: Array<{
            date: string
            values: Array<{
                query: string
                value: number
            }>
        }>

        // insight360 default charts
        pros_and_cons?: {
            title: string
            executive_summary: string
            pros_features: Array<{
                name: string
                description: string
            }>
            cons_features: Array<{
                name: string
                description: string
            }>
        }

        // old charts
        vertical?: Array<{
            label: string
            value: number
        }>
        horizontal?: Array<{
            name: string
            value: number
            color: string
        }>
        positiveNegative?: Array<{
            name: string
            value: number
            color: string
        }>
    }
    reportSummary: {
		retailers?: string[]
		brands?: string[]
		genders?: string[]
		age?: string
		type?: string
		includeImages?: boolean
		timePeriod?: string
		location?: string
		regions?: string[]
		priceRange?: string
	}
}

export default function ChartBox({
    id,
    title,
    description,
    AIGenerated,
    AIChatChart,
    boxSize = 'half',
    chartType,
    chartHeight,
    chart,
    reportSummary,
    showAllNumbers,
    switchToPercentage
}: ChartBoxProps) {
    // State for toggling between numbers and percentages (only for Colors chart)
    const [showAsPercentage, setShowAsPercentage] = useState(false)
    
    // Handle View in % button click
    const handleViewInPercentage = () => {
        setShowAsPercentage(prev => !prev)
    }
    
    // determine the effective box size - override to 'half' for Canada geographic trend charts
    const effectiveBoxSize = chart.geographyTrend && reportSummary.location === 'CA' || reportSummary.location === 'EU'
        ? 'half' 
        : boxSize
    
    return (
        <div
            className={clsx(
                styles.component,
                effectiveBoxSize === 'full' && styles.full,
                effectiveBoxSize === 'half' && styles.half
            )}
            data-chart
        >

            {!AIChatChart && (
                <div className={styles.header} data-chart-header>

                    {(title || description) && (
                        <div className={styles.left}>

                            {title && (
                                <h3 className='bold'>
                                    {title}
                                </h3>
                            )}

                            {description && (
                                <p className='text-14'>
                                    {description}
                                </p>
                            )}

                        </div>
                    )}

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

                        {switchToPercentage && (
                            <button
                                className={clsx(
                                    styles.switch, 
                                    'text-14 medium',
                                    showAsPercentage && styles.active
                                )}
                                onClick={handleViewInPercentage}
                            >
                                {showAsPercentage ? 'View as numbers' : 'View in %'}
                            </button>
                        )}

                        <DeleteChart id={id} />

                    </div>

                </div>
            )}

            <div
                className={styles.chart}
                data-chart-type={chartType}
                data-chart-main
            >

                {/* --- shop360 default charts  --- */}

                {chart.pricePointAnalysis && (
                    <PricePointAnalysis
                        data={chart.pricePointAnalysis}
                        height={chartHeight}
                        showAllNumbers={showAllNumbers}
                    />
                )}

                {chart.pricePointByRetailer && (
                    <PricePointByRetailer
                        data={chart.pricePointByRetailer}
                        height={chartHeight}
                        reportSummary={{
                            ...reportSummary,
                            regions: reportSummary.regions?.join(',')
                        }}
                    />
                )}

                {chart.skuAnalysis && (
                    <SkuAnalysis
                        data={chart.skuAnalysis}
                        height={chartHeight}
                        reportSummary={{
                            ...reportSummary,
                            regions: reportSummary.regions?.join(',')
                        }}
                        showAllNumbers={showAllNumbers}
                    />
                )}

                {chart.priceDistributionByBrand && (
                    <PriceDistributionByBrand
                        data={chart.priceDistributionByBrand}
                        height={chartHeight}
                        reportSummary={{
                            ...reportSummary,
                            regions: reportSummary.regions?.join(',')
                        }}
                        showAllNumbers={showAllNumbers}
                    />
                )}

                {chart.colors && (
                    <Colors
                        data={chart.colors}
                        height={chartHeight}
                        showAllNumbers={showAllNumbers}
                        showAsPercentage={showAsPercentage}
                    />
                )}

                {/* --- demand360 default charts  --- */}
                {chart.geographyTrend && (
                    <Maps
                        location={reportSummary.location as 'US' | 'CA' | 'EU'}
                        data={chart.geographyTrend}
                    />
                )}

                {chart.categoryTrend && (
                    <CategoryTrend
                        data={chart.categoryTrend}
                    />
                )}

                {/* --- insight360 default charts  --- */}
                {chart.pros_and_cons && (
                    <ProsAndCons
                        title={chart.pros_and_cons.title}
                        executive_summary={chart.pros_and_cons.executive_summary}
                        pros_features={chart.pros_and_cons.pros_features}
                        cons_features={chart.pros_and_cons.cons_features}
                    />
                )}

                {/* --- other charts  --- */}
                {chart.vertical && (
                    <VerticalBars
                        data={chart.vertical}
                        //reportSummary={reportSummary}
                        showAllNumbers={showAllNumbers}
                    />
                )}

                {chart.horizontal && (
                    <HorizontalBars
                        data={chart.horizontal}
                        //reportSummary={reportSummary}
                    />
                )}

                {chart.positiveNegative && (
                    <PositiveNegativeBars
                        data={chart.positiveNegative}
                        //reportSummary={reportSummary}
                    />
                )}

            </div>

        </div>
    )
}