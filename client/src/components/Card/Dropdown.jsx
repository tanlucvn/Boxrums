import { useEffect, useRef, useState } from 'react';

import { DotsThreeOutline } from '@phosphor-icons/react'

const Dropdown = ({ children }) => {
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
        <div ref={dropdown} className={dropdownOpen ? 'dropdown open' : 'dropdown'}>
            <div
                className="dropdown_trigger act_btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <DotsThreeOutline weight='bold' />
            </div>
            {dropdownOpen && (
                <div className="dropdown_content">
                    {children}
                </div>
            )}
        </div>
    )
}

export default Dropdown;