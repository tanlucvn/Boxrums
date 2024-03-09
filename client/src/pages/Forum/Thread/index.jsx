import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '@/common/page-animation'
import Loader from '@/components/loader.component'
import BlogInteraction from '@/components/blog-interaction.component'
import BlogContent from '@/components/blog-content.component'
import CommentContainer from '@/components/comments.component'
import { StoreContext } from '@/stores/Store'
import { BACKEND, Strings } from '@/support/Constants'

import Avatar from 'boring-avatars';
import Errorer from '@/components/Errorer'
import { BlogPostCard } from '@/components/Card/Card2'
import { dateFormat } from '@/support/Utils'


export const ThreadContext = createContext({})
const Thread = () => {
    const { user, lang } = useContext(StoreContext)
    const { threadId } = useParams();

    /* const [blog, setBlog] = useState */
    // const [board, setBoard] = useState
    const [thread, setThread] = useState()
    const [answers, setAnswers] = useState([])

    const [likes, setLikes] = useState(thread?.likes)
    const [liked, setLiked] = useState(user ? !!thread?.likes?.find(i => i === user.id) : false)

    const [similarBlog, setSimilarBlog] = useState([])
    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)
    const [commentsWrapper, setCommentsWrapper] = useState(false);

    const filteredSimilarBlog = similarBlog.filter(blog => blog._id !== threadId);

    const fetchThreads = async () => {
        try {
            const data = await fetch(`${BACKEND}/api/threads/recently?limit=${5}`)
            const response = await data.json()

            if (!response.error) {
                if (response.docs.length) {
                    setSimilarBlog(response.docs)
                }
            } else throw Error(response.error?.message || 'Error')
        } catch (err) {
            console.error(err)
        }
    }

    const fetchThread = async () => {
        try {
            const data = await fetch(`${BACKEND}/api/thread?threadId=${threadId}`)
            const response = await data.json()

            if (!response.error) {
                setThread(response.thread)
                setLoading(false)
                setNoData(false)
                await fetchAnswers()
            } else throw Error(response.error?.message || 'Error')
        } catch (err) {
            setNoData(true)
            setLoading(false)
        }
    }

    const fetchAnswers = async () => {
        try {
            const data = await fetch(`${BACKEND}/api/answers?threadId=${threadId}&pagination=false`)
            const response = await data.json()

            if (!response.error) {
                setAnswers(response.docs)
                setLoading(false)
            } else throw Error(response.error?.message || 'Error')
        } catch (err) {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchThreads()
        fetchThread()
    }, [threadId])

    useEffect(() => {
        setLikes(thread?.likes)
        setLiked(user ? !!thread?.likes?.find(i => i === user.id) : false)
    }, [user, thread?.likes])

    // console.log(filteredSimilarBlog)
    return (
        <AnimationWrapper>
            {
                !noData ? (
                    !loading ? <>
                        <ThreadContext.Provider value={{ thread, setThread, likes, setLikes, liked, setLiked, loading, setLoading, answers, setAnswers, commentsWrapper, setCommentsWrapper, similarBlog }}>
                            <CommentContainer />

                            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                                <div className='aspect-video'>
                                    {
                                        thread.banner ?
                                            <img src={thread.banner} alt="Banner" className='aspect-video' /> :
                                            <Avatar
                                                size={"100%"}
                                                name={thread.title}
                                                variant="marble"
                                                colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                                square="true"
                                            />
                                    }
                                </div>

                                <div className='mt-12'>
                                    <div className='flex items-center gap-5'>
                                        <h2>
                                            {thread.title}
                                        </h2>
                                        <div className="flex ml-auto gap-3">
                                            {thread.pined &&
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" title={Strings.pin[lang]}>
                                                    {thread.pined && <i class="fi fi-sr-thumbtack text-xl"></i>}
                                                </div>
                                            }

                                            {thread.closed &&
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" title={Strings.close[lang]}>
                                                    {thread.closed && <i class="fi fi-sr-lock text-xl"></i>}
                                                </div>
                                            }
                                        </div>

                                    </div>
                                    <div className='flex max-sm:flex-col justify-between my-8'>
                                        <div className='flex gap-5 items-start '>
                                            <Avatar
                                                size={40}
                                                name={thread.author.name}
                                                variant="marble"
                                                colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                            />
                                            <p className='capitalize '>
                                                {thread.author.name}
                                                <br />
                                                @
                                                <Link className="underline" to={`/user/${thread.author.name}`}>{thread.author.name}</Link>
                                            </p>
                                        </div>
                                        <p className='text-dark-grey opacity-75 max-sm:mt-6 mx-sm:ml-12 max-sm:pl-5'>{dateFormat(thread.createdAt)}</p>
                                    </div>
                                </div>

                                <BlogInteraction dropdown="true" />

                                <div className='my-12 blog-page-content'>
                                    {
                                        thread && thread.body && thread.body[0].blocks.map((block, i) => {
                                            return <div className='my-4 md:my-8' key={i}>
                                                <BlogContent block={block} />
                                            </div>
                                        })
                                    }
                                </div>

                                <BlogInteraction share="true" />

                                {
                                    filteredSimilarBlog !== null && filteredSimilarBlog.length ?
                                        <>
                                            <h1 className='font-medium text-2xl mt-14 mb-10'>{Strings.similarThreads[lang]}</h1>
                                            {
                                                filteredSimilarBlog && filteredSimilarBlog.map((blog, i) => {
                                                    return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                                        <BlogPostCard data={blog} lang={lang} />
                                                    </AnimationWrapper>
                                                })
                                            }
                                        </>
                                        : ""
                                }
                            </div>
                        </ThreadContext.Provider>
                    </> : <Loader />
                ) : <Errorer message={Strings.threadNotFound[lang]} />
            }
        </AnimationWrapper>
    )
}

export default Thread