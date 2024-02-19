import { useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/stores/Store';

import { Strings } from '@/support/Constants';

import { Section } from '@/components/Section';

import Items from './Items';

const Folders = () => {
    const { setPostType, setFabVisible, lang } = useContext(StoreContext)
    document.title = 'Forum | ' + Strings.filesUploads[lang]
    const [init, setInit] = useState(true)

    useEffect(() => {
        if (init) {
            setFabVisible(true)
            setPostType({
                type: 'upload',
                id: null
            })
        }
        setInit(false)
        // eslint-disable-next-line
    }, [init])

    return (
        <Section>
            <Items lang={lang} />
        </Section>
    )
}

export default Folders;