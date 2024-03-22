import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { counter, dateFormat, declOfNum, deletedUser } from "@/support/Utils"
import { Link } from "react-router-dom"
import Avatar from 'boring-avatars'
import { BACKEND, Strings, fileExt, imageTypes, videoTypes } from "@/support/Constants"
import { StoreContext } from "@/stores/Store"
import { UserOnline, UserRole, UserStatus } from "@/components/UserBadge"

export const ArticleCard = ({ data, preview = false, type, joinedList }) => {
    const { user, lang } = useContext(StoreContext)
    const [likes, setLikes] = useState(data.likes)
    const [liked, setLiked] = useState(user ? !!data.likes?.find(i => i._id === user.id) : false)

    useEffect(() => {
        setLikes(data.likes)
        setLiked(user ? !!data.likes?.find(i => i._id === user.id) : false)
    }, [user, data.likes])

    // console.log(data)

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
                <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>
                    {data.desc}
                </p>

                {(data.pined || data.closed) &&
                    <div className="flex gap-3 mt-2">
                        {data.pined &&
                            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" title={Strings.pin[lang]}>
                                <i class="fi fi-sr-thumbtack text-xl"></i>
                            </div>
                        }

                        {data.closed &&
                            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" title={Strings.close[lang]}>
                                <i class="fi fi-sr-lock text-xl"></i>
                            </div>
                        }
                    </div>
                }

                {/* IMG/VIDEO/FILE BOX */}
                <AttachCard data={data} />

                {/* LIKE COUNTER */}
                <div className='flex flex-wrap gap-4 mt-7 items-center'>
                    {data.tags.length > 0 && <span className='btn-light py-1 px-4 capitalize'>{data.tags[0]}</span>}
                    {liked ?
                        <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                            <i className='fi fi-sr-heart text-xl text-red'></i>
                            {counter(likes ? likes.length : 0)} {declOfNum(likes ? likes.length : 0, Strings.like[lang], Strings.likes[lang])}
                        </span>
                        :
                        <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                            <i className='fi fi-rr-heart text-xl'></i>
                            {counter(likes ? likes.length : 0)} {declOfNum(likes ? likes.length : 0, Strings.like[lang], Strings.likes[lang])}
                        </span>
                    }

                    {preview && type === "newestAnswer" &&
                        <div className="flex items-center ml-auto gap-2 text-dark-grey max-sm:ml-3">
                            <i class="fi fi-rr-comment-dots"></i>
                            {dateFormat(data.newestAnswer)}
                        </div>
                    }

                    {preview && type === "answersCount" &&
                        <div className="flex items-center ml-auto gap-2 text-dark-grey max-sm:ml-3">
                            <i class="fi fi-rr-comment-dots"></i>
                            <p className="flex gap-1">
                                {counter(data.answersCount)}
                                <span>
                                    {declOfNum(data.answersCount, Strings.answer[lang], Strings.answers[lang])}
                                </span>
                            </p>
                        </div>
                    }
                </div>
            </div>
            <div className='h-28 aspect-square bg-grey'>
                {
                    data.banner ?
                        <img src={data.banner} alt="Banner" className='w-full h-full aspect-square object-cover' /> :
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

export const BlogPostCard = ({ data, lang }) => {
    const { user } = useContext(StoreContext)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        setLiked(user ? !!data.likes?.find(i => i._id === user.id) : false)
    }, [user, data.likes])

    return (
        <a href={`/thread/${data._id}`} className='flex gap-8 items-center border-b border-grey pb-5 mb-4 hover:opacity-80'>
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
                <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{data.desc}</p>
                <div className='flex gap-4 mt-7'>
                    {data.tags.length > 0 && <span className='btn-light py-1 px-4 capitalize'>{data.tags[0]}</span>}
                    <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                        {liked ?
                            <>
                                <i className='fi fi-sr-heart text-xl text-red'></i>
                                {counter(data.likes ? data.likes.length : 0)} {declOfNum(data.likes ? data.likes.length : 0, Strings.like[lang], Strings.likes[lang])}
                            </> :
                            <>
                                <i className='fi fi-rr-heart text-xl'></i>
                                {counter(data.likes ? data.likes.length : 0)} {declOfNum(data.likes ? data.likes.length : 0, Strings.like[lang], Strings.likes[lang])}
                            </>
                        }
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
        </a>
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

export const BoardsCard = ({ data, preview = false, type }) => {
    const { lang } = useContext(StoreContext)

    // console.log(data)
    return (
        <Link to={`/board/${data.name}`} className='flex gap-8 items-center border-b border-grey pb-5 mb-4 hover:opacity-90'>
            <div className='w-full'>
                <h1 className='blog-title'>{data.title}</h1>
                <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{data.body}</p>

                <div className="flex gap-x-10 justify-between items-center flex-wrap">
                    <div className='flex gap-4 mt-7'>
                        <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                            <i class="fi fi-rr-ballot"></i>
                            {counter(data.threadsCount)} {declOfNum(data.threadsCount, Strings.thread[lang], Strings.threads[lang])}
                        </span>

                        <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                            <i class="fi fi-rr-comment-dots"></i>
                            {counter(data.answersCount)} {declOfNum(data.answersCount, Strings.answer[lang], Strings.answers[lang])}
                        </span>
                    </div>

                    {preview && type === "popular" &&
                        <div className='flex flex-wrap gap-4 mt-7'>
                            <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                                <i class="fi fi-rr-ballot"></i>
                                {dateFormat(data.newestThread)}
                            </span>

                            <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                                <i class="fi fi-rr-comment-dots"></i>
                                {dateFormat(data.newestAnswer)}
                            </span>
                        </div>
                    }

                    {preview && type === "newestAnswer" &&
                        <div className="flex mt-7 items-center ml-auto gap-2 text-dark-grey max-sm:ml-3">
                            <i class="fi fi-rr-comment-dots"></i>
                            {dateFormat(data.newestAnswer)}
                        </div>
                    }

                    {preview && type === "newestThread" &&
                        <div className="flex mt-7 items-center ml-auto gap-2 text-dark-grey max-sm:ml-3">
                            <i class="fi fi-rr-ballot"></i>
                            {dateFormat(data.newestThread)}
                        </div>
                    }

                    {preview && type === "answersCount" &&
                        <div className="flex mt-7 items-center ml-auto gap-2 text-dark-grey max-sm:ml-3">
                            <i class="fi fi-rr-comment-dots"></i>
                            <p className="flex gap-1">
                                {counter(data.answersCount)}
                                <span>
                                    {declOfNum(data.answersCount, Strings.answer[lang], Strings.answers[lang])}
                                </span>
                            </p>
                        </div>
                    }
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

export const FolderCard = ({ data }) => {
    const { lang } = useContext(StoreContext)

    return (
        <Link to={`/uploads/${data.name}`} className='flex gap-8 items-center border-b border-grey pb-5 mb-4 hover:opacity-90'>
            <div className='w-full'>
                <h1 className='blog-title'>{data.title}</h1>
                <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{data.body}</p>

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
    const { user, lang } = useContext(StoreContext)
    const [likes, setLikes] = useState(data.likes)
    const [liked, setLiked] = useState(user ? !!data.likes?.find(i => i._id === user.id) : false)

    useEffect(() => {
        setLikes(data.likes)
        setLiked(user ? !!data.likes?.find(i => i._id === user.id) : false)
    }, [user, data.likes])

    return (
        <Link to={`/file/${data._id}`} className='flex gap-8 items-center border-b border-grey pb-5 mb-4 hover:opacity-80'>
            <div className='w-full'>
                <div className='flex gap-2 items-center mb-7'>
                    {data.author !== null ?
                        <>
                            <div className="w-6 h-6">
                                <Avatar
                                    size={"100%"}
                                    name={data.author.name}
                                    variant="marble"
                                    colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                />
                            </div>
                            <p className='line-clamp-1'>{data.author.displayName} @{data.author.name}</p>
                        </> :
                        <>
                            <div className="w-6 h-6">
                                <Avatar
                                    size={"100%"}
                                    name={deletedUser.name}
                                    variant="marble"
                                    colors={['#C20D90']}
                                />
                            </div>
                            <p className='line-clamp-1'>{deletedUser.displayName} @{deletedUser.name}</p>
                        </>
                    }

                    <p className='min-w-fit'>{dateFormat(data.createdAt)}</p>
                </div>
                <h1 className='blog-title'>{data.title}</h1>
                <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>
                    {data.desc}
                </p>

                {/* IMG/VIDEO/FILE BOX */}
                <AttachCard data={data} />

                {/* LIKE COUNTER */}
                <div className='flex gap-4 mt-7'>
                    {data.tags.length > 0 && <span className='btn-light py-1 px-4 capitalize'>{data.tags[0]}</span>}
                    {liked ?
                        <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                            <i className='fi fi-sr-heart text-xl text-red'></i>
                            {counter(likes ? likes.length : 0)} {declOfNum(likes ? likes.length : 0, Strings.like[lang], Strings.likes[lang])}
                        </span>
                        :
                        <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                            <i className='fi fi-rr-heart text-xl'></i>
                            {counter(likes ? likes.length : 0)}
                            <p className="max-sm:hidden">
                                {declOfNum(likes ? likes.length : 0, Strings.like[lang], Strings.likes[lang])}
                            </p>
                        </span>
                    }

                    <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                        <i className='fi fi-rr-download text-xl'></i>
                        {counter(data.downloads ? data.downloads : 0)}
                        <p className="max-sm:hidden">
                            {declOfNum(data.downloads ? data.downloads.length : 0, Strings.download[lang], Strings.downloads[lang])}
                        </p>
                    </span>
                </div>
            </div>

            <div className="h-28 aspect-square flex justify-center items-center max-sm:hidden">
                {imageTypes.find(i => i === data.file.type) ? (
                    <div
                        className="card_left"
                        style={{ backgroundImage: `url(${BACKEND + data.file.url})` }}
                    />
                ) : videoTypes.find(i => i === data.file.type) ? (
                    <div
                        className="card_left"
                        style={{ backgroundImage: `url(${BACKEND + data.file.thumb})` }}
                    />
                ) : (
                    <div className="card_left empty" />
                )}
            </div>

            <div className='h-28 aspect-square bg-grey'>
                {
                    data.banner ?
                        <img src={data.banner} alt="Banner" className='w-full h-full aspect-square object-cover' /> :
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

export const SearchUserCard = ({ data }) => {
    return (
        <Link to={`/user/${data.name}`} className='flex gap-5 items-center mb-5'>
            <div className='w-14 h-15'>
                <Avatar
                    size={"100%"}
                    name={data.name}
                    variant="marble"
                    colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                />
            </div>
            <div>
                <h1 className='font-medium text-xl line-clamp-2'>{data.displayName}</h1>
                <p className='text-dark-grey'>@{data.name}</p>
            </div>
        </Link>
    )
}

export const BannedCard = ({ data, owner }) => {
    const { lang } = useContext(StoreContext)

    if (data.admin === null) {
        data.admin = deletedUser
    }

    return (
        <div className="block relative group p-6 bg-grey text-black border-2 border-grey rounded-lg shadow-sm my-4 max-w-lg max-md:max-w-none">
            <div className="card_head">
                <div className="card_head_inner">
                    {!owner && <div className="card_title full">{Strings.userBanned[lang]}</div>}
                    <div className="flex items-center gap-3 font-medium">
                        <div className="w-8 h-8">
                            <Avatar
                                size={"100%"}
                                name={data.ban.admin.name}
                                variant="marble"
                                colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <p>{data.ban.admin.displayName}</p>

                            <UserRole role={data.ban.admin.role} />
                        </div>

                        <span className="font-normal">/</span>

                        <p>{dateFormat(data.createdAt)}</p>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <p className="my-2">
                    <span className="mr-2 font-medium">{Strings.reason[lang]}:</span>
                    <span className="font-normal">{data.ban.reason}</span>
                </p>
                <p className="my-2">
                    <span className="mr-2 font-medium">{Strings.createdAt[lang]}:</span>
                    <span className="font-normal">{dateFormat(data.ban.createdAt)}</span>
                </p>
                <p className="my-2">
                    <span className="mr-2 font-medium">{Strings.banExpires[lang]}:</span>
                    <span className="font-normal">{dateFormat(data.ban.expiresAt)}</span>
                </p>
            </div>
        </div>
    )
}

export const BannedAll = ({ data, deleteBan }) => {
    const { lang } = useContext(StoreContext)

    function calculateCooldown(expiresAt) {
        if (!expiresAt) return '';

        const now = new Date();
        const expirationDate = new Date(expiresAt);
        const difference = expirationDate - now;

        if (difference <= 0) return Strings.timeExpired[lang];

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const result = `${hours} ${Strings.hours[lang]} ${minutes} ${Strings.minutes[lang]} ${seconds} ${Strings.seconds[lang]}`;

        return result;
    }

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
                    <p className="my-2">
                        <span className="mr-2 font-medium">{Strings.reason[lang]}:</span>
                        <span className="font-normal">{data.reason}</span>
                    </p>
                    <p className="my-2">
                        <span className="mr-2 font-medium">Ngày tạo:</span>
                        <span className="font-normal">{dateFormat(data.createdAt)}</span>
                    </p>
                    <p className="my-2">
                        <span className="mr-2 font-medium">{Strings.banExpires[lang]}:</span>
                        <span className="font-normal">{dateFormat(data.expiresAt)}</span>
                    </p>
                    <p className="my-2">
                        <span className="mr-2 font-medium">Tình trạng:</span>
                        <span className="font-normal">{calculateCooldown(data.expiresAt)}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3 mt-5">
                    <Link to={'/user/' + data.admin.name} reloadDocument="true" className="flex items-center gap-3 border-2 border-light-grey px-3 py-2 rounded-full cursor-pointer hover:bg-light-grey">
                        <div className="w-8 h-8">
                            <Avatar
                                size={'100%'}
                                name={data.admin.name}
                                variant="marble"
                                colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                            />
                        </div>

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

export const BanInfoCard = ({ data, owner }) => {
    const { lang } = useContext(StoreContext)

    if (data.admin === null) {
        data.admin = deletedUser
    }

    return (
        <div className="block relative group p-6 bg-grey text-black border-2 border-grey rounded-lg shadow-sm my-4 max-w-lg max-md:max-w-none">
            <div className="card_head">
                <div className="card_head_inner">
                    {!owner && <div className="card_title full">{Strings.userBanned[lang]}</div>}
                    <div className="flex items-center gap-3 font-medium">
                        <div className="w-8 h-8">
                            <Avatar
                                size={"100%"}
                                name={data.admin.name}
                                variant="marble"
                                colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <p>{data.admin.displayName}</p>

                            <UserRole role={data.admin.role} />
                        </div>

                        <span className="font-normal">/</span>

                        <p>{dateFormat(data.createdAt)}</p>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <p className="my-2">
                    <span className="mr-2 font-medium">{Strings.reason[lang]}:</span>
                    <span className="font-normal">{data.reason}</span>
                </p>
                <p className="my-2">
                    <span className="mr-2 font-medium">{Strings.createdAt[lang]}:</span>
                    <span className="font-normal">{dateFormat(data.createdAt)}</span>
                </p>
                <p className="my-2">
                    <span className="mr-2 font-medium">{Strings.banExpires[lang]}:</span>
                    <span className="font-normal">{dateFormat(data.expiresAt)}</span>
                </p>
            </div>
        </div>
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

/* export const DialoqueCard = ({ data }) => {
    const { user, lang } = useContext(StoreContext)
    let key = 'from'
    if (user.id === data.from?._id) {
        key = 'to'
    }

    if (data[key] === null) {
        data[key] = deletedUser
    }

    return (
        <div class="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
            <Link
                to={'/messages/' + data[key].name}
                class="flex flex-row items-center hover:bg-grey rounded-xl p-2"
            >
                <div
                    class="h-8 w-8"
                >
                    <Avatar
                        size={"100%"}
                        name={data[key].name}
                        variant="marble"
                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                    />
                </div>
                <div class="ml-2 text-sm font-semibold">{data[key].displayName}</div>

                {data.lastMessage?.from === user.id && <span>{Strings.you[lang]}: </span>}
                {data.lastMessage?.body.length ? data.lastMessage.body : data.lastMessage?.file.length
                    ? (
                        <>
                            <File weight='bold' />
                            {Strings.file[lang]}
                        </>
                    ) : Strings.message[lang]
                }

                <UserOnline onlineAt={data[key].onlineAt} dot />
                <UserRole role={data[key].role} />
                {data[key].ban && <UserStatus status="ban" />}
            </Link>
        </div>


    )
} */

export const DialoqueCard = ({ data }) => {
    const { user, lang } = useContext(StoreContext)
    let key = 'from'
    if (user.id === data.from?._id) {
        key = 'to'
    }

    if (data[key] === null) {
        data[key] = deletedUser
    }

    return (
        <div className={data.lastMessage.read ? 'card_block' : 'card_block noread'}>
            <header className="card_head user_head">
                <div className="card_head_inner">
                    <Link to={'/messages/' + data[key].name} className="flex">
                        <div
                            class="h-8 w-8"
                        >
                            <Avatar
                                size={"100%"}
                                name={data[key].name}
                                variant="marble"
                                colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                            />
                        </div>

                        <div className="user_info">
                            <div className="user_info_top">
                                {data[key].displayName}
                                <UserOnline onlineAt={data[key].onlineAt} dot />
                                <UserRole role={data[key].role} />
                                {data[key].ban && <UserStatus status="ban" />}
                            </div>
                            <div className="head_text">
                                {data.lastMessage?.from === user.id && <span>{Strings.you[lang]}: </span>}
                                {data.lastMessage?.body.length ? data.lastMessage.body : data.lastMessage?.file.length
                                    ? (
                                        <>
                                            <File weight='bold' />
                                            {Strings.file[lang]}
                                        </>
                                    ) : Strings.message[lang]
                                }
                            </div>
                        </div>
                    </Link>
                    <span className="message_time">{dateFormat(data.lastMessage.createdAt, 'mini')}</span>
                </div>
            </header>
        </div>
    )
}

export const NotificationCard = ({ data }) => {
    const { lang } = useContext(StoreContext)
    const [collapsed, setCollapsed] = useState(true)

    if (data.from === null) {
        data.from = deletedUser
    }

    let pagePath = '/thread/' + data.threadId
    if (data.type === 'answerToThread' || data.type === 'answerToAnswer') {
        pagePath = '/thread/' + data.pageId
    }
    if (data.type === 'commentToFile' || data.type === 'commentToComment') {
        pagePath = '/file/' + data.pageId
    }

    return (
        <div className="card_item">
            <div className="card_body">
                <div className={data.read ? 'card_block' : 'card_block noread'}>
                    <header className="card_head">
                        <div className="card_head_inner">
                            <Link to={pagePath} className="card_title">
                                {data.title}
                            </Link>

                            <div className="card_info">
                                <Link to={'/user/' + data.from.name} className="head_text bold">
                                    {data.from.displayName}
                                    <UserRole role={data.from.role} />
                                    {data.from.ban && <UserStatus status="ban" />}
                                </Link>
                                <span className="bullet">•</span>
                                <span className="head_text">
                                    <time>{dateFormat(data.createdAt)}</time>
                                </span>
                            </div>
                        </div>
                    </header>

                    <div className="card_content markdown">
                        {data.body}
                    </div>

                    {data.body.length > 200 && (
                        <div className="text_show_more" onClick={() => setCollapsed(!collapsed)}>
                            {collapsed ? Strings.showMore[lang] : Strings.showLess[lang]}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}