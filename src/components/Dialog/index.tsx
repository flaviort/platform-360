'use client'

// libraries
import clsx from 'clsx'
import { useEffect } from 'react'

// img / svg
import { X } from 'lucide-react'

// css
import styles from './index.module.scss'

interface DialogProps {
    className?: string
    children: React.ReactNode
    id: string
}

export default function Dialog({
    className,
    children,
    id
}: DialogProps) {

    const closeDialog = () => {
        const dialog = document.getElementById(id) as HTMLDialogElement

        if (dialog) {
            dialog.close()
           
            // check if there are any other opn dialogs
            const openDialogs = document.querySelectorAll('dialog[open')

            if (openDialogs.length === 0) {
                document.body.classList.remove('no-scroll')
            }
        }
    }

    // check if the dialog is open
    useEffect(() => {
        const dialog = document.getElementById(id) as HTMLDialogElement

        if (dialog) {
            const observer = new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutation) => {
                    if (mutation.attributeName === 'open') {
                        if (dialog.open) {
                            document.body.classList.add('no-scroll')
                        } else {
                            const openDialogs = document.querySelectorAll('dialog[open]')

                            if (openDialogs.length === 0) {
                                document.body.classList.remove('no-scroll')
                            }
                        }
                    }
                })
            })

            observer.observe(dialog, { attributes: true })

            return () => {
                observer.disconnect()

                const openDialogs = document.querySelectorAll('dialog[open]')

                if (openDialogs.length === 0) {
                    document.body.classList.remove('no-scroll')
                }
            }
        }
    }, [id])

    // add effect to handle elements with data-dialog-close
    useEffect(() => {
        const dialog = document.getElementById(id) as HTMLDialogElement
        
        const closeButtons = dialog?.querySelectorAll('[data-dialog-close]')

        const handleClick = (event: Event) => {
            const targetButton = event.currentTarget as HTMLElement
            const closestDialog = targetButton.closest('dialog') as HTMLDialogElement

            if (closestDialog && closestDialog.open) {
                closestDialog.close()
                const openDialogs = document.querySelectorAll('dialog[open]')

                if (openDialogs.length === 0) {
                    document.body.classList.remove('no-scroll')
                }
            }
        }

        closeButtons?.forEach(button => {
            button.addEventListener('click', handleClick)
        })

        return () => {
            closeButtons?.forEach(button => {
                button.removeEventListener('click', handleClick)
            })

            const openDialogs = document.querySelectorAll('dialog[open]')

            if (openDialogs.length === 0) {
                document.body.classList.remove('no-scroll')
            }
        }
    }, [id])

    // backdrop click
    const handleBackdropClick = (event: React.MouseEvent<HTMLElement>) => {
        const dialogElement = event.currentTarget

        if (event.target === dialogElement) {
            closeDialog()

            const openDialogs = document.querySelectorAll('dialog[open]')

            if (openDialogs.length === 0) {
                document.body.classList.remove('no-scroll')
            }
        }
    }

    // open popups
    useEffect(() => {
        const dialogTriggers = document.querySelectorAll('[data-dialog]')

        dialogTriggers.forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.preventDefault()
                document.body.classList.add('no-scroll')

                const dialogId = (trigger.getAttribute('href') as string).substring(1)

                const dialog = document.getElementById(dialogId)
                
                if (dialog && (dialog as HTMLDialogElement).showModal) {
                    (dialog as HTMLDialogElement).showModal()
                }
            })
        })
    }, [])

    return (
        <dialog
            className={clsx(styles.component, className)}
            id={id}
        >

            <div
                className={styles.backdrop}
                onClick={handleBackdropClick}
            />

            <div className={styles.comopnentWrapper}>

                <button
                    className={styles.close}
                    data-dialog-close
                >
                    <X />
                </button>

                <div className={styles.componentInner}>
                    {children}
                </div>

            </div>
        </dialog>
    )
}