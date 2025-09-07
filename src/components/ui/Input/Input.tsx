import { InputProps } from "@/interfaces/components/ui"

const Input = (
    { type, onChange, value, name, setIsFocused, isFocused, error }:
        InputProps) => {

    return (
        <input
            className={`outline-0 bg-gray-100/90 border-1
            border-transparent pt-4 pb-1
            px-3 rounded-lg ${isFocused && 'bg-white border-black!'}
            ${error && 'border-red-500!'} transition-all duration-900`}
            onChange={onChange} value={value}
            type={type} name={name} id={name}
            onFocus={() => setIsFocused && setIsFocused(true)}
            onBlur={() => setIsFocused && setIsFocused(false)}
        />
    )
}

export default Input