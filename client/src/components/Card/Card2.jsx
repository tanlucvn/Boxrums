import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { counter, dateFormat, declOfNum } from "@/support/Utils"
import { Link } from "react-router-dom"
import Avatar from 'boring-avatars'
import { BACKEND, Strings, fileExt, imageTypes, videoTypes } from "@/support/Constants"
import { StoreContext } from "@/stores/Store"
import { ImageLightbox } from "@/components/VideoLightbox"

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
