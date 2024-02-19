import { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/stores/Store';

import { BACKEND, Strings } from '@/support/Constants';

import { Section } from '@/components/Section';
import Loader from '@/components/Loader';
import Errorer from '@/components/Errorer';

import FileContent from './FileContent';
import Comments from './Comments';

const File = ({ history, match }) => {
    const { user, token, setPostType, setFabVisible, setModalOpen, lang } = useContext(StoreContext)
    const [init, setInit] = useState(true)
    const { fileId } = useParams()

    useEffect(() => {
        if (init) {
            setFabVisible(false)
            setPostType({
                type: 'upload',
                id: null
            })
        }
        setInit(false)
        // eslint-disable-next-line
    }, [init])

    const [folder, setFolder] = useState({})
    const [file, setFile] = useState({})
    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)
    const [onModeration, setOnModeration] = useState(false)
    const [commentsSubscribed, setCommentsSubscribed] = useState({})

    useEffect(() => {
        const fileTitle = file.title || Strings.file[lang]
        document.title = 'Forum | ' + fileTitle
    }, [file, lang])

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const data = await fetch(`${BACKEND}/api/file?fileId=${fileId}`)
                const response = await data.json()

                if (!response.error) {
                    setFolder(response.folder)
                    if (!response.message) {
                        setFile(response.file)
                        setNoData(false)
                    } else {
                        setOnModeration(true)
                        setNoData(true)
                    }
                    setLoading(false)
                } else throw Error(response.error?.message || 'Error')
            } catch (err) {
                setNoData(true)
                setLoading(false)
            }
        }

        fetchFile()
    }, [fileId])

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
        setPostType({
            type: 'fileEdit',
            id: fileId,
            someData: {
                title: file.title,
                body: file.body
            }
        })
        setModalOpen(true)
    }

    return (
        <Section>
            {!noData ? (
                !loading ? (
                    <>
                        <FileContent
                            data={file}
                            user={user}
                            token={token}
                            lang={lang}
                            deleteFile={deleteFile}
                            editFile={editFile}
                        />

                        <br />

                        <Comments
                            lang={lang}
                            user={user}
                            token={token}
                            fileId={file._id}
                            subcribed={commentsSubscribed}
                            clearSubcribe={setCommentsSubscribed}
                        />
                    </>
                ) : <Loader color="#64707d" />
            ) : (
                <>
                    <Errorer
                        message={onModeration ? Strings.theFileWillBePublishedAfterModeration[lang] : Strings.fileNotFound[lang]}
                    />
                </>
            )}
        </Section>
    )
}

export default File;