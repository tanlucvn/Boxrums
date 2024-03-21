import { useMoreFetch } from '@/hooks/useMoreFetch';

import DataView from '@/components/DataView';
import { BoardsCard } from '@/components/Card/Card2';

export default function NewestAnswer() {
    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'boards', sort: 'newestAnswer' })

    const previewBoardsCard = (item) => {
        return <BoardsCard {...item} preview="true" type="newestAnswer" />;
    };

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={previewBoardsCard}
            noDataMessage={"no boards yet"}
            errorMessage={"unable to display Boards"}
        />
    )
}