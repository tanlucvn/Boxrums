import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import NotificationCommentField from './notification-comment-field.component';
import Avatar from 'boring-avatars'
import { dateFormat } from '@/support/Utils';
import { Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';

const NotificationCard = ({ data, index, notificationState }) => {
    const { lang } = useContext(StoreContext)
    const [isReplying, setRepling] = useState(false)

    const handleReplyClick = () => {
        setRepling(preVal => !preVal)
    }
    return (
        <div className={'p-6 border-b border-grey border-l-black ' + (!data.read ? 'border-l-2' : '')}>
            <div className='flex gap-5 mb-3'>
                <div className='w-14 h-14 flex-none'>
                    <Avatar
                        size={'100%'}
                        name={data.from.name}
                        variant="marble"
                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                    />
                </div>
                <div className='w-full '>
                    <h1 className='text-xl font-medium text-dark-grey'>
                        <span className='lg:inline-block hidden capitalize'>{data.from.displayName}</span>
                        <Link className='mx-1 text-black underline' to={`/user/${data.from.name}`}>@{data.from.name}</Link>
                        <span className='font-normal'>
                            {
                                data.type === 'likeThread' && Strings.likeThread[lang]
                            }

                            {
                                data.type === 'likeAnswer' && Strings.likeAnswer[lang]
                            }

                            {
                                data.type === 'likeComment' && Strings.likeComment[lang]
                            }

                            {
                                data.type === 'answerToThread' && Strings.answerToThread[lang]
                            }

                            {
                                data.type === 'answerToAnswer' && Strings.answerToAnswer[lang]
                            }

                            {
                                data.type === "commentToFile" && Strings.commentToFile[lang]
                            }

                            {
                                data.type === 'commentToComment' && Strings.commentToComment[lang]
                            }
                        </span>
                    </h1>


                    {/* NAVIGATE TO PAGE */}
                    {/* THREAD */}
                    {(data.type === "answerToThread" || data.type === "answerToAnswer" || data.type === "likeThread" || data.type === "likeAnswer") &&
                        <Link to={`/thread/${data.pageId}`}
                            className='font-medium text-dark-grey hover:underline line-clamp-1'
                        >
                            {`"${data.title}"`}
                        </Link>
                    }
                    {/* UPLOADS */}
                    {(data.type === "commentToComment" || data.type === "commentToFile" || data.type === 'likeComment') &&
                        <Link to={`/file/${data.pageId}`}
                            className='font-medium text-dark-grey hover:underline line-clamp-1'
                        >
                            {`"${data.title}"`}
                        </Link>
                    }


                    {/* BODY */}
                    {(data.type !== 'likeThread' && data.type !== "likeAnswer" && data.type !== 'likeComment') &&
                        <div className='p-4 mt-4 rounded-md bg-grey'>
                            <p>{data.body}</p>
                        </div>
                    }
                </div>
            </div>

            <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
                <p>{dateFormat(data.createdAt)}</p>

                {
                    (data.type !== 'likeThread' && data.type !== "likeAnswer" && data.type !== 'likeComment') &&
                    <>
                        {/* {
                                !reply && <button onClick={handleReplyClick} className='underline hover:text-black'>Reply</button>
                            } */}

                        {/* <button onClick={handleReplyClick} className='underline hover:text-black'>Reply</button> */}
                    </>
                }
            </div>

            {
                isReplying ?
                    <div className='mt-8'>
                        <NotificationCommentField _id={data._id} blog_author={data.from} index={index} replyingTo={data._id} setReplying={setRepling} notification_id={data._id} notificationData={notificationState} />
                    </div>
                    : ""
            }

            {/* {
                reply ?
                    <div className='ml-20 p-5 bg-grey mt-5 rounded-md '>
                        <div className='flex gap-3 mb-3'>
                            <img src={author_profile_img} alt="" className='w-8 h-8 rounded-full' />
                            <div>
                                <h1 className='font-medium text-xl text-dark-grey'>
                                    <Link className='mx-1 text-black underline' to={`/user/${author_username}`}>
                                        @{author_username}
                                    </Link>
                                    <span className='font-normal'>replied to</span>
                                    <Link className='mx-1 text-black underline' to={`/user/${username}`}>
                                        @{username}
                                    </Link>
                                </h1>
                            </div>
                        </div>
                        <p className='ml-14 font-gelasio text-xl my-2'>{reply.comment}</p>

                        <button onClick={(e) => handleDeleteClick(comment._id, 'reply', e.target)} className='ml-14 mt-2 underline hover:text-black'>Delete</button>
                    </div>
                    : ""
            } */}
        </div>
    )
}

export default NotificationCard