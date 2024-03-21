import Loader from '@/components/Loader';
import NoDataMessage from '../NoData';

const DataView = ({ data, noData, loading, moreLoading, card: Card, noDataMessage, errorMessage, children }) => {
    return !noData ? (
        !loading ? (
            data.length ? (
                <>
                    {children}

                    <div className="items_list">
                        {data.map(item => (
                            <Card key={item._id} data={item} />
                        ))}
                    </div>

                    {moreLoading && <Loader />}
                </>
            ) : <NoDataMessage message={noDataMessage} />
        ) : <Loader />
    ) : <NoDataMessage message={errorMessage} />
}

export default DataView;