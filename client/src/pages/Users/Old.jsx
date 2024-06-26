import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';

import DataView from '@/components/DataView';
import { UserCard } from '@/components/Card/Card2';

const Old = ({ lang }) => {
    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'users', sort: 'old' })

    console.log("oldest")
    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={UserCard}
            noDataMessage={Strings.noUsersYet[lang]}
            errorMessage={Strings.unableToDisplayUsers[lang]}
        />
    )
}

export default Old;