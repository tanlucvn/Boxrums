import Loader from '@/components/Loader';
import Errorer from '@/components/Errorer';

const DataView = ({ data, noData, loading, moreLoading, card: Card, noDataMessage, errorMessage, lang, children }) => {
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
            ) : <Errorer message={noDataMessage} />
        ) : <Loader />
    ) : <Errorer message={errorMessage} />
}

export default DataView;