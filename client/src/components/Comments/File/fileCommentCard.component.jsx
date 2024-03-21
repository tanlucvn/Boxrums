import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { StoreContext } from '@/stores/Store'
import Avatar from 'boring-avatars'
import { counter, dateFormat } from '@/support/Utils'
import { BACKEND, Strings } from '@/support/Constants'
import { AttachCard } from '../../Card/Card2'
import FileCommentField from './fileCommentField.component'
import { FileContext } from '@/pages/Uploads/File/FilePage'
import axios from 'axios'

const FileCommentCard = ({ index, leftVal, commentData }) => {
    const { user, lang, token } = useContext(StoreContext)
    const { file, comment, setComment } = useContext(FileContext)
    const [likes, setLikes] = useState(commentData.likes)
    const [liked, setLiked] = useState(user ? !!commentData.likes.find(i => i._id === user.id) : false)

    const [isReplying, setReplying] = useState(false)

    useEffect(() => {
        setLikes(commentData.likes)
        setLiked(user ? !!commentData.likes?.find(i => i._id === user.id) : false)
    }, [user, commentData.likes])

    const handleReplyClick = () => {
        if (!user) {
            return toast.error("Login first to leave a reply")
        }
        setReplying(prev => !prev)
    }

    const deleteComment = () => {
        fetch(BACKEND + '/api/file/comment/delete', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commentId: commentData._id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) throw Error(data.error?.message || 'Error')
                toast.success('Deleted successfully')
                setComment(comment.filter(a => a._id !== commentData._id));
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const likeComment = () => {
        axios.put(BACKEND + '/api/file/comment/like', { commentId: commentData._id }, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    setLikes(data.likes);
                    setLiked(user ? !!data.likes?.find(i => i._id === user.id) : false);
                } else {
                    throw Error(data.error?.message || 'Error');
                }
            })
            .catch(err => {
                toast.error(err.message === '[object Object]' ? 'Error' : err.message);
            });
    };

    return (
        <div className='w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className='my-5 p-6 rounded-md border border-grey' key={index}>
                <div className='flex gap-3 items-center mb-8 '>
                    <Avatar
                        size={30}
                        name={commentData.author?.name}
                        variant="marble"
                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                    />
                    <p className='line-clamp-1'>{commentData.author?.name} @{commentData.author?.name}</p>
                    <p className='min-w-fit'>{dateFormat(commentData.createdAt)}</p>
                </div>

                <p className='text-xl ml-3'>{commentData.body}</p>

                {commentData.attach && <AttachCard data={commentData} />}

                <div className='flex gap-5 items-center justify-between mt-5'>
                    {!leftVal && <button onClick={handleReplyClick} className={`${isReplying && 'text-purple'} hover:text-purple`}>{Strings.reply[lang]}</button>}

                    <div className='flex gap-3 items-center'>
                        <button onClick={likeComment} className={'w-10 h-10 rounded-full flex items-center justify-center ' + (liked ? "bg-red/20 text-red" : "bg-grey/80")}>
                            <i className={'fi ' + (liked ? 'fi-sr-heart' : 'fi-rr-heart')}></i>
                        </button>
                        <p className='text-xl text-dark-grey'>{counter(likes ? likes.length : 0)}</p>
                    </div>

                    <div className='flex gap-2 ml-auto'>
                        {
                            user?.name === commentData.author?.name ||
                                user?.name === file.author.name ?
                                <button onClick={deleteComment} className='p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center'>
                                    <i className='fi fi-rr-trash pointer-events-auto' title={Strings.delete[lang]}></i>
                                </button>
                                : ""
                        }
                    </div>
                </div>

                {
                    isReplying ?
                        <div className='mt-8'>
                            <FileCommentField action={Strings.reply[lang]} index={index} replyingTo={commentData._id} setReplying={setReplying} />
                        </div> : ""
                }
            </div>
        </div>
    )
}

export default FileCommentCard