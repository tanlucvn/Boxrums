import React, { createContext, useContext, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import AnimationWrapper from '@/common/page-animation'
import Loader from '@/components/Loader'
import { BACKEND, Strings, fileExt, imageTypes, videoTypes } from '@/support/Constants'
import { dateFormat, deletedUser, formatBytes } from '@/support/Utils'
import FileCommentContainer from '@/components/Comments/File/fileComments.component'
import FileInteraction from '@/components/Interaction/File/file-interaction.component'
import { StoreContext } from '@/stores/Store'
import Avatar from 'boring-avatars'
import axios from 'axios'
import Errorer from '@/components/Errorer'
import BlogContent from '@/components/blog-content.component'
import FileDownloads from '@/components/Comments/File/fileDownloads.components'
import Socket, { joinToRoom, leaveFromRoom } from '@/support/Socket'
import { toast } from 'react-hot-toast'

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
    const navigate = useNavigate()

    const [file, setFile] = useState(fileStructure)
    const [folder, setFolder] = useState()
    const [comment, setComment] = useState([])
    // console.log(file)

    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)

    const [liked, setLiked] = useState()

    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [downloadsWrapper, setDownloadsWrapper] = useState(false);
    const [totalParentComentsLoaded, setTotalCommentsLoaded] = useState(0)
    const [subscribed, setSubscribed] = useState({})

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
        if (file && file.likes.length >= 0) {
            setLiked(user ? !!file.likes.find(i => i._id === user.id) : false)
        }
    }, [user, file])

    useEffect(() => {
        if (fileId) joinToRoom('file:' + fileId)
        return () => {
            if (fileId) leaveFromRoom('file:' + fileId)
        }
    }, [fileId])

    useEffect(() => {
        Socket.on('fileDeleted', (data) => {
            toast.error("File has been deleted")
            navigate('/uploads/');
        });
        Socket.on('fileEdited', (data) => {
            setFile(data);
        });
        Socket.on('fileLiked', (data) => {
            setFile(data);
        });
        Socket.on('fileDownloaded', (data) => {
            setFile(data);
        });
        Socket.on('commentCreated', (data) => {
            setSubscribed({ type: 'commentCreated', payload: data })
        });
        Socket.on('commentDeleted', (data) => {
            setSubscribed({ type: 'commentDeleted', payload: data })
        });
        Socket.on('commentLiked', (data) => {
            setSubscribed({ type: 'commentLiked', payload: data })
        });

        // eslint-disable-next-line
    }, []);

    console.log("likes", file.likes)
    return (
        <AnimationWrapper>
            {
                !noData ? (
                    !loading ? <>
                        <FileContext.Provider value={{
                            file, setFile,
                            comment, setComment,
                            subscribed, setSubscribed,
                            liked, setLiked,
                            commentsWrapper, setCommentsWrapper, totalParentComentsLoaded, setTotalCommentsLoaded,
                            downloadsWrapper, setDownloadsWrapper
                        }}>
                            <FileCommentContainer />
                            <FileDownloads />
                            <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                                <div className='aspect-video'>
                                    {
                                        file.banner ? <img src={file.banner} alt="Banner" className='aspect-video' /> :
                                            <Avatar
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
                                </div>

                                <FileInteraction dropdown="true" />

                                <div className='my-12 blog-page-content'>
                                    {
                                        file && file.body && file.body[0].blocks.map((block, i) => {
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