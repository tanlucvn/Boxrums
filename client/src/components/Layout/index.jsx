import React, { useContext, useEffect } from 'react'
import Navbar from './Navbar'
import { Toaster } from 'react-hot-toast'
import { StoreContext } from '@/stores/Store'
import Modal from '../Modal'

export default function Layout() {
    const { user, token, modalOpen, setModalOpen, postType, setPostType, fab, lang } = useContext(StoreContext)

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

    return (
        <>
            <Navbar />
            <Toaster />
            {user && modalOpen && <Modal open={modalOpen} close={modalClose} />}
        </>
    )
}
