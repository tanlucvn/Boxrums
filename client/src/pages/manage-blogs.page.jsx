import React, { useContext, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import InPageNavigaion from '../components/InpageNavigation'
import Loader from '../components/Loader'
import NoDataMessage from '../components/NoData'
import AnimationWrapper from '../common/page-animation'
import { ManagePublishedBlogCard } from '../components/manage-blogcard.component'
import { StoreContext } from '@/stores/Store'
import { useMoreFetch } from '@/hooks/useMoreFetch'
import { Strings } from '@/support/Constants'

const ManageBlog = () => {
    const { user, lang } = useContext(StoreContext)
    const [query, setQuery] = useState("")
    const [init, setInit] = useState(true)

    const { loading: threadsLoading, moreLoading: threadsMoreLoading, noData: threadsNodata, items: threadsItems, setItems: threadsSetItems } = useMoreFetch({ method: 'user/threads', params: { userId: user.id }, auth: true })
    const { loading: uploadsLoading, moreLoading: uploadsMoreLoading, noData: uploadsNodata, items: uploadsItems, setItems: uploadsSetItems } = useMoreFetch({ method: 'user/uploads', params: { userId: user.id }, auth: true })
    const [storedData, setStoredData] = useState({ threads: [], uploads: [] });

    const handleChange = (e) => {
        if (e.target.value === null || e.target.value === "") {
            threadsSetItems(storedData.threads)
            uploadsSetItems(storedData.uploads)
            return
        }

        if (e.target.value.length) {
            setQuery("");
            threadsSetItems(null)
            uploadsSetItems(null)

            setTimeout(() => {
                const threadsfilteredItems = storedData.threads.filter(item => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
                const uploadsfilteredItems = storedData.uploads.filter(item => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
                threadsSetItems(threadsfilteredItems)
                uploadsSetItems(uploadsfilteredItems)
            }, 500)
        }
    }

    /* const handleSearch = (e) => {
        setQuery(e.target.value)

        if (e.keyCode == 13 && searchQuery.length) {
            const threadsfilteredItems = storedData.threads.filter(item => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
                const uploadsfilteredItems = storedData.uploads.filter(item => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
                threadsSetItems(threadsfilteredItems)
                uploadsSetItems(uploadsfilteredItems)
        }
    } */

    useEffect(() => {
        if (threadsLoading === false && init) {
            setStoredData(prev => ({ ...prev, threads: threadsItems }));
            setInit(false)
        }
    }, [threadsLoading, init]);

    useEffect(() => {
        if (uploadsLoading === false && init) {
            setStoredData(prev => ({ ...prev, uploads: uploadsItems }));
            setInit(false)
        }
    }, [uploadsLoading, init]);

    // console.log("thread", storedData.threads)

    return (
        <>
            <h1 className='max-md:hidden text-2xl'>Manage Blog</h1>
            <Toaster />
            <div className='relative max-md:mt-5 md:mt-8 mb-10'>
                <input
                    type="search"
                    className='w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey'
                    placeholder='Search Blogs'
                    onChange={handleChange}
                // onKeyDown={handleSearch}
                />
                <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
            </div>

            <InPageNavigaion routes={[Strings.thread[lang], Strings.upload[lang]]}>
                {
                    threadsItems == null ? <Loader /> :
                        threadsItems.length ?
                            <>
                                {
                                    threadsItems.map((thread, i) => {
                                        return <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                            <ManagePublishedBlogCard thread={{ ...thread, index: i }} />
                                        </AnimationWrapper>
                                    })
                                }
                            </>
                            : <NoDataMessage message='No Published Blogs Available' />
                }

                {
                    uploadsItems == null ? <Loader /> :
                        uploadsItems.length ?
                            <>
                                {
                                    uploadsItems.map((upload, i) => {
                                        return <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                            <ManagePublishedBlogCard thread={{ ...upload, index: i }} />
                                        </AnimationWrapper>
                                    })
                                }
                            </>
                            : <NoDataMessage message='No Published Blogs Available' />
                }
            </InPageNavigaion>
        </>
    )
}

export default ManageBlog