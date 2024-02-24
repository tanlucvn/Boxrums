import { useState } from "react"

import './style.scss'

export const LabelInputBox = ({ text, errors }) => {
    return (
        <div className="input-label flex">
            {text}
            <span className='error-text'>
                {errors}
            </span>
        </div>
    )
}

export const InputBox = ({ name, type, id, value, placeholder, icon, disable = false, onChange, className, autoFocus }) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    return (
        <div className="relative w-[100%] mb-4 ">
            <input name={name}
                type={type === "password" ? passwordVisible ? "text" : "password" : type}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                disabled={disable}
                className={`input-box ${className} ${!icon && 'pl-4'}`}
                onChange={onChange}
                autoFocus={autoFocus}
            />
            <i className={"fi " + icon + " input-icon"}></i>
            {
                type === "password" ?
                    <i className={"fi fi-rr-eye" + (!passwordVisible ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"} onClick={() => setPasswordVisible(currVal => !currVal)}></i>
                    : ""
            }
        </div>
    )
}

export const TextareaBox = ({ value, onChange, placeholder, readonly }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readonly}
            className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
        >
        </textarea>
    )
}