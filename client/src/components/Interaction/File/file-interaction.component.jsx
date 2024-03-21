import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'
import { counter, declOfNum } from '@/support/Utils';
import { BACKEND, Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import Dropdown from '../../Dropdown';
import { FileContext } from '@/pages/Uploads/File/FilePage';
import { DeletePopup } from '../../ModalPopup';

const FileInteraction = ({ dropdown = false, share = false }) => {
    const { user, lang, token } = useContext(StoreContext)
    const { file, setFile, liked, setLiked, commentsWrapper, setCommentsWrapper, downloadsWrapper, setDownloadsWrapper, comment } = useContext(FileContext);
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const likeFile = () => {
        if (!user) {
            toast.error(Strings.pleaseLogin[lang])
            return
        }
        fetch(BACKEND + '/api/file/like', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId: file._id })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setFile(prev => ({ ...prev, likes: data.likes }))
                    setLiked(!liked)
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const onCopyLink = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success(Strings.linkCopied[lang]))
            .catch(err => toast.error(Strings.failedToCopyLink[lang]))
    }

    const deleteFile = () => {
        const conf = window.confirm(`${Strings.delete[lang]}?`)

        if (!conf) return

        fetch(BACKEND + '/api/file/delete', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    toast.success(data.message)
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message))
    }

    const editFile = () => {
        fetch(`${BACKEND}/api/file/edit`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileId: fileValues.folderId,
                title: fileValues.title,
                body: fileValues.body
            })
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false)
                if (!data.error) {
                    close()
                    setPostType({
                        type: 'upload',
                        id: null
                    })
                } else throw Error(data.error?.message || 'Error')
            })
            .catch(err => {
                setLoading(false)
                setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message })
            })
    }

    const handleCommentsWrapper = () => {
        if (downloadsWrapper === true) return
        else { setCommentsWrapper(prev => !prev) }
    }

    const handleDownloadsWrapper = () => {
        if (commentsWrapper === true) return
        else { setDownloadsWrapper(prev => !prev) }
    }

    return (
        <>
            <Toaster />
            <hr className='border-grey my-2' />
            <div className='flex gap-6 justify-between'>
                <div className='flex gap-3 items-center'>
                    <button onClick={likeFile} className={'w-10 h-10 rounded-full flex items-center justify-center ' + (liked ? "bg-red/20 text-red" : "bg-grey/80")}>
                        <i className={'fi ' + (liked ? 'fi-sr-heart' : 'fi-rr-heart')}></i>
                    </button>
                    <p className='text-xl text-dark-grey'>{counter(file.likes ? file.likes.length : 0)} <span className='max-sm:hidden'>{declOfNum(file.likes ? file.likes.length : 0, Strings.like[lang], Strings.likes[lang])}</span></p>

                    <button onClick={handleCommentsWrapper} className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                        <i className='fi fi-rr-comment-dots'></i>
                    </button>
                    <p className='text-xl text-dark-grey'>{counter(comment ? comment.length : 0)} <span className='max-sm:hidden'>{declOfNum(comment ? comment.length : 0, Strings.answer[lang], Strings.answers[lang])}</span></p>

                    <button onClick={handleDownloadsWrapper} className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                        <i class="fi fi-rr-download"></i>
                    </button>
                    <p className='text-xl text-dark-grey'>{counter(file.downloads ? file.downloads : 0)} <span className='max-sm:hidden'>{declOfNum(file.downloads ? file.downloads.length : 0, Strings.download[lang], Strings.downloads[lang])}</span></p>
                </div>

                <div className='flex gap-6 items-center'>
                    {share &&
                        <Link to={`https://twitter.com/intent/tweet?text=Read ${file.title}&url=${location.href}`}>
                            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                        </Link>
                    }

                    {dropdown && user &&
                        <Dropdown lang={lang} closed={open}>
                            <div onClick={() => onCopyLink(BACKEND + file.file.url)} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                <i class="fi fi-rr-copy-alt"></i>
                                {Strings.copyFileLink[lang]}
                            </div>

                            {user.role >= 2 && (
                                <div onClick={() => deleteFile()} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                    <i class="fi fi-rr-trash"></i>
                                    {Strings.delete[lang]}
                                </div>
                            )}

                            {user.id === file.author?._id || user.role >= 2 ? (
                                <Link to={`/editor/file/${file._id}`} className="flex gap-3 items-center px-4 py-2 text-sm text-dark-grey rounded-md cursor-pointer hover:bg-dark-grey/60 hover:text-black">
                                    <i class="fi fi-rr-pencil"></i>
                                    {Strings.edit[lang]}
                                </Link>
                            ) : null}
                        </Dropdown>}
                </div>
            </div>

            <DeletePopup open={open} close={() => setOpen(false)} onConfirmed={editFile} title="Edit File" body="Delete file?" lang={lang} />
            <hr className='border-grey my-2' />
        </>
    )
}

export default FileInteraction