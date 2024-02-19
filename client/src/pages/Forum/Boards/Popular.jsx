import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'utils/Constants';

import DataView from 'components/DataView';
import { BoardCard } from 'components/Card';

export default function Popular({ lang }) {
    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'boards', sort: 'popular' })

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