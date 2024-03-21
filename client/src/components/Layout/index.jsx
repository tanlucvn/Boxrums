import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Toaster, toast } from 'react-hot-toast'
import { StoreContext } from '@/stores/Store'
import Modal from '../Modal'
import { ThemeContext } from '@/App'
import Socket, { joinToRoom, leaveFromRoom } from '@/support/Socket'
import Avatar from 'boring-avatars'
import { dateFormat } from '@/support/Utils'
import { BACKEND, Strings } from '@/support/Constants'

export default function Layout() {
    const { user, token, modalOpen, setModalOpen, postType, setPostType, fab, lang } = useContext(StoreContext)
    const { theme } = useContext(ThemeContext)
    const [onlineIndicator, setOnlineIndicator] = useState(0)

    useEffect(() => {
        if (modalOpen) {
            document.body.classList.add('noscroll')
        } else {
            document.body.classList.remove('noscroll')
        }
    }, [modalOpen])

    const modalClose = () => {
        if (
            postType.type === 'answer' ||
            postType.type === 'answerEdit' ||
            postType.type === 'userThreadEdit' ||
            postType.type === 'adminThreadEdit'
        ) {
            setPostType({
                type: 'answer',
                id: postType.id
            })
        }
        if (postType.type === 'fileEdit') {
            setPostType({
                type: 'upload',
                id: null
            })
        }
        setModalOpen(false)
    }

    useEffect(() => {
        joinToRoom('notification:' + user?.id, { token })
        return () => {
            leaveFromRoom('notification:' + user?.id)
        }
    }, [user?.id, token])

    useEffect(() => {
        Socket.on('newNotification', (data) => {
            console.log("new", data)
            toast.custom((t) => (
                <div id="toast-notification" class="w-full max-w-xs p-4 bg-grey rounded-lg shadow" role="alert">
                    <div class="flex items-center mb-3">
                        <span class="mb-1 text-sm font-semibold">{Strings.newNotification[lang]}</span>
                    </div>
                    <div class="flex items-center">
                        <div class="relative inline-block shrink-0">
                            <div className='w-12 h-12'>
                                <Avatar
                                    size={'100%'}
                                    name={data.from.name}
                                    variant="marble"
                                    colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                />
                            </div>
                        </div>
                        <div class="ms-3 text-sm font-normal">
                            <div class="text-sm font-semibold">{data.from.displayName}</div>
                            {data.type === "likeThread" && <div class="text-sm font-normal">{Strings.likeThread[lang]}</div>}
                            {data.type === "likeAnswer" && <div class="text-sm font-normal">{Strings.likeAnswer[lang]}</div>}
                            {data.type === "likeComment" && <div class="text-sm font-normal">{Strings.likeComment[lang]}</div>}
                            {data.type === "answerToThread" && <div class="text-sm font-normal">{Strings.answerToThread[lang]}</div>}
                            {data.type === "answerToAnswer" && <div class="text-sm font-normal">{Strings.answerToAnswer[lang]}</div>}
                            {data.type === "commentToFile" && <div class="text-sm font-normal">{Strings.commentToFile[lang]}</div>}
                            {data.type === "commentToComment" && <div class="text-sm font-normal">{Strings.commentToComment[lang]}</div>}
                            <span class="text-sm font-medium text-dark-grey/80">{dateFormat(data.createdAt)}</span>
                        </div>
                    </div>
                </div>
            ), {
                duration: 4000,
                position: 'bottom-right',
            });
        });
        // eslint-disable-next-line
    }, [user?.id])

    useEffect(() => {
        if (user) {
            updateLastSeen()
            setOnlineIndicator(setInterval(() => updateLastSeen(), 60000))
        }

        return () => {
            clearInterval(onlineIndicator)
        }
        // eslint-disable-next-line
    }, [user])

    const updateLastSeen = () => {
        fetch(BACKEND + '/api/profile/setOnline', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .catch(console.error)
    }

    return (
        <>
            <Navbar />
            <Toaster />

            {user && modalOpen && <Modal open={modalOpen} close={modalClose} />}
        </>
    )
}
