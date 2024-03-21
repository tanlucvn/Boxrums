import { useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/stores/Store';

import { Section } from '@/components/Section';
import SortNav from '@/components/SortNav';

import All from './All';
import Popular from './Popular';
import NewestAnswer from './NewestAnswer';
import NewestThread from './NewestThread';
import Answers from './Answers';
import { Strings } from '@/support/Constants';

export default function Boards() {
    const { setPostType, setFabVisible, lang } = useContext(StoreContext)
    const [init, setInit] = useState(true)
    const [sort, setSort] = useState('all')

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
                { title: Strings.all[lang], sort: 'all' },
                { title: Strings.popular[lang], sort: 'popular' },
                { title: Strings.newestAnswer[lang], sort: 'newestanswer' },
                { title: Strings.newestThread[lang], sort: 'newestthread' },
                { title: Strings.byAnswersCount[lang], sort: 'answers' }
            ]} setSort={setSort} state={sort} />

            {sort === 'popular' && <Popular lang={lang} />}
            {sort === 'newestanswer' && <NewestAnswer lang={lang} />}
            {sort === 'newestthread' && <NewestThread lang={lang} />}
            {sort === 'answers' && <Answers lang={lang} />}
            {sort === 'all' && <All lang={lang} />}
        </Section>
    )
}