import React, { createContext, useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '@/common/page-animation'
import Loader from '@/components/loader.component'
import { BACKEND, Strings, fileExt, imageTypes, videoTypes } from '@/support/Constants'
import { dateFormat, deletedUser, formatBytes } from '@/support/Utils'
import FileCommentContainer from '@/components/fileComments.component'
import FileInteraction from '@/components/file-interaction.component'
import { StoreContext } from '@/stores/Store'
import Avatar from 'boring-avatars'
import axios from 'axios'
import Errorer from '@/components/Errorer'
import BlogContent from '@/components/blog-content.component'
import FileDownloads from '@/components/fileDownloads.components'

const fileStructure = {
    folderId: "",
    title: "",
    desc: "",
    body: [],
    tags: [],
    createdAt: "",
    author: {},
    file: {},
    likes: [],
    downloads: 0,
    commentsCount: 0,
    moderated: false
}
export const FileContext = createContext({})
const FilePage = () => {
    const { fileId } = useParams();
    const { user, lang } = useContext(StoreContext);

    const [file, setFile] = useState(fileStructure)
    const [folder, setFolder] = useState()
    const [comment, setComment] = useState([])
    const [bodyParse, setBodyParse] = useState()

    // console.log(file)

    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)

    const [likes, setLikes] = useState()
    const [liked, setLiked] = useState()

    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [downloadsWrapper, setDownloadsWrapper] = useState(false);
    const [totalParentComentsLoaded, setTotalCommentsLoaded] = useState(0)

    const fetchFile = async () => {
        try {
            const response = await axios.get(`${BACKEND}/api/file`, {
                params: {
                    fileId: fileId
                }
            });

            if (!response.data.error) {
                setFolder(response.data.folder);
                if (!response.data.message) {
                    setFile(response.data.file);
                    setNoData(false);
                    setLikes(response.data.file.likes);
                    setBodyParse(JSON.parse(response.data.file.body));

                    await fetchComment();
                } else {
                    setOnModeration(true);
                    setNoData(true);
                }
            } else {
                throw new Error(response.data.error?.message || 'Error');
            }
            setLoading(false);
        } catch (err) {
            setNoData(true);
            setLoading(false);
        }
    }

    const fetchComment = async () => {
        try {
            const response = await axios.get(`${BACKEND}/api/file/comments`, {
                params: {
                    fileId: fileId,
                    pagination: false
                }
            });

            if (!response.data.error) {
                setComment(response.data.docs);
            } else {
                throw new Error(response.data.error?.message || 'Error');
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFile()
    }, [fileId])

    useEffect(() => {
        setLiked(user ? !!likes?.find(i => i._id === user.id) : false)
    }, [user, likes])


    console.log(file)
    return (
        <AnimationWrapper>
            {
                !noData ? (
                    !loading ? <>
                        <FileContext.Provider value={{
                            file, setFile,
                            comment, setComment,
                            likes, setLikes, liked, setLiked,
                            commentsWrapper, setCommentsWrapper, totalParentComentsLoaded, setTotalCommentsLoaded,
                            downloadsWrapper, setDownloadsWrapper
                        }}>
                            <FileCommentContainer />
                            <FileDownloads />
                            <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                                <div className='aspect-video'>
                                    {
                                        file.banner ? file.banner : <Avatar
                                            size={"100%"}
                                            name={file.title}
                                            variant="marble"
                                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                            square="true"
                                        />
                                    }
                                </div>
                                <div className='mt-12'>
                                    <h2>{file.title}</h2>
                                    <div className='flex max-sm:flex-col justify-between my-8'>
                                        <div className='flex gap-5 items-start '>
                                            {file.author ?
                                                <>
                                                    <Avatar
                                                        size={40}
                                                        name={file.author.name}
                                                        variant="marble"
                                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                                    />
                                                    <p className='capitalize '>
                                                        {file.author.displayName}
                                                        <br />
                                                        @
                                                        <Link className="underline" to={`/user/${file.author.name}`}>{file.author.name}</Link>
                                                    </p>
                                                </> :
                                                <>
                                                    <Avatar
                                                        size={40}
                                                        name={deletedUser.name}
                                                        variant="marble"
                                                        colors={['#C20D90']}
                                                    />
                                                    <p className='capitalize '>
                                                        {deletedUser.displayName}
                                                        <br />
                                                        @
                                                        <Link className="underline" to={`/user/${deletedUser.name}`}>{deletedUser.name}</Link>
                                                    </p>
                                                </>
                                            }
                                        </div>
                                        <p className='text-dark-grey opacity-75 max-sm:mt-6 mx-sm:ml-12 max-sm:pl-5'>{dateFormat(file?.createdAt)}</p>
                                    </div>

                                    {/* <div className='bg-grey rounded-xl w-fit'>
                                        {imageTypes.find(i => i === file.file.type) ? (
                                            <img
                                                className="card_left"
                                                src={BACKEND + file.file.url}
                                                onClick={() => imageView(BACKEND + file.file.url)}
                                                alt="Preview"
                                            />
                                        ) : videoTypes.find(i => i === file.file.type) ? (
                                            <video
                                                className="card_left"
                                                src={BACKEND + file.file.url}
                                                poster={BACKEND + file.file.thumb}
                                                controls
                                            />
                                        ) : null}

                                        <div className='my-4 md:my-8'>
                                            <div className='flex gap-3'>
                                                <p>{Strings.extension[lang]}:</p>
                                                <span>{fileExt.exec(file.file.url)[1]}</span>
                                            </div>
                                            <div className='flex gap-3'>
                                                <p>{Strings.fileSize[lang]}:</p>
                                                <span>{formatBytes(file.file.size)}</span>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>

                                <FileInteraction dropdown="true" />

                                <div className='my-12 blog-page-content'>
                                    {
                                        file && file.body && bodyParse.blocks.map((block, i) => {
                                            return <div className='my-4 md:my-8' key={i}>
                                                <BlogContent block={block} />
                                            </div>
                                        })
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