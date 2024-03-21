import React, { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AnimationWrapper from '@/common/page-animation'
import { Link } from 'react-router-dom'
import { StoreContext } from '@/stores/Store'
import { toast } from 'react-hot-toast'
import { Strings } from '@/support/Constants'

const NavbarDropdown = () => {
    const { user, logout, lang } = useContext(StoreContext)
    const navigate = useNavigate()
    const dropdownRef = useRef()

    const onLogout = () => {
        navigate('/')
        logout()

        toast.success("Logged out successfully!")
    }

    return (
        <AnimationWrapper transition={{ duration: 0.2 }} className="absolute right-0 z-50">
            <div ref={dropdownRef} className='bg-grey absolute right-0 top-3 border-grey w-60 duration-200 shadow-md'>
                <Link to='/editor' className='flex gap-2 link md:hidden pl-8 py-4 '>
                    <i className='fi fi-rr-file-edit'></i>
                    <p>Write</p>
                </Link>
                <Link to={`/user/${user.name}`} className='link pl-8 py-4 '>
                    {Strings.profile[lang]}
                </Link>
                {user.role >= 2 &&
                    <Link to={`/dashboard`} className='link pl-8 py-4 '>
                        {Strings.dashboard[lang]}
                    </Link>
                }
                <Link to={`/settings/edit-profile`} className='link pl-8 py-4 '>
                    {Strings.settings[lang]}
                </Link>
                <span className='absolute border-t border-grey  w-[100%]'></span>

                <button className='text-left p-4 hover:bg-grey w-full pl-8 py-4'
                    onClick={onLogout}
                >
                    <h1 className='font-bol text-xl mg-1'>{Strings.logout[lang]}</h1>
                    <p className='text-dark-grey'>@{user.name}</p>
                </button>
            </div>
        </AnimationWrapper>
    )
}

export default NavbarDropdown