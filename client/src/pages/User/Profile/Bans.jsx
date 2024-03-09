import { useContext, useEffect } from 'react';
import { StoreContext } from '@/stores/Store';
import { useMoreFetch } from '@/hooks/useMoreFetch';
import { Strings } from '@/support/Constants';
import DataView from '@/components/DataView';
import { BannedAll } from '@/components/Card/Card2';

const Bans = ({ userData }) => {
    const { user, lang, setPostType, setModalOpen, postRes } = useContext(StoreContext)
    document.title = 'Forum | ' + userData.displayName + ' / ' + Strings.bans[lang]

    const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'user/bans', params: { userId: userData.id ? userData.id : userData._id }, auth: true })

    const deleteBan = (banId) => {
        setPostType({
            type: 'deleteBan',
            banId: banId,
        });
        setModalOpen(true);
    }

    useEffect(() => {
        if (postRes && postRes.banDeleted && postRes.banDeleted.data) {
            const updatedItems = items.filter(item => item._id !== postRes.banDeleted.data._id);
            setItems(updatedItems);
        }
        // eslint-disable-next-line
    }, [postRes.banDeleted])

    return (
        <DataView
            data={items}
            noData={noData}
            loading={loading}
            moreLoading={moreLoading}
            card={user.role >= 2 ? (props) => <BannedAll {...props} deleteBan={deleteBan} /> : BannedAll}
            noDataMessage={Strings.noBansYet[lang]}
            errorMessage={Strings.unableToDisplayBans[lang]}
        />
    )
}

export default Bans;