import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'
import { ThreadContext } from '@/pages/Forum/Thread/index_test';
import { counter, declOfNum } from '@/support/Utils';
import { BACKEND, Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';

const BlogInteraction = () => {
    const threadContextData = useContext(ThreadContext);
    const { user, lang, token } = useContext(StoreContext)
    const { thread, likes, setLikes, liked, setLiked, setCommentsWrapper, answers } = threadContextData

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
                    <Link to={`https://twitter.com/intent/tweet?text=Read ${thread.title}&url=${location.href}`}><i className="fi fi-brands-twitter text-xl hover:text-twitter"></i></Link>
                </div>
            </div>

            <hr className='border-grey my-2' />
        </>
    )
}

export default BlogInteraction