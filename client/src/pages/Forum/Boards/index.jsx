import { useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/stores/Store';

import { Section } from '@/components/Section';
import SortNav from '@/components/SortNav';

import Default from './Default';
import Popular from './Popular';
import NewestAnswer from './NewestAnswer';
import NewestThread from './NewestThread';
import Answers from './Answers';

export default function Boards() {
    const { setPostType, setFabVisible, lang } = useContext(StoreContext)
    const [init, setInit] = useState(true)
    const [sort, setSort] = useState('default')

    useEffect(() => {
        if (init) {
            setFabVisible(true)
            setPostType({
                type: 'thread',
                id: null
            })
        }
        setInit(false)
        // eslint-disable-next-line
    }, [init])

    return (
        <Section>
            <SortNav links={[
                { title: "Default", sort: 'default' },
                { title: "Popular", sort: 'popular' },
                { title: "recentlyAnswered", sort: 'newestanswer' },
                { title: "byNewest", sort: 'newestthread' },
                { title: "byAnswersCount", sort: 'answers' }
            ]} setSort={setSort} state={sort} />

            {sort === 'popular' && <Popular lang={lang} />}
            {sort === 'newestanswer' && <NewestAnswer lang={lang} />}
            {sort === 'newestthread' && <NewestThread lang={lang} />}
            {sort === 'answers' && <Answers lang={lang} />}
            {sort === 'default' && <Default lang={lang} />}
        </Section>
    )
}