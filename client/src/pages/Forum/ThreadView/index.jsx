import axios from 'axios'
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '@/common/page-animation'
import Loader from '@/components/loader.component'
import { getDay } from '@/common/date'
import BlogInteraction from '@/components/blog-interaction.component'
import BlogPostCard from '@/components/blog-post.component'
import BlogContent from '@/components/blog-content.component'
import CommentContainer, { fetchComment } from '@/components/comments.component'
import { StoreContext } from '@/stores/Store'
import { Strings } from '@/support/Constants'

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

export const BlogContext = createContext({})
const ThreadView = () => {
    /*     let { blog_id } = useParams()
        const [blog, setBlog] = useState
            (blogStructure);
        const [similarBlog, setSimilarBlog] = useState(blogStructure)
        const [loading, setLoading] = useState(true)
        const [isLikedByUser, setLikedByUser] = useState(false);
        const [commentsWrapper, setCommentsWrapper] = useState(false);
        const [totalParentComentsLoaded, setTotalCommentsLoaded] = useState(0)
    
        let { title, content, banner, author: { personal_info: { username: author_username, fullname, profile_img } }, publishedAt } = blog
    
        const fetchBlog = () => {
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
        }
        useEffect(() => {
            resetState()
            fetchBlog()
        }, [blog_id])
        const resetState = () => {
            setBlog(blogStructure)
            setSimilarBlog(null)
            setLoading(true)
            setLikedByUser(false)
            // setCommentsWrapper(false)
            setTotalCommentsLoaded(0)
        } */
    const { user, token, setPostType, setFabVisible, lang } = useContext(StoreContext)
    const { threadId } = useParams();
    const [headings, setHeadings] = useState([]);
    const [rightSidebarLoading, setRightSidebarLoading] = useState(true);

    useEffect(() => {
        setPostType({
            type: 'answer',
            id: threadId
        })
        // eslint-disable-next-line
    }, [threadId])

    const [joined, setJoined] = useState([])
    const [board, setBoard] = useState({})
    const [thread, setThread] = useState({})
    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)
    const [likes, setLikes] = useState(thread.likes || 0);
    const [answersSubscribed, setAnswersSubscribed] = useState({})
    const [scrollAmount, setScrollAmount] = useState(0);

    useEffect(() => {
        const threadTitle = thread.title || Strings.thread[lang]
        document.title = 'Forum | ' + threadTitle
    }, [thread, lang])

    const updateLikes = (newLikes) => {
        setLikes(newLikes);
    };


    useEffect(() => {
        const fetchThread = async () => {
            try {
                const data = await fetch(`${BACKEND}/api/thread?threadId=${threadId}`)
                const response = await data.json()

                if (!response.error) {
                    setBoard(response.board)
                    setThread(response.thread)
                    setLoading(false)
                    setNoData(false)

                } else throw Error(response.error?.message || 'Error')
            } catch (err) {
                setNoData(true)
                setLoading(false)
            }
        }

        fetchThread()
    }, [threadId])

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

    useEffect(() => {
        const handleScroll = () => {
            const windowScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const newScrollAmount = (windowScroll / windowHeight) * 100;
            setScrollAmount(newScrollAmount);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> :
                    {/* <BlogContext.Provider value={{ blog, setBlog, isLikedByUser, setLikedByUser, commentsWrapper, setCommentsWrapper, totalParentComentsLoaded, setTotalCommentsLoaded }}>
                        <CommentContainer />
                        <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                            <img src={banner} alt="Banner" className='aspect-video' />
                            <div className='mt-12'>
                                <h2>{title}</h2>
                                <div className='flex max-sm:flex-col justify-between my-8'>
                                    <div className='flex gap-5 items-start '>
                                        <img src={profile_img} alt="Author" className='w-12 h-12 rounded-full' />
                                        <p className='capitalize '>
                                            {fullname}
                                            <br />
                                            @
                                            <Link className="underline" to={`/user/${author_username}`}>{author_username}</Link>
                                        </p>

                                    </div>
                                    <p className='text-dark-grey opacity-75 max-sm:mt-6 mx-sm:ml-12 max-sm:pl-5'>Published on {getDay(publishedAt)}</p>
                                </div>
                            </div>

                            <BlogInteraction />

                            <div className='my-12 font-gelasio blog-page-content'>
                                {
                                    content[0].blocks.map((block, i) => {
                                        return <div className='my-4 md:my-8' key={i}>
                                            <BlogContent block={block} />
                                        </div>
                                    })
                                }

                            </div>

                            <BlogInteraction />

                            {
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
                            }

                        </div>
                    </BlogContext.Provider> */}
            }
        </AnimationWrapper>
    )
}

export default ThreadView