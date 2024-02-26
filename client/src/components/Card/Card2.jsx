import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { counter, dateFormat, declOfNum } from "@/support/Utils"
import { Link } from "react-router-dom"
import Avatar from 'boring-avatars'
import { BACKEND, Strings, fileExt, imageTypes, videoTypes } from "@/support/Constants"
import { StoreContext } from "@/stores/Store"
import { ImageLightbox } from "@/components/VideoLightbox"
import { UserOnline, UserRole, UserStatus } from "../UserBadge"
import { CardBody } from "."

export const ArticleCard = ({ data, threadData, full = false, preview = false, type, joinedList }) => {
    const { user, lang } = useContext(StoreContext)
    const likesList = useRef()
    const [likes, setLikes] = useState(data.likes)
    const [liked, setLiked] = useState(user ? !!data.likes?.find(i => i._id === user.id) : false)

    const removeMarkdown = (markdownText) => {
        const regex = /(?:__|[*]{2})(.*?)(?:__|[*]{2})|\[(.*?)\]\(.*?\)|`([^`]+)`|![.*?]\(.*?\)|<.*?>/g;

        const plainText = markdownText.replace(regex, (match, p1, p2, p3) => {
            return p1 || p2 || p3 || match;
        });

        return plainText;
    }

    useEffect(() => {
        setLikes(data.likes)
        setLiked(user ? !!data.likes?.find(i => i._id === user.id) : false)
    }, [user, data.likes])

    return (
        <Link to={`/thread/${data._id}`} className='flex gap-8 items-center border-b border-grey pb-5 mb-4 hover:opacity-80'>
            <div className='w-full'>
                <div className='flex gap-2 items-center mb-7'>
                    <div className="w-6 h-6">
                        <Avatar
                            size={"100%"}
                            name={data.author.name}
                            variant="marble"
                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                        />
                    </div>
                    <p className='line-clamp-1'>{data.author.displayName} @{data.author.name}</p>
                    <p className='min-w-fit'>{dateFormat(data.createdAt)}</p>
                </div>
                <h1 className='blog-title'>{data.title}</h1>
                <p className='my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{removeMarkdown(data.body)}</p>

                {/* IMG/VIDEO/FILE BOX */}
                <AttachCard data={data} />

                {/* LIKE COUNTER */}
                <div className='flex gap-4 mt-7'>
                    <span className='btn-light py-1 px-4'>{data.tags ? tags[0] : "Test"}</span>
                    {liked ?
                        <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                            <i className='fi fi-sr-heart text-xl text-red'></i>
                            {counter(likes ? likes.length : 0)} {declOfNum(likes ? likes.length : 0, Strings.like[lang], Strings.likes[lang])}
                        </span>
                        :
                        <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                            <i className='fi fi-rr-heart text-xl'></i>
                            {counter(likes ? likes.length : 0)} {declOfNum(likes ? likes.length : 0, Strings.like[lang], Strings.likes[lang])}
                        </span>}
                </div>
            </div>
            <div className='h-28 aspect-square bg-grey'>
                {
                    data.banner ? <img src={data.banner} alt="Banner" className='w-full h-full aspect-square object-cover' /> :
                        <Avatar
                            size={"100%"}
                            name={data.title}
                            variant="marble"
                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                            square="true"
                        />
                }
            </div>
        </Link>
    )
}

export const AttachCard = ({ data, resized = false }) => {
    const [image, setImage] = useState('')
    const [imageOpen, setImageOpen] = useState(false)
    const [video, setVideo] = useState('')
    const [thumb, setThumb] = useState('')
    const [videoOpen, setVideoOpen] = useState(false)

    const imageView = (url) => {
        setImage(url)
        setImageOpen(true)
    }

    const videoView = (url, thumbUrl) => {
        setVideo(url)
        setThumb(thumbUrl)
        setVideoOpen(true)
    }


    return (
        <>
            <div
                className={data.attach && data.attach.length === 1 ? 'm-2 font-bold leading-3 break-words flex items-start w-[112px] h-auto' : 'm-2 font-bold leading-3 break-words'}
            >
                {data.attach ? (
                    <div className={data.attach.length > 1 ? resized ? 'grid grid-cols-[repeat(2,minmax(0,72px))] max-lg:grid-cols-[repeat(2,minmax(0,72px))] gap-x-4 gap-y-2 mt-4 mb-2 justify-center' : 'grid grid-cols-[repeat(4,minmax(0,72px))] max-lg:grid-cols-[repeat(2,minmax(0,72px))] gap-x-4 gap-y-2 mt-4 mb-2' : 'flex items-center overflow-x-auto overflow-y-hidden snap-x'}>
                        {data.attach.map((item, index) => (
                            <Fragment key={index}>
                                {imageTypes.find(i => i === item.type) ? (
                                    <a className="spotlight" href={BACKEND + item.file} data-download="true" data-media="image">
                                        <div
                                            className="attached_file image_file card_left m-auto"
                                            style={{ backgroundImage: `url(${BACKEND + item.file})` }}
                                        />
                                    </a>
                                ) : videoTypes.find(i => i === item.type) ? (
                                    <a className="spotlight" href={BACKEND + item.file} data-download="true" data-media="video" data-autoplay="true" data-poster={BACKEND + item.thumb}>
                                        <div
                                            className="attached_file card_left image_file card_left m-auto"
                                            style={{ backgroundImage: `url(${BACKEND + item.thumb})` }}
                                        >
                                            <div className="attached_info">{fileExt.exec(item.file)[1]}</div>
                                        </div>
                                    </a>
                                ) : (
                                    <a href={BACKEND + item.file} className="attached_file card_left empty relative m-auto" target="_blank" rel="noopener noreferrer">
                                        <div className="flex items-center justify-center absolute inset-0">
                                            <i class="fi fi-rs-file text-2xl opacity-40"></i>
                                        </div>
                                        <div class="absolute bottom-0 left-0 p-2 text-dark-grey opacity-60">
                                            <div className="text-sm">{fileExt.exec(item.file)[1]}</div>
                                        </div>
                                    </a>
                                )}
                            </Fragment>
                        ))}
                    </div>
                ) : null}

                {/* {imageOpen && <ImageLightbox image={image} onCloseRequest={() => setImageOpen(false)} />} */}

                {/* {videoOpen && (
                    <VideoLightbox
                        source={video}
                        thumb={thumb}
                        onCloseRequest={() => setVideoOpen(false)}
                    />
                )} */}

            </div>
        </>
    )
}

export const FolderCard = ({ data }) => {
    const { lang } = useContext(StoreContext)

    return (
        <Link to={`/uploads/${data.name}`} className='flex gap-8 items-center border-b border-grey pb-5 mb-4 hover:opacity-90'>
            <div className='w-full'>
                <h1 className='blog-title'>{data.title}</h1>
                <p className='my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{data.body}</p>

                {/* FILES COUNTER */}
                <div className='flex gap-4 mt-7'>
                    {/* <span className='btn-light py-1 px-4'>{tags[0]}</span> */}
                    <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                        <i class="fi fi-rr-file text-xl"></i>
                        {counter(data.filesCount)} {declOfNum(data.threadsCount, [Strings.file[lang], Strings.files[lang]])}
                    </span>
                </div>
            </div>
            <div className='h-28 aspect-square bg-grey'>
                {
                    data.banner ? <img src={data.banner} alt="Banner" className='w-full h-full aspect-square object-cover' /> :
                        <Avatar
                            size={"100%"}
                            name={data.title}
                            variant="marble"
                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                            square="true"
                        />
                }
            </div>
        </Link>
    )
}

export const FileCard = ({ data, deleteFile }) => {

    const removeMarkdown = (markdownText) => {
        const regex = /(?:__|[*]{2})(.*?)(?:__|[*]{2})|\[(.*?)\]\(.*?\)|`([^`]+)`|![.*?]\(.*?\)|<.*?>/g;

        const plainText = markdownText.replace(regex, (match, p1, p2, p3) => {
            return p1 || p2 || p3 || match;
        });

        return plainText;
    }


    return (
        <Link to={`/thread/${data._id}`} className='flex gap-8 items-center border-b border-grey pb-5 mb-4 hover:opacity-90'>
            <div className='w-full'>
                <div className='flex gap-2 items-center mb-7'>
                    <Avatar
                        size={40}
                        name={data.author.name}
                        variant="marble"
                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                    />
                    <p className='line-clamp-1'>{data.author.displayName} @{data.author.name}</p>
                    <p className='min-w-fit'>{dateFormat(data.createdAt)}</p>
                </div>
                <h1 className='blog-title'>{data.title}</h1>
                <p className='my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{removeMarkdown(data.body)}</p>

                {/* IMG/VIDEO/FILE BOX */}
                <AttachCard data={data} />

                {/* LIKE COUNTER */}
                <div className='flex gap-4 mt-7'>
                    {/* <span className='btn-light py-1 px-4'>{tags[0]}</span> */}
                    <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                        <i className='fi fi-rr-heart text-xl'></i>50 likes{/* {total_likes} */}
                    </span>
                </div>
            </div>
            <div className='h-28 aspect-square bg-grey'>
                {
                    data.banner ? <img src={data.banner} alt="Banner" className='w-full h-full aspect-square object-cover' /> :
                        <Avatar
                            size={"100%"}
                            name={data.title}
                            variant="marble"
                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                            square="true"
                        />
                }
            </div>
        </Link>
    )
}


export const UserCard = ({ data, online, karma }) => {
    const { lang } = useContext(StoreContext)

    return (
        <div className="block relative group p-6 bg-grey text-black border-2 border-grey rounded-lg shadow-sm my-4 max-w-lg max-md:max-w-none">
            <Link to={'/user/' + data.name}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                        <Avatar
                            size={"100%"}
                            name={data.name}
                            variant="marble"
                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                        />
                    </div>

                    <div className="flex flex-col flex-1 overflow-hidden leading-6">
                        <div className="flex items-center">
                            {data.displayName}
                            <UserRole role={data.role} />
                            {data.ban && <UserStatus status="ban" lang={lang} />}
                        </div>
                        {!online && (
                            <div className="flex items-center text-dark-grey/80 break-words">
                                <UserOnline onlineAt={data.onlineAt} />
                            </div>
                        )}
                        {karma && (
                            <div className="flex items-center text-dark-grey/80 break-words">
                                {Strings.karma[lang]}:&nbsp;
                                <span className={data.karma > 0 ? 'positive' : data.karma < 0 ? 'negative' : ''}>
                                    {counter(data.karma)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export const BannedAll = ({ data, deleteBan }) => {
    const { lang } = useContext(StoreContext)

    if (data.user === null) {
        data.user = deletedUser
    }

    if (data.admin === null) {
        data.admin = deletedUser
    }

    return (
        <>
            <div class="block relative group p-6 bg-grey text-black border-2 border-grey rounded-lg shadow-sm my-4">
                {/* <h5 class="mb-2 text-2xl font-bold tracking-tight">Noteworthy technology acquisitions 2021</h5> */}
                <div className="flex font-medium">
                    <Link to={'/user/' + data.user.name}>
                        <span>{data.user.displayName}</span>
                    </Link>
                    <span className="mx-2 font-normal">/</span>
                    <p>
                        <time>{dateFormat(data.createdAt)}</time>
                    </p>
                </div>

                <div className="mt-5">
                    <p>
                        <span className="mr-2 font-medium">{Strings.reason[lang]}:</span>
                        <span className="font-normal">{data.reason}</span>
                    </p>
                    <p>
                        <span className="mr-2 font-medium">{Strings.banExpires[lang]}:</span>
                        <span className="font-normal">{dateFormat(data.expiresAt)}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3 mt-5">
                    <Link to={'/user/' + data.admin.name} reloadDocument="true" className="border-2 border-light-grey px-3 py-2 rounded-full cursor-pointer hover:bg-light-grey">
                        Admin:&nbsp;
                        <span className='text-purple'>{data.admin.displayName}</span>
                    </Link>

                    {deleteBan && (
                        <div className="btn-delete" onClick={() => deleteBan(data._id)}>
                            <i class="fi fi-rr-trash"></i>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export const AnswerCard = ({ data }) => {
    const { lang } = useContext(StoreContext)

    return (
        <>
            <div class="block relative group p-6 bg-grey text-black border-2 border-grey rounded-lg shadow-sm my-4">
                <div className="flex font-medium">
                    <Link to={'/user/' + data.author.name}>
                        <span>{data.author.displayName}</span>
                    </Link>
                    <span className="mx-2 font-normal">/</span>
                    <p>
                        <time>{dateFormat(data.createdAt)}</time>
                    </p>
                </div>

                <div className="mt-5">
                    <AttachCard data={data} />
                    {data.body}
                </div>

                <div className="flex items-center gap-3 mt-5">
                    <Link to={'/thread/' + data.threadId} className="border-2 border-light-grey px-3 py-2 rounded-full cursor-pointer hover:bg-light-grey">{Strings.open[lang]} {Strings.thread[lang]}</Link>
                </div>
            </div>
        </>
    )
}