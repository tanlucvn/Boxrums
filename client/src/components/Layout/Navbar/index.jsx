import { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ThemeContext, UserContext } from '@/App'
import NavbarDropdown from './Dropdown'
import { storeInSession } from '@/common/session'
import Avatar from 'boring-avatars';
import { Strings } from '@/support/Constants'
import { StoreContext } from '@/stores/Store'
import Socket, { joinToRoom, leaveFromRoom } from '@/support/Socket'
import newNotificationSound from '@/assets/sounds/newNotifications.mp3'

const Navbar = () => {
    const { user, token, lang, setPostType, logout } = useContext(StoreContext)
    const navigate = useNavigate()
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)
    const [userNavPanel, setUserNavPanel] = useState(false)
    const [navType, setNavType] = useState("thread")
    const [newNotification, setNewNotification] = useState(false)
    const [adminNotification, setAdminNotification] = useState(false)
    const location = useLocation()

    const [soundPlayed, setSoundPlayed] = useState(false);
    const sound = new Audio(newNotificationSound);

    const storeNewNotificationState = (value) => {
        localStorage.setItem('newNotification', value ? 'true' : 'false');
    };


    let { theme, setTheme } = useContext(ThemeContext)
    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal)
    }
    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false)
        }, 300)
    }
    const handleChange = (e) => {
        let query = e.target.value;
        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`)
        }
    }

    useEffect(() => {
        if (location.pathname.startsWith("/uploads") || location.pathname.startsWith("/file")) {
            setNavType("file")
        } else {
            setNavType("thread")
        }
    }, [location])

    const toggleNotification = () => {
        setNewNotification(false);
        localStorage.setItem('newNotification', 'false');
    };

    const changeChage = () => {
        let newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.body.setAttribute('data-theme', newTheme)
        storeInSession('theme', newTheme)
    }

    useEffect(() => {
        joinToRoom('notification:' + user?.id, { token })
        return () => {
            leaveFromRoom('notification:' + user?.id)
        }
    }, [user?.id, token])

    useEffect(() => {
        /* Socket.on('notificationsCount', (data) => {
            if (data.count > 0) {
                setNotification(true)
            }
        }) */

        const storedNewNotification = localStorage.getItem('newNotification');
        if (storedNewNotification) {
            setNewNotification(storedNewNotification === 'true');
        }

        Socket.on('newNotification', () => {
            if (!soundPlayed) {
                sound.play();
                setSoundPlayed(true);
            }
            setNewNotification(true);
            storeNewNotificationState(true);
        });

        Socket.on('ban', (data) => {
            if (data.user === user?.id) {
                localStorage.setItem('ban', user?.id)
                navigate('/banned')
                logout()
            }
        })
        // eslint-disable-next-line
    }, [user?.id])

    useEffect(() => {
        if (user?.id) joinToRoom('pmCount:' + user.id, { token })
        return () => {
            if (user?.id) leaveFromRoom('pmCount:' + user.id)
        }
    }, [user?.id, token])

    useEffect(() => {
        if (user?.role >= 2) joinToRoom('adminNotification', { token })
        return () => {
            if (user?.role >= 2) leaveFromRoom('adminNotification')
        }
    }, [user?.role, token])

    useEffect(() => {
        Socket.on('messagesCount', (data) => {
            setMessages(data.count)
        })
        Socket.on('newAdminNotification', (data) => {
            if (!soundPlayed) {
                sound.play();
                setSoundPlayed(true);
            }

            if (data.type === 'report') {
                localStorage.setItem('reports', true)
            }
            if (data.type === 'file') {
                localStorage.setItem('files', true)
            }
            setAdminNotification(true)
        })
    }, [])

    return (
        <>
            <nav className="navbar z-50">
                <Link to='/'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 684" className={`w-10 ${theme === 'dark' ? 'opacity-90' : 'opacity-80'}`}>
                        <path fill={theme === 'dark' ? '#916bc2' : '#000'} d="M305.7 0L0 170.9v342.3L305.7 684 612 513.2V170.9L305.7 0z" />
                        <path fill="#fff" d="M305.7 80.1l-233.6 131 233.6 131 234.2-131-234.2-131" />
                    </svg>
                </Link>

                <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")}>
                    <input type="text" placeholder={Strings.search[lang]} className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12' onKeyDown={handleChange} />
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                </div>

                <div className='flex items-center gap-3 md:gap-6 ml-auto '>
                    <button className='md:hidden  bg-grey w-12 h-12 rounded-full flex items-center justify-center' onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}><i className='fi fi-rr-search text-xl'></i></button>

                    {user &&
                        <Link to='/editor' className='hidden md:flex gap-2 link' onClick={navType === "thread" ?
                            () => setPostType({
                                type: 'thread'
                            }) :
                            () => setPostType({
                                type: 'upload'
                            })}>

                            {navType === "thread" ?
                                <>
                                    <p>{Strings.newThread[lang]}</p> <i className='fi fi-rr-file-edit'></i>
                                </> :
                                <>
                                    <p>{Strings.newFile[lang]}</p>
                                    <i class="fi fi-rr-add-document"></i>
                                </>
                            }
                        </Link>
                    }

                    <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 '>
                        <i className={'fi fi-rr-' + (theme == 'light' ? 'moon' : 'sun') + " text-xl block mt-1"} onClick={changeChage}></i>
                    </button>

                    {
                        user ?
                            <>
                                <Link to='/notifications'>
                                    <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10' onClick={toggleNotification}>
                                        <i className='fi fi-rr-bell text-xl block mt-1'></i>
                                        {
                                            newNotification &&
                                            <span className='bg-red w-3 h-3 rounded-full  absolute z-10 top-2 right-2'></span>

                                        }
                                    </button>
                                </Link>
                                <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                    <div className="cursor-pointer">
                                        <Avatar
                                            size={40}
                                            name={user.name}
                                            variant="marble"
                                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                        />
                                    </div>
                                    {
                                        userNavPanel &&
                                        <NavbarDropdown />
                                    }
                                </div>

                            </>
                            :
                            <>
                                <Link className='btn-dark py-2 ' to='/login'>
                                    {Strings.login[lang]}
                                </Link>
                                <Link className='btn-light py-2 hidden md:block' to='/register'>
                                    {Strings.register[lang]}
                                </Link>
                            </>
                    }
                </div>
            </nav>
            <Outlet />
        </>
    )
}
export default Navbar;