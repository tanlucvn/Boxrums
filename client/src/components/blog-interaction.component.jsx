import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'
import { ThreadContext } from '@/pages/Forum/Thread';
import { counter, declOfNum } from '@/support/Utils';
import { BACKEND, Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import Dropdown from './Dropdown';
import { DeletePopup } from './ModalPopup';

const BlogInteraction = ({ dropdown = false, share = false }) => {
    const threadContextData = useContext(ThreadContext);
    const { user, lang, token } = useContext(StoreContext)
    const { thread, setThread, likes, setLikes, liked, setLiked, setCommentsWrapper, answers, setAnswers } = threadContextData
    const [banned, setBanned] = useState(thread.author?.ban)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const likeThread = () => {
        if (!user) {
            toast.error(Strings.pleaseLogin[lang])
            return
        }
        fetch(BACKEND + '/api/thread/like', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadId: thread._id })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setLikes(data.likes)
                    setLiked(!liked)
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const pinThread = () => {
        const formData = new FormData()
        formData.append('threadId', thread._id)
        formData.append('title', thread.title)
        formData.append('body', thread.body)
        formData.append('pined', !thread.pined)

        fetch(BACKEND + '/api/thread/adminedit', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setThread({ ...thread, ...data });
                }
                if (data.error) throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))

    }

    const closeThread = () => {
        const editApi = user.role >= 2 ? 'adminedit' : 'edit'

        const formData = new FormData()
        formData.append('threadId', thread._id)
        formData.append('title', thread.title)
        formData.append('body', thread.body)
        formData.append('closed', !thread.closed)

        fetch(BACKEND + '/api/thread/' + editApi, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setThread({ ...thread, ...data })
                }
                if (data.error) throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const deleteThread = () => {
        fetch(BACKEND + '/api/thread/delete', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadId: thread._id })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setThread({ ...thread, ...data })
                }
                if (data.message) {
                    toast.success(data.message)
                    navigate('/')
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const clearThread = () => {
        setOpen(false)

        fetch(BACKEND + '/api/thread/clear', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadId: thread._id })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setAnswers({ ...answers, ...data })
                    toast.success("Cleared successfully")
                }
                if (data.error) throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

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

    return (
        <>
            <Toaster />
            <hr className='border-grey my-2' />
            <div className='flex gap-6 justify-between'>
                <div className='flex gap-3 items-center'>
                    <button onClick={likeThread} className={'w-10 h-10 rounded-full flex items-center justify-center ' + (liked ? "bg-red/20 text-red" : "bg-grey/80")}>
                        <i className={'fi ' + (liked ? 'fi-sr-heart' : 'fi-rr-heart')}></i>
                    </button>
                    <p className='text-xl text-dark-grey'>{counter(likes ? likes.length : 0)} <span className='max-sm:hidden'>{declOfNum(likes ? likes.length : 0, Strings.like[lang], Strings.likes[lang])}</span></p>
                    <button onClick={() => setCommentsWrapper(preVal => !preVal)} className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                        <i className='fi fi-rr-comment-dots'></i>
                    </button>
                    <p className='text-xl text-dark-grey'>{counter(answers ? answers.length : 0)} <span className='max-sm:hidden'>{declOfNum(answers ? answers.length : 0, Strings.answer[lang], Strings.answers[lang])}</span></p>
                </div>

                <div className='flex gap-6 items-center'>
                    {
                        thread === thread.author.name ?
                            <Link to={`/editor/${thread._id}`} className='underline hover:text-purple'>Edit</Link> : ""
                    }

                    {share &&
                        <Link to={`https://twitter.com/intent/tweet?text=Read ${thread.title}&url=${location.href}`}>
                            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                        </Link>
                    }

                    {dropdown && user && user.role >= 2 &&
                        <Dropdown lang={lang} closed={open}>
                            <div onClick={pinThread} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                {thread.pined ? <i class="fi fi-rr-thumbtack"></i> : <i class="fi fi-sr-thumbtack"></i>}
                                {thread.pined ? Strings.unpin[lang] : Strings.pin[lang]}
                            </div>

                            <div onClick={closeThread} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                {thread.closed ? <i class="fi fi-rr-lock"></i> : <i class="fi fi-sr-lock"></i>}
                                {thread.closed ? Strings.open[lang] : Strings.close[lang]}
                            </div>

                            {user.role >= thread.author.role &&
                                <div onClick={deleteThread} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                    <i class="fi fi-rr-trash"></i>
                                    {Strings.delete[lang]}
                                </div>
                            }
                            {user.role >= thread.author.role && (
                                <div onClick={() => setOpen(true)} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                    <i class="fi fi-rs-trash"></i>
                                    {Strings.deleteAllAnswers[lang]}
                                </div>
                            )}
                            {thread.author.name !== 'deleted' && user.id !== thread.author._id && thread.author.role === 1 && (
                                <div onClick={onBan} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                    {banned ? Strings.unbanUser[lang] : Strings.banUser[lang]}
                                </div>
                            )}
                        </Dropdown>}
                </div>
            </div>

            <DeletePopup open={open} close={() => setOpen(false)} onConfirmed={clearThread} title="Clear" body="Clear answer" lang={lang} />
            <hr className='border-grey my-2' />
        </>
    )
}

export default BlogInteraction