'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'

// components
import Portal from '@/components/Utils/Portal'
import Avatar from '@/components/Avatar'
import ChartBox from '@/components/ChartBox'
import Fancybox from '@/components/Utils/Fancybox'

// svg
import { Sparkle, X, SendHorizontal, LoaderCircle } from 'lucide-react'

// styles
import styles from './index.module.scss'

// context
import { useUser } from '@/contexts/UserContext'

// utils
import { formatFlexibleChartData } from '@/utils/chartUtils'

// types
interface AIChatBoxProps {
    isOpen: boolean
    onClose: () => void
    reportId?: string
    onChartAdded?: () => void
}

interface Message {
    id: string
    text: string
    isUser: boolean
    timestamp: Date
    data?: any[]
}

interface ApiResponse {
    message?: string
    data?: any[]
    query_id?: string
    chat_history_id?: string
}

// Add new interface for add chart response
interface AddChartResponse {
    id: string
    title: string
    description?: string
    preferences?: any
    success?: boolean
    error?: string
}

// constants
const API_BASE_URL = '/api/proxy?endpoint=/api'

export default function AIChatBox({
    isOpen,
    onClose,
    reportId,
    onChartAdded
}: AIChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAddingChart, setIsAddingChart] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [chatHistoryId, setChatHistoryId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // focus the input field always
    const focusInput = () => {
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)
    }

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom()
        }
    }, [messages])

    // textarea auto-resize
    const adjustTextareaHeight = () => {
        const textarea = inputRef.current
        if (!textarea) return

        // reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto'
        
        // calculate the new height based on scrollHeight
        const newHeight = Math.min(textarea.scrollHeight, 24 * 6)
        textarea.style.height = `${newHeight}px`
        
        // add overflow scrolling if content exceeds 6 lines
        textarea.style.overflowY = textarea.scrollHeight > 24 * 6 ? 'auto' : 'hidden'
    }

    // update textarea height whenever input value changes
    useEffect(() => {
        adjustTextareaHeight()
    }, [inputValue])

    // Helper to get the auth token
    const getAuthToken = (): string => {
        // Try to get auth token from localStorage
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                console.error('No auth token found in localStorage')
                return ''
            }
            return token
        } catch (error) {
            console.error('Error getting auth token:', error)
            return ''
        }
    }

    // start a new chat conversation with welcome message
    const startChatConversation = async () => {
        try {
            // Add a welcome message without making an API call since the endpoint structure changed
            const welcomeMessageId = Date.now().toString()
            const welcomeMessage: Message = {
                id: welcomeMessageId,
                text: "Hello! How can I help you today? Ask me a question about your product data.",
                isUser: false,
                timestamp: new Date()
            }
            
            setMessages([welcomeMessage])
            // Reset chat history ID for new conversation
            setChatHistoryId(null)
        } catch (error) {
            console.error('Error starting chat:', error)
        }
    }

    // Continue an existing chat conversation
    const continueChatConversation = async (query: string) => {
        if (!reportId) {
            // If no report ID is provided, show an error message
            const errorMessageId = Date.now().toString()
            const errorMessage: Message = {
                id: errorMessageId,
                text: "Please open this chat from a specific report to enable AI analysis.",
                isUser: false,
                timestamp: new Date()
            }
            
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: query,
                isUser: true,
                timestamp: new Date()
            }, errorMessage])
            
            return
        }
        
        try {
            setIsLoading(true)
            
            // Add user message to chat
            const userMessageId = Date.now().toString()
            const userMessage: Message = {
                id: userMessageId,
                text: query,
                isUser: true,
                timestamp: new Date()
            }
            
            setMessages(prev => [...prev, userMessage])
            
            // Get authentication token
            const authToken = getAuthToken()
            if (!authToken) {
                throw new Error('Authentication required')
            }
            
            // Set up abort controller for timeout handling
            const abortController = new AbortController()
            const timeoutId = setTimeout(() => abortController.abort(), 60000)
            
            // Make API call with the new structure
            const requestPayload = {
                question: query,
                report_id: reportId,
                ...(chatHistoryId ? { chat_history_id: chatHistoryId } : {})
            }
            
            // Retry logic for 504 errors
            let retryCount = 0
            const maxRetries = 2
            
            const makeRequest = async (): Promise<Response> => {
                while (retryCount <= maxRetries) {
                    try {
                        console.log(`API Request:`, JSON.stringify(requestPayload, null, 2))
                        
                        const response = await fetch(
                            `${API_BASE_URL}/chats`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${authToken}`
                                },
                                body: JSON.stringify(requestPayload),
                                signal: abortController.signal
                            }
                        )
                        
                        // If we get a 504 Gateway Timeout, retry
                        if (response.status === 504 && retryCount < maxRetries) {
                            console.warn(`504 Gateway Timeout on attempt ${retryCount + 1}, retrying...`)
                            retryCount++
                            // Wait before retrying (exponential backoff)
                            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
                            continue
                        }
                        
                        return response
                        
                    } catch (error: any) {
                        // If it's a timeout error and we can retry, do so
                        if (error.name === 'AbortError' && retryCount < maxRetries) {
                            console.warn(`Request timeout on attempt ${retryCount + 1}, retrying...`)
                            retryCount++
                            // Reset the timeout for retry
                            clearTimeout(timeoutId)
                            const newTimeoutId = setTimeout(() => abortController.abort(), 60000)
                            // Wait before retrying
                            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
                            continue
                        }
                        
                        throw error
                    }
                }
                
                throw new Error('Max retries exceeded')
            }
            
            try {
                const response = await makeRequest()
                
                clearTimeout(timeoutId)
                
                if (!response.ok) {
                    let errorMessage = `API error: ${response.status}`
                    
                    if (response.status === 504) {
                        errorMessage = "The AI service is experiencing high load. Please try a simpler question or wait a moment before trying again."
                    } else if (response.status >= 500) {
                        errorMessage = "The AI service is temporarily unavailable. Please try again in a few moments."
                    }
                    
                    throw new Error(errorMessage)
                }

                const responseText = await response.text()
                
                // Parse response - handle potential parsing issues
                let data: ApiResponse
                try {
                    data = JSON.parse(responseText)
                    console.log('API Response:', JSON.stringify(data, null, 2))
                } catch (parseError) {
                    console.error('Failed to parse response as JSON:', parseError)
                    throw new Error('Invalid JSON response from server')
                }
                
                // Store chat_history_id for future requests
                if (data.chat_history_id) {
                    setChatHistoryId(data.chat_history_id)
                }
                
                // Add AI response to chat
                const aiMessageId = (Date.now() + 1).toString()
                const aiMessage: Message = {
                    id: aiMessageId,
                    text: data.message || "I don't have a specific answer for that query.",
                    isUser: false,
                    timestamp: new Date(),
                    data: data.data || undefined
                }
                
                setMessages(prev => [...prev, aiMessage])
                
            } catch (fetchError: any) {
                clearTimeout(timeoutId)
                console.error('Fetch error:', fetchError)
                
                // Special handling for abort errors (timeouts)
                const isTimeoutError = fetchError.name === 'AbortError'
                
                // Add an error message
                const errorMessageId = (Date.now() + 1).toString()
                const errorMessage: Message = {
                    id: errorMessageId,
                    text: isTimeoutError 
                        ? "The request is taking longer than expected. Please try a simpler question or try again later."
                        : `Error: ${fetchError.message || 'An error occurred while processing your request'}`,
                    isUser: false,
                    timestamp: new Date()
                }
                
                setMessages(prev => [...prev, errorMessage])
            }
            
        } catch (error) {
            console.error('Error continuing chat:', error)
            
            // Add a fallback error message if we couldn't even make the request
            const errorMessageId = (Date.now() + 1).toString()
            const errorMessage: Message = {
                id: errorMessageId,
                text: "I'm having trouble processing your request. Please check your connection and try again.",
                isUser: false,
                timestamp: new Date()
            }
            
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            continueChatConversation(inputValue)
            setInputValue('')
            focusInput()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Handle Shift+Enter to add a new line
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault()
            setInputValue(prev => prev + '\n')
            return
        }
        
        // Regular Enter key to send message
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Clear chat history and start a new conversation
    const clearChatHistory = async () => {
        try {
            setIsLoading(true)
            // Clear messages state
            setMessages([])
            // Clear chat history ID
            setChatHistoryId(null)
            // Start a new conversation with welcome message
            await startChatConversation()
            // Focus the input field
            focusInput()
        } catch (error) {
            console.error('Error during chat reset:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Add chart to dashboard
    const addChartToDashboard = async (messageId: string, messageData: any[]) => {
        if (!chatHistoryId || !reportId) {
            console.error('Cannot add chart: missing chat_history_id or report_id')
            return
        }

        try {
            setIsAddingChart(true)
            
            // Get authentication token
            const authToken = getAuthToken()
            if (!authToken) {
                throw new Error('Authentication required')
            }

            // Prepare chart data
            const chartData = {
                title: 'AI Generated Chart',
                chat_history_id: chatHistoryId,
                description: `Generated at ${new Date().toLocaleString()}`,
                preferences: {
                    box_size: 'full',
                    chart_type: 'vertical'
                }
            }
            
            // Call API to create chart
            const response = await fetch(`${API_BASE_URL}/charts/create/from_chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(chartData)
            })
            
            if (!response.ok) {
                const errorText = await response.text()
                console.error('Failed to add chart:', errorText)
                throw new Error(`API error: ${response.status}`)
            }

            const responseData: AddChartResponse = await response.json()

            // Update UI to show success
            const successMessageId = Date.now().toString()
            const successMessage: Message = {
                id: successMessageId,
                text: `Chart successfully added to your dashboard! You can view it in the report.`,
                isUser: false,
                timestamp: new Date()
            }
            
            setMessages(prev => [...prev, successMessage])
            
            // Call the onChartAdded callback if provided
            if (onChartAdded) {
                onChartAdded()
            }
            
        } catch (error) {
            console.error('Error adding chart to dashboard:', error)
            
            // Add error message
            const errorMessageId = Date.now().toString()
            const errorMessage: Message = {
                id: errorMessageId,
                text: `Failed to add chart to dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
                isUser: false,
                timestamp: new Date()
            }
            
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsAddingChart(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            // Only fetch initial response if there are no messages yet
            if (messages.length === 0) {
                startChatConversation()
            }
            document.body.classList.add('no-scroll')
            focusInput()
        } else {
            document.body.classList.remove('no-scroll')
        }

        function handleEscKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        
        document.addEventListener('keydown', handleEscKeyDown)

        return () => {
            document.removeEventListener('keydown', handleEscKeyDown)
            document.body.classList.remove('no-scroll')
        }
    }, [isOpen, onClose, messages.length])

    const { userData } = useUser()

    return (
        <AnimatePresence mode='wait'>
            {isOpen && (
                <Portal>
                    <motion.div
                        key='modal'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: .3,
                            ease: 'easeInOut' 
                        }}
                        className={styles.aiChat}
                    >
                        <div
                            className={styles.bg}
                            onClick={onClose}
                        />

                        <motion.div
                            key='wrapper'
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                duration: .3,
                                ease: 'easeInOut' 
                            }}
                            className={styles.wrapper}
                        >
                            <div className={styles.topWrapper}>
                                <div className={styles.top}>

                                    <h2 className={clsx(styles.title, 'text-20 semi-bold purple')}>
                                        <Sparkle /> AI Assistant {reportId ? '' : '(No Report Selected)'}
                                    </h2>

                                    <div className={styles.actions}>

                                        <Fancybox
                                            options={{
                                                on: {
                                                    done: (fancybox: any) => {
                                                        const no = fancybox.container.querySelector('.no')
                                                        const yes = fancybox.container.querySelector('.yes')
                                                        
                                                        no?.addEventListener('click', () => {
                                                            // Just close the dialog, do nothing
                                                        })
                                                        
                                                        yes?.addEventListener('click', async () => {
                                                            try {
                                                                // Show loading state on button
                                                                const yesButton = fancybox.container.querySelector('.yes')
                                                                if (yesButton) {
                                                                    yesButton.classList.add('loading')
                                                                }
                                                                
                                                                // Clear chat history
                                                                await clearChatHistory()
                                                                
                                                                // Remove loading state
                                                                if (yesButton) {
                                                                    yesButton.classList.remove('loading')
                                                                }
                                                            } catch (error) {
                                                                console.error('Error starting new chat:', error)
                                                                
                                                                // Remove loading state if present
                                                                const yesButton = fancybox.container.querySelector('.yes')
                                                                if (yesButton) {
                                                                    yesButton.classList.remove('loading')
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            }}
                                        >
                                            <a
                                                href='#confirm-new-chat'
                                                data-fancybox
                                                className={clsx(
                                                    styles.clearChat,
                                                    (isLoading || isAddingChart) && styles.disabled
                                                )}
                                                onClick={(e) => {
                                                    if (isLoading || isAddingChart) {
                                                        e.preventDefault()
                                                    }
                                                }}
                                                title="Clear conversation"
                                            >
                                                Start new chat
                                            </a>
                                            
                                            <div className={styles.popup} id='confirm-new-chat'>
                                                <h2 className='text-45 bold'>
                                                    Are you sure?
                                                </h2>
                                                
                                                <p className='text-16'>
                                                    Starting a new chat will <strong className='red uppercase bold'><u>erase</u></strong> your current conversation history. This action is irreversible. Do you want to continue?
                                                </p>
                                                
                                                <div className={styles.buttons}>
                                                    <button
                                                        className='button button--gradient-blue text-16 no'
                                                        data-fancybox-close
                                                    >
                                                        No
                                                    </button>
                                                    
                                                    <button
                                                        className={clsx(
                                                            styles.confirm,
                                                            'button button--hollow text-16 yes'
                                                        )}
                                                        data-fancybox-close
                                                    >
                                                        <span className='button__text'>
                                                            Yes
                                                        </span>
                                                        
                                                        <span className='button__loading'>
                                                            <span className='rotation' style={{ '--speed': '.5' } as any}>
                                                                <LoaderCircle />
                                                            </span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </Fancybox>

                                        <button
                                            className={styles.close}
                                            onClick={onClose}
                                            type='button'
                                        >
                                            <X />
                                        </button>

                                    </div>

                                </div>

                                <div className={styles.middle}>
                                    <div className={styles.messagesContainer}>

                                        {messages.length === 0 && !isLoading ? (
                                            <div className={styles.emptyState}>
                                                <p>
                                                    Starting a new conversation...
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                {messages.map((message) => (
                                                    <div 
                                                        key={message.id} 
                                                        className={clsx(
                                                            styles.messageWrapper,
                                                            message.isUser ? styles.userMessage : styles.aiMessage
                                                        )}
                                                    >
                                                        
                                                        {message.isUser ? (
                                                            <div className={styles.messageIcon}>
                                                                <Avatar
                                                                    image={userData?.image}
                                                                    alt={userData?.first_name ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : userData?.email || ''}
                                                                    letter={userData?.first_name?.[0] || userData?.email?.[0]?.toUpperCase()}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className={styles.messageIcon}>
                                                                <Sparkle />
                                                            </div>
                                                        )}

                                                        <div className={styles.messageArea}>

                                                            <div className={styles.messageContent}>

                                                                <div className={clsx(styles.messageText, 'text-16')}>
                                                                    {message.text}
                                                                </div>

                                                                {message.data && message.data.length > 0 && (
                                                                    <>
                                                                        <div className={styles.messageData}>

                                                                            {process.env.NODE_ENV === 'development' && (
                                                                                <div className='relative'>
                                                                                    
                                                                                    <p className={styles.devOnly}>
                                                                                        Dev only
                                                                                    </p>

                                                                                    <pre className='bg-gray-800 white p-1'>
                                                                                        {JSON.stringify(message.data, null, 2)}
                                                                                    </pre>
                                                                                </div>
                                                                            )}

                                                                            <ChartBox
                                                                                id={`ai-chart-${message.id}`}
                                                                                boxSize='full'
                                                                                AIChatChart
                                                                                chartType='vertical'
                                                                                chart={{
                                                                                    vertical: formatFlexibleChartData(message.data)
                                                                                }}
                                                                                reportSummary={{
                                                                                    retailers: [],
                                                                                    brands: [],
                                                                                    genders: [],
                                                                                    regions: []
                                                                                }}
                                                                            />
                                                                        </div>

                                                                        <button 
                                                                            className='mt-half text-14 button button--gradient-purple button--small'
                                                                            onClick={() => addChartToDashboard(message.id, message.data || [])} 
                                                                            disabled={isLoading || isAddingChart || !reportId}
                                                                        >
                                                                            {isAddingChart ? 'Adding chart...' : 'Add chart to dashboard'}
                                                                        </button>
                                                                    </>
                                                                )}

                                                            </div>

                                                            <div className={styles.messageTime}>
                                                                <p className='text-12 gray-500'>
                                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>

                                                        </div>

                                                    </div>
                                                ))}

                                                {isLoading && (
                                                    <div className={clsx(styles.messageWrapper, styles.aiMessage)}>
                                                        
                                                        <div className={styles.messageIcon}>
                                                            <Sparkle />
                                                        </div>

                                                        <div className={styles.messageArea}>
                                                            <div className={styles.messageContent}>
                                                                <div className={clsx(styles.typing, 'text-12 purple')}>
                                                                    <span>•</span>
                                                                    <span>•</span>
                                                                    <span>•</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                )}

                                                <div ref={messagesEndRef} />

                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.bottom}>
                                <div className={styles.inputWrapper}>
                                    <textarea
                                        ref={inputRef}
                                        placeholder={reportId ? 'Type your message...' : 'Please open this chat from a report first'}
                                        className={clsx(styles.input, 'text-16')}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isLoading || !reportId}
                                        rows={1}
                                    />

                                    <button 
                                        className={styles.send} 
                                        onClick={handleSendMessage}
                                        disabled={isLoading || !inputValue.trim() || !reportId}
                                    >
                                        <SendHorizontal />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                </Portal>
            )}
        </AnimatePresence>
    )
}