// libraries
import clsx from 'clsx'

// components
import { SubWrapper, Sub } from '@/components/SubMenu'
import PopupShop360 from '@/components/NewReportPopup/shop360'
import PopupDemand360 from '@/components/NewReportPopup/demand360'
import PopupInsight360 from '@/components/NewReportPopup/insight360'
import PopupFeedback360 from '@/components/NewReportPopup/feedback360'

// css
import styles from './index.module.scss'

// img / svg
import { ChevronDown, Plus, ShoppingCart, ChartNoAxesCombined, Search, FilePenLine } from 'lucide-react'

export default function NewReportButton() {
    return (
        <SubWrapper className={styles.new}>

            <button
                className={clsx(
                    styles.button,
                    'button button--gradient-blue uppercase text-14'
                )}
                data-toggle-sub
            >

                <Plus />

                <span>
                    New
                </span>

                <ChevronDown />

            </button>

            <Sub className={styles.sub}>

                <p className='text-14 bold gray-400 uppercase'>
                    Reports
                </p>

                <PopupShop360
                    icon={ShoppingCart}
                    text='Shop360'
                />

                <PopupDemand360
                    icon={ChartNoAxesCombined}
                    text='Demand360'
                />

                <PopupInsight360
                    icon={Search}
                    text='Insight360'
                />

                <PopupFeedback360
                    icon={FilePenLine}
                    text='Feedback360'
                    disabled
                />

            </Sub>

        </SubWrapper>
    )
}