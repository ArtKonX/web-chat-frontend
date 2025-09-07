import React from 'react';

import { useState } from "react";

import Input from "../Input/Input";
import { InputWithLabelAndInfoProps } from "@/interfaces/components/ui";

const InputWithLabelAndInfo = (
    { ...props }: InputWithLabelAndInfoProps
) => {

    const { text, name, value, info, ...inputProps } = props;
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="flex flex-col mb-4 relative">
            <label
                htmlFor={name}
                className={`absolute h-full left-3 transition-all duration-300 ease-in-out
                ${isFocused || value ? 'text-sm top-0 text-black!' : 'top-3'}
                text-gray-400`}
            >
                {text}
            </label>
            <Input {...inputProps} name={name} value={value} setIsFocused={setIsFocused} isFocused={isFocused} />
            {info &&
                <span className="mt-1 text-sm">
                    {info}
                </span>}
        </div>
    )
}

export default InputWithLabelAndInfo