// libraries
import { useFormContext } from 'react-hook-form'

export interface InputHiddenProps {
    name: string
    value: string
}

export default function InputHidden({
    name,
    value
}: InputHiddenProps) {

    const {
        register
    } = useFormContext() ?? {}

    return (
        <input
            type='hidden'
            value={value}
            {...register(name)}
        />
    )
}

