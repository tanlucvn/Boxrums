import { useMoreFetch } from '@/hooks/useMoreFetch';

import DataView from '@/components/DataView';
import { BoardCard } from '@/components/Card';

export default function Default({ lang }) {
    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'boards' })

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={BoardCard}
            noDataMessage={"no boards yet"}
            errorMessage={"unable to display Boards"}
        />
    )
}