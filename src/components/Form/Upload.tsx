'use client'

// libraries
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useFormContext, RegisterOptions } from 'react-hook-form'

// css
import styles from './form.module.scss'

// svg
import { X, Plus } from 'lucide-react'

interface UploadProps {
    id: string
    name: string
    label?: string
    labelAlwaysVisible?: boolean
    hideLabel?: boolean
    hideValidations?: boolean
    uploadButtonText: string
    required?: boolean
    disabled?: boolean
    className?: string
    accept?: string
    multiple?: boolean
    maxFileSize?: number
    helperText?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Upload({
    id,
    name,
    label,
    labelAlwaysVisible,
    hideLabel,
    hideValidations,
    uploadButtonText,
    required,
    disabled,
    className,
    accept,
    multiple,
    maxFileSize,
    helperText,
    onChange
}: UploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [customErrors, setCustomErrors] = useState<string[]>([])

    const { register, watch, formState: { errors } } = useFormContext()
    const inputValue = watch(name, '')

    let validations: RegisterOptions = {
        //onChange: (e) => onChange(e),
        required
    }

    if (!hideValidations) {
        validations = {
            ...validations,
            required: required && 'This field is required'
        }
    }

    const errorMessage = errors && errors[name]?.message

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files
        const newErrors: string[] = []

        if (selectedFiles) {
            const MAX_FILE_SIZE = maxFileSize ? maxFileSize * 1024 * 1024 : 10 * 1024 * 1024
            const newFiles: File[] = []

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i]

                // Check file size
                if (file.size > MAX_FILE_SIZE) {
                    newErrors.push(`File size exceeds the ${maxFileSize}MB limit.`)
                    continue
                }

                // Check file format if accept is specified
                if (accept) {
                    const acceptedTypes = accept.split(',').map(type => type.trim())
                    const fileType = file.type
                    const isValidType = acceptedTypes.some(type => {
                        if (type.includes('*')) {
                            return fileType.startsWith(type.replace('*', ''))
                        }
                        return type === fileType
                    })

                    if (!isValidType) {
                        newErrors.push('File format not supported.')
                        continue
                    }
                }

                // Only add the file if it's not already in the state
                if (!files.some(existingFile => existingFile.name === file.name)) {
                    newFiles.push(file)
                }
            }

            // Update errors state
            setCustomErrors(newErrors)

            // Only proceed with file upload if there are no errors
            if (newErrors.length === 0) {
                // append the new files to the existing ones
                setFiles(prevFiles => [...prevFiles, ...newFiles])

                const fileInput = document.getElementById(id) as HTMLInputElement
                const newFilesDT = new DataTransfer()
                if (fileInput) {
                    ((files || []).concat(newFiles)).forEach(f => {
                        newFilesDT.items.add(f)
                    })
                    fileInput.files = newFilesDT.files
                }

                if (onChange) {
                    onChange(event)
                }
            }
        }
    }

    const handleRemoveFile = (fileNameToRemove: string) => {
        const updatedFiles = files.filter(file => file.name !== fileNameToRemove)
        setFiles(updatedFiles)

        const fileInput = document.getElementById(id) as HTMLInputElement

        if (fileInput && fileInput.files) {
            const newFiles = new DataTransfer()
            
            Array.from(fileInput.files).forEach((file) => {
                if (file.name !== fileNameToRemove) {
                    newFiles.items.add(file)
                }
            })

            fileInput.files = newFiles.files
        }
    }

    useEffect(() => {
        const handleResetForm = () => {
            setFiles([])
        }

        document.addEventListener('resetForm', handleResetForm)

        return () => {
            document.removeEventListener('resetForm', handleResetForm)
        }
    }, [setFiles])

    // track focus state
    const [isFocused, setIsFocused] = useState(false)

    // determine whether the label should shrink based on focus or input value
    const shouldShrinkLabel = isFocused || inputValue !== ''

    const isLabelAlwaysVisible = labelAlwaysVisible ? false : true

    return (
        <div className={clsx(
            styles.formLine,
            styles.uploadLine,
            className,
            hideLabel && styles.noLabel,
            !hideValidations && (errors && errors[name] || customErrors.length > 0) && styles.error
        )}>

            {!hideLabel && (
                <label
                    className={clsx(styles.label, 'text-16')}
                    htmlFor={id}
                    data-shrink={shouldShrinkLabel ? 'false' : isLabelAlwaysVisible}
                >
                    {label} {required && <span className='red'>*</span>}
                </label>
            )}

            <div className={styles.lineWrapper}>

                {files.length ? (
                    <div className={styles.fileList}>
                        
                        {files.map((file, i) => (
                            <div
                                className={styles.fileLine}
                                key={i}
                            >
                                
                                <p className={styles.input}>
                                    {file.name}
                                </p>

                                <button
                                    type='button'
                                    onClick={() => handleRemoveFile(file.name)}
                                    className={styles.removeButton}
                                >
                                    <X />
                                    Remove
                                </button>

                            </div>
                        ))}
                    </div>
                ) : null}

                <input
                    type='file'
                    id={id}
                    className={styles.file}
                    disabled={disabled || false}
                    accept={accept}
                    multiple={multiple}
                    {...register(name, {
                        ...validations,
                        onBlur: () => {
                            setIsFocused(false)
                        }
                    })}
                    onChange={handleFileChange}
                />

                <label
                    htmlFor={id}
                    className={clsx(styles.uploadButton, 'button button--gradient-purple text-16')}
                >
                    <Plus />
                    {uploadButtonText}
                </label>

                {helperText && (
                    <div
                        className={clsx(styles.helper, 'text-12 gray-400')}
                        dangerouslySetInnerHTML={{ __html: helperText }}
                    />
                )}

                {(errorMessage || customErrors.length > 0) && (
                    <div className='form-line__error-messages'>
                        {errorMessage && (
                            <p className={styles.errorMsg}>
                                {typeof errorMessage === 'string' && errorMessage}
                            </p>
                        )}
                        {customErrors.map((error, index) => (
                            <p
                                key={index}
                                className={styles.errorMsg}
                            >
                                {error}
                            </p>
                        ))}
                    </div>
                )}

            </div>

        </div>
    )
}