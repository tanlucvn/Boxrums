import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../App'
import { StoreContext } from '@/stores/Store'
import { Strings } from '@/support/Constants'


const SideNavProfile = () => {
    const { user, lang } = useContext(StoreContext)

    const page = location.pathname.split('/')[2]

    const [pageState, setPageState] = useState(/* page.replace('-', ' ') */)
    const [showSideNav, setShowSideNav] = useState(false)

    const activeTabLine = useRef()
    const sideBarIconTab = useRef()
    const pageStateTap = useRef();

    const chagnePageState = (e) => {
        let { offsetWidth, offsetLeft } = e.target;
        activeTabLine.current.style.width = offsetWidth + 'px'
        activeTabLine.current.style.left = offsetLeft + 'px'

        if (e.target == sideBarIconTab.current) {
            setShowSideNav(true)
        }
        else {
            setShowSideNav(false)
        }
    }

    useEffect(() => {
        setShowSideNav(false)
        pageStateTap?.current?.click()
    }, [pageState])
    return (
        user === null ? <Navigate to="/login" /> :
            <>
                <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>

                    <div className="skicky top-[80px] z-30">

                        <div className='relative md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto '>
                            <button ref={sideBarIconTab} className='p-5 capitalize ' onClick={chagnePageState}>
                                <i className='fi fi-rr-bars-staggered pointer-events-none'></i>
                            </button>
                            <button ref={pageStateTap} className='p-5 capitalize ' onClick={chagnePageState}>
                                {pageState}
                            </button>

                            <hr ref={activeTabLine} className='absolute bottom-0 duration-500 ' />

                        </div>

                        <div className={'min-w-[200px] h-[calc(100vh-80px-64px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 ' + (!showSideNav ? 'max-md:opacity-0 max-md:pointer-events-none' : 'opacity-100 pointer-events-auto')}>
                            <h1 className='text-xl text-dark-grey mb-3'>{Strings.generals[lang]}</h1>
                            <hr className='border-grey -ml-6 mb-8 mr-6' />


                            <NavLink to={'/posts'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                                <i className='fi fi-rr-document'></i>
                                {Strings.yourThreads[lang]}
                            </NavLink>

                            <NavLink to={'/notifications'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>

                                <div className='relative'>
                                    <i className='fi fi-rr-bell'></i>
                                    {
                                        /* new_notification_available && */ <span className='bg-red h-2 w-2 rounded-full absolute z-10 top-0 right-0'></span>
                                    }

                                </div>
                                {Strings.notifications[lang]}
                            </NavLink>

                            <NavLink to={'/editor'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                                <i className='fi fi-rr-file-edit'></i>
                                {Strings.newThread[lang]}
                            </NavLink>

                            <h1 className='text-xl text-dark-grey mb-3 mt-20'>{Strings.settings[lang]}</h1>
                            <hr className='border-grey ml-6 mb-8 mr-6' />

                            <NavLink to={'/settings/edit-profile'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                                <i className='fi fi-rr-user'></i>
                                {Strings.editProfile[lang]}
                            </NavLink>

                            <NavLink to={'/settings/change-password'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                                <i className='fi fi-rr-lock'></i>
                                {Strings.changePassword[lang]}
                            </NavLink>

                            <NavLink to={'/settings/customize'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                                <i class="fi fi-rr-square-plus"></i>
                                {Strings.customize[lang]}
                            </NavLink>
                        </div>

                    </div>
                    <div className='max-md:-mt-8 mt-5 w-full'>
                        <Outlet />
                    </div>
                </section>
            </>
    )
}

export default SideNavProfile