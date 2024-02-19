import { useMoreFetch } from 'hooks/useMoreFetch';

import { Strings } from 'utils/Constants';

import DataView from 'components/DataView';
import { Card } from 'components/Card';

const Default = ({ boardId, lang }) => {
    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'threads', params: { boardId } })

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={(props) => <Card {...props} preview />}
            noDataMessage={Strings.noThreadsYet[lang]}
            errorMessage={Strings.unableToDisplayThreads[lang]}
        />
    )
}

export default Default;