import React, { useContext, useState } from 'react'
import { UserContext } from '../App'
import toast from 'react-hot-toast'
import CommentField from './comment-field.component'
import { BlogContext } from '../pages/blog.page'
import axios from 'axios'
import { StoreContext } from '@/stores/Store'
import Avatar from 'boring-avatars'
import { ThreadContext } from '@/pages/Forum/Thread/index_test'
import { dateFormat } from '@/support/Utils'
import { BACKEND, Strings } from '@/support/Constants'
import { AttachCard } from './Card/Card2'

const CommentCard = ({ index, leftVal, answerData }) => {
  const { user, lang, token } = useContext(StoreContext)
  const { thread, answers, setAnswers } = useContext(ThreadContext)

  const [isReplying, setReplying] = useState(false)
  const [isEditing, setEditing] = useState(false)

  const handleReplyClick = () => {
    if (!user) {
      return toast.error("Login first to leave a reply")
    }
    setReplying(prev => !prev)
    if (isEditing === true) {
      setEditing(prev => !prev)
    }
  }

  const handleEditingClick = () => {
    if (!user) {
      return toast.error("Login first to leave a reply")
    }
    setEditing(prev => !prev)
    if (isReplying === true) {
      setReplying(prev => !prev)
    }
  }

  const deleteAnswer = () => {
    fetch(BACKEND + '/api/answer/delete', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answerId: answerData._id })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) throw Error(data.error?.message || 'Error')
        toast.success('Deleted successfully')
        setAnswers(answers.filter(a => a._id !== answerData._id));
      })
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
  }

  return (
    <div className='w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className='my-5 p-6 rounded-md border border-grey' key={index}>
        <div className='flex gap-3 items-center mb-8 '>
          <Avatar
            size={30}
            name={answerData.author?.name}
            variant="marble"
            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
          />
          <p className='line-clamp-1'>{answerData.author?.name} @{answerData.author?.name}</p>
          <p className='min-w-fit'>{dateFormat(answerData.createdAt)}</p>
        </div>

        <p className='text-xl font-gelasio ml-3'>{answerData.body}</p>

        {answerData.attach && <AttachCard data={answerData} />}

        <div className='flex gap-5 items-center justify-between mt-5'>
          {!leftVal && <button onClick={handleReplyClick} className={`${isReplying && 'text-purple'} hover:text-purple`}>{Strings.reply[lang]}</button>}

          <div className='flex gap-2 ml-auto'>
            {
              user?.name === answerData.author?.name ?
                <button onClick={handleEditingClick} className='p-2 px-3 rounded-md border border-grey ml-auto hover:bg-sky-500/30 hover:text-sky-500 flex items-center'>
                  <i class="fi fi-rr-pencil" title={Strings.edit[lang]}></i>
                </button>
                : ""
            }

            {
              user?.name === answerData.author?.name ||
                user?.name === thread.author.name ?
                <button onClick={deleteAnswer} className='p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center'>
                  <i className='fi fi-rr-trash pointer-events-auto' title={Strings.delete[lang]}></i>
                </button>
                : ""
            }
          </div>
        </div>

        {
          isReplying ?
            <div className='mt-8'>
              <CommentField action={Strings.reply[lang]} index={index} replyingTo={answerData._id} setReplying={setReplying} />
            </div> : ""
        }

        {
          isEditing ?
            <div className='mt-8'>
              <CommentField action={Strings.edit[lang]} index={index} replyingTo={answerData._id} setReplying={setReplying} placeholder={"Chỉnh sửa bình luận"} defaultValue={answerData.body} type="editing" />
            </div> : ""
        }
      </div>
    </div>
  )
}

export default CommentCard