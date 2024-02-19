import axios from 'axios'
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '@/common/page-animation'
import Loader from '@/components/loader.component'
import { getDay } from '@/common/date'
import BlogInteraction from '@/components/blog-interaction.component'
import BlogPostCard from '@/components/blog-post.component'
import BlogContent from '@/components/blog-content.component'
import CommentContainer from '@/components/comments.component'
import { StoreContext } from '@/stores/Store'
import { BACKEND, Strings } from '@/support/Constants'

import Avatar from 'boring-avatars';
import Markdown from '@/components/Markdown'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import Errorer from '@/components/Errorer'

export const blogStructure = {
    title: '',
    des: '',
    content: [],
    author: {
        personal_info: {},
    },
    banner: '',
    publishedAt: '',
}

export const ThreadContext = createContext({})

const Thread = () => {
    const { user, lang } = useContext(StoreContext)
    const { threadId } = useParams();

    const [headings, setHeadings] = useState([]);
    const [rightSidebarLoading, setRightSidebarLoading] = useState(true);

    /* const [blog, setBlog] = useState */
    // const [board, setBoard] = useState
    const [thread, setThread] = useState()
    const [answers, setAnswers] = useState([])

    const [likes, setLikes] = useState(thread?.likes)
    const [liked, setLiked] = useState(user ? !!thread?.likes?.find(i => i === user.id) : false)

    const [similarBlog, setSimilarBlog] = useState(blogStructure)
    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)
    const [commentsWrapper, setCommentsWrapper] = useState(false);


    // let { title, content, banner, author: { personal_info: { username: author_username, fullname, profile_img } }, publishedAt } = blog

    /* const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', { blog_id })
            .then(async ({ data: { blog } }) => {
                blog.comments = await fetchComment({ blog_id: blog._id, setParentCommentCountFun: setTotalCommentsLoaded })

                setBlog(blog)

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id })
                    .then(({ data: { blogs } }) => {
                        setSimilarBlog(blogs)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                setLoading(false)
            })
            .catch(err => {
                console.log(err);
                setLoading(false)
            })
    } */

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
                console.log(response)
                setAnswers(response.docs)
                setLoading(false)
            } else throw Error(response.error?.message || 'Error')
        } catch (err) {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchThread()
    }, [threadId])

    useEffect(() => {
        setLikes(thread?.likes)
        setLiked(user ? !!thread?.likes?.find(i => i === user.id) : false)
    }, [user, thread?.likes])

    useLayoutEffect(() => {
        const searchHeadings = setTimeout(() => {
            const contentElements = document.querySelectorAll('.md-editor-preview h1');
            const headingsData = [];

            contentElements.forEach((headingElement) => {
                const id = headingElement.id;
                const text = headingElement.textContent;
                const offsetTop = headingElement.offsetTop;
                const height = headingElement.clientHeight;

                headingsData.push({ id, text, offsetTop, height });
            });

            setHeadings(headingsData);
            if (headingsData.length > 0) {
                setRightSidebarLoading(false);
            } else {
                setRightSidebarLoading(false)
            }

        }, 1000);

        return () => clearTimeout(searchHeadings);
    }, [threadId]);

    const resetState = () => {
        setBlog(blogStructure)
        setSimilarBlog(null)
        setLoading(true)
        setLikedByUser(false)
        // setCommentsWrapper(false)
        setTotalCommentsLoaded(0)
    }

    // console.log("likes", likes)
    // console.log("liked", liked)
    // console.log(answers)

    return (
        <AnimationWrapper>
            {
                !noData ? (
                    !loading ? <>
                        <ThreadContext.Provider value={{ thread, setThread, likes, setLikes, liked, setLiked, loading, setLoading, answers, setAnswers, commentsWrapper, setCommentsWrapper }}>
                            <div className='thread-container grid grid-cols-12 gap-3'>
                                <div className='thread-leftSidebar col-span-3 sticky top-0 pl-6 pr-4 max-lg:px-[5vw] max-lg:col-span-6 max-lg:relative max-lg:top-6 max-sm:col-span-12 max-sm:top-8'>
                                    <LeftSidebar data={thread} />
                                </div>

                                <div className="thread-content col-span-6 max-lg:col-span-12 max-lg:order-last">
                                    <CommentContainer />
                                    <div className='max-w-[900px] center py-10 max-lg:px-[5vw] rounded-2xl'>
                                        <div className='bg-grey p-10 rounded-2xl'>
                                            {/* <img src={"banner"} alt="Banner" className='aspect-video' /> */}
                                            <div className='aspect-video'>
                                                {
                                                    thread.banner ? thread.banner : <Avatar
                                                        size={"100%"}
                                                        name={thread.title}
                                                        variant="marble"
                                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                                        square="true"
                                                    />
                                                }
                                            </div>
                                            <div className='mt-12'>
                                                <h2>{thread.title}</h2>
                                                <div className='flex max-sm:flex-col justify-between my-8'>
                                                    <div className='flex gap-5 items-start '>
                                                        {/* <img src={thread,author.} alt="Author" className='w-12 h-12 rounded-full' /> */}
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
                                                    <p className='text-dark-grey opacity-75 max-sm:mt-6 mx-sm:ml-12 max-sm:pl-5'>Published on {getDay(thread.createdAt)}</p>
                                                </div>
                                            </div>

                                            <BlogInteraction />

                                            <div className='my-12 font-gelasio blog-page-content'>
                                                {
                                                    /* content[0].blocks.map((block, i) => {
                                                        return <div className='my-4 md:my-8' key={i}>
                                                            <BlogContent block={block} />
                                                        </div>
                                                    }) */
                                                    <div className='my-4 md:my-8'>
                                                        <Markdown source={thread.body} />
                                                    </div>
                                                }

                                            </div>

                                            <BlogInteraction />

                                            {/* {
                                similarBlog !== null && similarBlog.length ?
                                    <>
                                        <h1 className='font-medium text-2xl mt-14 mb-10'>Similar Blogs</h1>
                                        {
                                            similarBlog && similarBlog.map((blog, i) => {
                                                console.log(blog)
                                                let { author: { personal_info } } = blog;
                                                return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                                    <BlogPostCard content={blog} author={personal_info} />
                                                </AnimationWrapper>
                                            })
                                        }
                                    </>
                                    : ""
                            } */}

                                        </div>
                                    </div>
                                </div>

                                <div className='thread-rightSidebar col-span-3 sticky top-0 pl-4 pr-6 max-lg:px-[5vw] max-lg:col-span-6 max-lg:relative max-lg:top-6 max-sm:col-span-12 max-sm:top-8'>
                                    <RightSidebar headings={headings} loading={rightSidebarLoading} />
                                </div>
                            </div>
                        </ThreadContext.Provider>
                    </> : <Loader />
                ) : <Errorer message={Strings.threadNotFound[lang]} />
            }
        </AnimationWrapper>
    )
}

export default Thread