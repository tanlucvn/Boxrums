import React, { useContext, useEffect } from 'react'
import NoDataMessage from '../../NoData';
import AnimationWrapper from '../../../common/page-animation';
import { Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import { FileContext } from '@/pages/Uploads/File/FilePage';
import FileCommentField from './fileCommentField.component';
import FileCommentCard from './fileCommentCard.component';

const FileCommentContainer = () => {
    const { user, lang } = useContext(StoreContext)
    const { file, comment, setComment, commentsWrapper, setCommentsWrapper, subscribed } = useContext(FileContext)

    useEffect(() => {
        if (!subscribed.type) return

        if (subscribed.type === 'commentCreated') {
            setComment(prev => [...prev, subscribed.payload])
            if (user && user.id === subscribed.payload.author._id) {
                window.scrollTo(0, document.body.scrollHeight)
            }
        }

        if (subscribed.type === 'commentDeleted') {
            setComment(prev => prev.filter(item => item._id !== subscribed.payload.id))
        }

        if (subscribed.type === 'commentLiked') {
            let newArray = [...comment]
            newArray[newArray.findIndex(item => item._id === subscribed.payload._id)] = subscribed.payload

            setComment(newArray)
        }
        // eslint-disable-next-line
    }, [setComment, subscribed, user])

    return (
        <div
            className={'max-sm:w-full fixed ' + (commentsWrapper ? 'top-0 sm:right-0' : "top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-7 overflow-y-auto overflow-x-hidden"}
        >
            <div className="relative">
                <h1 className='text-xl font-medium'>Comments</h1>
                <p className='text-lg mt-2 w-[70&] text-dark-grey line-clamp-1 '>{file.title}</p>
                <button onClick={() => setCommentsWrapper(preVal => !preVal)} className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey'>
                    <i className='fi fi-rr-cross text-2xl mt-1'></i>
                </button>
                <hr className='border-grey my-8 w-[120%] -ml-10' />
                <FileCommentField action={Strings.comment[lang]} />

                {
                    comment && comment.length ? (
                        comment.map((commentItem, i) => {
                            const replies = comment.filter(a => a.commentedTo === commentItem._id);
                            replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                            return (
                                <AnimationWrapper key={i}>
                                    {/* Default comment */}
                                    {!commentItem.commentedTo && <FileCommentCard index={i} commentData={commentItem} />}

                                    {/* Reply comment */}
                                    {replies.map((reply, j) => (
                                        <AnimationWrapper key={`reply_${j}`}>
                                            <FileCommentCard index={`reply_${j}`} leftVal={4} commentData={reply} />
                                        </AnimationWrapper>
                                    ))}
                                </AnimationWrapper>
                            );
                        })
                    ) : (
                        <NoDataMessage message={"No Comments"} />
                    )
                }
            </div>
        </div>
    )
}

export default FileCommentContainer