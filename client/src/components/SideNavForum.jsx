import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { StoreContext } from '@/stores/Store'
import { Strings } from '@/support/Constants'

const SideNavForum = () => {
    const { user, lang } = useContext(StoreContext)

    /* let page = location.pathname.split('/')[2] */
    const location = useLocation()

    let [pageState, setPageState] = useState()
    let [showSideNav, setShowSideNav] = useState(false)

    let activeTabLine = useRef()
    let sideBarIconTab = useRef()
    let pageStateTap = useRef();

    const chagnePageState = (e) => {
        let { offsetWidth, offsetLeft } = e.target;
        /* console.log(offsetLeft, offsetWidth) */
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

        if (location.pathname === '/') {
            setPageState(Strings.home[lang])
        } else {
            setPageState(location.pathname.replace("/", ""))
        }

        pageStateTap?.current?.click()
    }, [pageState])

    return (
        <section className='relative flex gap-10 py-0 pl-7 pr-7 m-0 max-md:flex-col'>

            <div className="fixed top-[80px] z-30 max-md:relative max-md:top-0">

                <div className='relative md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto '>
                    <button ref={sideBarIconTab} className='p-5 capitalize ' onClick={chagnePageState}>
                        <i className='fi fi-rr-bars-staggered pointer-events-none'></i>
                    </button>
                    <button ref={pageStateTap} className='p-5 capitalize ' onClick={chagnePageState}>
                        {pageState}
                    </button>

                    <hr ref={activeTabLine} className='absolute bottom-0 duration-500 ' />

                </div>

                <div className={'min-w-[200px] h-[calc(100vh-80px-64px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-screen max-md:overflow-hidden max-md:px-16 max-md:-ml-7 max-md:h-max ' + (!showSideNav ? 'max-md:opacity-0 max-md:pointer-events-none' : 'opacity-100 pointer-events-auto')}>
                    <h1 className='text-xl text-dark-grey mb-3 select-none'>{Strings.generals[lang]}</h1>
                    <hr className='border-grey ml-6 mb-8 mr-6' />


                    <NavLink to={'/'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                        <i class="fi fi-rr-home"></i>
                        {Strings.home[lang]}
                    </NavLink>

                    {user && user.role === 3
                        && <NavLink to={'/dashboard'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                            <i class="fi fi-rr-chart-pie-alt"></i>
                            {Strings.dashboard[lang]}
                        </NavLink>
                    }

                    <NavLink to={'/boards'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                        <i class="fi fi-rr-poll-h"></i>
                        {Strings.allBoards[lang]}
                    </NavLink>

                    <NavLink to={'/uploads'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                        <i class="fi fi-rr-cube"></i>
                        {Strings.uploads[lang]}
                    </NavLink>

                    <NavLink to={'/users'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                        <i class="fi fi-rr-users"></i>
                        {Strings.users[lang]}
                    </NavLink>

                    {user &&
                        <>
                            <h1 className='text-xl text-dark-grey mb-3 mt-20 select-none'>{Strings.mores[lang]}</h1>
                            <hr className='border-grey ml-6 mb-8 mr-6' />

                            <NavLink to={'/messages'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                                <i class="fi fi-rr-comments"></i>
                                {Strings.messages[lang]}
                            </NavLink>
                        </>
                    }
                </div>

            </div>
            <div className='ml-64 max-md:-mt-8 mt-5 w-full max-md:ml-0'>
                <Outlet />
            </div>
        </section>
    )
}

export default SideNavForum