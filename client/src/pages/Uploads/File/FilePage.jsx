import React, { createContext, useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '@/common/page-animation'
import Loader from '@/components/loader.component'
import { getDay } from '@/common/date'
import BlogInteraction from '@/components/blog-interaction.component'
import BlogPostCard from '@/components/blog-post.component'
import BlogContent from '@/components/blog-content.component'
import { BACKEND, Strings } from '@/support/Constants'
import { dateFormat } from '@/support/Utils'
import FileCommentContainer from '@/components/fileComments.component'
import FileInteraction from '@/components/file-interaction.component'
import { StoreContext } from '@/stores/Store'
import Avatar from 'boring-avatars'
import Markdown from '@/components/Markdown'

export const FileContext = createContext({})
const FilePage = () => {
    const { fileId } = useParams();
    const { user, lang } = useContext(StoreContext);

    const [file, setFile] = useState()
    const [folder, setFolder] = useState()
    const [comment, setComment] = useState([])

    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)

    const [likes, setLikes] = useState(file?.likes)
    const [liked, setLiked] = useState(user ? !!file?.likes?.find(i => i === user.id) : false)

    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentComentsLoaded, setTotalCommentsLoaded] = useState(0)

    const fetchFile = async () => {
        try {
            const data = await fetch(`${BACKEND}/api/file?fileId=${fileId}`)
            const response = await data.json()

            if (!response.error) {
                setFolder(response.folder)
                if (!response.message) {
                    setFile(response.file)
                    setNoData(false)
                    await fetchComment()
                } else {
                    setOnModeration(true)
                    setNoData(true)
                }
                setLoading(false)
            } else throw Error(response.error?.message || 'Error')
        } catch (err) {
            setNoData(true)
            setLoading(false)
        }
    }

    const fetchComment = async () => {
        try {
            const data = await fetch(`${BACKEND}/api/file/comments?fileId=${fileId}&pagination=false`)
            const response = await data.json()

            if (!response.error) {
                setComment(response.docs)
                setLoading(false)
            } else throw Error(response.error?.message || 'Error')
        } catch (err) {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFile()
    }, [fileId])

    useEffect(() => {
        setLikes(file?.likes)
        setLiked(user ? !!file?.likes?.find(i => i === user.id) : false)
    }, [user, file?.likes])

    return (
        <AnimationWrapper>
            {
                !noData ? (
                    !loading ? <>
                        <FileContext.Provider value={{ file, setFile, comment, setComment, likes, setLikes, liked, setLiked, commentsWrapper, setCommentsWrapper, totalParentComentsLoaded, setTotalCommentsLoaded }}>
                            <FileCommentContainer />
                            <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                                {/* <img src={banner} alt="Banner" className='aspect-video' /> */}
                                <div className='mt-12'>
                                    <h2>{file.title}</h2>
                                    <div className='flex max-sm:flex-col justify-between my-8'>
                                        <div className='flex gap-5 items-start '>
                                            {file.author &&
                                                <>
                                                    <Avatar
                                                        size={40}
                                                        name={file.author}
                                                        variant="marble"
                                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                                    />
                                                    <p className='capitalize '>
                                                        {file.author}
                                                        <br />
                                                        @
                                                        <Link className="underline" to={`/user/${file.author}`}>{file.author}</Link>
                                                    </p>
                                                </>
                                            }

                                        </div>
                                        <p className='text-dark-grey opacity-75 max-sm:mt-6 mx-sm:ml-12 max-sm:pl-5'>{dateFormat(file?.createdAt)}</p>
                                    </div>
                                </div>

                                <FileInteraction />

                                <div className='my-12 font-gelasio blog-page-content'>
                                    {
                                        <div className='my-4 md:my-8'>
                                            <Markdown block={file.body} />
                                        </div>
                                    }

                                </div>

                                <FileInteraction />

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
                        </FileContext.Provider>
                    </> : <Loader />
                ) : <Errorer message={Strings.threadNotFound[lang]} />
            }
        </AnimationWrapper>
    )
}

export default FilePage