import { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { StoreContext } from '@/stores/Store';

import { BACKEND, Strings } from '@/support/Constants';

import { Section } from '@/components/Section';
import Loader from '@/components/Loader';
import Errorer from '@/components/Errorer';

import Items from './Items';

const Folder = ({ match }) => {
    const { setPostType, setFabVisible, lang } = useContext(StoreContext)
    const { folderName } = useParams();
    const [init, setInit] = useState(true)
    const [folder, setFolder] = useState({})
    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)

    useEffect(() => {
        setFabVisible(true)
        setPostType({
            type: 'upload',
            id: folder._id || null
        })
        // eslint-disable-next-line
    }, [folder])

    useEffect(() => {
        const folderFullName = folder.title || Strings.folder[lang]
        document.title = 'Forum | ' + folderFullName
        const fetchFolder = async () => {
            try {
                const data = await fetch(`${BACKEND}/api/folder?name=${folderName}`)
                const response = await data.json()

                if (!response.error) {
                    setInit(false)
                    setFolder(response)
                    setLoading(false)
                    setNoData(false)
                } else throw Error(response.error?.message || 'Error')
            } catch (err) {
                setInit(false)
                setNoData(true)
                setLoading(false)
            }
        }

        init && fetchFolder()
    }, [init, folder, folderName, lang])

    console.log(folder)

    return (
        <Section>
            {!noData ? (
                !loading
                    ? <Items folderId={folder._id} lang={lang} />
                    : <Loader />
            ) : (
                <Errorer message={Strings.unableToDisplayFolder[lang]} />
            )}
        </Section>
    )
}

export default Folder;