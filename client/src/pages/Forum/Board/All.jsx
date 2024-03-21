import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';

import DataView from '@/components/DataView';
import { ArticleCard } from '@/components/Card/Card2';

const All = ({ boardId, lang }) => {
    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'threads', params: { boardId } })

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

export default All;