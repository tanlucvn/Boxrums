import React, { createContext, useContext, useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import FileUploadForm from './Form/FileUploadForm'
import { BACKEND, Strings } from '@/support/Constants'
import { StoreContext } from '@/stores/Store'
import { ThreadContext } from '@/pages/Forum/Thread'
import { AIWriter } from './ModalPopup'

export const SentenceContext = createContext({});
const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying, placeholder, defaultValue, type }) => {
  const { user, token, lang } = useContext(StoreContext)
  const { thread, answers, setAnswers } = useContext(ThreadContext)
  const [open, setOpen] = useState(false)
  const [stc, setStc] = useState()
  const [comment, setComment] = useState(stc ? stc : "")

  const [files, setFiles] = useState([])
  const [clearFiles, setClearFiles] = useState(false)

  const createAnswer = () => {
    if (!user) {
      return toast.error(Strings.pleaseLoginToAnswer[lang])
    }

    if (!comment.length) {
      return toast.error(Strings.writeSomething[lang])
    }

    const formData = new FormData()
    files.map(item => formData.append('attach', item))

    formData.append('threadId', thread._id)
    formData.append('body', comment.substring(0, 1000))
    if (replyingTo) { formData.append('answeredTo', replyingTo) }

    fetch(BACKEND + '/api/answer/create', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setAnswers([...answers, data])
          setComment("");
          setFiles([])
          setClearFiles(true)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        // setLoading(false)
        // setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message })
      })
  }

  const editAnswer = () => {
    if (!user) {
      return toast.error(Strings.pleaseLoginToAnswer[lang])
    }

    if (!comment.length) {
      return toast.error(Strings.writeSomething[lang])
    }

    const formData = new FormData()
    files.map(item => formData.append('attach', item))

    formData.append('body', comment.substring(0, 1000))
    if (replyingTo) { formData.append('answerId', replyingTo) }

    fetch(BACKEND + '/api/answer/edit', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          // Find the index of the existing answer in the answers array
          const existingAnswerIndex = answers.findIndex(answer => answer._id === data._id);

          // If the answer is found, update it; otherwise, do nothing
          if (existingAnswerIndex !== -1) {
            const updatedAnswers = [...answers];
            updatedAnswers[existingAnswerIndex] = data;
            setAnswers(updatedAnswers);
          }

          setComment("");
          setFiles([]);
          setClearFiles(true);
        } else throw Error(data.error?.message || 'Error');
      })
      .catch(err => {
        // setLoading(false)
        // setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message })
      })
  }


  const getFile = (files) => {
    setClearFiles(false)
    setFiles(files)
  }

  useEffect(() => {
    if (clearFiles) {
      setFiles([])
    }
  }, [clearFiles])

  useEffect(() => {
    if (stc) {
      setComment(stc);
      setStc("")
    }
  }, [stc]);
  return (
    <SentenceContext.Provider value={{ stc, setStc }}>
      <Toaster />
      <button
        className="relative flex items-center justify-center font-medium gap-3 border-2 border-grey my-5 px-4 py-2 w-max min-w-[20px] h-9 text-black bg-transparent text-sm rounded-md cursor-pointer select-none"
        onClick={() => setOpen(true)}
        title={Strings.aiWriter[lang]}
      >
        <i class="fi fi-rr-magic-wand"></i>
        <p>{Strings.aiWriter[lang]}</p>
      </button>

      <AIWriter open={open} close={() => setOpen(false)} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={placeholder ? placeholder : Strings.leaveAnComment[lang]}
        className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
      >
      </textarea>
      <FileUploadForm
        sendFiles={getFile}
        clearFiles={clearFiles}
      />
      <button className='btn-dark mt-5 px-10' onClick={type === "editing" ? editAnswer : createAnswer}>{action}</button>
    </SentenceContext.Provider>
  )
}

export default CommentField