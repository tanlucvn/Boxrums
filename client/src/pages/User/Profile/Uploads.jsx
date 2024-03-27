import { useContext } from 'react';

import { StoreContext } from '@/stores/Store';

import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';

import DataView from '@/components/DataView';
import { FileCard } from '@/components/Card/Card2';

const Uploads = ({ userData }) => {
    const { user, lang } = useContext(StoreContext)
    document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.threads[lang]

    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'user/uploads', params: { userId: user.id === userData.id ? userData.id : userData._id }, auth: true })

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={FileCard}
            noDataMessage={Strings.noThreadsYet[lang]}
            errorMessage={Strings.unableToDisplayThreads[lang]}
        />
    )
}

export default Uploads;