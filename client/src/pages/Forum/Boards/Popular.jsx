import { useMoreFetch } from '@/hooks/useMoreFetch';

import DataView from '@/components/DataView';
import { BoardsCard } from '@/components/Card/Card2';

export default function Popular({ lang }) {
    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'boards', sort: 'popular' })

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={BoardsCard}
            noDataMessage={"no boards yet"}
            errorMessage={"unable to display Boards"}
        />
    )
}