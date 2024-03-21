import { useContext } from 'react';

import { StoreContext } from '@/stores/Store';

import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';

import DataView from '@/components/DataView';
import { ArticleCard } from '@/components/Card/Card2';

const Threads = ({ userData }) => {
    const { user, lang } = useContext(StoreContext)
    document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.threads[lang]

    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'user/threads', params: { userId: user.id === userData.id ? userData.id : userData._id }, auth: true })

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={ArticleCard}
            noDataMessage={Strings.noThreadsYet[lang]}
            errorMessage={Strings.unableToDisplayThreads[lang]}
        />
    )
}

export default Threads;