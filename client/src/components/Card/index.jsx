import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SmileySad, SmileyMeh, Smiley, Article, ChatText, PushPinSimple, Lock, DotsThreeVertical, ArrowCounterClockwise, DownloadSimple, Heart, Eye, PencilSimple, TrashSimple, File } from '@phosphor-icons/react'

import { StoreContext } from '@/stores/Store';

import { counter, declOfNum, dateFormat, deletedUser } from '@/support/Utils';
import { BACKEND, Strings, imageTypes, videoTypes, fileExt } from '@/support/Constants';

import Markdown from '@/components/Markdown';
import { UserRole, UserStatus, UserOnline } from '@/components/UserBadge';
import VideoLightbox, { ImageLightbox } from '@/components/VideoLightbox';

import Dropdown from './Dropdown';
import Avatar from 'boring-avatars';

/* import './style.scss' */

export const CardBody = ({ children }) => {
    return (
        <div className="card_item">
            <div className="card_body">
                <div className="card_block">
                    {children}
                </div>
            </div>
        </div>
    )
}

export const Card = ({ data, threadData, full = false, preview = false, type, joinedList, onLikedResData }) => {
    const { user, token, setModalOpen, setPostType, setFabVisible, lang } = useContext(StoreContext)
    const navigate = useNavigate()
    const likesList = useRef()
    const [likes, setLikes] = useState(data.likes)
    const [liked, setLiked] = useState(user ? !!data.likes?.find(i => i.user === user.id) : false)
    const [image, setImage] = useState('')
    const [imageOpen, setImageOpen] = useState(false)
    const [video, setVideo] = useState('')
    const [thumb, setThumb] = useState('')
    const [videoOpen, setVideoOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(preview ? true : false)

    if (data.author === null) {
        data.author = deletedUser
    }
    if (threadData && threadData.author === null) {
        threadData.author = deletedUser
    }

    useEffect(() => {
        if (type === 'thread' && data.closed) {
            setFabVisible(false)
        }
        if (type === 'thread' && !data.closed) {
            setFabVisible(true)
        }
        // eslint-disable-next-line
    }, [data.closed])

    const likeThread = (emoji) => {
        fetch(BACKEND + '/api/thread/like', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadId: data._id, emotionType: emoji })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setLikes(data.likes)
                    onLikedResData(data.likes)
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const likeAnswer = () => {
        fetch(BACKEND + '/api/answer/like', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answerId: data._id })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setLikes(data.likes)
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    useEffect(() => {
        setLikes(data.likes)
        setLiked(user ? !!data.likes?.find(i => i.user === user.id) : false)
    }, [user, data.likes])

    const onLikeThread = ({ target, emoji }) => {
        if (likesList.current?.contains(target)) return;
        if (user) {
            setLiked(!liked);

            likeThread(emoji)
        } else {
            navigate('/signup');
        }
    }
    const onLike = ({ target, emoji }) => {
        if (likesList.current?.contains(target)) return;

        if (user) {
            setLiked(!liked);

            type === 'answer' ? likeAnswer() : likeThread();
        } else {
            navigate('/signup');
        }
    };

    const editClick = () => {
        const moder = user.role >= 2 ? true : false
        let postType
        if (type === 'thread' && moder) {
            postType = 'adminThreadEdit'
        } else if (type === 'answer') {
            postType = 'answerEdit'
        } else {
            postType = 'userThreadEdit'
        }
        setPostType({
            type: postType,
            id: data._id,
            someData: {
                id: data._id,
                title: data.title,
                body: data.body
            }
        })
        setModalOpen(true)
    }

    const reportClick = () => {
        const id = type === 'answer' ? data.threadId : data._id

        fetch(BACKEND + '/api/report/create', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                threadId: id,
                postId: data._id,
                body: data.body
            })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    toast.success(Strings.reportSent[lang])
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const answerTo = (toId, displayName) => {
        const id = type === 'answer' ? data.threadId : data._id

        setPostType({
            type: 'answer',
            id,
            someData: {
                toId,
                body: `**${displayName}**, `
            }
        })
        setModalOpen(true)
    }

    const deleteThread = () => {
        fetch(BACKEND + '/api/thread/delete', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadId: data._id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    toast.success(data.message)
                    navigate('/')
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const deleteAnswer = () => {
        fetch(BACKEND + '/api/answer/delete', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answerId: data._id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const onDelete = () => {
        const conf = window.confirm(`${Strings.delete[lang]}?`)

        if (!conf) return

        if (type === 'answer') {
            deleteAnswer()
        } else {
            deleteThread()
        }
    }

    const onClear = () => {
        const conf = window.confirm(`${Strings.deleteAllAnswers[lang]}?`)

        if (!conf) return

        fetch(BACKEND + '/api/thread/clear', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadId: data._id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const onPin = () => {
        if (type === 'thread') {
            const formData = new FormData()
            formData.append('postData', JSON.stringify({
                threadId: data._id,
                title: data.title,
                body: data.body,
                pined: !data.pined
            }))

            fetch(BACKEND + '/api/thread/adminedit', {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) throw Error(data.error?.message || 'Error')
                })
                .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
        }
    }

    const onClose = () => {
        if (type === 'thread') {
            const editApi = user.role >= 2 ? 'adminedit' : 'edit'

            const formData = new FormData()
            formData.append('postData', JSON.stringify({
                threadId: data._id,
                title: data.title,
                body: data.body,
                closed: !data.closed
            }))

            fetch(BACKEND + '/api/thread/' + editApi, {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) throw Error(data.error?.message || 'Error')
                })
                .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
        }
    }

    const [banned, setBanned] = useState(data.author?.ban)

    const onBan = () => {
        if (banned) {
            fetch(BACKEND + '/api/ban/delete', {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: data.author._id })
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.error) {
                        setBanned(false)
                    } else throw Error(data.error?.message || 'Error')
                })
                .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
        } else {
            setPostType({
                type: 'ban',
                id: data.author._id,
                someData: {
                    body: data.body
                }
            })
            setModalOpen(true)
        }
    }

    const imageView = (url) => {
        console.log("image clicked")
        setImage(url)
        setImageOpen(true)
    }

    const videoView = (url, thumbUrl) => {
        setVideo(url)
        setThumb(thumbUrl)
        setVideoOpen(true)
    }

    useEffect(() => {
        if (imageOpen || videoOpen) {
            document.body.classList.add('noscroll')
        } else {
            document.body.classList.remove('noscroll')
        }
    }, [imageOpen, videoOpen])

    // console.log(likes.map((item, index) => (item.user.displayName)))
    // console.log(data)

    return (
        <CardBody>
            <header className="card_head">
                <div className="card_head_inner">
                    {full ? (
                        data.title && (
                            <div className="card_title full">
                                {data.pined && <PushPinSimple weight='bold' className="thread_pin" />}
                                {data.closed && <Lock weight='bold' className='thread_lock' />}
                                {data.title}
                            </div>
                        )
                    ) : (
                        <Link to={'/thread/' + data._id} className="card_title">
                            {data.pined && <PushPinSimple weight='bold' className="thread_pin" />}
                            {data.closed && <Lock weight='bold' className='thread_lock' />}
                            {data.title}
                        </Link>
                    )}

                    <div className="card_info">
                        <Link to={'/user/' + data.author.name} className="head_text bold">
                            {data.author.displayName}
                            {full && (
                                <>
                                    <UserOnline onlineAt={data.author.onlineAt} dot />
                                    <UserRole role={data.author.role} />
                                    {type === 'thread' && <UserStatus status="owner" />}
                                    {type === 'answer' && (
                                        data.author._id === threadData.author._id && <UserStatus status="owner" />
                                    )}
                                    {data.author.ban && <UserStatus status="ban" />}
                                </>
                            )}
                        </Link>
                        <span className="bullet">{full ? '-' : '•'}</span>
                        <span className="head_text">
                            <time>{dateFormat(data.createdAt)}</time>
                        </span>
                    </div>
                </div>

                {full && user && (
                    <Dropdown>
                        {user.role >= 2 && (
                            <>
                                {type === 'thread' && (
                                    <div onClick={onPin} className="dropdown_item">
                                        {data.pined ? Strings.unpin[lang] : Strings.pin[lang]}
                                    </div>
                                )}
                                {type === 'thread' && (
                                    <div onClick={onClose} className="dropdown_item">
                                        {data.closed ? Strings.open[lang] : Strings.close[lang]}
                                    </div>
                                )}
                                {user.role >= data.author.role && <div onClick={onDelete} className="dropdown_item">{Strings.delete[lang]}</div>}
                                {type === 'thread' && user.role >= data.author.role && (
                                    <div onClick={onClear} className="dropdown_item">{Strings.deleteAllAnswers[lang]}</div>
                                )}
                                {data.author.name !== 'deleted' && user.id !== data.author._id && data.author.role === 1 && (
                                    <div onClick={onBan} className="dropdown_item">
                                        {banned ? Strings.unbanUser[lang] : Strings.banUser[lang]}
                                    </div>
                                )}
                            </>
                        )}
                        {user.id === data.author._id || (user.role >= 2 && user.role >= data.author.role)
                            ? <div onClick={editClick} className="dropdown_item">{Strings.edit[lang]}</div>
                            : null
                        }
                        {type === 'thread' && user.id === data.author._id && user.role === 1 && (
                            <div onClick={onClose} className="dropdown_item">
                                {data.closed ? Strings.open[lang] : Strings.close[lang]}
                            </div>
                        )}
                        {user.id !== data.author._id && (
                            <div onClick={reportClick} className="dropdown_item">{Strings.report[lang]}</div>
                        )}
                    </Dropdown>
                )}
            </header>

            {(full || preview) && (
                <Fragment>
                    <div
                        className={data.attach && data.attach.length === 1 ? 'card_content with_attach_list markdown' : 'card_content markdown'}
                    >
                        {data.attach ? (
                            <div className={data.attach.length > 1 ? 'attach_grid' : 'attach_list'}>
                                {data.attach.map((item, index) => (
                                    <Fragment key={index}>
                                        {imageTypes.find(i => i === item.type) ? (
                                            <div
                                                onClick={() => imageView(BACKEND + item.file)}
                                                className="attached_file image_file card_left"
                                                style={{ backgroundImage: `url(${BACKEND + item.file})` }}
                                            />
                                        ) : videoTypes.find(i => i === item.type) ? (
                                            <div
                                                onClick={() => videoView(BACKEND + item.file, BACKEND + item.thumb)}
                                                className="attached_file card_left image_file card_left"
                                                style={{ backgroundImage: `url(${BACKEND + item.thumb})` }}
                                            >
                                                <div className="attached_info">{fileExt.exec(item.file)[1]}</div>
                                            </div>
                                        ) : (
                                            <a href={BACKEND + item.file} className="attached_file card_left empty" target="_blank" rel="noopener noreferrer">
                                                <div className="attached_info">{fileExt.exec(item.file)[1]}</div>
                                            </a>
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        ) : null}

                        {imageOpen && <ImageLightbox image={image} onCloseRequest={() => setImageOpen(false)} />}

                        {videoOpen && (
                            <VideoLightbox
                                source={video}
                                thumb={thumb}
                                onCloseRequest={() => setVideoOpen(false)}
                            />
                        )}

                        <Markdown
                            source={collapsed && data.body.length > 200 ? data.body.slice(0, 200) + '...' : data.body}
                            onImageClick={imageView}
                        />
                    </div>

                    {preview && data.body.length > 200 && (
                        <div
                            className="text_show_more"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? Strings.showMore[lang] : Strings.showLess[lang]}
                        </div>
                    )}
                </Fragment>
            )}

            <footer className="card_foot thread_foot">
                {full ? (
                    <Fragment>
                        {data.author.name !== 'deleted' && user && user.id !== data.author._id && (
                            <div className="act_btn foot_btn" onClick={() => answerTo(data._id, data.author.displayName)}>
                                <ArrowCounterClockwise weight='bold' />
                                <span>{Strings.answer[lang]}</span>
                            </div>
                        )}

                        <div className='emoji_card'>
                            <p className='emoji_card-title'>Bạn cảm thấy vài biết này hay?</p>
                            <div className='emoji_vote'>
                                <ul role="tooltip" aria-label="Cảm xúc của bạn khi đọc bài viết">
                                    <li className='emoji_vote-bad' onClick={() => onLikeThread({ emoji: "bad" })}>
                                        <SmileySad />
                                    </li>
                                    <li className='emoji_vote-neutral' onClick={() => onLikeThread({ emoji: "neutral" })}>
                                        <SmileyMeh />
                                    </li>
                                    <li className='emoji_vote-good' onClick={() => onLikeThread({ emoji: "good" })}>
                                        <Smiley />
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="act_btn foot_btn relative" onClick={onLike}>
                            {/* <Heart weight={liked ? 'fill' : 'bold'} /> */}
                            {likes.length ? (
                                <Fragment>
                                    <span className="card_count">{counter(likes.length)}</span>
                                    <span className="hidden">
                                        {declOfNum(likes.length, [Strings.like1[lang], Strings.like2[lang], Strings.like3[lang]])}
                                    </span>
                                    {user && (
                                        <div className="pop_list" ref={likesList}>
                                            {likes.slice(0, 4).map((item, index) => (
                                                <Link
                                                    key={index}
                                                    to={'/user/' + item.user.name}
                                                    title={item.user.displayName}
                                                >
                                                    <Avatar
                                                        size={'100%'}
                                                        name={item.user.displayName}
                                                        variant="marble"
                                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}

                                                    />
                                                </Link>

                                            ))}
                                            {likes.length > 4 && <span>+{likes.length - 4}</span>}
                                        </div>
                                    )}
                                </Fragment>
                            ) : null}
                        </div>

                        {data.answersCount > 0 && (
                            <div className="act_btn foot_btn disable">
                                <ChatText weight='bold' />
                                <span className="card_count">{counter(data.answersCount)}</span>
                                <span className="hidden">
                                    {declOfNum(data.answersCount, [Strings.answer1[lang], Strings.answer2[lang], Strings.answer3[lang]])}
                                </span>
                            </div>
                        )}

                        {user && joinedList && joinedList.length ? (
                            <div className="act_btn foot_btn relative">
                                <Eye weight='bold' />
                                <span className="card_count">{counter(joinedList.length)}</span>
                                <span className="hidden">{Strings.isViewing[lang]}</span>

                                <div className="pop_list">
                                    {joinedList.map((item, index) => (
                                        <Link
                                            key={index}
                                            to={'/user/' + item.user.name}
                                            className="head_profile"
                                            title={item.user.displayName}
                                            style={{ backgroundImage: `url(${item.user.picture ? BACKEND + item.user.picture : ''})` }}
                                        >
                                            {!item.user.picture && item.user.displayName.charAt(0)}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </Fragment>
                ) : (
                    type !== 'answer' ? (
                        <div className="act_btn foot_btn disable">
                            <ChatText weight='bold' />
                            <span className="card_count">{counter(data.answersCount)}</span>
                            <span className="count_title">
                                {declOfNum(data.answersCount, [Strings.answer1[lang], Strings.answer2[lang], Strings.answer3[lang]])}
                            </span>
                        </div>
                    ) : (
                        <Link to={'/thread/' + data.threadId} className="act_btn foot_btn">{Strings.open[lang]} {Strings.thread1[lang]}</Link>
                    )
                )}
            </footer>

            {full && data.edited && (
                data.edited.createdAt && (
                    <div className="act_btn foot_btn under_foot disable">
                        <PencilSimple />
                        <span className="card_count">
                            {dateFormat(data.edited.createdAt)}
                        </span>
                    </div>
                )
            )}
        </CardBody>
    )
}

export const BoardCard = ({ data }) => {
    const { lang } = useContext(StoreContext)

    return (
        <CardBody>
            <header className="card_head">
                <div className="card_head_inner">
                    <Link to={'/boards/' + data.name} className="card_title">{data.title}</Link>
                </div>
            </header>

            <footer className="card_foot">
                <div className="act_btn foot_btn disable">
                    <Article weight='bold' />
                    <span className="card_count">{counter(data.threadsCount)}</span>
                    <span className="count_title">
                        {declOfNum(data.threadsCount, [Strings.thread1[lang], Strings.thread2[lang], Strings.thread3[lang]])}
                    </span>
                </div>

                <div className="act_btn foot_btn disable">
                    <ChatText weight='bold' />
                    <span className="card_count">{counter(data.answersCount)}</span>
                    <span className="count_title">
                        {declOfNum(data.answersCount, [Strings.answer[lang], Strings.answers[lang]])}
                    </span>
                </div>
            </footer>
        </CardBody>
    )
}

export const UserCard = ({ data, online, karma }) => {
    const { lang } = useContext(StoreContext)

    return (
        <CardBody>
            <Link to={'/user/' + data.name} className="card_head user_head">
                <div className="card_head_inner">
                    <div className="card_title user_title">
                        {data.picture ? (
                            <div className="head_profile" style={{ backgroundImage: `url(${BACKEND + data.picture})` }} />
                        ) : (
                            <div className="head_profile">
                                {data.displayName.charAt(0)}
                            </div>
                        )}
                        <div className="user_info">
                            <div className="user_info_top">
                                {data.displayName}
                                <UserRole role={data.role} />
                                {data.ban && <UserStatus status="ban" />}
                            </div>
                            {!online && (
                                <div className="head_text">
                                    <UserOnline onlineAt={data.onlineAt} />
                                </div>
                            )}
                            {karma && (
                                <div className="head_text">
                                    {Strings.karma[lang]}:&nbsp;
                                    <span className={data.karma > 0 ? 'positive' : data.karma < 0 ? 'negative' : ''}>
                                        {counter(data.karma)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </CardBody>
    )
}

export const BannedCard = ({ data, unBan }) => {
    const { lang } = useContext(StoreContext)

    if (data.ban.admin === null) {
        data.ban.admin = deletedUser
    }

    return (
        <CardBody>
            <div className="card_head user_head">
                <div className="card_head_inner row">
                    <Link to={'/user/' + data.name} className="card_title user_title">
                        {data.picture ? (
                            <div className="head_profile" style={{ backgroundImage: `url(${BACKEND + data.picture})` }} />
                        ) : (
                            <div className="head_profile">
                                {data.displayName.charAt(0)}
                            </div>
                        )}
                        <div className="user_info">
                            <div className="user_info_top">
                                {data.displayName}
                            </div>
                            <div className="head_text">{dateFormat(data.ban?.createdAt)}</div>
                        </div>
                    </Link>

                    <div className="edit_action_menu">
                        <div className="action delete" onClick={() => unBan(data._id)}>
                            <TrashSimple weight='bold' />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card_content">
                <p>
                    <span className="secondary_text">{Strings.reason[lang]}:</span>
                    {data.ban?.reason}
                </p>
                <p>
                    <span className="secondary_text">{Strings.banExpires[lang]}:</span>
                    {dateFormat(data.ban?.expiresAt)}
                </p>
            </div>

            <footer className="card_foot">
                <div className="act_btn foot_btn disable">
                    <span className="card_count">
                        Admin:&nbsp;
                        <Link to={'/user/' + data.ban.admin.name}>{data.ban.admin.displayName}</Link>
                    </span>
                </div>
            </footer>
        </CardBody>
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
        <CardBody>
            <header className="card_head">
                <div className="card_head_inner">
                    <div className="card_info">
                        <Link to={'/user/' + data.user.name} className="head_text bold">
                            {data.user.displayName}
                        </Link>
                        <span className="bullet">•</span>
                        <span className="head_text">
                            <time>{dateFormat(data.createdAt)}</time>
                        </span>
                    </div>
                </div>
            </header>

            <div className="card_content">
                <p>
                    <span className="secondary_text">{Strings.reason[lang]}:</span>
                    {data.reason}
                </p>
                <p>
                    <span className="secondary_text">{Strings.banExpires[lang]}:</span>
                    {dateFormat(data.expiresAt)}
                </p>
            </div>

            <footer className="card_foot">
                <div className="act_btn foot_btn disable">
                    <span className="card_count">
                        Admin:&nbsp;
                        <Link to={'/user/' + data.admin.name}>{data.admin.displayName}</Link>
                    </span>
                </div>

                {deleteBan && (
                    <div className="act_btn foot_btn delete" onClick={() => deleteBan(data._id)}>
                        <TrashSimple weight="bold" />
                    </div>
                )}
            </footer>
        </CardBody>
    )
}

export const BanInfoCard = ({ data, owner }) => {
    const { lang } = useContext(StoreContext)

    if (data.admin === null) {
        data.admin = deletedUser
    }

    return (
        <CardBody>
            <div className="card_head">
                <div className="card_head_inner">
                    {!owner && <div className="card_title full">{Strings.userBanned[lang]}</div>}
                    <div className="card_info">
                        <div className="head_text bold">
                            Admin:&nbsp;
                            {owner
                                ? data.admin.displayName
                                : <Link to={'/user/' + data.admin.name}>{data.admin.displayName}</Link>
                            }
                        </div>
                        <span className="bullet">•</span>
                        <span className="head_text">
                            <time>{dateFormat(data.createdAt)}</time>
                        </span>
                    </div>
                </div>
            </div>

            <div className="card_content">
                <p>
                    <span className="secondary_text">{Strings.reason[lang]}:</span>
                    {data.reason}
                </p>
                <p>
                    <span className="secondary_text">{Strings.banExpires[lang]}:</span>
                    {dateFormat(data.expiresAt)}
                </p>
            </div>
        </CardBody>
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
                        <Markdown source={collapsed && data.body.length > 200 ? data.body.slice(0, 200) + '...' : data.body} />
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

export const FolderCard = ({ data }) => {
    const { lang } = useContext(StoreContext)
    console.log("Folder cảd", data)
    return (
        <CardBody>
            <header className="card_head">
                <div className="card_head_inner">
                    <Link to={'/uploads/' + data.name} className="card_title">{data.title}</Link>
                </div>
            </header>

            <footer className="card_foot">
                <div className="act_btn foot_btn disable">
                    <File weight='bold' />
                    <span className="card_count">{counter(data.filesCount)}</span>
                    <span className="count_title">
                        {declOfNum(data.threadsCount, [Strings.file1[lang], Strings.file2[lang], Strings.file3[lang]])}
                    </span>
                </div>
            </footer>
        </CardBody>
    )
}

export const FileCard = ({ data, deleteFile }) => {
    const { lang } = useContext(StoreContext)

    if (data.author === null) {
        data.author = deletedUser
    }

    return (
        <div className="card_item file_card">
            <div className="card_body">
                <div className="card_block with_left">
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

                    <div className="card_right">
                        <header className="card_head">
                            <div className="card_head_inner">
                                <Link to={'/file/' + data._id} className="card_title">{data.title}</Link>

                                <div className="card_info">
                                    <Link to={'/user/' + data.author.name} className="head_text bold">
                                        {data.author.displayName}
                                        {deleteFile && (
                                            <>
                                                <UserRole role={data.author.role} />
                                                {data.author.ban && <UserStatus status="ban" />}
                                            </>
                                        )}
                                    </Link>
                                    <span className="bullet">•</span>
                                    <span className="head_text">
                                        <time>{dateFormat(data.createdAt, 'mini')}</time>
                                    </span>
                                </div>
                            </div>
                        </header>

                        <footer className="card_foot">
                            <div className="act_btn foot_btn disable">
                                <DownloadSimple ưe />
                                <span className="card_count">{counter(data.downloads)}</span>
                                <span className="hidden">
                                    {declOfNum(data.downloads, [Strings.download1[lang], Strings.download2[lang], Strings.download3[lang]])}
                                </span>
                            </div>

                            <div className="act_btn foot_btn disable">
                                <Heart weight='bold' />
                                <span className="card_count">{counter(data.likes.length)}</span>
                                <span className="hidden">
                                    {declOfNum(data.likes.length, [Strings.like[lang], Strings.likes[lang]])}
                                </span>
                            </div>

                            {deleteFile && (
                                <div className="act_btn foot_btn delete" onClick={() => deleteFile(data._id)}>
                                    <TrashSimple weight="bold" />
                                </div>
                            )}
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    )
}

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
        <div className="card_item">
            <div className="card_body">
                <div className={data.lastMessage.read ? 'card_block' : 'card_block noread'}>
                    <header className="card_head user_head">
                        <div className="card_head_inner">
                            <Link to={'/messages/' + data[key].name} className="card_title user_title">
                                {data[key].picture ? (
                                    <div className="head_profile" style={{ backgroundImage: `url(${BACKEND + data[key].picture})` }} />
                                ) : (
                                    <div className="head_profile">
                                        {data[key].displayName.charAt(0)}
                                    </div>
                                )}
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
            </div>
        </div>
    )
}

export const AuthHistoryCard = ({ data }) => {
    if (data.user === null) {
        data.user = deletedUser
    }

    return (
        <CardBody>
            <header className="card_head">
                <div className="card_head_inner">
                    <div className="card_info">
                        <Link to={'/user/' + data.user.name} className="head_text bold">
                            {data.user.displayName}
                        </Link>
                        <span className="bullet">•</span>
                        <span className="head_text">
                            <time>{dateFormat(data.loginAt)}</time>
                        </span>
                    </div>
                </div>
            </header>
            <div className="card_content">
                <p>
                    <span className="secondary_text">Ip address:</span>
                    {data.ip}
                </p>
                <p>
                    <span className="secondary_text">Browser:</span>
                    {data.ua}
                </p>
            </div>

        </CardBody>
    )
}