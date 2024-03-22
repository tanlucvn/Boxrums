import React, { useContext, useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { BACKEND, Strings } from '@/support/Constants'
import { StoreContext } from '@/stores/Store'
import { FileContext } from '@/pages/Uploads/File'

const FileCommentField = ({ action, index = undefined, replyingTo = undefined, setReplying, placeholder, defaultValue, type }) => {
    const { user, token, lang } = useContext(StoreContext)
    const { file, comment, setComment } = useContext(FileContext)
    const [commentField, setCommentField] = useState("")

    const createComment = () => {
        if (!user) {
            return toast.error(Strings.pleaseLoginToAnswer[lang])
        }

        if (!commentField.length) {
            return toast.error(Strings.writeSomething[lang])
        }

        fetch(BACKEND + '/api/file/comment/create', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileId: file._id,
                body: commentField.substring(0, 1000),
                commentedTo: replyingTo ? replyingTo : null
            })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setComment([...comment, data])
                    setCommentField("");
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => {
                // setLoading(false)
                // setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message })
            })
    }

    return (
        <>
            <Toaster />

            <textarea
                value={commentField}
                onChange={(e) => setCommentField(e.target.value)}
                placeholder={placeholder ? placeholder : Strings.leaveAnComment[lang]}
                className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
            >
            </textarea>

            <button className='btn-dark mt-5 px-10' onClick={createComment}>{action}</button>
        </>
    )
}

export default FileCommentField