'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'

// components
import Portal from '@/components/Utils/Portal'
import Avatar from '@/components/Avatar'

// svg
import { Sparkle, X, SendHorizontal } from 'lucide-react'

// styles
import styles from './index.module.scss'

// context
import { useUser } from '@/contexts/UserContext'

// types
interface AIChatBoxProps {
    isOpen: boolean
    onClose: () => void
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
}

// constants
const API_BASE_URL = 'https://dcx3uf4aq3.us-east-1.awsapprunner.com/v2'
const USER_ID = '1234' // should be dynamic in a real application

export default function AIChatBox({
    isOpen,
    onClose
}: AIChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
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

    // start a new chat conversation
    const startChatConversation = async () => {
        try {
            setIsLoading(true)
            
            // Try to fetch from API with timeout to handle unresponsive server
            const abortController = new AbortController()
            const timeoutId = setTimeout(() => abortController.abort(), 10000) // 10 second timeout
            
            try {
                const response = await fetch(
                    `${API_BASE_URL}/products/start_user_chat?user_id=${USER_ID}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        signal: abortController.signal
                    }
                )
                
                clearTimeout(timeoutId)
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`)
                }

                const data = await response.text()
                
                // The response might be a string or JSON object
                let parsedData: ApiResponse = {}
                try {
                    if (data.startsWith('{')) {
                        parsedData = JSON.parse(data)
                    } else {
                        parsedData = { message: data }
                    }
                } catch (e) {
                    console.error("Error parsing response:", e)
                    parsedData = { message: data }
                }

                if (parsedData.message) {
                    const welcomeMessageId = Date.now().toString()
                    const welcomeMessage: Message = {
                        id: welcomeMessageId,
                        text: parsedData.message,
                        isUser: false,
                        timestamp: new Date(),
                        data: parsedData.data
                    }
                    
                    setMessages([welcomeMessage])
                    return // Exit function after successful response
                }
                
                // If we get here, the API responded but without a valid message
                throw new Error("Invalid API response")
                
            } catch (fetchError) {
                clearTimeout(timeoutId)
                throw fetchError // Re-throw to be caught by outer try-catch
            }
            
        } catch (error) {
            console.error('Error starting chat:', error)
            
        } finally {
            setIsLoading(false)
        }
    }

    // Continue an existing chat conversation
    const continueChatConversation = async (query: string) => {
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
            
            // Set up abort controller for timeout handling
            const abortController = new AbortController()
            const timeoutId = setTimeout(() => abortController.abort(), 10000) // 10 second timeout
            
            try {
                // Make API call - using POST with path parameter and body
                const response = await fetch(
                    `${API_BASE_URL}/products/continue_user_chat/${USER_ID}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ question: query }),
                        signal: abortController.signal
                    }
                )
                
                clearTimeout(timeoutId)
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`)
                }

                // Parse response
                let data
                const contentType = response.headers.get("content-type")
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json()
                } else {
                    // Handle text response
                    const textData = await response.text()
                    try {
                        // Try to parse as JSON anyway (some APIs send JSON with wrong Content-Type)
                        data = JSON.parse(textData)
                    } catch (e) {
                        // If it's not JSON, use as plain text
                        data = { message: textData }
                    }
                }
                
                // Extract message and data from response
                let message = ''
                let responseData = []
                
                if (typeof data === 'object') {
                    // Try to extract message from standard locations
                    message = data.message || data.response || data.answer || data.text || ''
                    
                    // Try to extract data if available
                    responseData = data.data || data.products || data.results || []
                    
                    // If the API returns the message in a different property, attempt to find it
                    if (!message && Object.keys(data).length > 0) {
                        const possibleMessageKey = Object.keys(data).find(key => 
                            typeof data[key] === 'string' && data[key].length > 0
                        )
                        
                        if (possibleMessageKey) {
                            message = data[possibleMessageKey]
                        } else {
                            message = "I received a response but couldn't extract a readable message."
                        }
                    }
                } else if (typeof data === 'string') {
                    message = data
                } else {
                    message = "Received a response in an unexpected format."
                }
                
                // Add AI response to chat
                const aiMessageId = (Date.now() + 1).toString()
                const aiMessage: Message = {
                    id: aiMessageId,
                    text: message,
                    isUser: false,
                    timestamp: new Date(),
                    data: responseData.length > 0 ? responseData : undefined
                }
                
                setMessages(prev => [...prev, aiMessage])
                
            } catch (fetchError) {
                clearTimeout(timeoutId)
                throw fetchError // Re-throw to be caught by outer try-catch
            }
            
        } catch (error) {
            console.error('Error continuing chat:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            continueChatConversation(inputValue)
            setInputValue('')
            focusInput() // Focus input after sending
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Handle Shift+Enter to add a new line
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault() // Prevent form submission
            setInputValue(prev => prev + '\n')
            return
        }
        
        // Regular Enter key to send message
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault() // Prevent adding a new line
            handleSendMessage()
        }
    }

    // Clear chat history - now with better error handling
    const clearChatHistory = async () => {
        setIsLoading(true)

        try {
            // First clear local messages to give immediate feedback
            setMessages([])
            
            // Then try to clear on server
            try {
                await fetch(
                    `${API_BASE_URL}/products/clear_user_chat?user_id=${USER_ID}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // Add timeout with AbortController
                        signal: AbortSignal.timeout(5000)
                    }
                )
            } catch (error) {
                console.error('Error clearing chat history on server:', error)
                // Continue anyway - we've already cleared the UI
            }
            
            // Start a new conversation
            startChatConversation()
        } catch (error) {
            console.error('Error during chat reset:', error)

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            // Only fetch initial response if there are no messages yet
            if (messages.length === 0) {
                startChatConversation()
            }
            document.body.classList.add('no-scroll')
            focusInput() // Focus input when chat opens
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
                                        <Sparkle /> AI Assistant
                                    </h2>

                                    <div className={styles.actions}>

                                        <button 
                                            className={styles.clearChat}
                                            onClick={clearChatHistory}
                                            title="Clear conversation"
                                            type="button"
                                        >
                                            Start new chat
                                        </button>

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
                                                                        <div className={clsx(styles.messageData, 'bg-gray-800 white p-1')}>
                                                                            <pre>
                                                                                {JSON.stringify(message.data, null, 2)}
                                                                            </pre>
                                                                        </div>

                                                                        <button className='mt-half text-14 button button--gradient-purple button--small'>
                                                                            Add chart to dashboard
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
                                        placeholder='Type your message...'
                                        className={clsx(styles.input, 'text-16')}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isLoading}
                                        rows={1}
                                    />

                                    <button 
                                        className={styles.send} 
                                        onClick={handleSendMessage}
                                        disabled={isLoading || !inputValue.trim()}
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