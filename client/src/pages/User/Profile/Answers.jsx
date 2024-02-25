import { useContext } from 'react';

import { StoreContext } from '@/stores/Store';

import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';

import DataView from '@/components/DataView';
import { Card } from '@/components/Card';

const Answers = ({ userData }) => {
    const { lang } = useContext(StoreContext)
    document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.answers[lang]

    const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'user/answers', params: { userId: userData.id ? userData.id : userData._id }, auth: true })

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={(props) => <Card {...props} preview type="answer" />}
            noDataMessage={Strings.noAnswersYet[lang]}
            errorMessage={Strings.unableToDisplayAnswers[lang]}
        />
    )
}

export default Answers;