// libraries
import { useFormContext } from 'react-hook-form'

export interface InputHiddenProps {
    label: string
    value: string
}

export default function InputHidden({
    label,
    value
}: InputHiddenProps) {

    const {
        register
    } = useFormContext() ?? {}

    return (
        <input
            type='hidden'
            value={value}
            {...register(label)}
        />
    )
}

