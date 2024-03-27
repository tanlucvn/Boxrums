import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { StoreContext } from '@/stores/Store';

import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';

import DataView from '@/components/DataView';
import { AuthHistoryCard } from '@/components/Card/Card2';

const AuthHistory = ({ userData }) => {
    const { user, lang } = useContext(StoreContext)
    document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.authorizationsHistory[lang]
    const navigate = useNavigate()

    useEffect(() => {
        if (user.role === 1) {
            if (user.id !== userData._id) {
                navigate('/user/' + userData.name)
            }
        }
        // eslint-disable-next-line
    }, [])

    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'user/authHistory', params: { userId: userData._id }, auth: true })

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={AuthHistoryCard}
            noDataMessage={Strings.userHasNotLoggedInYet[lang]}
            errorMessage={Strings.unableToDisplayAuthorizationsHistory[lang]}
        />
    )
}

export default AuthHistory;