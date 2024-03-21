import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';

import DataView from '@/components/DataView';
import { ArticleCard } from '@/components/Card/Card2';

const Recently = ({ boardId, lang }) => {
    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'threads', params: { boardId }, sort: 'newestAnswer' })

    const previewArticleCard = (item) => {
        return <ArticleCard {...item} preview="true" type="newestAnswer" />;
    };

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={previewArticleCard}
            noDataMessage={Strings.noThreadsYet[lang]}
            errorMessage={Strings.unableToDisplayThreads[lang]}
        />
    )
}

export default Recently;