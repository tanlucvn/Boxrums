import React, { useContext } from 'react'
import CommentField from './comment-field.component'
import axios from 'axios';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';
import { ThreadContext } from '@/pages/Forum/Thread/index_test';
import { Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';

export const fetchComment = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {

}

const CommentContainer = () => {
    const { lang } = useContext(StoreContext)
    const { thread, answers, commentsWrapper, setCommentsWrapper } = useContext(ThreadContext)

    return (
        <div
            className={'max-sm:w-full fixed ' + (commentsWrapper ? 'top-0 sm:right-0' : "top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-7 overflow-y-auto overflow-x-hidden"}
        >
            <div className="relative">
                <h1 className='text-xl font-medium'>Comments</h1>
                <p className='text-lg mt-2 w-[70&] text-dark-grey line-clamp-1 '>{thread.title}</p>
                <button onClick={() => setCommentsWrapper(preVal => !preVal)} className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey'>
                    <i className='fi fi-br-cross text-2xl mt-1'></i>
                </button>
                <hr className='border-grey my-8 w-[120%] -ml-10' />
                <CommentField action={Strings.comment[lang]} />

                {
                    answers && answers.length ? (
                        answers.map((answer, i) => {
                            const replies = answers.filter(a => a.answeredTo === answer._id);
                            replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                            return (
                                <AnimationWrapper key={i}>
                                    {/* Default comment */}
                                    {!answer.answeredTo && <CommentCard index={i} answerData={answer} />}

                                    {/* Reply comment */}
                                    {replies.map((reply, j) => (
                                        <AnimationWrapper key={`reply_${j}`}>
                                            <CommentCard index={`reply_${j}`} leftVal={4} answerData={reply} />
                                        </AnimationWrapper>
                                    ))}
                                </AnimationWrapper>
                            );
                        })
                    ) : (
                        <NoDataMessage message={"No Comments"} />
                    )
                }



                {/* {
                    total_parent_comments > totalParentComentsLoaded ?
                        <button onClick={loadMoreComment} className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>
                            Load More
                        </button>
                        : ""
                } */}
            </div>
        </div>
    )
}

export default CommentContainer