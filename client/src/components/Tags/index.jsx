import React from 'react'

const Tags = ({ title = "", className, icon }) => {
    return (
        <span class={`btn-light flex items-center text-sm font-medium py-2 px-4 capitalize gap-3 w-fit ${className}`}>
            {title}
            {icon}
        </span>
    )
}

export default Tags