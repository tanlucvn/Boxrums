import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import { ThreadContext } from '@/pages/Forum/Thread';
import { counter, declOfNum } from '@/support/Utils';
import { BACKEND, Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import Dropdown from '../../Dropdown';
import { DeletePopup } from '../../ModalPopup';
import axios from 'axios';

const BlogInteraction = ({ dropdown = false, share = false }) => {
    const { user, lang, token, setPostType, setModalOpen } = useContext(StoreContext)
    const { thread, setThread, liked, setLiked, setCommentsWrapper, answers, setAnswers } = useContext(ThreadContext);
    const [banned, setBanned] = useState(thread.author?.ban)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const likeThread = () => {
        if (!user) {
            toast.error(Strings.pleaseLogin[lang]);
            return;
        }

        axios.put(BACKEND + '/api/thread/like', { threadId: thread._id }, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    setThread(prev => ({ ...prev, likes: data.likes }));
                    setLiked(!liked);
                } else {
                    throw new Error(data.error?.message || 'Error');
                }
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.error === "thread is closed") {
                    toast.error(Strings.threadIsClosed[lang]);
                } else {
                    toast.error(err.message === '[object Object]' ? 'Error' : err.message);
                }
            });
    }

    const pinThread = () => {
        const threadData = {
            threadId: thread._id,
            title: thread.title,
            body: thread.body,
            pined: !thread.pined
        };

        axios.put(BACKEND + '/api/thread/adminedit', threadData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (!response.data.error) {
                    setThread({ ...thread, ...response.data });
                }
                if (response.data.error) throw Error(response.data.error?.message || 'Error');
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message));
    }

    const closeThread = () => {
        const editType = user.role >= 2 ? 'adminedit' : 'edit';

        const threadData = {
            threadId: thread._id,
            title: thread.title,
            body: thread.body,
            closed: !thread.closed
        };

        axios.put(BACKEND + '/api/thread/' + editType, threadData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.data.error) {
                    setThread({ ...thread, ...response.data });
                }
                if (response.data.error) throw Error(response.data.error?.message || 'Error');
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message));
    };

    const deleteThread = () => {
        axios.delete(BACKEND + '/api/thread/delete', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: { threadId: thread._id }
        })
            .then(response => {
                if (!response.data.error) {
                    setThread({ ...thread, ...response.data });
                }
                if (response.data.message) {
                    toast.success(response.data.message);
                    navigate('/');
                } else throw Error(response.data.error?.message || 'Error');
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message));
    };

    const clearThread = () => {
        setOpen(false);

        axios.delete(BACKEND + '/api/thread/clear', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: { threadId: thread._id }
        })
            .then(response => {
                if (!response.data.error) {
                    setAnswers({ ...answers, ...response.data });
                    toast.success("Cleared successfully");
                }
                if (response.data.error) throw Error(response.data.error?.message || 'Error');
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message));
    };

    const onBan = () => {
        if (banned) {
            axios.delete(BACKEND + '/api/ban/delete', {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                data: { userId: thread.author._id }
            })
                .then(response => {
                    if (!response.data.error) {
                        setBanned(false);
                    } else {
                        throw new Error(response.data.error?.message || 'Error');
                    }
                })
                .catch(err => {
                    toast.error(err.message === '[object Object]' ? 'Error' : err.message);
                });
        } else {
            setPostType({
                type: 'ban',
                id: thread.author._id,
                someData: {
                    body: ""
                }
            });
            setModalOpen(true);
        }
    }

    const reportThread = () => {
        // const id = type === 'answer' ? data.threadId : data._id
        setPostType({
            type: 'createReport',
            threadId: thread._id,
            postId: thread._id,
            someData: {
                body: ""
            }
        })

        setModalOpen(true)

        /* fetch(BACKEND + '/api/report/create', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                threadId: thread._id,
                postId: thread._id,
                body: thread.body
            })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    toast.success(Strings.reportSent[lang])
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message)) */
    }

    return (
        <>
            <hr className='border-grey my-2' />
            <div className='flex gap-6 justify-between'>
                <div className='flex gap-3 items-center'>
                    <button onClick={likeThread} className={'w-10 h-10 rounded-full flex items-center justify-center ' + (liked ? "bg-red/20 text-red" : "bg-grey/80")}>
                        <i className={'fi ' + (liked ? 'fi-sr-heart' : 'fi-rr-heart')}></i>
                    </button>
                    <p className='text-xl text-dark-grey'>{counter(thread.likes ? thread.likes.length : 0)} <span className='max-sm:hidden'>{declOfNum(thread.likes ? thread.likes.length : 0, Strings.like[lang], Strings.likes[lang])}</span></p>
                    <button onClick={() => setCommentsWrapper(preVal => !preVal)} className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                        <i className='fi fi-rr-comment-dots'></i>
                    </button>
                    <p className='text-xl text-dark-grey'>{counter(answers ? answers.length : 0)} <span className='max-sm:hidden'>{declOfNum(answers ? answers.length : 0, Strings.answer[lang], Strings.answers[lang])}</span></p>
                </div>

                <div className='flex gap-6 items-center'>
                    {
                        thread.author && thread === thread.author.name ?
                            <Link to={`/editor/${thread._id}`} className='underline hover:text-purple'>Edit</Link> : ""
                    }

                    {share &&
                        <Link to={`https://twitter.com/intent/tweet?text=Read ${thread.title}&url=${location.href}`}>
                            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                        </Link>
                    }

                    {dropdown && user &&
                        <Dropdown lang={lang} closed={open}>
                            {/* MODER AND ADMINSTRATOR INTERACT */}
                            {
                                user.role >= 2 && (
                                    <>
                                        <div onClick={pinThread} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                            {thread.pined ? <i class="fi fi-rr-thumbtack"></i> : <i class="fi fi-sr-thumbtack"></i>}
                                            {thread.pined ? Strings.unpin[lang] : Strings.pin[lang]}
                                        </div>

                                        <div onClick={closeThread} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                            {thread.closed ? <i class="fi fi-rr-lock"></i> : <i class="fi fi-sr-lock"></i>}
                                            {thread.closed ? Strings.open[lang] : Strings.close[lang]}
                                        </div>

                                        {user.role >= thread.author.role && (
                                            <div onClick={() => setOpen(true)} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                                <i class="fi fi-rs-trash"></i>
                                                {Strings.deleteAllAnswers[lang]}
                                            </div>
                                        )}
                                        {thread.author.name !== 'deleted' && user.id !== thread.author._id && thread.author.role === 1 && (
                                            <div onClick={onBan} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                                <i class="fi fi-rr-ban"></i>
                                                {banned ? Strings.unbanUser[lang] : Strings.banUser[lang]}
                                            </div>
                                        )}
                                    </>

                                )
                            }

                            {/* DEFAULT INTERACT */}
                            {
                                (user.role > thread.author.role || user.id === thread.author._id) &&
                                <div onClick={deleteThread} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                    <i class="fi fi-rr-trash"></i>
                                    {Strings.delete[lang]}
                                </div>
                            }

                            {
                                (user.id === thread.author._id || (user.role >= 2 && user.role >= thread.author.role)) &&
                                <Link to={`/editor/thread/${thread._id}`} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                    <i class="fi fi-rr-pencil"></i>
                                    {Strings.edit[lang]}
                                </Link>
                            }

                            {
                                user.id === thread.author._id && user.role === 1 &&
                                <div onClick={closeThread} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                    {thread.closed ? <i class="fi fi-rr-lock"></i> : <i class="fi fi-sr-lock"></i>}
                                    {thread.closed ? Strings.open[lang] : Strings.close[lang]}
                                </div>

                            }

                            {
                                user.id !== thread.author._id &&
                                <div onClick={reportThread} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                    <i class="fi fi-rr-megaphone"></i>
                                    {Strings.report[lang]}
                                </div>

                            }
                        </Dropdown>}
                </div>
            </div>

            <DeletePopup open={open} close={() => setOpen(false)} onConfirmed={clearThread} title="Clear" body="Clear answer" lang={lang} />
            <hr className='border-grey my-2' />
        </>
    )
}

export default BlogInteraction