import { Strings } from '@/support/Constants';
import { useEffect, useRef, useState } from 'react';

const Dropdown = ({ children, lang, closed }) => {
    const dropdown = useRef()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleClickOutside = ({ target }) => {
        if (dropdown.current?.contains(target)) return

        setDropdownOpen(false)
    }

    return (
        <>
            <div class="flex justify-center" ref={dropdown}>
                <div class="relative">
                    <div className='flex gap-3 items-center'>
                        <p className='max-sm:hidden'>{Strings.options[lang]}</p>
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} class="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                            <i class="fi fi-rr-menu-dots-vertical text-xl"></i>
                        </button>
                    </div>


                    {dropdownOpen && closed !== true && (
                        <div x-show="dropdownOpen" class="absolute right-0 mt-3 py-2 w-48 bg-grey rounded-xl shadow-sm z-20 p-2">
                            {children}
                        </div>
                    )}
                </div>
            </div>

            {/* <div ref={dropdown} className={dropdownOpen ? 'dropdown open' : 'dropdown'}>
            <div
                className="dropdown_trigger act_btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <i class="fi fi-rr-menu-dots"></i>
            </div>
            {dropdownOpen && (
                <div className="dropdown_content">
                    {children}
                </div>
            )}
        </div> */}
        </>
    )
}

export default Dropdown;