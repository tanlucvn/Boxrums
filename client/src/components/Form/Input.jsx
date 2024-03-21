import { useState, useRef, useEffect, useContext } from "react"
import { Strings } from "@/support/Constants"
import { StoreContext } from "@/stores/Store"
import Avatar from 'boring-avatars'

import './style.scss'

export const LabelInputBox = ({ text, errors, className }) => {
    return (
        <div className={`font-medium p-[.3rem_.0rem] select-none m-[.3rem_.2rem] justify-between flex ${className}`}>
            {text}
            <span className='text-red font-normal text-sm'>
                {errors}
            </span>
        </div>
    )
}

export const InputBox = ({ ref, name, type, id, value, placeholder, icon, disable = false, onChange, className, autoFocus }) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    return (
        <div className="relative w-[100%] mb-4 ">
            <input ref={ref}
                name={name}
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

export const TextareaBox = ({ name, value, onChange, placeholder, readonly }) => {
    return (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readonly}
            className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
        >
        </textarea>
    )
}

export const InputColor = ({ onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [colors] = useState(['#2196F3', '#009688', '#9C27B0', '#FFEB3B', '#afbbc9', '#4CAF50', '#2d3748', '#f56565', '#ed64a6']);
    const [colorSelected, setColorSelected] = useState('#2196F3');
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleColorChange = (color) => {
        setColorSelected(color);
        if (onChange) {
            onChange(color);
        }
    };

    return (
        <div className="mb-5">
            <div className="flex items-center gap-5">
                <input id="colorSelected" type="text" placeholder="Pick a color"
                    className="input-box pl-4"
                    readOnly
                    value={colorSelected}
                />

                <div className="relative">
                    <button type="button" onClick={() => setIsOpen(!isOpen)}
                        className="relative flex justify-center items-center w-10 h-10 rounded-full focus:outline-none focus:shadow-outline"
                        style={{ background: colorSelected, color: 'white' }}
                    >
                        <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M15.584 10.001L13.998 8.417 5.903 16.512 5.374 18.626 7.488 18.097z" /><path d="M4.03,15.758l-1,4c-0.086,0.341,0.015,0.701,0.263,0.949C3.482,20.896,3.738,21,4,21c0.081,0,0.162-0.01,0.242-0.03l4-1 c0.176-0.044,0.337-0.135,0.465-0.263l8.292-8.292l1.294,1.292l1.414-1.414l-1.294-1.292L21,7.414 c0.378-0.378,0.586-0.88,0.586-1.414S21.378,4.964,21,4.586L19.414,3c-0.756-0.756-2.072-0.756-2.828,0l-2.589,2.589l-1.298-1.296 l-1.414,1.414l1.298,1.296l-8.29,8.29C4.165,15.421,4.074,15.582,4.03,15.758z M5.903,16.512l8.095-8.095l1.586,1.584 l-8.096,8.096l-2.114,0.529L5.903,16.512z" /></svg>
                    </button>

                    {isOpen && (
                        <div ref={wrapperRef}
                            onClick={() => setIsOpen(false)}
                            className="absolute origin-top-right left-1/2 z-20 mt-3 w-40 rounded-md shadow-lg -translate-x-1/2 transform">
                            <div className="rounded-md bg-grey shadow-xs px-4 py-3">
                                <div className="flex flex-wrap -mx-2">
                                    {colors.map((color, index) => (
                                        <div key={index} className="px-2">
                                            {colorSelected === color ? (
                                                <div
                                                    className="w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white"
                                                    style={{ background: color, boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.2)' }}
                                                ></div>
                                            ) : (
                                                <div
                                                    onClick={() => handleColorChange(color)}
                                                    onKeyDown={() => handleColorChange(color)}
                                                    role="checkbox"
                                                    tabIndex={0}
                                                    aria-checked={colorSelected}
                                                    className="w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white focus:outline-none focus:shadow-outline"
                                                    style={{ background: color }}
                                                ></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export const IconSelectBox = ({ iconOptions, onSelect, value }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const onSelected = (option) => {
        onSelect(option)
        setIsOpen(false)
    }
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target) && event.target.className !== 'group p-4 inline-flex items-center gap-3 rounded-md border-2 border-grey text-base font-medium w-full bg-grey') {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className="relative">
            <button type="button" className="group p-4 inline-flex items-center gap-3 rounded-md border-2 border-grey text-base font-medium w-full bg-grey" onClick={() => setIsOpen(prev => !prev)} aria-expanded={isOpen}>
                <i className={`devicon-${value.label}-plain dev-icon text-2xl`}></i>
                <p className='ml-2'>{value.value}</p>
                {isOpen ? <i className="fi fi-rr-angle-small-up ml-auto"></i> : <i className="fi fi-rr-angle-small-down ml-auto"></i>}
            </button>

            {isOpen && (
                <div ref={wrapperRef} className="absolute left-1/2 z-20 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white">
                        <div className="bg-grey px-5 py-3">
                            <p className="text-sm font-medium">Select icon</p>
                        </div>
                        <div className="relative grid gap-6 px-5 py-6 sm:gap-8 sm:p-8 overflow-y-scroll max-h-[150px]">
                            {iconOptions.map((option, index) => (
                                <div key={index} className="-m-3 flex items-start rounded-lg p-3 cursor-pointer hover:bg-light-grey" onClick={() => onSelected(option)} >
                                    <i className={`devicon-${option.label}-plain dev-icon text-2xl my-auto`}></i>
                                    <div className="ml-4">
                                        <p className="text-base font-medium">{option.label}</p>
                                        <p className="mt-1 text-sm text-dark-grey/80">{option.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export const SelectBox = ({ options, onChange, value, className, onClick }) => {
    const { lang, postType } = useContext(StoreContext)
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const handleSelected = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className={`relative`} ref={wrapperRef}>
            <button
                type="button"
                className={`group p-4 inline-flex items-center gap-3 rounded-md border-2 border-grey text-base font-medium w-full bg-grey ${className}`}
                onClick={() => {
                    setIsOpen(prev => !prev)
                    if (onClick) onClick();
                }}
                aria-expanded={isOpen}
            >
                <p className='ml-2'>{value}</p>
                {isOpen ? <i className="fi fi-rr-angle-small-up ml-auto"></i> : <i className="fi fi-rr-angle-small-down ml-auto"></i>}
            </button>

            {isOpen && (
                <div className="absolute left-0 z-20 mt-3 w-full max-w-md transform px-2 sm:px-0">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white">
                        <div className="bg-grey px-5 py-3">
                            <p className="text-sm font-medium">{Strings.select[lang]}</p>
                        </div>
                        <div className="relative grid gap-6 px-5 py-6 sm:gap-8 sm:p-8 overflow-y-scroll max-h-[150px]">
                            {options.map((option, index) => (
                                <div key={index} className="-m-3 flex items-start rounded-lg p-3 cursor-pointer hover:bg-light-grey" onClick={() => handleSelected(option)}>
                                    <div className="w-8 h-8 my-auto">
                                        <Avatar
                                            size={'100%'}
                                            name={option.name}
                                            variant="marble"
                                            square="true"
                                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-base font-medium">{option.title}</p>
                                        <div className="flex gap-3 items-center">
                                            {postType.type === "thread" &&
                                                <>
                                                    <p className="mt-1 text-sm text-dark-grey/80">{option.threadsCount} {Strings.thread[lang]}</p>
                                                    <p className="mt-1 text-sm text-dark-grey/80">{option.answersCount} {Strings.answer[lang]}</p>
                                                </>
                                            }
                                            {postType.type === "upload" && <p className="mt-1 text-sm text-dark-grey/80">{option.filesCount} {Strings.file[lang]}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};